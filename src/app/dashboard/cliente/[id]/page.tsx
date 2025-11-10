"use client";

import { supabase } from "@/lib/supabase/supabase";
import { ClienteType, ContatoType, TiposContatoType } from "@/types/next";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import {
  formataCelular,
  formataCPF,
  retornaNumeros,
} from "@/utils/nogDevFormatar";
import { ArrowBigLeft, Plus, Trash, Trash2 } from "lucide-react";
import { formataContatoPorTipo, parseDbContacts } from "../tools/funcoes";
import {
  CLASS_NAME_INPUT,
  CLASS_NAME_LABEL,
  CONTACT_OPTIONS,
} from "../tools/padroes";
import Botao from "../../components/Botao";

export default function EditClientPage() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [notas, setNotas] = useState("");
  const [otherContacts, setOtherContacts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const rota = useRouter();
  const params = useParams();
  const { id } = params;

  const hasPreviousPage = window.history.length > 2;

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchClientData = async () => {
      setLoading(true);
      setMessage("");
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setMessage(`Erro ao carregar dados do cliente: ${error.message}`);
          return;
        }

        const clientData = data as ClienteType;

        if (clientData) {
          setNome(clientData.nome || "");
          setCpf(clientData.cpf || "");
          setWhatsapp(clientData.whatsapp || "");
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
  }, [id]);

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
        const valueToSet = field === "key" ? (data as TiposContatoType) : data;
        return { ...contact, [field]: valueToSet };
      }
      return contact;
    });
    setOtherContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const parsedOtherContacts = otherContacts.reduce((acc, contact) => {
      if (
        contact.key.trim() &&
        CONTACT_OPTIONS.includes(contact.key as TiposContatoType) &&
        contact.value.trim() !== ""
      ) {
        acc[contact.key.trim().toLowerCase()] = contact.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);

    const clientUpdates = {
      nome,
      cpf: retornaNumeros(cpf) || null,
      whatsapp: retornaNumeros(whatsapp) || null,
      nascimento: nascimento || null,
      outros_contatos: parsedOtherContacts,
      notas: notas || null,
      updated_at: new Date().toISOString(),
    };

    try {
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
        rota.back();
      }
    } catch (err: any) {
      const msg = err.message || "Verifique a conexão e tente novamente.";
      setMessage(`Erro inesperado: ${msg}`);
      toast.error(`Erro inesperado: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!id || typeof id !== "string") {
    return (
      <div className="p-8 text-center text-red-600">
        Erro: ID do cliente para edição não fornecido.
      </div>
    );
  }

  if (loading) {
    <Loading />;
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 ">
      <div className="w-full max-w-xl p-4 md:p-8 shadow-2xl rounded-xl bg-background">
        {hasPreviousPage && (
          <button
            onClick={() => rota.back()}
            className="text-primary flex flex-row gap-1 p-2 cursor-pointer"
          >
            <ArrowBigLeft /> Voltar
          </button>
        )}
        <h1 className="text-3xl font-extrabold mb-8 text-secondary-foreground text-center border-b pb-4">
          Editar Cliente:{" "}
          <span className="text-primary">{nome || "Carregando..."}</span>
        </h1>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className={CLASS_NAME_LABEL}>Nome Completo *</label>
            <input
              type="text"
              placeholder="Nome Completo *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASS_NAME_INPUT}
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
                    value={formataContatoPorTipo(contact.key, contact.value)}
                    onChange={(e) =>
                      updateContact(
                        index,
                        "value",
                        formataContatoPorTipo(contact.key, e.target.value)
                      )
                    }
                    className={CLASS_NAME_INPUT}
                    required={contact.key !== null}
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
              <Plus />
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

          <Botao type="submit" disabled={isSaving || nome.trim() === ""}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Botao>
        </form>
      </div>
    </div>
  );
}
