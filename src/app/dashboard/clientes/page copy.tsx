"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const FiltroClientes = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // estados locais sincronizados com URL
  const [nome, setNome] = useState(searchParams.get("nome") || "");
  const [cpf, setCpf] = useState(searchParams.get("cpf") || "");
  const [nascimento, setNascimento] = useState(
    searchParams.get("nascimento") || ""
  );

  // atualiza a URL sem recarregar a página
  const atualizarURL = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });

    router.replace(`${pathname}?${current.toString()}`);
  };

  // atualiza URL sempre que os filtros mudarem
  useEffect(() => {
    const timeout = setTimeout(() => {
      atualizarURL({ nome, cpf, nascimento });
    }, 400); // debounce leve para evitar spam de updates
    return () => clearTimeout(timeout);
  }, [nome, cpf, nascimento]);

  return (
    <div className="flex flex-wrap gap-3 items-end bg-card p-4 rounded-xl border border-border shadow-sm">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary outline-none"
          placeholder="Buscar por nome..."
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">CPF</label>
        <input
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary outline-none"
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">
          Nascimento
        </label>
        <input
          type="date"
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary outline-none"
        />
      </div>

      <button
        onClick={() => {
          setNome("");
          setCpf("");
          setNascimento("");
          atualizarURL({ nome: "", cpf: "", nascimento: "" });
        }}
        className="ml-auto px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-primary hover:text-primary-foreground transition"
      >
        Limpar
      </button>
    </div>
  );
};
