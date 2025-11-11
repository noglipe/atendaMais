"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calendar,
  PlusCircle,
  Trash2,
  Edit,
  CheckCircle,
  Send,
  X,
  ListFilter,
  CalendarDays,
  Clock,
  CircleDot,
  CalendarCheck,
} from "lucide-react";

// --- Utilitários de Data ---
// Formata a data no formato DD/MM/AAAA
const formatDate = (dateString: any) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Formata o status para estilos Tailwind
const getStatusClasses = (status: any) => {
  switch (status) {
    case "Pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Realizado":
      return "bg-green-100 text-green-800 border-green-300";
    case "Cancelado":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-aceborder-accent text-primary border-accent";
  }
};

// --- Estrutura de Compromisso (Mock Data) ---
const mockAppointments = [
  {
    id: "a1",
    title: "Reunião de Kickoff do Projeto Alpha",
    date: "2025-11-15",
    time: "10:00",
    status: "Pendente",
    description: "Apresentação inicial para o cliente e definição de escopo.",
  },
  {
    id: "a2",
    title: "Almoço com Gerente de Contas",
    date: "2025-11-15",
    time: "12:30",
    status: "Realizado",
    description: "Discussão sobre metas trimestrais.",
  },
  {
    id: "a3",
    title: "Sessão de Planejamento Estratégico",
    date: "2025-11-16",
    time: "15:00",
    status: "Pendente",
    description: "Brainstorming para a próxima campanha de marketing.",
  },
];

