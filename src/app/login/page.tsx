"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
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
  const labelStyle = "block text-sm font-medium leading-6 text-secondary";
  const inputStyle =
    "block w-full rounded-md border-0 py-2 px-3 text-secondary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  return (
    // Container principal: centraliza tudo e dá um fundo cinza
    <div className="dark flex min-h-screen flex-1 flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Card do formulário */}
      <div className="dark w-full max-w-sm mx-auto bg-foreground shadow-lg rounded-lg p-6 sm:p-8">
        {/* Título */}
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-secondary">
          Acessar sua conta
        </h2>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
            <label htmlFor="password" className={labelStyle}>
              Senha
            </label>
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
            <div className="dark p-3 text-sm text-destructive rounded-lg bg-background border border-border">
              {error}
            </div>
          )}

          {/* Botão de Submit */}
          <div>
            <button
              type="submit"
              disabled={loading} // [NOVO] Desativa o botão durante o loading
              className="dark flex w-full justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
