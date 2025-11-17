"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // [NOVO] Estado de loading
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // [NOVO] Ativa o loading

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Melhora a mensagem de erro para o usuário
      if (error.message === "Invalid login credentials") {
        setError("Email ou senha inválidos.");
      } else {
        setError(error.message);
      }
      setLoading(false); // [NOVO] Desativa o loading
      return;
    }

    // A sessão já é armazenada automaticamente
    router.push("/dashboard"); // redireciona para área logada
    // Não é preciso desativar o loading aqui, pois a página vai mudar
  };

  // --- [NOVO] Estilos reutilizáveis do Tailwind ---
  const labelStyle = "block text-sm font-medium leading-6 text-foreground";
  const inputStyle =
    "block w-full rounded-lg border bg-input py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-ring sm:text-sm sm:leading-6 transition-all";

  return (
    // Container principal: centraliza tudo e dá um fundo cinza
    <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="Logo Atenda+" width={60} height={60} />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-primary">
          Acesse sua conta
        </h2>
      </div>

      {/* Card do formulário */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Formulário */}
        <form
          className="space-y-6 bg-card p-8 shadow-2xl rounded-2xl border border-border/10"
          onSubmit={handleLogin}
        >
          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={labelStyle}>
                Senha
              </label>
              <div className="text-sm">
                <Link
                  href="/recuperar-senha" // Página de recuperação de senha
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/80 rounded-lg border border-destructive">
              {error}
            </div>
          )}

          {/* Botão de Submit */}
          <div>
            <button
              type="submit"
              disabled={loading} // [NOVO] Desativa o botão durante o loading
              className="flex w-full justify-center rounded-full bg-primary px-3 py-3 text-lg font-bold leading-6 text-primary-foreground shadow-lg hover:bg-primary/80 transition-all duration-300 transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}{" "}
              {/* [NOVO] Muda o texto do botão */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
