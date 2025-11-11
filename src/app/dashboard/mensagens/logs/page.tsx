"use client";

import React, { useState, useEffect } from "react";
import {
  Filter,
  Search,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Send,
  Loader2,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
} from "lucide-react";

// Constante para o número de linhas por página (50, conforme solicitado)
const ROWS_PER_PAGE = 50;

// Dados simulados do log de mensagens
const mockLogs = [
  {
    id: 1,
    client: "Ana Silva",
    message:
      "Lembrete de agendamento para 20/11 às 10:00h. Por favor, confirme o recebimento desta mensagem e a sua presença para garantir a vaga. Caso não possa comparecer, avise com 24h de antecedência.",
    date: "2025-11-19",
    time: "14:30",
    status: "Enviado",
  },
  {
    id: 2,
    client: "João Souza",
    message:
      "Confirmação do serviço de Mentoria de Carreira. O contrato e o cronograma inicial foram anexados. Revise e assine o documento para iniciarmos o processo de onboarding.",
    date: "2025-11-19",
    time: "10:15",
    status: "Lido",
  },
  {
    id: 3,
    client: "Maria Oliveira",
    message:
      "Orçamento para Consultoria Estratégica. Envio em anexo a proposta detalhada com os escopos e valores. Aguardamos o seu retorno para a reunião de follow-up.",
    date: "2025-11-18",
    time: "17:45",
    status: "Erro",
  },
  {
    id: 4,
    client: "Pedro Santos",
    message:
      "Aviso sobre feriado na próxima semana. Informamos que não haverá atendimento na próxima segunda-feira, dia 25 de novembro, devido ao feriado municipal. Voltamos na terça em horário normal.",
    date: "2025-11-18",
    time: "09:00",
    status: "Enviado",
  },
  {
    id: 5,
    client: "Juliana Costa",
    message:
      "Proposta de Workshop Personalizado. A proposta inclui módulos de liderança e comunicação, com duração de 4 horas. O investimento total é R$ 2.500,00.",
    date: "2025-11-17",
    time: "11:20",
    status: "Pendente",
  },
  {
    id: 6,
    client: "Felipe Martins",
    message:
      "Resposta sobre disponibilidade de agenda. Temos vagas disponíveis nas quintas-feiras à tarde. Por favor, acesse o link da agenda para escolher o melhor horário.",
    date: "2025-11-17",
    time: "16:05",
    status: "Lido",
  },
  {
    id: 7,
    client: "Ana Silva",
    message:
      "Detalhes da Consultoria Estratégica. O kick-off será na próxima terça. Prepare os documentos solicitados e envie-os até o final do dia.",
    date: "2025-11-16",
    time: "08:10",
    status: "Enviado",
  },
  {
    id: 8,
    client: "João Souza",
    message:
      "Link para formulário de briefing inicial. O preenchimento é obrigatório antes da nossa primeira sessão. Leva apenas 10 minutos.",
    date: "2025-11-15",
    time: "14:55",
    status: "Erro",
  },
  {
    id: 9,
    client: "Maria Oliveira",
    message:
      "Agendamento de Quick Start para amanhã. O link da reunião será enviado uma hora antes do início. Esteja online pontualmente.",
    date: "2025-11-14",
    time: "19:00",
    status: "Lido",
  },
];

const statusOptions = ["Todos", "Enviado", "Lido", "Erro", "Pendente"];

// Mapeamento de Status para Cores e Ícones
const getStatusClasses = (status) => {
  switch (status) {
    case "Enviado":
      return { text: "text-blue-700", bg: "bg-blue-100", icon: Send };
    case "Lido":
      return { text: "text-green-700", bg: "bg-green-100", icon: CheckCircle };
    case "Erro":
      return { text: "text-red-700", bg: "bg-red-100", icon: AlertTriangle };
    case "Pendente":
      return { text: "text-yellow-700", bg: "bg-yellow-100", icon: Loader2 };
    default:
      return { text: "text-gray-700", bg: "bg-gray-100", icon: Mail };
  }
};

