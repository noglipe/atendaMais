"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { ClienteType } from "@/types/next";
import { useState, useEffect, useMemo, useCallback } from "react";
import Loading from "../components/Loading";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClientTable } from "../components/ClientTable ";
import { toast } from "sonner";
import { Users, PlusCircle, Search } from "lucide-react"; // Adicionando ícones

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
        c.outros_contatos?.email?.toLowerCase().includes(term) ||
        c.outros_contatos?.telefone?.includes(term) ||
        c.outros_contatos?.instagram?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  return (
    <div className="flex-1 min-h-screen font-sans p-4 sm:p-8">
      {/* Título Principal com Ícone - Padronizado com a página de Agenda */}
      {/* CLASSE AJUSTADA: Adicionado 'items-start' em mobile para o botão ficar abaixo do título. */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-8 flex flex-col sm:flex-row sm:items-center items-start justify-between">
        <div className="flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Lista de Clientes
        </div>
        <button
          onClick={() => router.push("/dashboard/cliente/novo")}
          // CLASSE AJUSTADA: 'w-full' em mobile, 'sm:w-auto' em telas maiores, 'mt-4' para espaçar em mobile.
          className="w-full sm:w-auto mt-4 sm:mt-0 py-3 bg-primary text-sm text-background font-bold rounded-lg shadow-md hover:bg-primary transition duration-150 transform hover:scale-[1.02] flex items-center justify-center p-2"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Adicionar Novo Cliente
        </button>
      </h1>

      {/* Estrutura de Layout com Colunas - Padronizado com a página de Agenda */}
      <div className="flex flex-col w-full gap-8">
        {/* --- Painel Lateral (Filtros/Ações) --- */}
        {/* CLASSE AJUSTADA: Uso de 'max-w-4xl' (ou similar, dependendo do design) para limitar o tamanho centralizado em telas grandes, garantindo 'w-full' para telas pequenas. Removido 'lg:w-3/4' do pai e colocado no container para melhor responsividade. */}
        <div className="w-full lg:max-w-4xl m-auto space-y-6">
          {/* Card de Pesquisa - Em um container padronizado */}
          <div className="p-4 bg-background rounded-xl shadow-lg border border-accent w-full">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5 text-secondary-foreground" />
              Pesquisar Cliente
            </h2>
            <input
              type="text"
              placeholder="Pesquisar por Nome, CPF ou Contato..."
              value={searchTerm}
              onChange={(e) => handleSearchTerm(e.target.value)}
              // Campo de input estilizado de forma semelhante ao campo de texto do modal de agenda
              className="w-full p-3 border border-accent rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
            />
          </div>
        </div>

        {/* --- Visualização Principal (Tabela) --- */}
        {/* CLASSE AJUSTADA: Uso de 'max-w-4xl' (ou similar) para limitar o tamanho centralizado em telas grandes, garantindo 'w-full' para telas pequenas. */}
        <div className="w-full lg:max-w-4xl m-auto">
          <div className="bg-background rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-4">
              Clientes Cadastrados
            </h2>
            {loading && <Loading />}
            {!loading && (
              <>
                <p className="mb-4 text-sm text-secondary-foreground">
                  Exibindo <strong>{filteredClients.length}</strong> de{" "}
                  <strong>{clients.length}</strong> clientes.
                </p>
                {/* O componente ClientTable deve ser verificado para garantir que a tabela (por exemplo, com a tag <table>) esteja em um container com 'overflow-x-auto' para evitar quebrar o layout. */}
                <div className="overflow-x-auto">
                  <ClientTable clients={filteredClients} />
                </div>
              </>
            )}
            {!loading && clients.length === 0 && (
              <div className="text-center p-10 bg-secondary rounded-lg">
                <p className="text-secondary-foreground text-lg">
                  Nenhum cliente cadastrado ainda.
                </p>
                <p className="text-primary-foreground mt-2">
                  Use o botão "Adicionar Novo Cliente" para começar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
