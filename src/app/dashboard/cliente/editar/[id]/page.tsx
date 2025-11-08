"use client";

import { supabase } from "@/lib/supabase/supabase";
import { Cliente, Contato, TiposContato } from "@/types/next";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CONTACT_OPTIONS: TiposContato[] = ["Email", "Telefone", "Instagran"];

// Função auxiliar para converter o objeto de contatos do DB para o estado de array
const parseDbContacts = (
  dbContacts: Record<string, any> | undefined
): Contato[] => {
  if (!dbContacts || Object.keys(dbContacts).length === 0) {
    return [];
  }

  return Object.entries(dbContacts)
    .map(([key, value]) => ({
      // Converte a chave (minúscula) de volta para o formato TiposContato (Capitalizado)
      key: (key.charAt(0).toUpperCase() + key.slice(1)) as TiposContato,
      value: value || "",
    }))
    .filter((c) => c.value); // Filtra valores vazios
};

export default function EditClientPage() {
  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [notas, setNotas] = useState("");
  const [otherContacts, setOtherContacts] = useState<Contato[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!loading) return;

    const fetchClientData = async () => {
      setLoading(true);
      setMessage("");
      try {
        // Simula a busca: .from("clients").select("*").eq("id", clientId)
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();

        console.log(data);

        if (error) {
          setMessage(`Erro ao carregar dados do cliente: ${error.message}`);
          return;
        }

        const clientData = data as Cliente;

        if (clientData) {
          // Preenche os estados com os dados do cliente
          setNome(clientData.nome || "");
          setCpf(clientData.cpf || "");
          setWhatsapp(clientData.whatsapp || "");
          // Certifique-se de que a data está no formato YYYY-MM-DD para o input type="date"
          setNascimento(
            clientData.nascimento ? clientData.nascimento.split("T")[0] : ""
          );
          setNotas(clientData.notas || "");
          setOtherContacts(parseDbContacts(clientData.outros_contatos));
        } else {
          setMessage("Cliente não encontrado.");
        }
      } catch (err: any) {
        setMessage(`Erro inesperado ao buscar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [loading]);

  // ------------------------------------------------------------------
  // FUNÇÕES DE GERENCIAMENTO DE CONTATOS (Reutilizadas do CreateClientPage)
  // ------------------------------------------------------------------
  const addContact = () => {
    // Adiciona um novo contato com a chave inicial "Email"
    setOtherContacts([...otherContacts, { key: "Email", value: "" }]);
  };

  const removeContact = (index: number) => {
    setOtherContacts(otherContacts.filter((_, i) => i !== index));
  };

  const updateContact = (
    index: number,
    field: "key" | "value",
    data: string
  ) => {
    const newContacts = otherContacts.map((contact, i) => {
      if (i === index) {
        const valueToSet = field === "key" ? (data as TiposContato) : data;
        return { ...contact, [field]: valueToSet };
      }
      return contact;
    });
    setOtherContacts(newContacts);
  };

  // ------------------------------------------------------------------
  // FUNÇÃO: Submissão (UPDATE)
  // ------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    // 1. Converte a lista de contatos para o formato de objeto (Record<string, any>)
    const parsedOtherContacts = otherContacts.reduce((acc, contact) => {
      if (
        contact.key.trim() &&
        CONTACT_OPTIONS.includes(contact.key as TiposContato) &&
        contact.value.trim() !== ""
      ) {
        // Normaliza a chave para minúsculas
        acc[contact.key.trim().toLowerCase()] = contact.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);

    // Dados para atualização
    const clientUpdates = {
      nome,
      cpf: cpf || null,
      whatsapp: whatsapp || null,
      nascimento: nascimento || null,
      outros_contatos: parsedOtherContacts,
      notas: notas || null,
      // Em uma implementação real com Supabase, você provavelmente não precisaria disso
      // mas é bom ter uma marca de atualização
      updated_at: new Date().toISOString(),
    };

    try {
      // Simula a atualização no banco de dados
      const { error } = await supabase
        .from("clients")
        .update(clientUpdates)
        .eq("id", id);

      if (error) {
        toast.error(`Erro ao atualizar cliente: ${error.message}`);
        setMessage(`Erro ao atualizar cliente: ${error.message}`);
      } else {
        toast.success("Cliente atualizado com sucesso!");
        setMessage("Cliente atualizado com sucesso!");
        // Aqui você pode adicionar um redirecionamento de volta para a lista de clientes
      }
    } catch (err: any) {
      setMessage(
        `Erro inesperado: ${
          err.message || "Verifique a conexão e tente novamente."
        }`
      );
      toast.error(
        `Erro inesperado: ${
          err.message || "Verifique a conexão e tente novamente."
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-8 text-center">
        Carregando dados do estabelecimento...
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-8 text-center text-red-600">
        Erro: ID do cliente para edição não fornecido.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Carregando dados do cliente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-gray-50">
      <div className="w-full max-w-lg p-6 md:p-8 bg-white shadow-2xl rounded-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center border-b pb-4">
          Editar Cliente:{" "}
          <span className="text-blue-600">{nome || "Carregando..."}</span>
        </h1>

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome (Obrigatório) */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              placeholder="Nome Completo *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>

          {/* CPF e WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF (Opcional)
              </label>
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp (Opcional)
              </label>
              <input
                type="text"
                placeholder="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div className="relative">
            <label
              htmlFor="nascimento"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Nascimento (Opcional)
            </label>
            <input
              id="nascimento"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 text-gray-600"
            />
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Gerenciamento de Outros Contatos */}
          {/* ------------------------------------------------------------------ */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-lg font-semibold text-gray-700 mb-3 mt-2">
              Outros Contatos
            </label>

            <div className="space-y-4">
              {otherContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                >
                  {/* Tipo/Chave do Contato (SELETOR) */}
                  <select
                    value={contact.key}
                    onChange={(e) =>
                      updateContact(index, "key", e.target.value)
                    }
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:border-blue-500 text-sm bg-white cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Selecione o Tipo
                    </option>
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Valor do Contato */}
                  <input
                    type="text"
                    placeholder="Valor do Contato"
                    value={contact.value}
                    onChange={(e) =>
                      updateContact(index, "value", e.target.value)
                    }
                    className="w-full md:w-2/3 p-2 border border-gray-300 rounded-lg focus:border-blue-500 text-sm"
                    required={contact.key !== null}
                  />

                  {/* Botão Remover */}
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    aria-label="Remover Contato"
                  >
                    {/* Inline SVG for Minus Icon */}
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
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Botão Adicionar */}
            <button
              type="button"
              onClick={addContact}
              className="mt-3 flex items-center justify-center space-x-2 w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-150"
            >
              {/* Inline SVG for Plus Icon */}
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Adicionar Contato</span>
            </button>
          </div>

          {/* Campo Notas */}
          <div className="relative pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (Opcional)
            </label>
            <textarea
              placeholder="Notas e observações importantes sobre o cliente"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 resize-y"
            />
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            disabled={isSaving || nome.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 shadow-lg 
                ${
                  isSaving || nome.trim() === ""
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-xl"
                }`}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>

        {/* Mensagem de Status */}
        {message && (
          <p
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              message.startsWith("Erro")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
