// ----------------------------------------------------
// Componente de Página Principal (Root)
// Salve como: src/app/page.jsx ou pages/index.jsx
// ----------------------------------------------------

import React from "react";
import Link from "next/link"; // Usar o Link do Next.js para navegação interna ou externa

// Informações de contato
const WHATSAPP_NUMBER = "55SEUNUMEROAQUI"; // Substitua pelo seu número de telefone com código do país (55)
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá, gostaria de saber mais sobre o Inpulsione Pro e como ele pode otimizar meu negócio!"
);
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* ==================================================
        Seção Principal (Hero)
        ==================================================
      */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Inpulsione Pro</h1>
          <Link href="#contato" passHref>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Fale Conosco
            </button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="pt-20 pb-16 bg-blue-600 text-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Domine Sua Presença Digital com o{" "}
              <span className="text-yellow-300">Inpulsione Pro</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 font-light">
              A plataforma completa que automatiza seu relacionamento e
              impulsiona seus resultados, focada no canal mais usado: **o
              WhatsApp.**
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login" passHref>
                <button className="bg-yellow-400 text-blue-900 text-xl font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 w-full sm:w-auto">
                  Acessar o Sistema
                </button>
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                passHref
              >
                <button className="bg-transparent border-2 border-white text-white text-xl font-bold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition duration-300 w-full sm:w-auto">
                  Falar com um Especialista
                </button>
              </Link>
            </div>

            {/* Sugestão de Imagem */}
            <p className="mt-8 text-sm opacity-75">
              [Imagem: Mockup de um celular e um computador exibindo a interface
              do sistema Inpulsione Pro e o ícone do WhatsApp]
            </p>
          </div>
        </section>

        {/* ==================================================
          Seção de Funcionalidades
          ==================================================
        */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold text-center mb-12 text-blue-800">
              O Que o Inpulsione Pro Faz Por Você?
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: Automação WhatsApp */}
              <FeatureCard
                icon="💬"
                title="Automação Inteligente"
                description="Disparos automáticos de lembretes, confirmações e follow-up diretamente pelo WhatsApp da sua empresa."
              />

              {/* Card 2: Gestão Completa */}
              <FeatureCard
                icon="📊"
                title="Gestão 360º"
                description="Controle financeiro, cadastro de clientes e histórico de atendimento em uma única plataforma intuitiva."
              />

              {/* Card 3: Presença Digital */}
              <FeatureCard
                icon="🌐"
                title="Presença Otimizada"
                description="Criação de Site Profissional, Catálogo Digital e Otimização do seu perfil no Google Maps (SEO)."
              />

              {/* Card 4: Retorno e Fidelização */}
              <FeatureCard
                icon="⭐"
                title="Fidelização Automática"
                description="Função 'Manutenção e Retorno' e revisão de satisfação mensal para garantir que seu cliente volte sempre."
              />
            </div>

            {/* Sugestão de Imagem */}
            <p className="mt-12 text-center text-sm text-gray-400">
              [Imagem: Gráfico de crescimento ou diagrama de fluxo mostrando a
              integração entre Sistema, WhatsApp e Cliente]
            </p>
          </div>
        </section>

        {/* ==================================================
          Seção Chamada para Ação Final e Contato
          ==================================================
        */}
        <section id="contato" className="py-20 bg-gray-100 text-center">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold mb-4 text-blue-800">
              Pronto para Impulsionar Seus Resultados?
            </h3>
            <p className="text-xl mb-8 text-gray-600">
              Fale agora mesmo com nossa equipe e descubra como o Inpulsione Pro
              vai transformar a gestão do seu negócio.
            </p>

            {/* Botão de Contato WhatsApp */}
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              <button className="bg-green-500 text-white text-2xl font-bold px-10 py-4 rounded-full shadow-xl hover:bg-green-600 transition duration-300 flex items-center justify-center mx-auto max-w-sm">
                {/* Ícone do WhatsApp (pode ser substituído por um SVG real) */}
                <span className="text-3xl mr-3">📱</span>
                Falar via WhatsApp
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* ==================================================
        Rodapé
        ==================================================
      */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Inpulsione Pro - Todos os direitos
            reservados.
          </p>
          <p className="text-sm mt-2">
            Plataforma de Gestão e Automação de Relacionamento Focada em
            WhatsApp.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Componente auxiliar para os cards de funcionalidade
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-500">
    <div className="text-5xl mb-4">{icon}</div>
    <h4 className="text-xl font-semibold mb-3 text-blue-700">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
