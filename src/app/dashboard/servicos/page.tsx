"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { ServicosType } from "@/types/next";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";

type ActiveFilterType = "all" | "active" | "inactive";

export default function ServiceListPage() {
  const [services, setServices] = useState<ServicosType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rota = useRouter();

  // Estados para Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilterType>("active"); // Padrão: Apenas serviços Ativos

  const { estabelecimento, loading: loadingPerfil } = usePerfil();

  // Função para buscar serviços (executada apenas se o estabelecimento.id estiver disponível)
  const fetchServices = useCallback(async (estabelecimentoId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Nota: Na implementação real do Supabase, você usaria .eq('estabelecimento_id', estabelecimentoId)
      // O mock simula essa filtragem.
      const { data, error } = await supabase.from("servicos").select("*");

      if (error) {
        setError(`Erro ao carregar serviços: ${error.message}`);
        setServices([]);
      } else {
        setServices(data as ServicosType[]);
      }
    } catch (err) {
      setError("Erro inesperado ao buscar dados.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para carregar os serviços quando o perfil estiver carregado
  useEffect(() => {
    if (!loadingPerfil && estabelecimento?.id) {
      fetchServices(estabelecimento.id);
    }
  }, [loadingPerfil, estabelecimento, fetchServices]);

  // Lógica de Filtragem e Ordenação (usa useMemo para performance)
  const filteredServices = useMemo(() => {
    let currentServices = services;

    // 1. FILTRO DE ATIVIDADE
    if (activeFilter === "active") {
      currentServices = currentServices.filter((s) => s.ativo === true);
    } else if (activeFilter === "inactive") {
      currentServices = currentServices.filter((s) => s.ativo === false);
    }
    // "all" não filtra por atividade

    // 2. FILTRO DE PESQUISA (Nome)
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase().trim();
      currentServices = currentServices.filter((service) =>
        service.nome.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Ordenação alfabética por nome
    return currentServices.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [services, searchTerm, activeFilter]);

  // Componente de Cartão de Serviço
  const ServiceCard: React.FC<{ service: ServicosType }> = ({ service }) => {
    const priceFormatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(service.preco);

    return (
      <div
        className={`p-5 rounded-xl border transition duration-300 relative
            ${
              service.ativo
                ? "bg-white border-green-200 shadow-lg hover:shadow-xl"
                : "bg-gray-100 border-red-200 opacity-80"
            }`}
      >
        {/* Status Indicator */}
        <span
          className={`absolute top-0 right-0 mt-3 mr-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md
                ${
                  service.ativo
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
        >
          {service.ativo ? "ATIVO" : "INATIVO"}
        </span>

        <h2
          className={`text-xl font-extrabold mb-3 break-words pr-12 ${
            service.ativo ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {service.nome}
        </h2>

        {/* Detalhes */}
        <div className="text-sm space-y-2">
          {/* Preço */}
          <div className="flex items-center text-gray-700 font-bold text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"></path>
            </svg>
            Preço: <span className="ml-2 text-green-700">{priceFormatted}</span>
          </div>

          {/* Duração */}
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Duração:{" "}
            <span className="font-medium ml-2">
              {service.tempo_duracao} minutos
            </span>
          </div>
        </div>

        {/* Ações (Placeholder para Editar/Excluir) */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
          <button
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-150
                    ${
                      service.ativo
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
            onClick={() => rota.push(`/dashboard/servicos/${service.id}`)}
          >
            {service.ativo ? "Editar" : "Ativar / Editar"}
          </button>
        </div>
      </div>
    );
  };

  if (loadingPerfil || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="ml-4 text-gray-600">Carregando serviços...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-center bg-red-50">
        <p className="font-bold mb-2 text-red-600">Erro de Carregamento:</p>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800 border-b pb-2">
        Lista de Serviços Ofertados
      </h1>

      {/* ------------------------------------------------------------------ */}
      {/* Barra de Filtros */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 space-y-4 md:flex md:space-y-0 md:space-x-4">
        {/* Campo de Pesquisa */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Pesquisar serviço por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Filtro por Status (Ativo/Inativo) */}
        <div className="relative md:w-56">
          <label htmlFor="active-filter" className="sr-only">
            Filtrar por Status
          </label>
          <select
            id="active-filter"
            value={activeFilter}
            onChange={(e) =>
              setActiveFilter(e.target.value as ActiveFilterType)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 text-gray-700 bg-white cursor-pointer"
          >
            <option value="active">Apenas Ativos</option>
            <option value="inactive">Apenas Inativos</option>
            <option value="all">Todos os Serviços</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Lista de Serviços */}
      {/* ------------------------------------------------------------------ */}
      <p className="text-sm text-gray-600 mb-4">
        Exibindo {filteredServices.length} de {services.length} serviços
        (filtrados).
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-md">
            <p className="text-lg text-gray-500">
              Nenhum serviço encontrado com os filtros aplicados.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Tente ajustar a pesquisa ou o filtro de status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
