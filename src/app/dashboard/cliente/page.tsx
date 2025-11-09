"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { ClienteType, ContatoType, TiposContatoType } from "@/types/next";

import { useState, useEffect, useMemo, useCallback } from "react";

const CONTACT_OPTIONS: TiposContatoType[] = ["Email", "Telefone", "Instagran"];

export default function Page() {
  const { estabelecimento } = usePerfil();
  const [clients, setClients] = useState<ClienteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estabelecimentoId, setEstabelecimentoId] = useState<string>("");

  // Função de busca de clientes
  const fetchClients = useCallback(async () => {
    if (!estabelecimentoId) return; // garante que só rode quando o id estiver disponível

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("estabelecimento_id", estabelecimentoId);

      if (error) {
        setError(`Erro ao carregar clientes: ${error.message}`);
        setClients([]);
      } else {
        setClients(data as ClienteType[]);
        console.log(data);
      }
    } catch {
      setError("Erro inesperado ao buscar dados.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [estabelecimentoId]);

  // Atualiza o estado do estabelecimentoId quando o perfil estiver disponível
  useEffect(() => {
    if (estabelecimento?.id) {
      setEstabelecimentoId(estabelecimento.id);
    }
  }, [estabelecimento]);

  // Busca clientes quando o estabelecimentoId mudar
  useEffect(() => {
    if (estabelecimentoId) {
      fetchClients();
    }
  }, [estabelecimentoId, fetchClients]);

  // Filtragem e ordenação
  const filteredClients = useMemo(() => {
    let currentClients = clients;

    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase().trim();
      currentClients = currentClients.filter(
        (client) =>
          client.nome.toLowerCase().includes(lowerCaseSearch) ||
          (client.cpf && client.cpf.includes(lowerCaseSearch)) ||
          client.whatsapp?.includes(lowerCaseSearch) ||
          client.outros_contatos?.email?.includes(lowerCaseSearch) ||
          client.outros_contatos?.telefone?.includes(lowerCaseSearch) ||
          client.outros_contatos?.instagram?.includes(lowerCaseSearch)
      );
    }

    return currentClients.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [clients, searchTerm]);

  // Componente de cartão de cliente
  const ClientCard: React.FC<{ client: ClienteType }> = ({ client }) => (
    <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-bold text-gray-800 break-words max-w-[80%]">
          {client.nome}
        </h2>
        <button className="text-gray-400 hover:text-blue-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="7" r="1"></circle>
            <circle cx="12" cy="17" r="1"></circle>
            <circle cx="12" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>

      <div className="text-sm space-y-1">
        {client.cpf && (
          <p className="flex items-center text-gray-600">
            CPF: <span className="font-medium ml-1">{client.cpf}</span>
          </p>
        )}
        {client.whatsapp && (
          <p className="flex items-center text-gray-600">
            WhatsApp:{" "}
            <span className="font-medium ml-1">{client.whatsapp}</span>
          </p>
        )}
        {client.nascimento && (
          <p className="flex items-center text-gray-600">
            Nascimento:{" "}
            <span className="font-medium ml-1">
              {new Date(client.nascimento).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>

      {client.outros_contatos &&
        Object.keys(client.outros_contatos).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Outros Contatos
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {client.outros_contatos && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Outros Contatos
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {client.outros_contatos.email && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Email: {client.outros_contatos.email}
                      </span>
                    )}
                    {client.outros_contatos.telefone && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Telefone: {client.outros_contatos.telefone}
                      </span>
                    )}
                    {client.outros_contatos.instagram && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Instagram: {client.outros_contatos.instagram}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Carregando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-center text-red-600 bg-red-50">
        <p className="font-bold mb-2">Erro de Carregamento:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">
        Lista de Clientes
      </h1>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 space-y-4">
        <input
          type="text"
          placeholder="Pesquisar por Nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Exibindo {filteredClients.length} de {clients.length} clientes.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-md">
            <p className="text-lg text-gray-500">
              Nenhum cliente encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