// --- Componente Modal para Adicionar/Editar Compromisso ---
const AppointmentModal = ({ isOpen, onClose, appointment, onSave }: any) => {
  const [formData, setFormData] = useState(
    appointment || {
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      status: "Pendente",
      description: "",
    }
  );

  // Atualiza o estado interno do formulário quando 'appointment' muda (modo edição)
  useEffect(() => {
    setFormData(
      appointment || {
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        status: "Pendente",
        description: "",
      }
    );
  }, [appointment]);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isEditing = !!appointment;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-5 border-b border-accent bg-indigo-50">
          <h2 className="text-xl font-bold text-primary flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            {isEditing ? "Editar Compromisso" : "Novo Compromisso"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:bg-indigo-100 transition duration-150"
            aria-label="Fechar Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-primary"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-primary"
              >
                Data
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-primary"
              >
                Hora
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-primary"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-background"
            >
              <option>Pendente</option>
              <option>Realizado</option>
              <option>Cancelado</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-primary"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={Number("3")}
              className="mt-1 block w-full rounded-lg border-accent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-primary transition duration-150 transform hover:scale-[1.02] flex items-center"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {isEditing ? "Salvar Alterações" : "Adicionar Compromisso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Função para ler o estado inicial da URL ---
const getInitialStateFromUrl = () => {
  // Garantir que estamos no lado do cliente
  if (typeof window === "undefined") {
    return {
      initialDate: new Date().toISOString().split("T")[0],
      initialMode: "day",
      initialStatus: "Todos",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const today = new Date().toISOString().split("T")[0];

  const dateParam = params.get("date");
  const modeParam = params.get("mode");
  const statusParam = params.get("status");

  // Validação básica para o formato da data YYYY-MM-DD
  const isValidDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam);

  // Retorna os estados iniciais, priorizando os parâmetros da URL
  return {
    initialDate: isValidDate ? dateParam : today,
    initialMode: modeParam === "month" ? "month" : "day", // Apenas 'day' ou 'month'
    initialStatus: ["Pendente", "Realizado", "Cancelado"].includes(statusParam)
      ? statusParam
      : "Todos",
  };
};

// --- Componente Principal da Aplicação ---
export default function App() {
  const { initialDate, initialMode, initialStatus } = getInitialStateFromUrl();

  // [INSTRUÇÃO FIREBASE]: No mundo real, use o onSnapshot() aqui
  // para sincronizar a coleção /artifacts/{appId}/users/{userId}/appointments
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Estados inicializados a partir da URL
  const [currentDate, setCurrentDate] = useState(initialDate); // Data no formato YYYY-MM-DD
  const [viewMode, setViewMode] = useState(initialMode); // 'day' ou 'month'
  const [filterStatus, setFilterStatus] = useState(initialStatus);

  // --- Efeito para Sincronizar Estado com a URL (Novo) ---
  useEffect(() => {
    const newParams = new URLSearchParams();

    // 1. Data (sempre incluída)
    newParams.set("date", currentDate);

    // 2. Modo de Visualização (só define se não for o padrão 'day')
    if (viewMode !== "day") {
      newParams.set("mode", viewMode);
    }

    // 3. Filtro de Status (só define se não for o padrão 'Todos')
    if (filterStatus !== "Todos") {
      newParams.set("status", filterStatus);
    }

    // Atualiza a URL sem recarregar a página
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }, [currentDate, viewMode, filterStatus]); // Dependências: Roda sempre que um filtro mudar

  // --- Funções de CRUD ---

  const handleSaveAppointment = (formData: any) => {
    // [INSTRUÇÃO FIREBASE]: Use addDoc() ou setDoc(doc(db, ...)) para salvar no Firestore.
    if (formData.id) {
      // Edição
      setAppointments(
        appointments.map((app) =>
          app.id === formData.id ? { ...app, ...formData } : app
        )
      );
    } else {
      // Novo compromisso
      const newAppointment = {
        ...formData,
        id: crypto.randomUUID(), // Geração de ID simples
      };
      setAppointments([...appointments, newAppointment]);
    }
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (id: any) => {
    // [INSTRUÇÃO FIREBASE]: Use deleteDoc(doc(db, ...)) para remover do Firestore.
    if (window.confirm("Tem certeza de que deseja deletar este compromisso?")) {
      setAppointments(appointments.filter((app) => app.id !== id));
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: any) => {
    // [INSTRUÇÃO FIREBASE]: Use updateDoc(doc(db, ...), { status: novoStatus })
    setAppointments(
      appointments.map((app) =>
        app.id === id
          ? {
              ...app,
              status: app.status === "Pendente" ? "Realizado" : "Pendente",
            }
          : app
      )
    );
  };

  // --- Ações Específicas (Simulação) ---

  const handleSendMessage = (appointment: any) => {
    alert(`Ação: Enviando mensagem sobre "${appointment.title}" (Simulação).`);
    // [INSTRUÇÃO FIREBASE]: Aqui você integraria um serviço de envio de e-mail/SMS/WhatsApp.
  };

  // --- Lógica de Visualização e Filtragem ---

  const filteredAppointments = useMemo(() => {
    let list = appointments.sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

    // 1. Filtrar por Modo de Visualização (Dia ou Mês)
    if (viewMode === "day") {
      list = list.filter((app) => app.date === currentDate);
    } else if (viewMode === "month") {
      const currentMonth = currentDate.substring(0, 7); // YYYY-MM
      list = list.filter((app) => app.date.startsWith(currentMonth));
    }

    // 2. Filtrar por Status
    if (filterStatus !== "Todos") {
      list = list.filter((app) => app.status === filterStatus);
    }

    return list;
  }, [appointments, currentDate, viewMode, filterStatus]);

  // --- Mini-Calendário (apenas para Mês) ---
  const renderMonthCalendar = useCallback(() => {
    const today = new Date();
    const currentViewDate = new Date(currentDate);
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Dom, 6=Sáb

    const days = [];
    // Espaços vazios iniciais
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const hasAppointment = appointments.some(
        (app) => app.date === dateString
      );
      const isToday = dateString === today.toISOString().split("T")[0];
      const isSelected = dateString === currentDate;

      const baseClasses =
        "h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition duration-150";
      let dayClasses = baseClasses;

      if (isToday) {
        dayClasses += " bg-pink-500 text-background shadow-lg";
      } else if (isSelected) {
        dayClasses +=
          " bg-indigo-200 text-indigo-900 border-2 border-indigo-500";
      } else if (hasAppointment) {
        dayClasses += " bg-indigo-100 text-primary hover:bg-indigo-300";
      } else {
        dayClasses += " text-primary hover:bg-aceborder-accent";
      }

      days.push(
        <div
          key={day}
          className={dayClasses}
          onClick={() => {
            // Define a nova data e muda a view para 'day', o useEffect fará o sync da URL
            setCurrentDate(dateString);
            setViewMode("day");
          }}
        >
          {day}
        </div>
      );
    }

    const monthName = currentViewDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const changeMonth = (delta: any) => {
      // Define a nova data, o useEffect fará o sync da URL
      const newDate = new Date(currentViewDate.setMonth(month + delta));
      setCurrentDate(newDate.toISOString().split("T")[0]);
    };

    return (
      <div className="p-4 bg-background rounded-xl shadow-lg border border-accent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-primary text-lg">{monthName}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-aceborder-accent text-secondary-foreground transition"
            >
              &lt;
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-aceborder-accent text-secondary-foreground transition"
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-bold text-secondary-foreground mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  }, [currentDate, appointments, viewMode]);

  return (
    <div className="min-h-screen font-sans p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-8 flex items-center">
        <Calendar className="mr-3 h-8 w-8 text-primary" />
        Gestão de Agenda Profissional
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- Painel Lateral (Filtros e Calendário) --- */}
        <div className="lg:w-1/3 space-y-6">
          <div className="p-4 bg-background rounded-xl shadow-lg border border-accent">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Ações Rápidas
            </h2>
            <button
              onClick={() => {
                setEditingAppointment(null);
                setIsModalOpen(true);
              }}
              className="w-full py-3 bg-primary text-background font-bold rounded-lg shadow-md hover:bg-primary transition duration-150 transform hover:scale-[1.02] flex items-center justify-center mb-4"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Novo Compromisso
            </button>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-primary flex items-center">
                <ListFilter className="mr-2 h-5 w-5 text-secondary-foreground" />{" "}
                Filtros
              </h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 border border-accent rounded-lg shadow-sm bg-background focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Mini-Calendário de Navegação */}
          {renderMonthCalendar()}
        </div>

        {/* --- Visualização Principal da Agenda --- */}
        <div className="lg:w-2/3">
          <div className="bg-background rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-primary mb-3 sm:mb-0">
                Agenda -
                {viewMode === "day"
                  ? formatDate(currentDate)
                  : new Date(currentDate).toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-4 py-2 rounded-full font-medium transition duration-150 flex items-center ${
                    viewMode === "day"
                      ? "bg-primary text-background shadow-md"
                      : "bg-aceborder-accent text-primary hover:bg-gray-200"
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mr-1" /> Dia
                </button>
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 rounded-full font-medium transition duration-150 flex items-center ${
                    viewMode === "month"
                      ? "bg-primary text-background shadow-md"
                      : "bg-aceborder-accent text-primary hover:bg-gray-200"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-1" /> Mês
                </button>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center p-10 bg-secondary rounded-lg">
                <p className="text-secondary-foreground text-lg">
                  {viewMode === "day"
                    ? `Nenhum compromisso para ${formatDate(currentDate)}.`
                    : "Nenhum compromisso encontrado para o mês selecionado."}
                </p>
                <p className="text-primary-foreground mt-2">
                  Use o botão "Adicionar Novo Compromisso" para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((app: any) => (
                  <div
                    key={app.id}
                    className="p-4 bg-background border border-accent rounded-lg shadow-sm hover:shadow-md transition duration-200 grid grid-cols-1 md:grid-cols-5 items-center gap-4"
                  >
                    {/* Detalhes Principais (Colunas 1 e 2 - Título e Descrição) */}
                    <div className="md:col-span-2">
                      <p className="text-lg font-semibold text-primary">
                        {app.title}
                      </p>
                      <p className="text-sm text-secondary-foreground mt-1">
                        {app.description}
                      </p>
                    </div>

                    {/* Detalhes de Data/Hora (Coluna 3) */}
                    <div className="text-sm text-primary space-y-1">
                      <p className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                        {formatDate(app.date)}
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        {app.time}
                      </p>
                    </div>

                    {/* Status (Coluna 4) */}
                    <div className="flex items-center justify-start md:justify-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Ações (Coluna 5) */}
                    <div className="flex space-x-2 justify-start md:justify-end">
                      <button
                        onClick={() => handleToggleStatus(app.id)}
                        className="p-2 rounded-full text-primary bg-indigo-50 hover:bg-indigo-100 transition duration-150"
                        title={
                          app.status === "Pendente"
                            ? "Marcar como Realizado"
                            : "Marcar como Pendente"
                        }
                      >
                        <CircleDot className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleSendMessage(app)}
                        className="p-2 rounded-full text-green-600 bg-green-50 hover:bg-green-100 transition duration-150"
                        title="Enviar Mensagem (Lembrete/Confirmação)"
                      >
                        <Send className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleEditAppointment(app)}
                        className="p-2 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-150"
                        title="Editar Compromisso"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteAppointment(app.id)}
                        className="p-2 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition duration-150"
                        title="Deletar Compromisso"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Compromisso */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={editingAppointment}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
