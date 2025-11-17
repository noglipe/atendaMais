"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { TiposContatoType } from "@/types/next";
import {
  formataCelular,
  formataCPF,
  retornaNumeros,
} from "@/utils/nogDevFormatar";
import {
  ArrowLeft,
  UserPlus,
  Trash,
  PlusCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/** Tipos constantes e classes de estilo */
const CONTACT_OPTIONS: TiposContatoType[] = ["Email", "Telefone", "Instagram"];

// Classes de input padronizadas (refletem o estilo do modal)
const CLASS_NAME_INPUT =
  "mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-background text-primary transition duration-150";
const CLASS_NAME_LABEL = "block text-sm font-medium text-primary mb-1";

/** Tipo usado apenas no formulário para representar cada contato adicional */
type ContactFormItem = {
  key: TiposContatoType | "";
  value: string;
};

export default function CreateClientPage() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [otherContacts, setOtherContacts] = useState<ContactFormItem[]>([]);

  const { estabelecimento, loading: loadingCliente } = usePerfil();
  const rota = useRouter();
  const hasPreviousPage =
    typeof window !== "undefined" && window.history.length > 2;

  const addContact = () => {
    // Adiciona o novo contato com o tipo inicial 'Email' se houver
    setOtherContacts([
      ...otherContacts,
      { key: CONTACT_OPTIONS[0] || "", value: "" },
    ]);
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
        const valueToSet =
          field === "key" ? (data as TiposContatoType | "") : data;
        return { ...contact, [field]: valueToSet } as ContactFormItem;
      }
      return contact;
    });
    setOtherContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const parsedOtherContacts = otherContacts.reduce((acc, contact) => {
      if (
        contact.key &&
        CONTACT_OPTIONS.includes(contact.key as TiposContatoType) &&
        contact.value.trim() !== ""
      ) {
        // Converte o tipo para minúsculas antes de salvar no objeto
        acc[contact.key.trim().toLowerCase()] = contact.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);

    const estabelecimentoId = estabelecimento?.id;
    if (!estabelecimentoId) {
      setLoading(false);
      setMessage("Erro: ID do Estabelecimento não encontrado.");
      toast.error("Erro: ID do Estabelecimento não encontrado.");
      return;
    }

    try {
      const { error } = await supabase.from("clients").insert([
        {
          nome,
          cpf: retornaNumeros(cpf) || null,
          whatsapp: retornaNumeros(whatsapp) || null,
          nascimento: nascimento || null,
          outros_contatos: parsedOtherContacts,
          notas: notas || null,
          estabelecimento_id: estabelecimentoId,
        },
      ]);

      if (error) {
        setMessage(`Erro ao cadastrar: ${error.message}`);
        toast.error(`Erro ao cadastrar: ${error.message}`);
      } else {
        setMessage("Cliente cadastrado com sucesso!");
        toast.success("Cliente cadastrado com sucesso!");

        // Limpar o formulário após sucesso
        setNome("");
        setCpf("");
        setWhatsapp("");
        setNascimento("");
        setNotas("");
        setOtherContacts([]);
      }
    } catch (err: any) {
      setMessage(`Erro inesperado: ${err?.message || "Tente novamente."}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCliente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-primary">
          Carregando dados do estabelecimento...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 sm:p-8">
      {/* Container Principal com Estilo de Card (Maior e Centralizado) */}
      <div className="w-full max-w-2xl p-6 md:p-8 bg-background shadow-2xl rounded-xl border border-accent">
        {/* Botão Voltar (Ajustado) */}
        {hasPreviousPage && (
          <button
            onClick={() => rota.back()}
            className="text-secondary-foreground hover:text-primary flex items-center mb-6 transition duration-150 p-2 rounded-lg hover:bg-indigo-50"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>
        )}

        {/* Título Padronizado */}
        <div className="flex items-center border-b pb-4 mb-8">
          <UserPlus className="mr-3 h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-primary">
            Cadastrar Novo Cliente
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção de Dados Principais */}
          <div className="space-y-4">
            <div>
              <label className={CLASS_NAME_LABEL}>Nome Completo *</label>
              <input
                type="text"
                placeholder="Nome Completo *"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={CLASS_NAME_INPUT}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={CLASS_NAME_LABEL}>CPF (Opcional)</label>
                <input
                  type="text"
                  placeholder="CPF"
                  value={formataCPF(cpf)}
                  onChange={(e) => setCpf(e.target.value)}
                  className={CLASS_NAME_INPUT}
                />
              </div>
              <div>
                <label className={CLASS_NAME_LABEL}>WhatsApp (Opcional)</label>
                <input
                  type="text"
                  placeholder="WhatsApp"
                  value={whatsapp && formataCelular(whatsapp)}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={CLASS_NAME_INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nascimento" className={CLASS_NAME_LABEL}>
                Data de Nascimento
              </label>
              <input
                id="nascimento"
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                // Mantendo a classe do input date
                className={`${CLASS_NAME_INPUT} [&::-webkit-calendar-picker-indicator]:invert-[0.5]`}
              />
            </div>
          </div>

          {/* --- Outros Contatos --- */}
          <div className="pt-6 border-t border-accent">
            <h3 className="block text-lg font-semibold text-primary mb-4">
              Contatos Adicionais (Opcional)
            </h3>

            <div className="space-y-4">
              {otherContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 items-center bg-indigo-50/50 p-3 rounded-lg border border-accent/70 shadow-sm"
                >
                  <select
                    value={contact.key}
                    onChange={(e) =>
                      updateContact(index, "key", e.target.value)
                    }
                    className="w-full sm:w-1/3 p-3 border rounded-lg focus:border-indigo-500 text-sm cursor-pointer bg-background text-primary"
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

                  <input
                    type="text"
                    placeholder="Valor do Contato (ex: nome@email.com)"
                    value={contact.value}
                    onChange={(e) =>
                      updateContact(index, "value", e.target.value)
                    }
                    className="w-full sm:flex-1 p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background text-primary transition duration-150"
                    required={contact.key !== null && contact.key !== ""}
                  />

                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="flex-shrink-0 p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-150"
                    aria-label="Remover Contato"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addContact}
              className="mt-4 flex items-center justify-center space-x-2 w-full px-4 py-3 bg-indigo-50 text-primary font-medium rounded-lg hover:bg-indigo-100 transition duration-150"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Adicionar Contato</span>
            </button>
          </div>

          {/* Notas */}
          <div className="relative pt-4 border-t border-accent">
            <label className={CLASS_NAME_LABEL}>Notas (Opcional)</label>
            <textarea
              placeholder="Notas e observações importantes sobre o cliente"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className={CLASS_NAME_INPUT}
            />
          </div>

          {/* Botão de Submissão Padronizado */}
          <button
            type="submit"
            disabled={loading || nome.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-background transition duration-200 shadow-md flex items-center justify-center space-x-2
              ${
                loading || nome.trim() === ""
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 transform hover:scale-[1.01]"
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-background"
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
                <span>Cadastrando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Confirmar Cadastro</span>
              </>
            )}
          </button>
        </form>

        {/* Mensagem de Feedback (Mantida) */}
        {message && (
          <p
            className={`mt-6 p-4 rounded-lg text-center font-semibold text-sm ${
              message.startsWith("Erro")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
