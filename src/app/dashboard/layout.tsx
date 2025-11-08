import { ClientProvider } from "@/context/ClientProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ClientProvider>{children}</ClientProvider>
    </div>
  );
}
