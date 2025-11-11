"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  DollarSign,
  BarChart3,
  Users,
  Calendar,
  Wallet,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  FileText,
} from "lucide-react";

// --- Tipos de Dados (Simulação) ---
// Em um sistema real, estes dados viriam de uma API ou Firestore.
interface FinancialData {
  id: number;
  date: string; // YYYY-MM-DD
  type: "receita" | "despesa";
  amount: number;
  description: string;
}

interface Delinquent {
  id: number;
  client: string;
  dueDate: string; // YYYY-MM-DD
  value: number;
  delayDays: number;
}

// Mock Data para Relatórios
const mockFinancialData: FinancialData[] = [
  {
    id: 1,
    date: "2024-11-01",
    type: "receita",
    amount: 5500.0,
    description: "Serviço A - Cliente X",
  },
  {
    id: 2,
    date: "2024-11-05",
    type: "despesa",
    amount: 1200.0,
    description: "Aluguel de Escritório",
  },
  {
    id: 3,
    date: "2024-11-10",
    type: "receita",
    amount: 8200.0,
    description: "Projeto B - Cliente Y",
  },
  {
    id: 4,
    date: "2024-10-25",
    type: "receita",
    amount: 3100.0,
    description: "Serviço C - Cliente Z",
  },
  {
    id: 5,
    date: "2024-10-02",
    type: "despesa",
    amount: 250.0,
    description: "Assinatura Software",
  },
  {
    id: 6,
    date: "2023-12-15",
    type: "receita",
    amount: 15000.0,
    description: "Projeto Anual",
  },
  {
    id: 7,
    date: "2023-12-01",
    type: "despesa",
    amount: 14400.0,
    description: "Salários Dezembro",
  },
];

// Mock Data para Inadimplentes
const mockDelinquents: Delinquent[] = [
  {
    id: 101,
    client: "ABC Marketing Ltda",
    dueDate: "2024-09-15",
    value: 3500.0,
    delayDays: 57,
  },
  {
    id: 102,
    client: "Indústrias Delta",
    dueDate: "2024-10-30",
    value: 1200.0,
    delayDays: 12,
  },
  {
    id: 103,
    client: "Startup Fênix",
    dueDate: "2024-11-05",
    value: 800.0,
    delayDays: 6,
  },
];

// Formata a moeda
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

// --- Componente de Cartão de Resumo ---
const SummaryCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition duration-200">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className={`h-6 w-6 ${colorClass}`} />
    </div>
    <div className="mt-1 flex items-center justify-between">
      <h3 className="text-3xl font-bold text-gray-900">
        {formatCurrency(value)}
      </h3>
      {trend && (
        <span
          className={`flex items-center text-sm font-semibold p-1.5 rounded-full ${
            trend === "up"
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          {trend === "up" ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {trend === "up" ? "+5%" : "-2%"} {/* Mock Trend */}
        </span>
      )}
    </div>
  </div>
);

// --- Componente Principal ---
export default function FinancialReports() {
  const [activeTab, setActiveTab] = useState("reports"); // 'reports' ou 'delinquents'
  const [period, setPeriod] = useState("month"); // 'month' ou 'year'

  // Simulação: Filtro de data baseado no período
  const today = new Date();
  const filterDate = useMemo(() => {
    if (period === "month") {
      return today.toISOString().substring(0, 7); // YYYY-MM (Ex: 2024-11)
    }
    return today.getFullYear().toString(); // YYYY (Ex: 2024)
  }, [period]);

  // Lógica de Agregação de Dados
  const aggregatedData = useMemo(() => {
    const filtered = mockFinancialData.filter((item) =>
      item.date.startsWith(filterDate)
    );

    const totalReceita = filtered
      .filter((item) => item.type === "receita")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalDespesa = filtered
      .filter((item) => item.type === "despesa")
      .reduce((sum, item) => sum + item.amount, 0);

    const netProfit = totalReceita - totalDespesa;

    return { totalReceita, totalDespesa, netProfit, filtered };
  }, [filterDate]);

  const { totalReceita, totalDespesa, netProfit, filtered } = aggregatedData;

  // --- Renderização da Aba de Relatórios (Visão Geral) ---
  const renderReportsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title={`Receitas (${period === "month" ? "Mês" : "Ano"})`}
          value={totalReceita}
          icon={ArrowUp}
          colorClass="text-green-500"
          trend="up"
        />
        <SummaryCard
          title={`Despesas (${period === "month" ? "Mês" : "Ano"})`}
          value={totalDespesa}
          icon={ArrowDown}
          colorClass="text-red-500"
          trend="down"
        />
        <SummaryCard
          title="Lucro Líquido"
          value={netProfit}
          icon={Wallet}
          colorClass={netProfit >= 0 ? "text-indigo-500" : "text-red-500"}
          trend={netProfit >= 0 ? "up" : "down"}
        />
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
          Transações do Período ({filterDate})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.type === "receita"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.type === "receita" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      item.type === "receita"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            Nenhuma transação encontrada para o período {filterDate}.
          </p>
        )}
      </div>
    </div>
  );

  // --- Renderização da Aba de Inadimplentes ---
  const renderDelinquentsView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100">
        <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
          Resumo de Contas Atrasadas
        </h3>
        <p className="text-3xl font-bold text-red-800">
          {formatCurrency(mockDelinquents.reduce((sum, d) => sum + d.value, 0))}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total pendente em {mockDelinquents.length} faturas.
        </p>
      </div>

      {/* Tabela de Inadimplentes */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Lista Detalhada de Inadimplentes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                  Valor (R$)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                  Dias de Atraso
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDelinquents.map((d) => (
                <tr key={d.id} className="hover:bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {d.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {d.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                    {formatCurrency(d.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                    {d.delayDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 mb-8 flex items-center">
        <BarChart3 className="mr-3 h-8 w-8 text-indigo-600" />
        Relatórios e Análise Financeira
      </h1>

      {/* --- Navegação em Abas (Tabs) --- */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("reports")}
            className={`py-2 px-4 font-semibold text-lg transition duration-200 flex items-center ${
              activeTab === "reports"
                ? "border-b-4 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Visão Geral e Fluxo
          </button>
          <button
            onClick={() => setActiveTab("delinquents")}
            className={`py-2 px-4 font-semibold text-lg transition duration-200 flex items-center ${
              activeTab === "delinquents"
                ? "border-b-4 border-red-600 text-red-600"
                : "text-gray-500 hover:text-red-600"
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Inadimplentes
          </button>
        </div>
      </div>

      {/* --- Controles de Filtro (Apenas para Relatórios) --- */}
      {activeTab === "reports" && (
        <div className="flex items-center space-x-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          <label className="text-gray-600 font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Período:
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
          <span className="text-sm text-gray-500">
            (Visualizando dados para: {filterDate})
          </span>
        </div>
      )}

      {/* --- Conteúdo das Abas --- */}
      <div className="py-4">
        {activeTab === "reports" && renderReportsView()}
        {activeTab === "delinquents" && renderDelinquentsView()}
      </div>
    </div>
  );
}
