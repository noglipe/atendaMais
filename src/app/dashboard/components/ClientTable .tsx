import { ClienteType, ContatoType } from "@/types/next";
import { formataCelular, formataCPF } from "@/utils/nogDevFormatar";

import {
  Mail,
  Phone,
  Instagram,
  Eye,
  X,
  ArrowUpDown,
  Pencil,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

// --------------------------------------------
// TIPO SEGURO PARA ITERAR CONTATOS
// --------------------------------------------
type ContactKey = keyof ContatoType;

// --------------------------------------------
// CONFIGURAÇÃO DE CADA TIPO DE CONTATO
// --------------------------------------------
interface ContactDetail {
  label: string;
  Icon: React.ComponentType<any>;
  isLink: boolean;
  prefix?: string;
  urlPrefix?: string;
  formatter?: (value: string) => string;
}

const contactMap: Record<ContactKey | "whatsapp_principal", ContactDetail> = {
  email: { label: "Email", Icon: Mail, isLink: false },
  instagram: {
    label: "Instagram",
    Icon: Instagram,
    isLink: true,
    prefix: "@",
    urlPrefix: "https://www.instagram.com/",
  },
  telefone: {
    label: "Telefone",
    Icon: Phone,
    isLink: false,
    formatter: formataCelular,
  },
  whatsapp: {
    label: "WhatsApp",
    Icon: MessageCircle,
    isLink: true,
    urlPrefix: "https://wa.me/",
    formatter: (v) => v.replace(/\D/g, ""),
  },
  whatsapp_principal: {
    label: "WhatsApp (Principal)",
    Icon: MessageCircle,
    isLink: true,
    urlPrefix: "https://wa.me/",
    formatter: (v) => v.replace(/\D/g, ""),
  },
};

// --------------------------------------------
// MODAL
// --------------------------------------------
interface ClientModalProps {
  cliente: ClienteType;
  onClose: () => void;
}

const ClientModal = ({ cliente, onClose }: ClientModalProps) => {
  // CONTATOS EXTRAS
  const contatosExtras = cliente.outros_contatos || {};

  // TRANSFORMAR JSON EM ENTRIES TIPADAS
  const contatosValidos = Object.entries(contatosExtras)
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => ({
      key: key as ContactKey,
      value: value as string,
    }));

  // ADICIONAR WHATS PRINCIPAL COMO CAMPO EXTRA
  if (cliente.whatsapp) {
    contatosValidos.unshift({
      key: "whatsapp",
      value: cliente.whatsapp,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-md rounded-xl shadow-2xl p-6 relative border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-primary border-b border-border pb-3 mb-4">
          Contatos de {cliente.nome}
        </h2>

        {contatosValidos.length === 0 ? (
          <p className="text-muted-foreground italic">
            Nenhum contato registrado.
          </p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {contatosValidos.map(({ key, value }, index) => {
              const config = contactMap[key];

              const formatted = config.formatter
                ? config.formatter(value)
                : value;

              const linkTarget = config.isLink
                ? `${config.urlPrefix}${formatted.replace("@", "")}`
                : undefined;

              return (
                <div key={index} className="flex items-start gap-3">
                  <config.Icon className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      {config.label}
                    </p>

                    {config.isLink ? (
                      <a
                        href={linkTarget}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-base text-blue-500 hover:underline flex items-center gap-1 break-all"
                      >
                        {config.prefix}
                        {value}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="font-medium text-base">{formatted}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------
// TABELA
// --------------------------------------------
export const ClientTable = ({ clients }: { clients: ClienteType[] }) => {
  const [selectedClient, setSelectedClient] = useState<ClienteType | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ClienteType | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const rota = useRouter();

  const sortedClients = useMemo(() => {
    if (!sortConfig.key) return clients;

    return [...clients].sort((a, b) => {
      const aVal = a[sortConfig.key!] || "";
      const bVal = b[sortConfig.key!] || "";

      const va = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const vb = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
      if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [clients, sortConfig]);

  const handleSort = (key: keyof ClienteType) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key: keyof ClienteType) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;

    return (
      <ArrowUpDown
        className={`w-4 h-4 ${
          sortConfig.direction === "asc"
            ? "rotate-180 transition-transform"
            : "transition-transform"
        }`}
      />
    );
  };

  return (
    <div className="overflow-x-auto bg-background rounded-2xl shadow-xs">
      <div className="w-full rounded-2xl border border-border shadow-2xl">
        <table className="w-full border-collapse text-sm">
          <thead className="text-secondary-foreground uppercase tracking-wider text-xs font-bold sticky top-0">
            <tr>
              <th
                onClick={() => handleSort("nome")}
                className="px-4 py-3 text-left w-1/3 cursor-pointer select-none hover:text-primary"
              >
                <div className="flex items-center gap-1">
                  Nome {getSortIcon("nome")}
                </div>
              </th>

              <th className="px-4 py-3 text-center w-1/3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card">
            {sortedClients.map((client, index) => {
              const hasOtherContacts =
                Boolean(client.whatsapp) ||
                Boolean(
                  Object.values(client.outros_contatos ?? {}).find((v) => v)
                );

              return (
                <tr
                  key={index}
                  className="hover:bg-accent/10 transition-colors text-card-foreground"
                >
                  <td className="px-4 py-4 font-semibold text-primary whitespace-nowrap">
                    <Link
                      href={`/dashboard/cliente/${client.id}`}
                      className="hover:text-blue-600 transition"
                    >
                      {client.nome}
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      {hasOtherContacts && (
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="inline-flex items-center gap-1 bg-secondary/70 text-secondary-foreground hover:bg-secondary transition p-2 rounded-full"
                          title={`Ver contatos de ${client.nome}`}
                        >
                          <Eye className="w-4 h-4" /> Contatos
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-xs text-muted px-4 py-2 text-right">
          Total de clientes:{" "}
          <span className="font-semibold text-muted">{clients.length}</span>
        </div>
      </div>

      {selectedClient && (
        <ClientModal
          cliente={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};
