"use client";
import React, { useState } from "react";
import { CalendarDays, Mail } from "lucide-react";

// Função auxiliar para gerar slots de horário em um dia (09:00h a 17:00h, a cada hora)
const generateTimeSlots = (date) => {
  const slots = [];
  // Gera horários das 9h às 17h, incluindo 17h
  for (let hour = 9; hour <= 17; hour++) {
    const time = `${String(hour).padStart(2, "0")}:00`;
    let available = true;

    // Simulação de horários indisponíveis específicos por dia
    if (date === "2025-11-20" && (hour === 10 || hour === 14 || hour === 16)) {
      available = false; // Manhã e Tarde indisponíveis na Quarta
    } else if (
      date === "2025-11-21" &&
      (hour === 12 || hour === 16 || hour === 9)
    ) {
      available = false; // Início do dia e almoço indisponíveis na Quinta
    } else if (
      date === "2025-11-22" &&
      (hour === 9 || hour === 13 || hour === 17)
    ) {
      available = false; // Início e Fim do dia indisponíveis na Sexta
    }

    slots.push({ time, available });
  }
  return slots;
};

// Dados de disponibilidade de agenda simulados (agora gerados com a função)
const mockAvailability = [
  {
    date: "2025-11-20",
    day: "Quarta-feira",
    timeSlots: generateTimeSlots("2025-11-20"),
  },
  {
    date: "2025-11-21",
    day: "Quinta-feira",
    timeSlots: generateTimeSlots("2025-11-21"),
  },
  {
    date: "2025-11-22",
    day: "Sexta-feira",
    timeSlots: generateTimeSlots("2025-11-22"),
  },
];

// Componente principal
const App = () => {
  const [selectedDate, setSelectedDate] = useState(mockAvailability[0].date);

  const selectedDayData = mockAvailability.find(
    (day) => day.date === selectedDate
  );

  // Função de simulação para agendamento
  const handleSlotClick = (time, available) => {
    // Substituído 'alert' por um modal simples (Mensagem no console e aviso visual)
    if (available) {
      console.log(`Tentativa de agendamento: ${time}.`);
      // Em uma aplicação real, aqui você mostraria um modal de confirmação
      // ou redirecionaria para o formulário de agendamento.
      const confirmationBox = document.getElementById("confirmation-message");
      confirmationBox.textContent = `✅ Slot ${time} selecionado! Prossiga com o contato.`;
      confirmationBox.classList.remove("hidden");
      setTimeout(() => confirmationBox.classList.add("hidden"), 3000);
    } else {
      console.log(`Slot ${time} já agendado.`);
      const confirmationBox = document.getElementById("confirmation-message");
      confirmationBox.textContent = `❌ Este horário (${time}) está reservado. Escolha outro.`;
      confirmationBox.classList.remove("hidden", "bg-green-500");
      confirmationBox.classList.add("bg-red-500");
      setTimeout(() => {
        confirmationBox.classList.add("hidden");
        confirmationBox.classList.remove("bg-red-500");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      {/* Mensagem de Confirmação/Aviso (Substituto de alert()) */}
      <div
        id="confirmation-message"
        className="hidden fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-opacity duration-300"
        role="alert"
      >
        Mensagem de Confirmação
      </div>

      {/* Cabeçalho */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight mb-2">
          Agenda de Disponibilidade
        </h1>
        <p className="text-xl text-gray-600">
          Encontre o melhor horário para o seu atendimento.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Bloco principal da Agenda */}
        <section className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-100 mb-12">
          <div className="flex items-center space-x-3 mb-8 border-b pb-4">
            <CalendarDays className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Próximos Horários Disponíveis
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Seletor de Data */}
            <div className="lg:w-1/3 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Selecione o Dia:
              </h3>
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible space-x-3 lg:space-x-0 lg:space-y-3 pb-2">
                {mockAvailability.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0
                      ${
                        selectedDate === day.date
                          ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-300"
                          : "bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                      }
                    `}
                  >
                    <span className="block">{day.day}</span>
                    <span className="text-xs opacity-80 mt-0.5">
                      {day.date.split("-").reverse().join("/")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slots de Horário */}
            <div className="lg:w-2/3 p-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Horários para {selectedDayData?.day || "Dia Selecionado"}:
              </h3>

              {/* Ajuste da grade para mais colunas em telas maiores (lg:grid-cols-4) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedDayData?.timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotClick(slot.time, slot.available)}
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-xl shadow-lg transition-transform duration-200 transform 
                      ${
                        slot.available
                          ? "bg-green-500 text-white hover:bg-green-600 active:scale-[0.98] ring-4 ring-green-100 cursor-pointer text-base"
                          : "bg-red-200 text-red-800 cursor-not-allowed opacity-70 text-base"
                      }
                    `}
                  >
                    <span className="block text-xl font-bold">{slot.time}</span>
                    <span className="block text-xs mt-0.5">
                      {slot.available ? "Disponível" : "Agendado"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Legenda */}
              <div className="mt-6 flex justify-end space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-200 rounded-full mr-2"></div>
                  <span>Agendado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Contato */}
        <section className="bg-blue-700 text-white p-8 rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Não encontrou o horário ideal?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Fale conosco diretamente para horários especiais ou dúvidas.
          </p>

          <a
            href="mailto:seuemail@exemplo.com"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-yellow-400 text-blue-900 font-extrabold text-lg rounded-full shadow-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] ring-4 ring-transparent hover:ring-yellow-200"
          >
            <Mail className="w-6 h-6" />
            <span>Entre em Contato</span>
          </a>
        </section>
      </main>

      {/* Rodapé simples */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default App;
