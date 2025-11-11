"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  CreditCard,
  AlertTriangle,
  Users,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  DollarSign,
  User,
  Send,
  Sparkles,
  History,
  RotateCw,
  X,
} from "lucide-react";

// Dados simulados de clientes devedores
const mockDebtors = [
  // Categoria 1: <= 30 dias (Dentro de 1 Mês)
  {
    id: 101,
    name: "Carlos Lima",
    phone: "11988887777",
    dueAmount: 150.0,
    overdueDays: 20,
  },
  {
    id: 102,
    name: "Beatriz Rocha",
    phone: "21911110000",
    dueAmount: 50.0,
    overdueDays: 5,
  },
  {
    id: 103,
    name: "Luiza Ferreira",
    phone: "81922221111",
    dueAmount: 320.0,
    overdueDays: 15,
  },

  // Categoria 2: > 30 dias e <= 90 dias (1 a 3 Meses)
  {
    id: 201,
    name: "Daniel Alves",
    phone: "31922223333",
    dueAmount: 220.0,
    overdueDays: 45,
  },
  {
    id: 202,
    name: "Eva Mendes",
    phone: "41944445555",
    dueAmount: 100.0,
    overdueDays: 70,
  },
  {
    id: 203,
    name: "Guilherme Silva",
    phone: "92955556666",
    dueAmount: 75.0,
    overdueDays: 35,
  },

  // Categoria 3: > 90 dias (Mais de 3 Meses)
  {
    id: 301,
    name: "Fernando Gomes",
    phone: "51966667777",
    dueAmount: 580.0,
    overdueDays: 120,
  },
  {
    id: 302,
    name: "Gisele Nunes",
    phone: "61999998888",
    dueAmount: 90.0,
    overdueDays: 95,
  },
  {
    id: 303,
    name: "Hugo Pereira",
    phone: "71933332222",
    dueAmount: 400.0,
    overdueDays: 180,
  },
];

// Definições das categorias de dívida
const categories = [
  {
    key: "M1",
    label: "Dentro de 1 Mês",
    maxDays: 30,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    hoverBg: "hover:bg-yellow-200",
  },
  {
    key: "M3",
    label: "1 a 3 Meses",
    maxDays: 90,
    color: "text-orange-600",
    bg: "bg-orange-100",
    hoverBg: "hover:bg-orange-200",
  },
  {
    key: "M3+",
    label: "Mais de 3 Meses",
    maxDays: Infinity,
    color: "text-red-600",
    bg: "bg-red-100",
    hoverBg: "hover:bg-red-200",
  },
];

