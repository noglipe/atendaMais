"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

// --- Tipos Mockados ---
interface KPI {
  faturamentoTotal: number;
  clientesAtivos: number;
  ticketMedio: number;
}
interface CommemorativeDate {
  data: string;
  descricao: string;
  nivel: "Alto" | "Medio" | "Baixo";
}
interface ClienteAniversariante {
  id: string;
  nome: string;
  dataNascimento: string;
}
interface ServicoRecente {
  id: string;
  clienteNome: string;
  data: string;
  valor: number;
}

// --- Componente Spinner (Autocontido) ---
const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-indigo-600 inline-flex ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
// --- Fim Componente Spinner ---

// --- Mock do Cliente Supabase (totalmente autocontido) ---
// Usado apenas para simular a chamada de dados
const createClientComponentClient = () => {
  // MOCKS DE DADOS DO DASHBOARD
  const mockKpis: KPI = {
    faturamentoTotal: 5890.5,
    clientesAtivos: 145,
    ticketMedio: 120.25,
  };

  const mockClientes: ClienteAniversariante[] = [
    { id: "c1", nome: "Ana Costa", dataNascimento: "1990-11-14" }, // Aniversário nesta semana
    { id: "c2", nome: "João Mendes", dataNascimento: "1985-11-11" }, // Aniversário hoje
    { id: "c3", nome: "Pedro Alvares", dataNascimento: "1995-12-25" }, // Próximo mês
    { id: "c4", nome: "Lucia Ferraz", dataNascimento: "1992-11-17" }, // Aniversário nesta semana
    { id: "c5", nome: "Carlos Silva", dataNascimento: "1970-05-10" },
  ];

  const mockDatasComemorativas: CommemorativeDate[] = [
    { data: "15/11", descricao: "Proclamação da República", nivel: "Medio" },
    { data: "20/11", descricao: "Dia da Consciência Negra", nivel: "Alto" },
    { data: "25/12", descricao: "Natal", nivel: "Alto" },
  ];

  const mockServicosRecentes: ServicoRecente[] = [
    {
      id: "r005",
      clienteNome: "Maria da Silva",
      data: "10/11/2025",
      valor: 90.0,
    },
    {
      id: "r004",
      clienteNome: "Fernando Luz",
      data: "09/11/2025",
      valor: 180.5,
    },
    { id: "r003", clienteNome: "Ana Costa", data: "09/11/2025", valor: 220.0 },
  ];

  // Mock da função from (Apenas simula a busca de dados)
  const fromMock = (table) => ({
    select: () => ({
      single: () => {
        if (table === "kpis")
          return Promise.resolve({ data: mockKpis, error: null });
        if (table === "clientes")
          return Promise.resolve({ data: mockClientes, error: null });
        if (table === "datas_comemorativas")
          return Promise.resolve({ data: mockDatasComemorativas, error: null });
        if (table === "servicos_recentes")
          return Promise.resolve({ data: mockServicosRecentes, error: null });
        return Promise.resolve({ data: null, error: null });
      },
    }),
  });

  return { from: fromMock };
};
// --- Fim Mock Supabase ---

// Função auxiliar para calcular aniversariantes da semana
const getBirthdayClientsOfTheWeek = (
  clients: ClienteAniversariante[]
): ClienteAniversariante[] => {
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 7
  );

  return clients.filter((client) => {
    const [year, month, day] = client.dataNascimento.split("-").map(Number);
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

    // Verifica se a data de aniversário cai entre o início e o fim da semana
    return birthdayThisYear >= startOfWeek && birthdayThisYear < endOfWeek;
  });
};

// Componente Card de KPI
const KPICard = ({ title, value, color, icon }) => (
  <div
    className={`p-6 bg-white rounded-xl shadow-lg border-l-4 border-${color}-500 flex items-center justify-between`}
  >
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
  </div>
);

