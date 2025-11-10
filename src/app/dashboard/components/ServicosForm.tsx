"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import Botao from "./Botao";
import { CLASS_NAME_INPUT, CLASS_NAME_LABEL } from "../cliente/tools/padroes";
import { toast } from "sonner";

type NovoServico = {
  nome: string;
  preco: number;
  tempo_duracao: number;
  ativo: boolean;
};

export function ServicosFormButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Botao onClick={onOpen} className="max-w-52">
      + Novo Serviço
    </Botao>
  );
}

export function NovoServicosForm({
  isOpen,
  onClose,
  idEstabelecimento,
}: {
  isOpen: boolean;
  onClose: () => void;
  idEstabelecimento: string;
}) {
  const [formData, setFormData] = useState<NovoServico>({
    nome: "",
    preco: 0,
    tempo_duracao: 30,
    ativo: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "preco"
          ? parseFloat(value.replace(",", ".")) || 0
          : name === "tempo_duracao"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.from("servicos").insert([
        {
          nome: formData.nome.trim(),
          tempo_duracao: formData.tempo_duracao,
          preco: formData.preco,
          ativo: true,
          estabelecimento_id: idEstabelecimento,
        },
      ]);

      if (error) throw error;

      setMessage(`Serviço "${formData.nome}" criado com sucesso!`);
      setFormData({ nome: "", preco: 0, tempo_duracao: 0, ativo: true });
    } catch {
      toast.error("Falha ao criar o serviço.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 items-center justify-center w-full my-6 rounded-sm shadow-lg border">
      <div className=" bg-background p-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Novo Serviço</h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2  grid-cols-1 gap-4">
            <div>
              <label className={CLASS_NAME_LABEL}>Nome do Serviço</label>
              <input
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className={CLASS_NAME_INPUT}
              />
            </div>

            <div>
              <label className={CLASS_NAME_LABEL}>Duração (min)</label>
              <input
                name="tempo_duracao"
                type="number"
                min="5"
                value={formData.tempo_duracao}
                onChange={handleChange}
                className={CLASS_NAME_INPUT}
              />
            </div>

            <div>
              <label className={CLASS_NAME_LABEL}>Preço (R$)</label>
              <input
                name="preco"
                type="text"
                placeholder="0,00"
                value={String(formData.preco).replace(".", ",")}
                onChange={handleChange}
                className={CLASS_NAME_INPUT}
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-destructive/70 rounded-lg hover:bg-destructive transition"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                isSaving
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
