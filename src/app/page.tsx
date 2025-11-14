import {
  BarChart3,
  Bot,
  Phone,
  Plus,
  PlusCircle,
  PlusSquare,
  PlusSquareIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Usar o Link do Next.js para navegação interna ou externa

// Informações de contato
const WHATSAPP_NUMBER = "5527997925394";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá, gostaria de saber mais sobre o Atenda Mais e como ele pode otimizar meu negócio!"
);
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ==================================================
        Seção Principal (Hero)
        ==================================================
      */}
      <header className="bg-background/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="flex flex-row gap-2 items-center text-3xl font-bold text-primary transition-transform hover:scale-105">
            Atenda
            <PlusCircle className="transition-transform group-hover:rotate-90" />
          </h1>
          <Link href="#contato" passHref>
            <button className="bg-accent text-secondary px-4 py-2 rounded-lg hover:bg-secondary-hover transition duration-300">
              Fale Conosco
            </button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="pt-24 pb-20 bg-gradient-to-b from-background to-accent/20 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Domine Sua Presença Digital com o{" "}
              <span className="text-accent-foreground">Atenda+</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 font-light">
              A plataforma completa que automatiza seu relacionamento e
              impulsiona seus resultados, focada no canal mais usado:{" "}
              <strong>o WhatsApp</strong>.
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login" passHref>
                <button className="bg-primary text-primary-foreground text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:bg-primary/80 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                  Acessar o Sistema
                </button>
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                passHref
              >
                <button className="bg-transparent border-2 border-primary text-primary text-lg font-bold px-8 py-4 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto">
                  Falar com um Especialista
                </button>
              </Link>
            </div>

            {/* Sugestão de Imagem 
            <div className="mt-8 flex justify-center">
              <Image
                src={"/painel.jpg"}
                priority
                width={1200} // Ajuste a largura conforme o tamanho original da sua imagem
                height={675} // Ajuste a altura para manter a proporção
                className="rounded-lg shadow-lg"
                alt="tela sistema"
              />
            </div>*/}
          </div>
        </section>

        {/* ==================================================
          Seção de Funcionalidades
          ==================================================
        */}
        <section className="py-16 bg-background text-center">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold text-center mb-16 text-primary">
              O Que o Atenda+ Faz Por Você?
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: Automação WhatsApp */}
              <FeatureCard
                icon={<TrendingUp className="w-10 h-10 text-primary" />}
                title="Seu Negócio no Piloto Automático (com WhatsApp e IA!)"
                description="Liberte seu tempo! Deixe a inteligência artificial cuidar dos agendamentos, lembretes, confirmações e follow-ups diretos no WhatsApp da sua empresa. Mais vendas, menos esforço!"
              />

              {/* Card 2: Gestão Completa */}
              <FeatureCard
                icon={<BarChart3 className="w-10 h-10 text-primary" />}
                title="Domine Seu Negócio: Tudo em um Só Lugar!"
                description="Tenha o controle total! Finanças, clientes e histórico de atendimento organizados em uma plataforma tão fácil que até sua avó usaria. Chega de papelada e confusão!"
              />

              {/* Card 3: Presença Digital */}
              <FeatureCard
                icon={<Bot className="w-10 h-10 text-primary" />}
                title="Keryx: Seu Assistente Virtual no WhatsApp, 24h por dia!"
                description="Imagine ter a Keryx, sua assistente 24h! Ela via WhatsApp realiza cadastros, agendamentos e gera relatórios para você. Praticidade e eficiência na palma da sua mão!"
              />

              {/* Card 4: Retorno e Fidelização */}
              <FeatureCard
                icon={<Sparkles className="w-10 h-10 text-primary" />}
                title="Clientes Apaixonados Voltando Sempre!"
                description="Transforme clientes em fãs! Com nossa 'Manutenção Inteligente' e pesquisas de satisfação, garantimos que eles voltem sempre, indicando seu negócio para todo mundo."
              />
            </div>

            {/* Sugestão de Imagem */}
            <div className="mt-20 flex justify-center">
              <Image
                src={"/painel.jpeg"}
                priority
                width={1200} // Ajuste a largura conforme o tamanho original da sua imagem
                height={675} // Ajuste a altura para manter a proporção
                className="rounded-2xl shadow-2xl border border-border/10"
                alt="tela sistema"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
          Seção Chamada para Ação Final e Contato
          ==================================================
        */}
        <section id="contato" className="py-20 bg-accent/20 text-center">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold mb-4 text-primary">
              Pronto para Impulsionar Seus Resultados?
            </h3>
            <p className="text-xl mb-8 text-primary/80">
              Fale agora mesmo com nossa equipe e descubra como o Atenda+ vai
              transformar a gestão do seu negócio.
            </p>

            {/* Botão de Contato WhatsApp */}
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              <button className="bg-primary text-primary-foreground text-2xl font-bold px-10 py-4 rounded-full shadow-xl hover:bg-primary/80 transition-all duration-300 flex items-center justify-center mx-auto max-w-sm transform hover:scale-105">
                {/* Ícone do WhatsApp (pode ser substituído por um SVG real) */}
                <span className="mr-3">
                  <Phone />
                </span>
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
      <footer className="bg-background border-t border-border/10 text-primary-foreground py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Atenda+ - Todos os direitos
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
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group relative bg-card/50 p-8 rounded-3xl shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/10 flex flex-col items-center text-center overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative mb-6 p-4 bg-primary/10 rounded-full">{icon}</div>
    <h4 className="relative text-xl font-bold mb-3 text-primary">{title}</h4>
    <p className="relative text-muted-foreground text-center">{description}</p>
  </div>
);

export default HomePage;