// Função de Simulação de Geração de Mensagem por IA
const generateAiMessage = (client, category) => {
  const amount = `R$ ${client.dueAmount.toFixed(2).replace(".", ",")}`;
  const days = client.overdueDays;

  let tone = "";
  let messageBody = "";

  switch (category.key) {
    case "M1":
      tone = "Lembrete Amigável";
      messageBody = `Olá, ${client.name}! Tudo bem? Enviamos esta mensagem para lembrar que o pagamento no valor de ${amount} está em aberto há ${days} dias. Podemos te ajudar com a regularização? 😉`;
      break;
    case "M3":
      tone = "Cobrança Firme";
      messageBody = `Prezado(a) ${client.name}, identificamos que seu débito no valor de ${amount} está em atraso há ${days} dias (mais de 1 mês). Por favor, pedimos a gentileza de regularizar a situação urgentemente para evitar cobranças adicionais.`;
      break;
    case "M3+":
      tone = "Urgência/Formal";
      messageBody = `URGENTE: ${client.name}, seu débito de ${amount} possui um atraso crítico de ${days} dias. Caso o pagamento não seja efetuado imediatamente, poderemos iniciar a suspensão dos serviços. Entre em contato para evitar medidas mais sérias.`;
      break;
    default:
      tone = "Geral";
      messageBody = `Olá, ${client.name}. Seu pagamento de ${amount} está atrasado. Por favor, regularize.`;
  }

  return {
    text: messageBody,
    tone,
    date: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

// Componente Modal de Cobrança
const CobrancaModal = ({ client, category, onClose }) => {
  const [history, setHistory] = useState([]); // Histórico de mensagens geradas
  const [currentMessage, setCurrentMessage] = useState(""); // Mensagem sendo editada
  const [historyIndex, setHistoryIndex] = useState(0); // Índice no histórico
  const [isLoading, setIsLoading] = useState(false);

  // Carrega a primeira mensagem ao abrir
  useEffect(() => {
    if (client && history.length === 0) {
      const initialMessage = generateAiMessage(client, category);
      setHistory([initialMessage]);
      setCurrentMessage(initialMessage.text);
      setHistoryIndex(0);
    }
  }, [client, category, history.length]);

  // Função para gerar uma nova sugestão da IA e adicioná-la ao histórico
  const handleGenerateNew = async () => {
    setIsLoading(true);
    // Simulação de chamada de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newSuggestion = generateAiMessage(client, category);

    // Limita o histórico a 3 sugestões
    setHistory((prev) => {
      const newHistory = [newSuggestion, ...prev.slice(0, 2)];
      // Seta a nova mensagem como a mais recente (índice 0)
      setHistoryIndex(0);
      return newHistory;
    });

    setCurrentMessage(newSuggestion.text);
    setIsLoading(false);
  };

  // Navegar para uma sugestão anterior no histórico
  const handleHistoryChange = (index) => {
    setHistoryIndex(index);
    setCurrentMessage(history[index].text);
  };

  // Gera o link final do WhatsApp com a mensagem codificada e editada
  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(currentMessage);
    const whatsappLink = `https://api.whatsapp.com/send?phone=55${client.phone}&text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
    onClose(); // Fecha o modal após o envio (simulado)
  };

  if (!client) return null;

  const currentSuggestion = history[historyIndex];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        {/* Cabeçalho do Modal */}
        <div
          className={`flex justify-between items-center p-5 border-b border-gray-100 rounded-t-xl ${category.bg.replace(
            "-100",
            "-50"
          )}`}
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Sparkles className={`w-5 h-5 mr-2 ${category.color}`} />
            Cobrança Inteligente para {client.name}
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
          {/* Detalhes do Cliente e Dívida */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
            <span className="text-sm text-gray-700 font-medium">
              Dívida:{" "}
              <span className="font-bold text-red-600">
                R$ {client.dueAmount.toFixed(2).replace(".", ",")}
              </span>
            </span>
            <span className="text-sm text-gray-700 font-medium">
              Atraso:{" "}
              <span className="font-bold">{client.overdueDays} dias</span>
            </span>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded-full ${category.bg} ${category.color}`}
            >
              {category.label}
            </span>
          </div>

          {/* Caixa de Edição da Mensagem */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Mensagem para WhatsApp:
              </h3>
              {currentSuggestion && (
                <span className="text-xs text-gray-600">
                  Tom: {currentSuggestion.tone}
                </span>
              )}
            </div>
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              rows="6"
              placeholder="Edite a mensagem aqui..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none text-base"
              disabled={isLoading}
            />
          </div>

          {/* Ações da IA */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            {/* Histórico */}
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                Sugestões ({history.length}):
              </span>
              {history.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryChange(index)}
                  disabled={index === historyIndex || isLoading}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    index === historyIndex
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sugestão {history.length - index}
                </button>
              ))}
            </div>

            {/* Gerar Novamente */}
            <button
              onClick={handleGenerateNew}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isLoading ? "Gerando..." : "Gerar Novamente"}</span>
            </button>
          </div>

          {/* Botão Final de Envio */}
          <button
            onClick={handleSendWhatsApp}
            disabled={!currentMessage.trim()}
            className="w-full inline-flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <Send className="w-6 h-6" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Cliente
const ClientCard = ({ client, openCobrançaModal }) => {
  // Determina a categoria e a cor para o card
  const category = categories.find((cat) => client.overdueDays <= cat.maxDays);
  const colorClass = category
    ? category.color.replace("text", "border")
    : "border-gray-500";

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-md border-l-4 ${colorClass} transition-shadow duration-200 hover:shadow-lg flex flex-col space-y-3`}
    >
      <div className="flex justify-between items-start border-b pb-2">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${category.bg} ${category.color}`}
        >
          {client.overdueDays} dias
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {/* Valor em Atraso */}
        <div className="flex justify-between items-center text-red-600 font-bold">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>Valor em Atraso:</span>
          </div>
          <span>R$ {client.dueAmount.toFixed(2).replace(".", ",")}</span>
        </div>

        {/* Contato */}
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>Telefone:</span>
          </div>
          <span>{client.phone}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Vencimento:</span>
          </div>
          <span>Há {client.overdueDays} dias</span>
        </div>
      </div>

      {/* Ação (Botão que abre o modal) */}
      <button
        onClick={() => openCobrançaModal(client)}
        className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        <Sparkles className="w-4 h-4" />
        <span>Gerar Mensagem de Cobrança (IA)</span>
      </button>
    </div>
  );
};

