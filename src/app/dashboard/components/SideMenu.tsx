"use client";

import React, { useState, useEffect } from "react";

// ====================================================================
// MOCK DE DEPENDÊNCIA: ClientProvider
// ====================================================================
const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// ====================================================================
// COMPONENTE SideMenu (CONSOLIDADO E CORRIGIDO PARA SCROLL)
// ====================================================================

// --- Links de Navegação Mockados (Atualizado com as novas rotas) ---
const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    name: "Agenda",
    href: "/dashboard/agenda",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2h2M12 9a4 4 0 100 8m-4-4a4 4 0 118 0"
        />
      </svg>
    ),
  },
  {
    name: "Serviços",
    href: "/dashboard/servicos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-10 3h8A2.5 2.5 0 0014.5 14H9.5a2.5 2.5 0 00-2.5 2.5v1.5zM3 12h18M3 12c0-1.76 1.343-3.2 3-3.5 1.657-.3 3.32-.3 5 0 1.678.3 3.343 1.74 5 3.5m-5-3.5V5m0 0h3M12 5h-3"
        />
      </svg>
    ),
  },
  {
    name: "Mensagens",
    href: "/dashboard/mensagens",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    name: "Log Mensagens",
    href: "/dashboard/mensagens/log",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0a2 2 0 002 2h4a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    name: "Relatórios",
    href: "/dashboard/relatorio",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m-6 0a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6z"
        />
      </svg>
    ),
  },
  {
    name: "Perfil / Config",
    href: "/dashboard/perfil",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.526.345 1.15.542 1.81.542z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    name: "Sair (Mock)",
    href: "#logout",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
  },
];

const MenuItem = ({
  item,
  isActive,
  isCollapsed,
}: {
  item: (typeof menuItems)[0];
  isActive: boolean;
  isCollapsed: boolean;
}) => {
  const baseClasses =
    "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden";
  const activeClasses =
    "bg-indigo-600 text-white shadow-lg transform lg:translate-x-1";
  const inactiveClasses =
    "text-indigo-200 hover:bg-indigo-700 hover:text-white";

  return (
    <a
      href={item.href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      title={item.name}
    >
      {/* Ícone */}
      <div className="flex-shrink-0">{item.icon}</div>
      {/* Texto (Oculto quando colapsado no desktop) */}
      <span className={`font-semibold ${isCollapsed ? "lg:hidden" : ""}`}>
        {item.name}
      </span>
    </a>
  );
};

export function SideMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Simulação da rota ativa (Ajustado para a nova estrutura de rotas)
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const mockUser = "Usuário Admin";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuItemClick = (href: string) => {
    setCurrentPath(href);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const menuWidthClasses = isCollapsed ? "lg:w-20" : "lg:w-64";

  return (
    <div className="relative">
      {/* Botão Hamburger (Visível apenas em telas pequenas) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay para o Mobile (Quando o menu está aberto) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* O Menu em si */}
      <div
        className={`
                    bg-indigo-800 text-white flex flex-col p-5 shadow-2xl z-50 transition-all duration-300
                    ${menuWidthClasses} 
                    
                    // Mobile (Default): Fixed e h-screen para ser uma gaveta
                    fixed top-0 left-0 h-screen 
                    ${
                      isMobileOpen
                        ? "w-64 transform translate-x-0"
                        : "w-64 transform -translate-x-full"
                    }
                    
                    // Desktop (lg): Sticky para acompanhar o scroll e H-AUTO para esticar com o conteúdo
                    lg:sticky lg:top-0 lg:translate-x-0 lg:h-auto lg:min-h-screen lg:flex
                `}
      >
        {/* Cabeçalho e Toggle Button */}
        <div
          className={`
                        mb-8 pb-4 flex items-center 
                        ${
                          isCollapsed
                            ? "justify-center border-b-0"
                            : "justify-between border-b border-indigo-700"
                        }
                    `}
        >
          <div
            className={`${
              isCollapsed ? "hidden" : "text-2xl font-extrabold text-indigo-100"
            }`}
          >
            MySystem Pro
          </div>
          {/* Botão de Colapso (Visível apenas em Desktop/Tablet) */}
          <button
            className={`p-2 rounded-full hover:bg-indigo-700 transition-colors hidden lg:block`}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isCollapsed ? (
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Área do Usuário (Oculta quando colapsada) */}
        <div
          className={`mb-8 p-3 bg-indigo-700 rounded-xl shadow-inner border border-indigo-600 transition-opacity duration-300 ${
            isCollapsed ? "lg:hidden" : "lg:block"
          }`}
        >
          <p className="text-sm text-indigo-300">Logado como:</p>
          <p className="font-bold">{mockUser}</p>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <div key={item.name} onClick={() => handleMenuItemClick(item.href)}>
              <MenuItem
                item={item}
                isActive={currentPath === item.href}
                isCollapsed={isCollapsed}
              />
            </div>
          ))}
        </nav>

        {/* Rodapé do Menu (Oculto quando colapsado) */}
        <div
          className={`mt-8 pt-4 border-t border-indigo-700 transition-opacity duration-300 ${
            isCollapsed ? "lg:hidden" : "lg:block"
          }`}
        >
          <p className="text-xs text-indigo-400 text-center">
            &copy; 2025 MySystem. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
