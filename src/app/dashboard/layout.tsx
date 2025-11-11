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
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. ClientProvider (Mock) */}
      <ClientProvider>
        {/* 2. SideMenu (Autocontido) */}
        <SideMenu />

        {/* 3. Main Content: flex-grow garante que ele ocupe todo o espaço restante. */}
        <main className="flex-grow p-4 lg:p-8 mt-16 lg:mt-0">{children}</main>
      </ClientProvider>
    </div>
  );
}
