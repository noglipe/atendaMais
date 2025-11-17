"use client";
import { ClientProvider } from "@/context/ClientProvider";
import { SideMenu } from "./components/SideMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'flex min-h-screen' garante alinhamento lateral e altura total.
    // AJUSTE CHAVE: Removido 'flex-wrap max-w-screen' e adicionado 'w-full'.
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* 1. ClientProvider (Mock) */}
      <ClientProvider>
        {/* 2. SideMenu (Autocontido) */}
        {/* ASSUMIMOS que SideMenu tem uma largura fixa em telas grandes (lg:w-64, por exemplo) e está OCULTO ou é um overlay em mobile. */}
        <SideMenu />

        {/* 3. Main Content: flex-grow garante que ele ocupe todo o espaço restante. */}
        {/* O 'mt-16 lg:mt-0' sugere que o SideMenu tem uma barra de navegação superior em mobile. */}
        <main className="flex-1 w-full p-4 lg:p-8 mt-16 lg:mt-0 overflow-y-auto">
          {children}
        </main>
      </ClientProvider>
    </div>
  );
}
