"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { TiposContatoType } from "@/types/next";
import {
  formataCelular,
  formataCPF,
  retornaNumeros,
} from "@/utils/nogDevFormatar";
import { ArrowBigLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/** Tipos constantes e classes de estilo */
const CONTACT_OPTIONS: TiposContatoType[] = ["Email", "Telefone", "Instagram"];
const CLASS_NAME_LABEL =
  "block text-sm font-medium text-secondary-foreground mb-1";
const CLASS_NAME_INPUT =
  "w-full p-3 border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent transition duration-150 text-primary";

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

  /* agora otherContacts usa o tipo do formulário */
  const [otherContacts, setOtherContacts] = useState<ContactFormItem[]>([]);

  const { estabelecimento, loading: loadingCliente } = usePerfil();
  const rota = useRouter();
  const hasPreviousPage =
    typeof window !== "undefined" && window.history.length > 2;

  const addContact = () => {
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
        acc[contact.key.trim().toLowerCase()] = contact.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);

    const estabelecimentoId = estabelecimento?.id;
    if (!estabelecimentoId) {
      setLoading(false);
      setMessage("Erro: ID do Estabelecimento não encontrado.");
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
      <div className="p-8 text-center">
        Carregando dados do estabelecimento...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-xl p-6 md:p-8 bg-background shadow-2xl rounded-xl">
        {hasPreviousPage && (
          <button
            onClick={() => rota.back()}
            className="text-primary flex flex-row gap-1 p-2 cursor-pointer"
          >
            <ArrowBigLeft /> Voltar
          </button>
        )}

        <h1 className="text-3xl font-extrabold mb-8 text-secondary-foreground text-center border-b pb-4">
          Cadastrar Novo Cliente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
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
                placeholder="CPF (Opcional)"
                value={formataCPF(cpf)}
                onChange={(e) => setCpf(e.target.value)}
                className={CLASS_NAME_INPUT}
              />
            </div>
            <div>
              <label className={CLASS_NAME_LABEL}>WhatsApp (Opcional)</label>
              <input
                type="text"
                placeholder="WhatsApp (Opcional)"
                value={formataCelular(whatsapp)}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={CLASS_NAME_INPUT}
              />
            </div>
          </div>

          <div>
            <label htmlFor="nascimento" className={CLASS_NAME_LABEL}>
              Data de Nascimento (Opcional)
            </label>
            <input
              id="nascimento"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className={`${CLASS_NAME_INPUT} [&::-webkit-calendar-picker-indicator]:invert-[0.5]`}
            />
          </div>

          {/* Outros Contatos */}
          <div className="pt-2 border-t border-accent-foreground">
            <label className="block text-lg font-semibold text-secondary-foreground mb-3 mt-2">
              Outros Contatos
            </label>

            <div className="space-y-4">
              {otherContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 items-center bg-background/10 p-3 rounded-lg border border-border/5 shadow-sm"
                >
                  <select
                    value={contact.key}
                    onChange={(e) =>
                      updateContact(index, "key", e.target.value)
                    }
                    className="w-full md:w-1/3 p-2 border rounded-lg focus:border-accent text-sm cursor-pointer text-secondary-foreground"
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
                    placeholder="Valor do Contato"
                    value={contact.value}
                    onChange={(e) =>
                      updateContact(index, "value", e.target.value)
                    }
                    className={CLASS_NAME_INPUT}
                    required={contact.key !== null && contact.key !== ""}
                  />

                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="flex-shrink-0 p-4 bg-destructive/30 text-destructive rounded-sm hover:bg-destructive/10 transition cursor-pointer"
                    aria-label="Remover Contato"
                  >
                    <Trash />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addContact}
              className="mt-3 flex items-center justify-center space-x-2 w-full px-4 py-2 border border-border text-accent rounded-lg hover:bg-accent/10 transition duration-150 cursor-pointer"
            >
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

          <div className="relative pt-2">
            <label className={CLASS_NAME_LABEL}>Notas (Opcional)</label>
            <textarea
              placeholder="Notas e observações importantes sobre o cliente"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className={CLASS_NAME_INPUT}
            />
          </div>

          <button
            type="submit"
            disabled={loading || nome.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-primary-foreground transition duration-200 shadow-lg cursor-pointer
                ${
                  loading || nome.trim() === ""
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-xl"
                }`}
          >
            {loading ? "Cadastrando..." : "Confirmar Cadastro"}
          </button>
        </form>

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
