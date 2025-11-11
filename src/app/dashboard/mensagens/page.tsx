"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  Image,
  FileText,
  Settings,
  AlertTriangle,
  ChevronRight,
  Hash,
  UserCheck,
  Loader2,
  X,
} from "lucide-react";

// Constante de aviso de antispam
const SPAM_WARNING =
  "ATENÇÃO: Use esta funcionalidade com cautela e responsabilidade. O envio de mensagens não solicitadas ou em massa em curtos períodos pode levar ao bloqueio (banimento) temporário ou permanente do seu número de WhatsApp. Priorize listas de clientes que optaram por receber suas mensagens.";

// Dados simulados dos clientes
const mockClients = [
  {
    id: 1,
    name: "Ana Silva",
    phone: "11987654321",
    status: "debtor",
    lastVisit: "2025-05-01",
  },
  {
    id: 2,
    name: "João Souza",
    phone: "21912345678",
    status: "long_time",
    lastVisit: "2024-01-15",
  },
  {
    id: 3,
    name: "Maria Oliveira",
    phone: "31998761234",
    status: "recent",
    lastVisit: "2025-11-05",
  },
  {
    id: 4,
    name: "Pedro Santos",
    phone: "41911112222",
    status: "recent",
    lastVisit: "2025-10-28",
  },
  {
    id: 5,
    name: "Juliana Costa",
    phone: "51933334444",
    status: "long_time",
    lastVisit: "2023-10-20",
  },
  {
    id: 6,
    name: "Felipe Martins",
    phone: "61955556666",
    status: "debtor",
    lastVisit: "2025-09-10",
  },
  {
    id: 7,
    name: "Lucas Pereira",
    phone: "71977778888",
    status: "recent",
    lastVisit: "2025-11-01",
  },
  {
    id: 8,
    name: "Gabriela Alves",
    phone: "81922221111",
    status: "long_time",
    lastVisit: "2024-05-12",
  },
  {
    id: 9,
    name: "Ricardo Rocha",
    phone: "91944443333",
    status: "debtor",
    lastVisit: "2025-06-25",
  },
];

// Mapeamento de status para tags visuais
const getStatusTag = (status) => {
  switch (status) {
    case "debtor":
      return {
        label: "Devedor",
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      };
    case "long_time":
      return {
        label: "Ausente (6m+)",
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      };
    case "recent":
      return {
        label: "Recente",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
      };
    default:
      return { label: "Novo", color: "bg-gray-100 text-gray-700", icon: Hash };
  }
};

