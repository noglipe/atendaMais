"use client";

import { usePerfil } from "@/context/ClientProvider";
import { supabase } from "@/lib/supabase/supabase";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateServicePage() {
  const [nome, setNome] = useState("");
  // Usamos string para o input, mas converteremos para número na submissão
  const [tempoDuracao, setTempoDuracao] = useState<string>("60"); // Duração em minutos
  const [preco, setPreco] = useState<string>("0.00"); // Preço do serviço

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Obtém o ID do estabelecimento
  const { estabelecimento, loading: loadingCliente } = usePerfil();

  // Função para formatar o preço conforme o usuário digita (opcional, mas bom para UX)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9,.]/g, ""); // Remove caracteres não numéricos
    value = value.replace(",", "."); // Padroniza vírgula para ponto para facilitar a conversão

    // Remove pontos extras, deixando apenas o primeiro
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    setPreco(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const estabelecimentoId = estabelecimento?.id;

    if (!estabelecimentoId) {
      setLoading(false);
      setMessage(
        "Erro: ID do Estabelecimento não encontrado. Verifique o contexto do estabelecimento."
      );
      return;
    }

    // Conversão de tipos para o banco de dados
    const parsedPreco = parseFloat(preco.replace(",", ".")) || 0.0;
    const parsedDuracao = parseInt(tempoDuracao, 10) || 0;

    // Validação básica
    if (nome.trim().length < 3) {
      setLoading(false);
      setMessage("Erro: O nome do serviço deve ter pelo menos 3 caracteres.");
      return;
    }

    try {
      const { error } = await supabase.from("servicos").insert([
        {
          nome: nome.trim(),
          tempo_duracao: parsedDuracao, // inteiro (minutos)
          preco: parsedPreco, // float/decimal
          ativo: true, // boolean
          estabelecimento_id: estabelecimentoId,
        },
      ]);

      if (error) {
        setMessage(`Erro ao cadastrar serviço: ${error.message}`);
      } else {
        setMessage(`Serviço "${nome}" cadastrado com sucesso!`);
        toast.success(`Serviço "${nome}" cadastrado com sucesso`);

        // Limpa formulário
        setNome("");
        setTempoDuracao("60");
        setPreco("0.00");
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
    <div className="min-h-screen flex items-start justify-center pt-10 bg-gray-50">
      <div className="w-full max-w-lg p-6 md:p-8 bg-white shadow-2xl rounded-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center border-b pb-4">
          Cadastrar Novo Serviço
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome do Serviço (Obrigatório) */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Serviço *
            </label>
            <input
              type="text"
              placeholder="Ex: Corte de Cabelo, Massagem Relaxante"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
              required
            />
          </div>

          {/* Duração e Preço (Duas Colunas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração (Minutos) *
              </label>
              <input
                type="number"
                placeholder="Minutos"
                value={tempoDuracao}
                onChange={(e) => setTempoDuracao(e.target.value)}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 font-bold">
                  R$
                </span>
                <input
                  type="text" // Usamos text para permitir melhor formatação e evitar problemas com float
                  placeholder="0,00"
                  value={preco.replace(".", ",")} // Exibe com vírgula para o usuário
                  onChange={handlePriceChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
                  required
                />
              </div>
            </div>
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            disabled={loading || nome.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 shadow-lg 
                            ${
                              loading || nome.trim() === ""
                                ? "bg-teal-300 cursor-not-allowed"
                                : "bg-teal-600 hover:bg-teal-700 hover:shadow-xl"
                            }`}
          >
            {loading ? "Cadastrando..." : "Confirmar Cadastro do Serviço"}
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