// Componente Modal para exibir a mensagem completa
const MessageModal = ({ log, onClose }) => {
  if (!log) return null;

  const { text, bg, icon: StatusIcon } = getStatusClasses(log.status);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Mensagem Completa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 space-y-4">
          {/* Detalhes Chave */}
          <div className="grid grid-cols-2 gap-3 text-sm border-b pb-4">
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-semibold">Cliente:</span>
              <span className="ml-2">{log.client}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${text} ${bg}`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {log.status}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-semibold">Data:</span>
              <span className="ml-2">
                {log.date.split("-").reverse().join("/")}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-semibold">Hora:</span>
              <span className="ml-2">{log.time}</span>
            </div>
          </div>

          {/* Conteúdo da Mensagem */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap">{log.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const App = () => {
  // 1. Função para obter filtros iniciais da URL
  const getInitialFilters = () => {
    // Tenta ler a URL; se falhar (SecurityError), retorna o estado padrão
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        search: params.get("search") || "",
        status: params.get("status") || "Todos",
        dateFrom: params.get("dateFrom") || "",
      };
    } catch (e) {
      console.warn(
        "Falha ao ler parâmetros da URL na inicialização. Usando filtros padrão."
      );
      return { search: "", status: "Todos", dateFrom: "" };
    }
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const [selectedLog, setSelectedLog] = useState(null); // Estado para o modal

  // ** useEffect: Sincroniza o estado de 'filters' com a URL **
  useEffect(() => {
    const params = new URLSearchParams();

    // Adiciona filtros válidos aos parâmetros de URL
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "Todos")
      params.set("status", filters.status);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);

    const newSearch = params.toString();

    // Tenta atualizar a URL sem recarregar a página.
    try {
      if (window.history.replaceState) {
        // Usa replaceState (melhor que pushState para filtros)
        const newUrl = `${window.location.pathname}?${newSearch}`;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }
    } catch (error) {
      // Este erro é esperado em iframes ou ambientes sandboxed.
      console.warn(
        "Falha ao atualizar a URL (SecurityError provável). Os filtros internos ainda estão funcionando.",
        error
      );
    }
  }, [filters]); // Dependência: executa sempre que 'filters' muda

  // Handler de alteração de filtro
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reinicia a paginação ao mudar o filtro
  };

  // 3. Lógica de Filtragem
  const filteredLogs = mockLogs
    .filter((log) => {
      // a. Pesquisa de Texto
      const searchMatch =
        !filters.search ||
        log.client.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.message.toLowerCase().includes(filters.search.toLowerCase());

      // b. Filtro de Status
      const statusMatch =
        filters.status === "Todos" || log.status === filters.status;

      // c. Filtro de Data Inicial
      const logDateTime = new Date(`${log.date}T${log.time}`).getTime();
      let dateMatch = true;
      if (filters.dateFrom) {
        // Define a data inicial do filtro (começo do dia)
        const filterDate = new Date(`${filters.dateFrom}T00:00:00`).getTime();
        dateMatch = logDateTime >= filterDate;
      }

      return searchMatch && statusMatch && dateMatch;
    })
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.date}`)
    ); // Ordena por data mais recente

  // Lógica de Paginação
  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;

  // Logs a serem exibidos na página atual
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Handlers de navegação
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      {/* Modal de Mensagem */}
      <MessageModal log={selectedLog} onClose={() => setSelectedLog(null)} />

      {/* Cabeçalho */}
      <header className="text-center mb-10">
        <h1 className="4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
          Log de Mensagens do Sistema
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Histórico completo de comunicações enviadas aos clientes.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Painel de Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4 text-blue-700">
            <Filter className="w-6 h-6" />
            <h2 className="text-xl font-bold">Filtros de Pesquisa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Pesquisa (Texto) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por Cliente ou Conteúdo"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Filtro de Status (Dropdown) */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    Status: {status}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Loader2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Filtro de Data Inicial (Date Picker) */}
            <div className="relative">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Resultados */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Colunas: Cliente 3/12, Mensagem 4/12, Data/Hora 2/12, Status 3/12 */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                  Mensagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => {
                  // Usando currentLogs
                  const { text, bg, icon: Icon } = getStatusClasses(log.status);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-blue-50 transition duration-150 cursor-pointer"
                      onClick={() => setSelectedLog(log)} // Adicionado clique para abrir o modal
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        {log.client}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{log.date.split("-").reverse().join("/")}</span>
                          <Clock className="w-4 h-4 text-gray-400 ml-2" />
                          <span>{log.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${text} ${bg}`}
                        >
                          <Icon className="w-3 h-3 mr-1.5" />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  {/* Colspan ajustado para 4 */}
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-lg text-gray-500"
                  >
                    Nenhum log encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Componente de Paginação */}
        {totalLogs > ROWS_PER_PAGE && (
          <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-blue-700 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>

            <span className="text-sm font-medium text-gray-700">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-blue-700 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500 text-center">
          Exibindo {currentLogs.length} de {totalLogs} logs filtrados. (Total
          Geral: {mockLogs.length})
        </p>
      </main>

      {/* Rodapé simples */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 Sistema de Logs. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default App;
