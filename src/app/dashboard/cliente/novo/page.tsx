"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { Contato, TiposContato } from "@/types/next";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CONTACT_OPTIONS: TiposContato[] = ["Email", "Telefone", "Instagran"];

type ContatoKey = TiposContato | "";

export default function CreateClientPage() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  // NOVO ESTADO: Data de Nascimento
  const [nascimento, setNascimento] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Novo estado para gerenciar outros contatos como uma array de objetos
  const [otherContacts, setOtherContacts] = useState<Contato[]>([]);

  // O uso do mock usePerfil substitui o useClient
  const { estabelecimento, loading: loadingCliente } = usePerfil();

  const addContact = () => {
    // Adiciona um novo contato com a chave inicial vazia para forçar a seleção no <select>
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
        // A tipagem 'ContatoKey' (TiposContato | "") garante a compatibilidade aqui
        const valueToSet = field === "key" ? (data as ContatoKey) : data;
        return { ...contact, [field]: valueToSet };
      }
      return contact;
    });
    setOtherContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Converte a lista de contatos para o formato de objeto (Record<string, any>)
    const parsedOtherContacts = otherContacts.reduce((acc, contact) => {
      // Garante que a chave não é vazia e é um tipo permitido antes de adicionar.
      if (
        contact.key.trim() &&
        CONTACT_OPTIONS.includes(contact.key as TiposContato)
      ) {
        // Normaliza a chave para minúsculas para o JSONB no banco de dados.
        acc[contact.key.trim().toLowerCase()] = contact.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);

    // Verifica se o ID do estabelecimento está disponível
    const estabelecimentoId = estabelecimento?.id;

    if (!estabelecimentoId) {
      setLoading(false);
      setMessage(
        "Erro: ID do Estabelecimento não encontrado. Verifique o contexto do estabelecimento."
      );
      return;
    }

    try {
      const { data, error } = await supabase.from("clients").insert([
        {
          nome,
          cpf: cpf || null,
          whatsapp: whatsapp || null,
          nascimento: nascimento || null, // NOVO CAMPO ADICIONADO
          outros_contatos: parsedOtherContacts, // Objeto JSONB
          notas: notas || null,
          estabelecimento_id: estabelecimentoId,
        },
      ]);

      if (error) {
        setMessage(`Erro ao cadastrar: ${error.message}`);
      } else {
        setMessage("Cliente cadastrado com sucesso!");
        toast.success("Cliente cadastrado com sucesso");
        // Limpa formulário
        setNome("");
        setCpf("");
        setWhatsapp("");
        setNascimento(""); // Limpa o novo campo
        setNotas("");
        setOtherContacts([]);
      }
    } catch (err: any) {
      setMessage(
        `Erro inesperado: ${
          err.message || "Verifique a conexão e tente novamente."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingCliente) {
    return (
      <div className="p-8 text-center">
        Carregando dados do estabelecimento...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-lg p-6 md:p-8 bg-white shadow-xl rounded-xl">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
          Cadastrar Novo Cliente
        </h1>

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome (Obrigatório) */}
          <div className="relative">
            <input
              type="text"
              placeholder="Nome Completo *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>

          {/* CPF e WhatsApp (Dois-Colunas no PC, Uma-Coluna no Celular) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="CPF (Opcional)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="WhatsApp (Opcional)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              />
            </div>
          </div>

          {/* NOVO CAMPO: Data de Nascimento (Full Width) */}
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
          <div className="pt-2">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
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
                    // O onChange retorna string, que é compatível com ContatoKey
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
                    // Torna obrigatório se o tipo foi selecionado (key não é "")
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
            <textarea
              placeholder="Notas e observações importantes sobre o cliente (Opcional)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 resize-y"
            />
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            disabled={loading || nome.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 shadow-md 
              ${
                loading || nome.trim() === ""
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
          >
            {loading ? "Cadastrando..." : "Confirmar Cadastro"}
          </button>
        </form>

        {/* Mensagem de Status */}
        {message && (
          <p
            className={`mt-4 p-3 rounded-lg text-center ${
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
