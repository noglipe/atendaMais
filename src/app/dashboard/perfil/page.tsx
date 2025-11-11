"use client";

import { useEffect, useState, useMemo } from "react";
// REMOVIDA A IMPORTAÇÃO: import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { EstabelecimentoType, PerfilType } from "@/types/next";

// --- Componente Spinner (Definido localmente para resolver erro de importação) ---
const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-white inline-flex ${className}`}
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

// Função utilitária para limpar e formatar o número do WhatsApp (adiciona 55 para o código do país - Brasil)
const formatWhatsappNumber = (rawNumber) => {
  if (!rawNumber) return "";
  const digits = rawNumber.replace(/\D/g, "");
  // Se o número não começar com 55 (código do Brasil), adicione.
  // Assume que o número com DDD tem 10 ou 11 dígitos.
  if (digits.length >= 10 && !digits.startsWith("55")) {
    return "55" + digits;
  }
  return digits;
};

// Componente Modal para exibir o QR Code
const QrCodeModal = ({ isOpen, onClose, qrCodeUrl, whatsappNumber }) => {
  if (!isOpen) return null;

  // Função para fazer o download do QR Code
  const handleDownload = () => {
    if (!qrCodeUrl) return;

    // Cria um link temporário para o download da imagem
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qrcode-whatsapp-${whatsappNumber.replace(/\D/g, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code baixado com sucesso!");
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  QR Code do WhatsApp
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Aponte a câmera do seu celular para este código para iniciar
                    uma conversa instantânea com o estabelecimento.
                  </p>

                  {qrCodeUrl ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      {/* Simulação de "imagem buscada de outro lugar" usando uma API de QR Code */}
                      <img
                        src={qrCodeUrl}
                        alt="QR Code do WhatsApp Business"
                        className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg border-4 border-green-500 shadow-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/300x300/f87171/ffffff?text=ERRO+QR";
                        }}
                      />
                      <p className="mt-4 text-gray-700 font-medium">
                        Número: {whatsappNumber || "Não cadastrado"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-red-500 font-semibold">
                      Por favor, cadastre um número de WhatsApp válido (com DDD)
                      na seção abaixo para gerar o QR Code.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
              onClick={handleDownload}
              disabled={!qrCodeUrl}
            >
              Baixar QR Code
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock para simular a criação do cliente Supabase (totalmente autocontido)
const createClientComponentClient = () => {
  // Este mock simula as funções usadas (auth.getUser, from, select, update)
  // sem depender de pacotes externos.

  // Mock do objeto user, pois a autenticação real não está disponível.
  const mockUser = {
    id: "mock-user-id",
    email: "mock.user@example.com",
    user_metadata: { nome: "Usuário Mock" },
  };

  // Mock da função auth
  const authMock = {
    getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
  };

  // Mock da função from
  const fromMock = (table) => ({
    // Simula que a busca inicial (select) retorna nulo para forçar a inserção do mock de dados.
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),

    // Simula a inserção (insert) retornando dados mockados.
    insert: (data) => ({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: {
              ...data,
              id:
                table === "estabelecimento" ? "mock-estab-id" : "mock-user-id",
            },
            error: null,
          }),
      }),
    }),

    // Simula a atualização (update).
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
  });

  return {
    auth: authMock,
    from: fromMock,
  };
};

export default function PerfilPage() {
  // Chamada direta do mock.
  const supabase = createClientComponentClient();

  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [estab, setEstab] = useState<EstabelecimentoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o Modal

  // --- Funções de QR Code ---
  const cleanedWhatsapp = useMemo(
    () => formatWhatsappNumber(estab?.whatsapp),
    [estab?.whatsapp]
  );

  const getWhatsappLink = () => {
    // Retorna o link wa.me pronto para ser usado no QR Code
    if (!cleanedWhatsapp) return "";
    // Mensagem pré-definida opcional: &text=Olá%2C+tenho+interesse!
    return `https://wa.me/${cleanedWhatsapp}`;
  };

  const qrCodeUrl = useMemo(() => {
    const link = getWhatsappLink();
    // Verifica se o link é válido antes de tentar gerar o QR Code
    if (!link || cleanedWhatsapp.length < 10) return "";

    // API de geração de QR Code (simulando "busca em outro lugar")
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      link
    )}`;
  }, [cleanedWhatsapp]);
  // --- Fim Funções de QR Code ---

  useEffect(() => {
    const loadData = async () => {
      // Garantindo que a simulação de user está sendo usada
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Se o usuário não estiver autenticado (ou mock), sai
      if (!user) {
        setLoading(false);
        return;
      }

      // --- ESTABELECIMENTO ---
      // A busca inicial retorna null, forçando a criação do mock
      let { data: estabData } = await supabase
        .from("estabelecimento")
        .select("*")
        .eq("owner_name", user.id)
        .single();

      if (!estabData) {
        // Insere mock de Estabelecimento
        const { data: novoEstab } = await supabase
          .from("estabelecimento")
          .insert({
            nome: "Novo Estabelecimento",
            owner_name: user.id,
            whatsapp: "11988887777", // Valor inicial mockado
            // Certifica-se de que o objeto endereco é inicializado corretamente
            endereco: { cep: "", rua: "", numero: "", cidade: "", estado: "" },
          })
          .select()
          .single();
        estabData = novoEstab;
      }
      setEstab(estabData);

      // --- PERFIL ---
      // A busca inicial retorna null, forçando a criação do mock
      let { data: perfilData } = await supabase
        .from("perfil")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!perfilData) {
        // Insere mock de Perfil
        const { data: novoPerfil } = await supabase
          .from("perfil")
          .insert({
            id: user.id,
            nome: (user.user_metadata as any)?.nome || user.id,
            email: user.email,
            whatsapp: "",
            estabelecimento_id: estabData?.id,
          })
          .select()
          .single();
        perfilData = novoPerfil;
      }
      setPerfil(perfilData);

      setLoading(false);
    };

    loadData();
  }, [supabase]);

  useEffect(() => {
    const cep = estab?.endereco?.cep?.replace(/\D/g, "");
    if (cep && cep.length === 8) {
      // Adicionado controle de abortamento de fetch para limpeza
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            console.log("CEP não encontrado ou inválido.");
            return;
          }

          setEstab((prev) =>
            prev
              ? {
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    rua: data.logradouro || prev.endereco.rua,
                    cidade: data.localidade || prev.endereco.cidade,
                    estado: data.uf || prev.endereco.estado,
                  },
                }
              : prev
          );
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Erro ao buscar CEP:", error);
          }
        });

      return () => controller.abort();
    }
  }, [estab?.endereco?.cep]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil || !estab) return;

    setLoading(true);
    perfil.estabelecimento_id = estab.id;

    // Atualiza Perfil
    const { error: perfilError } = await supabase
      .from("perfil")
      .update({
        nome: perfil.nome,
        whatsapp: perfil.whatsapp,
        estabelecimento_id: perfil.estabelecimento_id,
      })
      .eq("id", perfil.id);

    // Atualiza Estabelecimento
    const { error: estabError } = await supabase
      .from("estabelecimento")
      .update({
        nome: estab.nome,
        razao_social: estab.razao_social,
        documento: estab.documento,
        owner_name: estab.owner_name,
        whatsapp: estab.whatsapp,
        endereco: estab.endereco,
      })
      .eq("id", estab.id);

    if (perfilError || estabError) {
      toast.error("Erro ao salvar dados.");
      console.error("Erro ao salvar Perfil:", perfilError);
      console.error("Erro ao salvar Estabelecimento:", estabError);
    } else {
      toast.success("Dados atualizados com sucesso!");
    }

    setLoading(false);
  };

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEstabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstab((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstab((prev) =>
      prev
        ? {
            ...prev,
            endereco: {
              ...prev.endereco,
              [name]: value,
            },
          }
        : prev
    );
  };

  const CLASS_NAME_INPUT =
    "block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-150";
  const CLASS_NAME_LABEL =
    "block text-sm font-medium leading-6 text-gray-700 mb-1";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
        <p className="ml-2 text-indigo-600">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:p-8 border border-gray-200 bg-white shadow-xl p-4 rounded-xl">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b-2 border-indigo-600 pb-4">
          Configurações do Perfil e Estabelecimento
        </h1>

        <form
          className="bg-white rounded-xl overflow-hidden"
          onSubmit={handleSave}
        >
          <div className="divide-y divide-gray-200">
            {/* PERFIL (Seu Usuário) */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-bold text-indigo-700">
                Seu Perfil (Administrador)
              </h2>
              <p className="text-sm text-gray-500">
                Estes são seus dados pessoais de contato.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-1">
                  <label htmlFor="perfil-nome" className={CLASS_NAME_LABEL}>
                    Nome
                  </label>
                  <input
                    type="text"
                    id="perfil-nome"
                    name="nome"
                    placeholder="Seu nome"
                    value={perfil?.nome || ""}
                    onChange={handlePerfilChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="perfil-email" className={CLASS_NAME_LABEL}>
                    Email
                  </label>
                  <input
                    type="text"
                    id="perfil-email"
                    name="email"
                    placeholder="Seu email"
                    value={perfil?.email || ""}
                    disabled // Email geralmente não é editável após o cadastro inicial
                    className={`${CLASS_NAME_INPUT} bg-gray-100 cursor-not-allowed`}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="perfil-whatsapp" className={CLASS_NAME_LABEL}>
                    Seu WhatsApp
                  </label>
                  <input
                    type="text"
                    id="perfil-whatsapp"
                    name="whatsapp"
                    placeholder="(XX) XXXXX-XXXX"
                    value={perfil?.whatsapp || ""}
                    onChange={handlePerfilChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>
              </div>
            </div>

            {/* ESTABELECIMENTO */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-bold text-indigo-700 flex justify-between items-center">
                Dados do Estabelecimento
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-150 flex items-center text-sm disabled:bg-gray-400"
                  disabled={!qrCodeUrl} // Desabilita se o número do WhatsApp não for válido
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 11h4V7H3v4zm14-4v4h4V7h-4zm-7 4h4V7h-4v4zm0 4h-4v4h4v-4zm0 4h4v-4h-4v4zm7-4h-4v4h4v-4zm-7-4v4h4v-4h-4z" />
                  </svg>
                  Visualizar QR Code
                </button>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                {/* CAMPOS PRINCIPAIS */}
                <div className="sm:col-span-3">
                  <label htmlFor="estab-nome" className={CLASS_NAME_LABEL}>
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    id="estab-nome"
                    name="nome"
                    value={estab?.nome || ""}
                    onChange={handleEstabChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-razao" className={CLASS_NAME_LABEL}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="estab-razao"
                    name="razao_social"
                    value={estab?.razao_social || ""}
                    onChange={handleEstabChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-doc" className={CLASS_NAME_LABEL}>
                    Documento (CNPJ/CPF)
                  </label>
                  <input
                    type="text"
                    id="estab-doc"
                    name="documento"
                    value={estab?.documento || ""}
                    onChange={handleEstabChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-whatsapp" className={CLASS_NAME_LABEL}>
                    <span className="font-bold text-green-700">
                      WhatsApp do Estabelecimento (para QR Code)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="estab-whatsapp"
                    name="whatsapp"
                    placeholder="(XX) XXXXX-XXXX (Obrigatório para QR Code)"
                    value={estab?.whatsapp || ""}
                    onChange={handleEstabChange}
                    className={`${CLASS_NAME_INPUT} border-green-400`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use o formato com DDD (ex: 11999998888). O Código QR será
                    gerado a partir deste número.
                  </p>
                </div>

                {/* ENDEREÇO */}
                <h3 className="sm:col-span-6 text-lg font-bold text-indigo-700 pt-4 border-t border-gray-200 mt-2">
                  Endereço
                </h3>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cep" className={CLASS_NAME_LABEL}>
                    CEP
                  </label>
                  <input
                    type="text"
                    id="endereco-cep"
                    name="cep"
                    value={estab?.endereco?.cep || ""}
                    onChange={handleEnderecoChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="endereco-rua" className={CLASS_NAME_LABEL}>
                    Rua
                  </label>
                  <input
                    type="text"
                    id="endereco-rua"
                    name="rua"
                    value={estab?.endereco?.rua || ""}
                    onChange={handleEnderecoChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-numero" className={CLASS_NAME_LABEL}>
                    Número
                  </label>
                  <input
                    type="text"
                    id="endereco-numero"
                    name="numero"
                    value={estab?.endereco?.numero || ""}
                    onChange={handleEnderecoChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cidade" className={CLASS_NAME_LABEL}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="endereco-cidade"
                    name="cidade"
                    value={estab?.endereco?.cidade || ""}
                    onChange={handleEnderecoChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-estado" className={CLASS_NAME_LABEL}>
                    Estado
                  </label>
                  <input
                    type="text"
                    id="endereco-estado"
                    name="estado"
                    value={estab?.endereco?.estado || ""}
                    onChange={handleEnderecoChange}
                    className={CLASS_NAME_INPUT}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="md" className="mr-2" />
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal do QR Code */}
      <QrCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCodeUrl={qrCodeUrl}
        whatsappNumber={estab?.whatsapp}
      />
    </div>
  );
}
