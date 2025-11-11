"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

// --- Tipos Mockados (Para simular a estrutura de dados do cliente) ---
interface EnderecoType {
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
}

interface ClienteType {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_cadastro: string;
  endereco: EnderecoType;
  // Seções solicitadas - Nomenclatura ajustada para Serviços
  historico_servicos: { id: string; data: string; valor: number }[];
  pagamentos: {
    id: string;
    data: string;
    status: "Pago" | "Pendente";
    valor: number;
  }[];
  mensagens_enviadas: number;
  perfil_influencia: "Alto" | "Médio" | "Baixo";
  // Métricas extra
  pontuacao_lealdade: number;
  ultima_prestacao: string; // Nomenclatura ajustada
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
const createClientComponentClient = () => {
  // Dados Mockados de exemplo (simulando que o cliente existe)
  const mockClientData: ClienteType = {
    id: "clt-001",
    nome: "Maria da Silva Mendes",
    email: "maria.smendes@exemplo.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    data_cadastro: "2023-01-15",
    endereco: {
      cep: "01001-000",
      rua: "Rua Principal",
      numero: "100",
      cidade: "São Paulo",
      estado: "SP",
    },
    historico_servicos: [
      { id: "s01", data: "2024-10-05", valor: 150.0 },
      { id: "s02", data: "2024-09-20", valor: 85.5 },
      { id: "s03", data: "2024-08-10", valor: 210.9 },
    ],
    pagamentos: [
      { id: "p01", data: "2024-10-05", status: "Pago", valor: 150.0 },
      { id: "p02", data: "2024-11-01", status: "Pendente", valor: 45.0 },
    ],
    mensagens_enviadas: 45,
    perfil_influencia: "Alto",
    pontuacao_lealdade: 850,
    ultima_prestacao: "2024-10-05", // Nomenclatura ajustada
  };

  // Mock da função auth
  const authMock = {
    getUser: () =>
      Promise.resolve({ data: { user: { id: "mock-user-id" } }, error: null }),
  };

  // Mock da função from
  const fromMock = (table) => ({
    select: () => ({
      eq: (key, value) => ({
        single: () => {
          // Simula a busca do cliente com sucesso
          if (table === "clientes" && key === "id" && value === "clt-001") {
            return Promise.resolve({ data: mockClientData, error: null });
          }
          // Simula falha ou busca de outros dados (não implementados)
          return Promise.resolve({ data: null, error: null });
        },
      }),
    }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
  });

  return {
    auth: authMock,
    from: fromMock,
  };
};

// --- Componente Modal de Edição (Mock) ---
const EditClientModal = ({ isOpen, onClose, clientData, onSave }) => {
  const [formData, setFormData] = useState(clientData);

  useEffect(() => {
    setFormData(clientData);
  }, [clientData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const CLASS_NAME_INPUT =
    "block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-150";
  const CLASS_NAME_LABEL =
    "block text-sm font-medium leading-6 text-gray-700 mb-1";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <form onSubmit={handleSave}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-xl font-bold text-indigo-700 border-b pb-2">
                Editar Dados Cadastrais
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className={CLASS_NAME_LABEL}>
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData?.nome || ""}
                    onChange={handleChange}
                    className={CLASS_NAME_INPUT}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={CLASS_NAME_LABEL}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className={CLASS_NAME_LABEL}>
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData?.telefone || ""}
                    onChange={handleChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="cpf" className={CLASS_NAME_LABEL}>
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData?.cpf || ""}
                    onChange={handleChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rua" className={CLASS_NAME_LABEL}>
                    Endereço (Rua)
                  </label>
                  <input
                    type="text"
                    name="rua"
                    value={formData?.endereco?.rua || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        endereco: { ...p.endereco, rua: e.target.value },
                      }))
                    }
                    className={CLASS_NAME_INPUT}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Salvar
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ClienteDetailPage() {
  // Usando o mock do cliente Supabase
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [clientData, setClientData] = useState<ClienteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("historico"); // Para navegação entre seções

  // Função para simular o carregamento de dados do cliente
  const fetchClientData = async (clientId = "clt-001") => {
    setLoading(true);
    // Simula a busca no Supabase
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", clientId)
      .single();

    if (data) {
      setClientData(data as ClienteType);
      toast.success("Dados do cliente carregados.");
    } else {
      toast.error("Cliente não encontrado ou erro de mock.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  // Função para simular o salvamento de dados
  const handleSaveClient = (updatedData: ClienteType) => {
    setLoading(true);

    // Simula a chamada de API de atualização
    // await supabase.from("clientes").update(updatedData).eq("id", updatedData.id);

    setClientData(updatedData); // Atualiza o estado local
    setLoading(false);
    toast.success("Dados cadastrais atualizados com sucesso!");
  };

  // Cálculo de métricas
  const totalSpent = useMemo(() => {
    if (!clientData) return 0;
    return clientData.historico_servicos.reduce(
      (sum, item) => sum + item.valor,
      0
    );
  }, [clientData]);

  // Função de renderização para o conteúdo principal (Tabs)
  const renderTabContent = () => {
    if (!clientData) return null;

    const formatCurrency = (value) =>
      value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    switch (activeTab) {
      case "historico":
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Total de {clientData.historico_servicos.length} serviços
              registrados.
            </p>
            {clientData.historico_servicos.map((servico) => (
              <div
                key={servico.id}
                className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Serviço #{servico.id}
                  </p>
                  <p className="text-sm text-gray-500">Data: {servico.data}</p>
                </div>
                <p className="font-bold text-lg text-green-600">
                  {formatCurrency(servico.valor)}
                </p>
              </div>
            ))}
          </div>
        );
      case "pagamentos":
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Visão geral dos status de pagamento.
            </p>
            {clientData.pagamentos.map((pag) => (
              <div
                key={pag.id}
                className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Transação #{pag.id}
                  </p>
                  <p className="text-sm text-gray-500">Data: {pag.data}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    pag.status === "Pago"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {pag.status} - {formatCurrency(pag.valor)}
                </span>
              </div>
            ))}
          </div>
        );
      case "mensagens":
        return (
          <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-4xl font-extrabold text-indigo-600">
              {clientData.mensagens_enviadas}
            </p>
            <p className="text-xl text-gray-700 mt-2">
              Mensagens de Marketing/Serviço Enviadas (Últimos 30 dias - Mock)
            </p>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
              Ver Logs de Comunicação
            </button>
          </div>
        );
      case "influencia":
        let badgeClass;
        switch (clientData.perfil_influencia) {
          case "Alto":
            badgeClass = "bg-red-100 text-red-800";
            break;
          case "Médio":
            badgeClass = "bg-yellow-100 text-yellow-800";
            break;
          case "Baixo":
            badgeClass = "bg-gray-100 text-gray-800";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
        }
        return (
          <div className="space-y-4 p-6 bg-blue-50 rounded-lg shadow-md">
            <h4 className="text-lg font-bold text-blue-800">
              Perfil de Influência (Índice Personalizado)
            </h4>
            <div className="flex items-center space-x-4">
              <span
                className={`px-4 py-2 text-xl font-bold rounded-full ${badgeClass}`}
              >
                {clientData.perfil_influencia}
              </span>
              <p className="text-gray-700">
                Indica o potencial do cliente em gerar novos leads ou promover
                seu negócio (ex: engajamento em redes, recomendações ativas).
              </p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-sm text-gray-600">
                Sugestão de Ação: Envie um cupom de desconto exclusivo para que
                ele compartilhe com a rede de contatos.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
        <p className="ml-2 text-indigo-600">
          Carregando detalhes do cliente...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:p-8 bg-white shadow-2xl rounded-xl">
        {/* Cabeçalho */}
        <div className="pb-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-indigo-600 font-semibold">
              Detalhes do Cliente / ID: {clientData.id}
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
              {clientData.nome}
            </h1>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-7.586 7.586l4.243 4.243-.707.707-4.243-4.243.707-.707zm-2.828 2.828l4.243-4.243.707.707-4.243 4.243-.707-.707zM5 13.5V17h3.5l-3.5-3.5z" />
            </svg>
            Editar Dados Cadastrais
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA 1: DADOS E MÉTRICAS CHAVE */}
          <div className="lg:col-span-1 space-y-6">
            {/* Box 1: Dados Cadastrais */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Dados Cadastrais
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="font-medium text-gray-900">
                    {clientData.email}
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <dt className="text-gray-500">Telefone:</dt>
                  <dd className="font-medium text-gray-900">
                    {clientData.telefone}
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <dt className="text-gray-500">CPF:</dt>
                  <dd className="font-medium text-gray-900">
                    {clientData.cpf}
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <dt className="text-gray-500">Desde:</dt>
                  <dd className="font-medium text-gray-900">
                    {clientData.data_cadastro}
                  </dd>
                </div>
                <div className="pt-2">
                  <dt className="text-gray-500">Endereço:</dt>
                  <dd className="font-medium text-gray-900">
                    {clientData.endereco.rua}, {clientData.endereco.numero} -{" "}
                    {clientData.endereco.cidade} / {clientData.endereco.estado}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Box 2: Métricas Chave */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 4a3 3 0 00-3 3v2h2v4h6V9h2V7a3 3 0 00-3-3H8z" />
                </svg>
                Métricas Chave
              </h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 font-medium">
                    Gasto Total (LTV)
                  </p>
                  <p className="text-xl font-extrabold text-indigo-900">
                    {totalSpent.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 font-medium">
                    Último Serviço
                  </p>
                  <p className="text-xl font-extrabold text-indigo-900">
                    {clientData.ultima_prestacao}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 font-medium">
                    Pontos Fidelidade
                  </p>
                  <p className="text-xl font-extrabold text-indigo-900">
                    {clientData.pontuacao_lealdade}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 font-medium">
                    Influência
                  </p>
                  <p className="text-xl font-extrabold text-indigo-900">
                    {clientData.perfil_influencia}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2/3: NAVEGAÇÃO POR ABAS (TABS) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              {/* Navegação por Abas */}
              <div className="flex border-b border-gray-200 mb-6">
                <TabButton
                  label="Histórico de Serviços"
                  tab="historico"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.375 6.875A1.002 1.002 0 009 15h2a1 1 0 00.957-.79L15.345 5H17a1 1 0 100-2h-1.479a1 1 0 00-.917.592l-.946 3.15H5.824l-.283-1.415A1.001 1.001 0 004 5H2V3z" />
                    </svg>
                  }
                />
                <TabButton
                  label="Pagamentos"
                  tab="pagamentos"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <TabButton
                  label="Mensagens Enviadas"
                  tab="mensagens"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a7.96 7.96 0 01-2.903-.555c-.47.164-1.01.277-1.442.277-.615 0-1.125-.094-1.507-.229.357-.357.77-.703 1.13-1.026.37-.323.704-.636 1.055-.918a8 8 0 004.997-2.672C14.735 12.593 18 10.433 18 10zm-8-9C5.582 1 2 4.134 2 8c0 2.37.935 4.545 2.5 6.183l-1.5 1.5.5.5 1.5-1.5a7.96 7.96 0 003.903.921C14.418 15 18 11.866 18 8c0-3.866-3.582-7-8-7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <TabButton
                  label="Perfil de Influência"
                  tab="influencia"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              {/* Conteúdo da Aba Ativa */}
              <div className="min-h-[300px] py-4">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clientData={clientData}
        onSave={handleSaveClient}
      />
    </div>
  );
}

// Subcomponente para os botões de aba
const TabButton = ({ label, tab, activeTab, setActiveTab, icon }) => {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-3 flex items-center text-sm font-medium border-b-2 transition-all duration-200 
                ${
                  isActive
                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
    >
      {icon}
      {label}
    </button>
  );
};