// Componente principal do Painel
const App = () => {
  const [activeTab, setActiveTab] = useState(categories[0].key);
  const [selectedClientForCobrança, setSelectedClientForCobrança] =
    useState(null);

  // 1. Classifica e filtra os clientes por categoria
  const categorizedDebtors = useMemo(() => {
    const result = { M1: [], M3: [], "M3+": [] };

    mockDebtors.forEach((client) => {
      if (client.overdueDays <= 30) {
        result.M1.push(client);
      } else if (client.overdueDays > 30 && client.overdueDays <= 90) {
        result.M3.push(client);
      } else {
        result["M3+"].push(client);
      }
    });
    return result;
  }, []);

  // Função para abrir o modal de cobrança
  const openCobrançaModal = (client) => {
    const category = categories.find(
      (cat) => client.overdueDays <= cat.maxDays
    );
    if (category) {
      setSelectedClientForCobrança({ ...client, category: category });
    }
  };

  const closeCobrançaModal = () => {
    setSelectedClientForCobrança(null);
  };

  const currentDebtors = categorizedDebtors[activeTab];
  const totalDebtors = mockDebtors.length;

  // Cálculo do valor total da dívida
  const totalDueAmount = mockDebtors.reduce(
    (sum, client) => sum + client.dueAmount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      {/* Modal de Cobrança (condicional) */}
      {selectedClientForCobrança && (
        <CobrancaModal
          client={selectedClientForCobrança}
          category={selectedClientForCobrança.category}
          onClose={closeCobrançaModal}
        />
      )}

      {/* Cabeçalho */}
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 tracking-tight mb-2 flex items-center justify-center">
          <CreditCard className="w-8 h-8 mr-3 text-red-500" />
          Painel de Clientes Inadimplentes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Acompanhe e categorize as pendências financeiras para otimizar suas
          ações de cobrança.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Indicadores de Sumário */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 p-5 rounded-xl shadow-md border border-red-200">
            <p className="text-sm font-medium text-red-600">
              Total de Inadimplentes
            </p>
            <p className="text-3xl font-bold text-red-700 mt-1">
              {totalDebtors}
            </p>
          </div>
          <div className="bg-blue-50 p-5 rounded-xl shadow-md border border-blue-200">
            <p className="text-sm font-medium text-blue-600">
              Total Devido (R$)
            </p>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              R$ {totalDueAmount.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="bg-yellow-50 p-5 rounded-xl shadow-md border border-yellow-200">
            <p className="text-sm font-medium text-yellow-600">Maior Atraso</p>
            <p className="text-3xl font-bold text-yellow-700 mt-1">
              {Math.max(...mockDebtors.map((d) => d.overdueDays))} dias
            </p>
          </div>
        </div>

        {/* Navegação por Abas (Tabs) */}
        <div className="bg-white p-2 rounded-xl shadow-lg mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`
                                    w-full sm:w-auto flex items-center justify-center px-4 py-3 text-sm font-bold rounded-lg transition-all duration-300
                                    ${
                                      activeTab === cat.key
                                        ? `${cat.bg} ${
                                            cat.color
                                          } shadow-lg ring-2 ring-offset-1 ring-${cat.color.replace(
                                            "text-",
                                            ""
                                          )}`
                                        : `text-gray-600 ${cat.hoverBg} hover:text-gray-800`
                                    }
                                `}
              >
                <AlertTriangle className={`w-4 h-4 mr-2 ${cat.color}`} />
                {cat.label} ({categorizedDebtors[cat.key].length})
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span>{categories.find((c) => c.key === activeTab).label}</span>
          </h2>

          {currentDebtors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDebtors.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  openCobrançaModal={openCobrançaModal}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-lg text-center text-gray-500 border border-gray-200">
              <Calendar className="w-10 h-10 mx-auto mb-3" />
              <p className="text-lg">
                Ótimo! Não há clientes nesta categoria de atraso.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Rodapé simples */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 Painel Financeiro.
      </footer>
    </div>
  );
};

export default App;
