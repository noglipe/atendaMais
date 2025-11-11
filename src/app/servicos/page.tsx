import React from "react";
import {
  Briefcase,
  Clock,
  DollarSign,
  Zap,
  Mail,
  ArrowRight,
  UserCheck,
} from "lucide-react";

// Dados simulados dos serviços oferecidos
const servicesData = [
  {
    icon: Briefcase,
    name: "Consultoria Estratégica",
    description:
      "Análise aprofundada do seu modelo de negócio e criação de um plano de ação personalizado para otimizar resultados e crescimento.",
    duration: "2 Horas",
    price: "R$ 450,00",
    tag: "Popular",
  },
  {
    icon: Zap,
    name: "Sessão Rápida de Dúvidas (Quick Start)",
    description:
      "Sessão focada para resolver problemas específicos, obter feedback imediato ou tirar dúvidas urgentes sobre um projeto.",
    duration: "30 Minutos",
    price: "R$ 150,00",
    tag: "Novo",
  },
  {
    icon: UserCheck,
    name: "Mentoria de Carreira",
    description:
      "Acompanhamento contínuo e orientação para profissionais que buscam transição de carreira, desenvolvimento de liderança ou aumento salarial.",
    duration: "1 Hora / Sessão",
    price: "R$ 300,00",
    tag: "Premium",
  },
  {
    icon: DollarSign,
    name: "Workshop Personalizado para Equipes",
    description:
      "Treinamento exclusivo desenhado para capacitar sua equipe em habilidades específicas, garantindo alinhamento e eficiência.",
    duration: "4 Horas",
    price: "Sob Consulta",
    tag: "Corporativo",
  },
];

// Componente principal
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      {/* Cabeçalho da Página de Serviços */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight mb-3">
          Nossos Serviços
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Oferecemos soluções personalizadas para atender às suas necessidades
          mais complexas, com foco em resultados e excelência.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Grade de Cards dos Serviços */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <IconComponent className="w-10 h-10 text-blue-600 bg-blue-50 p-2 rounded-full" />
                  {service.tag && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        service.tag === "Popular"
                          ? "bg-yellow-100 text-yellow-800"
                          : service.tag === "Premium"
                          ? "bg-purple-100 text-purple-800"
                          : service.tag === "Novo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {service.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm flex-grow">
                  {service.description}
                </p>

                <div className="space-y-2 border-t pt-4 mt-auto">
                  {/* Duração */}
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Duração:{" "}
                    <span className="ml-1 font-semibold">
                      {service.duration}
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="flex items-center text-lg font-bold">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-green-700">{service.price}</span>
                  </div>
                </div>

                {/* Botão de Saiba Mais (Removido) */}
              </div>
            );
          })}
        </section>

        {/* Seção de Contato (Consistente com a outra página) */}
        <section className="bg-blue-700 text-white p-8 rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Interessado em agendar um serviço?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Fale conosco para tirar dúvidas, solicitar um orçamento ou confirmar
            o agendamento.
          </p>

          <a
            href="mailto:seuemail@exemplo.com"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-yellow-400 text-blue-900 font-extrabold text-lg rounded-full shadow-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] ring-4 ring-transparent hover:ring-yellow-200"
          >
            <Mail className="w-6 h-6" />
            <span>Entre em Contato Agora</span>
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
