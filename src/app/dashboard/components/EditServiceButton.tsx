"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { ServicosType } from "@/types/next";
import { CLASS_NAME_INPUT, CLASS_NAME_LABEL } from "../cliente/tools/padroes";
import Botao from "./Botao";
import { toast } from "sonner";
import { createPortal } from "react-dom";

type EditServiceButtonProps = {
  serviceId: string;
  refresh?: () => void;
};

export function EditServiceButton({
  serviceId,
  refresh,
}: EditServiceButtonProps) {
  const [serviceData, setServiceData] = useState<ServicosType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchService = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("id", serviceId)
        .single();

      if (error) throw error;
      setServiceData(data);
    } catch {
      setError("Erro ao carregar serviço.");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (isOpen) fetchService();
  }, [isOpen, fetchService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setServiceData((prev) => {
      if (!prev) return null;
      let newValue: string | number | boolean;

      if (type === "checkbox")
        newValue = (e.target as HTMLInputElement).checked;
      else if (name === "preco")
        newValue = parseFloat(value.replace(",", ".")) || 0;
      else if (name === "tempo_duracao") newValue = parseInt(value, 10) || 0;
      else newValue = value;

      return { ...prev, [name]: newValue };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceData) return;

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase
        .from("servicos")
        .update({
          nome: serviceData.nome,
          preco: serviceData.preco,
          tempo_duracao: serviceData.tempo_duracao,
          ativo: serviceData.ativo,
        })
        .eq("id", serviceId);

      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success("Serviço atualizado com sucesso!");
      setMessage("Serviço atualizado com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações.");
      setError("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
      setIsOpen(false);
      setMessage("");
      refresh && refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition"
      >
        Editar
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-background/50 z-50 backdrop-blur-lg
"
          >
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-accent">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white hover:text-white/50"
              >
                ✕
              </button>

              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : serviceData ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-teal-700 mb-4">
                    Editar Serviço: {serviceData.nome}
                  </h2>

                  {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className={CLASS_NAME_LABEL}>Nome</label>
                    <input
                      name="nome"
                      value={serviceData.nome}
                      onChange={handleChange}
                      className={CLASS_NAME_INPUT}
                    />
                  </div>

                  <div>
                    <label className={CLASS_NAME_LABEL}>Duração (min)</label>
                    <input
                      name="tempo_duracao"
                      type="number"
                      value={serviceData.tempo_duracao}
                      onChange={handleChange}
                      className={CLASS_NAME_INPUT}
                    />
                  </div>

                  <div>
                    <label className={CLASS_NAME_LABEL}>Preço (R$)</label>
                    <input
                      name="preco"
                      type="text"
                      value={String(serviceData.preco).replace(".", ",")}
                      onChange={handleChange}
                      className={CLASS_NAME_INPUT}
                    />
                  </div>

                  <div className="flex flex-row gap-1 items-center">
                    <label htmlFor="ativo" className="">
                      Ativo
                    </label>
                    <input
                      id="ativo"
                      name="ativo"
                      type="checkbox"
                      checked={serviceData.ativo}
                      onChange={handleChange}
                      className={``}
                    />
                  </div>

                  <div className="flex flex-row pt-4 border-t justify-end">
                    <div className="flex justify-end w-[50%] gap-2">
                      <Botao
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variante="destructive"
                        className="w-52"
                      >
                        Cancelar
                      </Botao>

                      <Botao type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Botao>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
