"use client";

import { supabase } from "@/lib/supabase/supabase";
import { ServicosType } from "@/types/next";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function EditServicePage() {
  const [serviceData, setServiceData] = useState<ServicosType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string;

  const fetchService = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(`Erro: ${error.message}`);
        setServiceData(null);
      } else {
        setServiceData(data);
      }
    } catch (err) {
      setError("Erro inesperado ao buscar dados do serviço.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setServiceData((prevData) => {
      if (!prevData) return null;

      let newValue: string | number | boolean;
      if (type === "checkbox") {
        newValue = (e.target as HTMLInputElement).checked;
      } else if (name === "preco") {
        const sanitizedValue = value.replace(",", ".");
        newValue = parseFloat(sanitizedValue) || 0;
      } else if (name === "tempo_duracao") {
        newValue = parseInt(value, 10) || 0;
      } else {
        newValue = value;
      }

      return {
        ...prevData,
        [name]: newValue,
      } as ServicosType;
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
        .eq("id", id);

      if (error) throw error;

      setMessage(`Serviço "${serviceData.nome}" atualizado com sucesso!`);
    } catch (err: any) {
      setError("Falha ao salvar as alterações do serviço.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="mt-4 text-lg text-gray-600">
          Buscando detalhes do serviço...
        </p>
      </div>
    );
  }

  if (error && !serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-red-50">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-300 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Erro ao Carregar Serviço
          </h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchService}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Serviço não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800 border-b pb-2">
          Editar Serviço:{" "}
          <span className="text-teal-600">{serviceData.nome}</span>
        </h1>

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-md"
            role="alert"
          >
            <p className="font-bold">Sucesso!</p>
            <p className="text-sm">{message}</p>
          </div>
        )}
        {error && !isSaving && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md"
            role="alert"
          >
            <p className="font-bold">Erro ao Salvar</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Serviço
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={serviceData.nome}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 transition duration-150"
            />
          </div>

          <div>
            <label
              htmlFor="tempo_duracao"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duração (em minutos)
            </label>
            <input
              id="tempo_duracao"
              name="tempo_duracao"
              type="number"
              min="5"
              required
              value={serviceData.tempo_duracao}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 transition duration-150"
            />
          </div>

          <div>
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço (R$)
            </label>
            <div className="relative mt-1 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                id="preco"
                name="preco"
                type="text"
                required
                value={String(serviceData.preco).replace(".", ",")}
                onChange={handleChange}
                placeholder="0,00"
                className="block w-full rounded-lg border-gray-300 pl-10 pr-3 p-3 border focus:border-teal-500 focus:ring-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              id="ativo"
              name="ativo"
              type="checkbox"
              checked={serviceData.ativo}
              onChange={handleChange}
              className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition duration-150"
            />
            <label
              htmlFor="ativo"
              className="ml-3 block text-base font-medium text-gray-700"
            >
              Serviço Ativo (Disponível para agendamento)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white transition duration-200 
                ${
                  isSaving
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                }`}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Salvando...
                </span>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
