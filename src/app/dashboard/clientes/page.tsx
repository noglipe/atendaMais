"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { ClienteType } from "@/types/next";
import { useState, useEffect, useMemo, useCallback } from "react";
import Loading from "../components/Loading";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClientTable } from "../components/ClientTable ";
import { toast } from "sonner";

export default function Page() {
  const { estabelecimento } = usePerfil();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [clients, setClients] = useState<ClienteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estabelecimentoId, setEstabelecimentoId] = useState<string>("");

  const handleSearchTerm = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("busca", value);
    else params.delete("busca");
    router.replace(`${pathname}?${params.toString()}`);
    setSearchTerm(value);
  };

  const fetchClients = useCallback(async () => {
    if (!estabelecimentoId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("estabelecimento_id", estabelecimentoId);

      if (error) throw error;
      setClients(data as ClienteType[]);
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [estabelecimentoId]);

  const parametrosUrl = useCallback(() => {
    const filtroUrl = searchParams.get("busca") || "";
    setSearchTerm(filtroUrl);
  }, [searchParams]);

  useEffect(() => {
    if (estabelecimento?.id) setEstabelecimentoId(estabelecimento.id);
  }, [estabelecimento]);

  useEffect(() => {
    if (estabelecimentoId) fetchClients();
  }, [estabelecimentoId, fetchClients]);

  useEffect(() => {
    parametrosUrl();
  }, [parametrosUrl]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.nome.toLowerCase().includes(term) ||
        c.cpf?.includes(term) ||
        c.whatsapp?.includes(term) ||
        c.outros_contatos?.email?.includes(term) ||
        c.outros_contatos?.telefone?.includes(term) ||
        c.outros_contatos?.instagram?.includes(term)
    );
  }, [clients, searchTerm]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex flex-row justify-between items-center mb-2">
        <h1 className="text-2xl md:text-2xl font-extrabold mb-6 text-secondary-foreground">
          Lista de Clientes
        </h1>
        <button
          className="inline-flex items-center gap-2 bg-primary/20 text-primary hover:bg-primary/40 transition-colors duration-200 px-3 p-4 rounded-sm text-xs font-medium cursor-pointer"
          onClick={() => router.push("/dashboard/cliente/novo")}
        >
          +Novo Cliente
        </button>
      </div>

      <div className="text-xl bg-input p-4 rounded-xl shadow-md mb-6 space-y-4">
        <input
          type="text"
          placeholder="Pesquisar por Nome, CPF ou Contato..."
          value={searchTerm}
          onChange={(e) => handleSearchTerm(e.target.value)}
          className="w-full p-3 border border-accent rounded-lg focus:border-accent-foreground focus:ring-1 transition duration-150"
        />
      </div>

      {loading && <Loading />}
      {!loading && (
        <>
          <p className="mb-4 text-sm">
            Exibindo {filteredClients.length} de {clients.length} clientes.
          </p>
          <ClientTable clients={filteredClients} />
        </>
      )}
    </div>
  );
}