// Componente de Simulação de Chatbot da IA (Modal)
const AiWriterModal = ({ isOpen, onClose, onGenerate, mode, clientCount }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const title =
    mode === "personalized"
      ? `IA Personalizada (Para ${clientCount} clientes)`
      : "IA - Mensagem Genérica";

  const description =
    mode === "personalized"
      ? "Descreva o propósito e a IA gerará um rascunho individualizado para cada cliente selecionado, usando o nome e o status como contexto."
      : "Descreva o propósito da mensagem e a IA gerará um único rascunho de mensagem para todos os clientes.";

  const placeholder =
    mode === "personalized"
      ? "Ex: Quero uma mensagem para lembrar os clientes devedores de um pagamento em aberto, com um tom amigável."
      : "Ex: Crie uma mensagem curta de feliz natal para enviar para todos os clientes.";

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    // Simulação de chamada de API. Em produção, este seria o ponto de chamada do Gemini API.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Chamada da função de callback com o prompt e o modo
    onGenerate(prompt, mode);

    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-blue-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-blue-700 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">{description}</p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            disabled={isLoading}
          />

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-md hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{isLoading ? "Gerando..." : "Gerar Mensagem"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const App = () => {
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiMode, setAiMode] = useState("generic"); // 'generic' ou 'personalized'
  const [isSelectorExpanded, setIsSelectorExpanded] = useState(true); // Novo estado para o seletor de clientes

  // Simulação de anexos
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedPdf, setAttachedPdf] = useState(null);

  const selectedClients = useMemo(
    () => mockClients.filter((client) => selectedClientIds.includes(client.id)),
    [selectedClientIds]
  );

  // Handlers de Seleção de Cliente
  const handleSelectClient = (clientId) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClientIds.length === mockClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(mockClients.map((client) => client.id));
    }
  };

  // Handler de Upload de Arquivos
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Em uma aplicação real, você faria o upload para o Firebase Storage
    if (type === "image") {
      setAttachedImage(file);
    } else if (type === "pdf") {
      setAttachedPdf(file);
    }
  };

  // Handler para simular envio de mensagem
  const handleSendMessage = () => {
    if (selectedClientIds.length === 0) {
      console.error("Selecione pelo menos um cliente para enviar.");
      return;
    }

    const clientList = selectedClients.map((c) => c.name).join(", ");

    // Em uma aplicação real, aqui você integraria com a API do WhatsApp/Twilio
    console.log(`--- ENVIO DE MENSAGEM INICIADO ---`);
    console.log(`Destinatários (${selectedClientIds.length}): ${clientList}`);
    console.log(`Mensagem: \n${messageText}`);
    if (attachedImage) console.log(`Anexo Imagem: ${attachedImage.name}`);
    if (attachedPdf) console.log(`Anexo PDF: ${attachedPdf.name}`);
    console.log(`--- FIM DO ENVIO SIMULADO ---`);

    // Limpar estados após o envio (simulação)
    setMessageText("");
    setSelectedClientIds([]);
    setAttachedImage(null);
    setAttachedPdf(null);

    // Exibir notificação (substituição do alert)
    const confirmationBox = document.getElementById("notification-box");
    confirmationBox.textContent = `✅ Mensagem enviada com sucesso para ${selectedClientIds.length} clientes (simulação).`;
    confirmationBox.classList.remove("hidden", "bg-red-500", "bg-yellow-500");
    confirmationBox.classList.add("bg-green-500");
    setTimeout(() => confirmationBox.classList.add("hidden"), 5000);
  };

  // Handler para IA gerar a mensagem (Simulação de Gemini)
  const handleAiGenerate = (prompt, mode) => {
    let aiOutput = "";

    // Simulação do resultado da IA para o modo genérico
    if (mode === "generic") {
      aiOutput = `Olá! A IA gerou esta sugestão para o seu prompt: "${prompt}". Lembre-se de revisar o conteúdo.`;
      setMessageText(aiOutput);

      // Simulação do resultado da IA para o modo personalizado (usando variáveis [CLIENTE])
    } else if (mode === "personalized") {
      aiOutput = `Olá [CLIENTE]! Viemos te dar um oi! O motivo desta mensagem é: "${prompt}". \n\nDetalhes do seu perfil: [STATUS_CLIENTE]. Estamos aqui para te ajudar.`;
      setMessageText(aiOutput);

      // Notificação sobre a personalização
      const confirmationBox = document.getElementById("notification-box");
      confirmationBox.textContent = `A IA gerou um modelo personalizado. Use as variáveis [CLIENTE] e [STATUS_CLIENTE] na mensagem!`;
      confirmationBox.classList.remove("hidden", "bg-green-500", "bg-red-500");
      confirmationBox.classList.add("bg-yellow-500");
      setTimeout(() => confirmationBox.classList.add("hidden"), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      {/* Modal de escrita por IA */}
      <AiWriterModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAiGenerate}
        mode={aiMode}
        clientCount={selectedClientIds.length}
      />

      {/* Notificação (Substituto de alert()) */}
      <div
        id="notification-box"
        className="hidden fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-opacity duration-300"
        role="alert"
      >
        Mensagem de Confirmação
      </div>

      {/* Cabeçalho */}
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight mb-2">
          Marketing WhatsApp Inteligente
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Selecione clientes e crie mensagens poderosas, com o auxílio da
          Inteligência Artificial.
        </p>
      </header>

      <main className="max-w-4xl mx-auto pb-16 space-y-6">
        {/* NOVO: Seletor de Clientes Colapsável */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <button
            onClick={() => setIsSelectorExpanded(!isSelectorExpanded)}
            className="w-full flex justify-between items-center p-5 rounded-xl transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">
                Clientes para Envio
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-extrabold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {selectedClientIds.length} Contato(s) Selecionado(s)
              </span>
              <ChevronRight
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isSelectorExpanded ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
          </button>

          {/* Conteúdo Expansível */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSelectorExpanded
                ? "max-h-[500px] border-t border-gray-100"
                : "max-h-0"
            }`}
          >
            <div className="p-5">
              {/* Selecionar Todos */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                <label className="flex items-center space-x-3 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedClientIds.length === mockClients.length &&
                      mockClients.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Selecionar Todos</span>
                </label>
                <span className="text-sm text-gray-500">
                  Total: {mockClients.length}
                </span>
              </div>

              {/* Lista de Clientes */}
              <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                {mockClients.map((client) => {
                  const tag = getStatusTag(client.status);
                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition duration-150 border border-gray-200"
                    >
                      <label className="flex items-center space-x-3 text-sm text-gray-800 cursor-pointer w-full">
                        <input
                          type="checkbox"
                          checked={selectedClientIds.includes(client.id)}
                          onChange={() => handleSelectClient(client.id)}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex flex-col truncate">
                          <span className="font-medium truncate">
                            {client.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {client.phone}
                          </span>
                        </div>
                      </label>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${tag.color}`}
                      >
                        <tag.icon className="w-3 h-3 mr-1" />
                        {tag.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Aviso Antispam (Sem alteração) */}
        <div className="bg-red-50 border border-red-300 p-4 rounded-xl shadow-md flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-700 mb-1">
              Aviso Importante (Anti-Spam)
            </h3>
            <p className="text-sm text-red-600">{SPAM_WARNING}</p>
          </div>
        </div>

        {/* Caixa de Texto Principal (Sem alteração) */}
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-2 mb-4 border-b pb-3">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Conteúdo da Mensagem
            </h2>
          </div>

          <textarea
            placeholder="Digite sua mensagem aqui ou use a IA abaixo. Use [CLIENTE] para personalizar o nome do cliente. Ex: Olá [CLIENTE],..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows="8"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none text-base"
          />

          {/* Ferramentas de Mensagem */}
          <div className="flex flex-wrap items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-700">
              Adicionar:
            </span>

            {/* Emojis (Simulação) */}
            <button
              onClick={() => setMessageText((prev) => prev + " 👋")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Inserir Emoji"
            >
              <span className="text-xl">😊</span>
            </button>
            <button
              onClick={() => setMessageText((prev) => prev + " 🚀")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Inserir Emoji"
            >
              <span className="text-xl">🚀</span>
            </button>

            {/* Anexo Imagem */}
            <label className="cursor-pointer flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm text-gray-700">
              <Image className="w-4 h-4 text-purple-600" />
              <span>
                {attachedImage
                  ? attachedImage.name.substring(0, 15) + "..."
                  : "Imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
              />
            </label>

            {/* Anexo PDF */}
            <label className="cursor-pointer flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm text-gray-700">
              <FileText className="w-4 h-4 text-red-600" />
              <span>
                {attachedPdf
                  ? attachedPdf.name.substring(0, 15) + "..."
                  : "PDF"}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, "pdf")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Opções de Geração por IA (Sem alteração) */}
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 space-y-3">
          <div className="flex items-center space-x-2 border-b pb-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Geração de Mensagem por IA
            </h2>
          </div>

          <p className="text-sm text-gray-600">
            Escolha como a IA deve te auxiliar:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Modo 1: IA Genérica */}
            <button
              onClick={() => {
                setAiMode("generic");
                setAiModalOpen(true);
              }}
              className="flex items-center justify-center p-3 space-x-2 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-sm hover:bg-yellow-300 transition"
            >
              <Settings className="w-5 h-5" />
              <span>Gerar Mensagem Genérica</span>
            </button>

            {/* Modo 2: IA Personalizada */}
            <button
              onClick={() => {
                setAiMode("personalized");
                setAiModalOpen(true);
              }}
              disabled={selectedClientIds.length === 0}
              className="flex items-center justify-center p-3 space-x-2 bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                selectedClientIds.length === 0
                  ? "Selecione clientes para habilitar a personalização"
                  : "Gerar mensagens personalizadas"
              }
            >
              <UserCheck className="w-5 h-5" />
              <span>Gerar Mensagens Personalizadas</span>
            </button>
          </div>
        </div>

        {/* Botão de Envio (Sem alteração) */}
        <button
          onClick={handleSendMessage}
          disabled={selectedClientIds.length === 0 || messageText.trim() === ""}
          className="w-full inline-flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6" />
          <span>Enviar Mensagem para {selectedClientIds.length} Clientes</span>
        </button>
      </main>

      {/* Rodapé simples */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 Sistema de Comunicação.
      </footer>
    </div>
  );
};

export default App;