// Componente Principal
export default function DashboardPage() {
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [clientes, setClientes] = useState<ClienteAniversariante[]>([]);
  const [datasComemorativas, setDatasComemorativas] = useState<
    CommemorativeDate[]
  >([]);
  const [servicosRecentes, setServicosRecentes] = useState<ServicoRecente[]>(
    []
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulação de chamadas Supabase para buscar os dados
        const { data: kpisData } = await supabase
          .from("kpis")
          .select("*")
          .single();
        const { data: clientesData } = await supabase
          .from("clientes")
          .select("*")
          .single();
        const { data: datasData } = await supabase
          .from("datas_comemorativas")
          .select("*")
          .single();
        const { data: servicosData } = await supabase
          .from("servicos_recentes")
          .select("*")
          .single();

        setKpis(kpisData);
        setClientes(clientesData || []);
        setDatasComemorativas(datasData || []);
        setServicosRecentes(servicosData || []);
      } catch (error) {
        toast.error("Erro ao carregar dados do Dashboard (Mock falhou).");
        console.error("Erro de Mock:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [supabase]);

  // Lógica calculada para Aniversariantes
  const aniversariantesDaSemana = useMemo(
    () => getBirthdayClientsOfTheWeek(clientes),
    [clientes]
  );

  // Lógica para Ação Sugerida
  const sugestaoDeAcao = useMemo(() => {
    if (!kpis) return null;

    let acao = "";
    let nivel = "info";

    if (kpis.clientesAtivos < 150) {
      acao =
        "Crie uma campanha de reativação para clientes inativos nos últimos 3 meses. Uma oferta especial de 10% de desconto no próximo serviço pode ser ideal.";
      nivel = "warning";
    } else if (kpis.faturamentoTotal < 5000) {
      acao =
        "Foque na otimização de preços ou no upselling. Treine sua equipe para oferecer um serviço premium adicional em 30% dos atendimentos.";
      nivel = "danger";
    } else if (aniversariantesDaSemana.length > 0) {
      acao = `Parabéns! Você tem ${aniversariantesDaSemana.length} aniversariantes esta semana. Envie mensagens personalizadas ou um pequeno presente virtual para aumentar a fidelidade.`;
      nivel = "success";
    } else {
      acao =
        "Ótimo trabalho! Mantenha a qualidade dos serviços e monitore as redes sociais em busca de novos influenciadores para parcerias.";
      nivel = "success";
    }

    return { acao, nivel };
  }, [kpis, aniversariantesDaSemana]);

  // Função de formatação de moeda
  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
        <p className="ml-2 text-indigo-600">Carregando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8 space-y-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Dashboard do Sistema
          </h1>
          <button className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12h-2v-4h-2V6h4v8z" />
            </svg>
            Novo Serviço
          </button>
        </div>

        {/* Linha 1: KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Faturamento Total (Mês)"
            value={formatCurrency(kpis?.faturamentoTotal || 0)}
            color="indigo"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 2a3 3 0 00-3 3v2h2v4h6V7h2V5a3 3 0 00-3-3H8z" />
              </svg>
            }
          />
          <KPICard
            title="Clientes Ativos (Mês)"
            value={kpis?.clientesAtivos.toLocaleString("pt-BR") || "0"}
            color="green"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            }
          />
          <KPICard
            title="Tíquete Médio (Serviço)"
            value={formatCurrency(kpis?.ticketMedio || 0)}
            color="red"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
              </svg>
            }
          />
        </div>

        {/* Linha 2: Ações e Lembretes (Layout em Colunas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUNA 1 & 2: AÇÕES, DATAS COMEMORATIVAS E FEED */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ação Sugerida para Engajamento */}
            <ActionSuggestionCard
              acao={sugestaoDeAcao.acao}
              nivel={sugestaoDeAcao.nivel}
            />

            {/* Datas Comemorativas (Lembretes) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Lembretes: Datas Comemorativas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {datasComemorativas.map((data, index) => (
                  <CommemorativeDateItem key={index} data={data} />
                ))}
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-3 4a1 1 0 100 2h2a1 1 0 100-2H9zm-5-3a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Últimos Serviços Prestados (Feed)
              </h2>
              <div className="space-y-3">
                {servicosRecentes.map((servico) => (
                  <div
                    key={servico.id}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Serviço #{servico.id} para {servico.clienteNome}
                      </p>
                      <p className="text-xs text-gray-500">
                        Data: {servico.data}
                      </p>
                    </div>
                    <p className="font-bold text-md text-indigo-600">
                      {formatCurrency(servico.valor)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 3: ANIVERSARIANTES E ALERTAS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Aniversariantes da Semana */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-pink-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 8a2 2 0 11-4 0 2 2 0 014 0zm0 1a1 1 0 100 2 1 1 0 000-2zm13-1a2 2 0 11-4 0 2 2 0 014 0zm0 1a1 1 0 100 2 1 1 0 000-2zm-3-3a2 2 0 10-4 0 2 2 0 004 0zm0 1a1 1 0 100 2 1 1 0 000-2zm-9 6a2 2 0 11-4 0 2 2 0 014 0zm0 1a1 1 0 100 2 1 1 0 000-2zm13-1a2 2 0 11-4 0 2 2 0 014 0zm0 1a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                Aniversariantes da Semana
              </h2>
              <div className="space-y-3">
                {aniversariantesDaSemana.length > 0 ? (
                  aniversariantesDaSemana.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 bg-pink-50 rounded-lg flex justify-between items-center"
                    >
                      <p className="font-semibold text-gray-900">
                        {client.nome}
                      </p>
                      <span className="text-sm font-bold text-pink-700">
                        {client.dataNascimento
                          .slice(-5)
                          .split("-")
                          .reverse()
                          .join("/")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 bg-gray-50 rounded-lg">
                    Nenhum aniversariante nesta semana.
                  </div>
                )}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                Enviar Mensagem de Aniversário
              </button>
            </div>

            {/* Alertas Rápidos (Ex: Pendências) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.328a1 1 0 011.486 0l5.857 6.443A1 1 0 0115 11H5a1 1 0 01-.714-1.687l5.857-6.443z"
                    clipRule="evenodd"
                  />
                </svg>
                Alertas Rápidos
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-800">
                    2 Pagamentos Atrasados
                  </p>
                  <p className="text-sm text-yellow-700">
                    Verificar seção Pagamentos.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800">
                    4 Novos Clientes
                  </p>
                  <p className="text-sm text-blue-700">
                    Bem-vindos! Envie uma mensagem inicial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente: Cartão de Sugestão de Ação
const ActionSuggestionCard = ({ acao, nivel }) => {
  let style = {
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-600",
    textColor: "text-indigo-800",
  };
  let icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ); // Ícone de Lâmpada

  if (nivel === "warning") {
    style = {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-600",
      textColor: "text-yellow-800",
    };
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.323 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  } else if (nivel === "success") {
    style = {
      bgColor: "bg-green-50",
      borderColor: "border-green-600",
      textColor: "text-green-800",
    };
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944c-3.134 0-6.075 1.488-7.962 3.864A12.001 12.001 0 0012 21a12.001 12.001 0 007.962-14.192c1.887-2.376 2.85-5.304 2.85-8.625z"
        />
      </svg>
    );
  }

  return (
    <div
      className={`p-6 ${style.bgColor} rounded-xl shadow-lg border-t-4 ${style.borderColor} space-y-4`}
    >
      <h2 className={`text-xl font-bold ${style.textColor} flex items-center`}>
        {icon}
        Próxima Ação Sugerida
      </h2>
      <p className="text-gray-700 font-medium">{acao}</p>
      <button
        className={`px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors`}
      >
        Agendar Comunicação
      </button>
    </div>
  );
};

// Subcomponente: Item de Data Comemorativa
const CommemorativeDateItem = ({ data }) => {
  let badgeClass;
  switch (data.nivel) {
    case "Alto":
      badgeClass = "bg-red-100 text-red-800";
      break;
    case "Medio":
      badgeClass = "bg-yellow-100 text-yellow-800";
      break;
    case "Baixo":
      badgeClass = "bg-gray-100 text-gray-800";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800";
  }

  return (
    <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
      <div>
        <p className="font-bold text-gray-900">{data.data}</p>
        <p className="text-sm text-gray-600">{data.descricao}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
      >
        Impacto {data.nivel}
      </span>
    </div>
  );
};
