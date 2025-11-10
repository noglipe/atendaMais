"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CLASS_NAME_INPUT,
  CLASS_NAME_LABEL,
} from "../../cliente/tools/padroes";
import Botao from "../../components/Botao";

export default function CreateServicePage() {
  const [nome, setNome] = useState("");
  const [tempoDuracao, setTempoDuracao] = useState<string>("0");
  const [preco, setPreco] = useState<string>("0.00");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const { estabelecimento, loading: loadingCliente } = usePerfil();
  const rota = useRouter();

  // Verifica histórico de navegação no client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasPreviousPage(window.history.length > 2);
    }
  }, []);

  // Auto limpa mensagem após alguns segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // mantém apenas números
    const numericValue = parseFloat(value) / 100;
    setPreco(numericValue.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const estabelecimentoId = estabelecimento?.id;
    if (!estabelecimentoId) {
      setLoading(false);
      setMessage("Erro: ID do estabelecimento não encontrado.");
      return;
    }

    const parsedPreco = parseFloat(preco) || 0.0;
    const parsedDuracao = parseInt(tempoDuracao, 10) || 0;

    if (nome.trim().length < 3) {
      setLoading(false);
      setMessage("Erro: O nome do serviço deve ter pelo menos 3 caracteres.");
      return;
    }

    try {
      const { error } = await supabase.from("servicos").insert([
        {
          nome: nome.trim(),
          tempo_duracao: parsedDuracao,
          preco: parsedPreco,
          ativo: true,
          estabelecimento_id: estabelecimentoId,
        },
      ]);

      if (error) {
        setMessage(`Erro ao cadastrar serviço: ${error.message}`);
        toast.error(`Erro ao cadastrar serviço: ${error.message}`);
      } else {
        setMessage(`Serviço "${nome}" cadastrado com sucesso!`);
        toast.success(`Serviço "${nome}" cadastrado com sucesso!`);

        // Limpa formulário
        setNome("");
        setTempoDuracao("0");
        setPreco("0.00");
        rota.refresh();
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
      <div className="p-8 text-center text-gray-600">
        Carregando dados do estabelecimento...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-lg p-6 md:p-8 bg-background shadow-2xl rounded-xl">
        {hasPreviousPage && (
          <button
            onClick={() => rota.back()}
            className="text-primary flex flex-row gap-1 p-2 cursor-pointer"
          >
            <ArrowBigLeft /> Voltar
          </button>
        )}

        <h1 className="text-3xl font-extrabold mb-8 text-pretty text-center border-b pb-4">
          Cadastrar Novo Serviço
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className={CLASS_NAME_LABEL}>Nome do Serviço *</label>
            <input
              type="text"
              placeholder="Ex: Corte de Cabelo, Massagem Relaxante"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASS_NAME_INPUT}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className={CLASS_NAME_LABEL}>Duração (Minutos) *</label>
              <input
                type="number"
                placeholder="Minutos"
                value={tempoDuracao}
                onChange={(e) => setTempoDuracao(e.target.value)}
                min="1"
                className={CLASS_NAME_INPUT}
                required
              />
            </div>

            <div className="relative">
              <label className={CLASS_NAME_LABEL}>Preço (R$) *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 font-bold ">
                  R$
                </span>
                <input
                  type="text"
                  placeholder="0,00"
                  value={Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(preco))}
                  onChange={handlePriceChange}
                  className={`${CLASS_NAME_INPUT} pl-10`}
                  required
                />
              </div>
            </div>
          </div>

          <Botao loading={loading} type="submit" className="w-full">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Botao>
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
