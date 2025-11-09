import { ClienteType } from "@/types/next";
import { formataCelular, formataCPF } from "@/utils/nogDevFormatar";

import {
  Mail,
  Phone,
  Instagram,
  Eye,
  X,
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

interface ClientTableProps {
  clients: ClienteType[];
}

interface ClientModalProps {
  cliente: ClienteType;
  onClose: () => void;
}

interface ContactDetail {
  label: string;
  Icon: React.ComponentType<any>;
  isLink: boolean;
  prefix?: string;
  urlPrefix?: string;
  formatter?: (value: string) => string;
}

const ClientModal = ({ cliente, onClose }: ClientModalProps) => {
  const contatos = Object.entries(cliente?.outros_contatos || {});

  const contactMap: Record<string, ContactDetail> = {
    email: { label: "Email", Icon: Mail, isLink: false },
    instagram: {
      label: "Instagram",
      Icon: Instagram,
      isLink: true,
      prefix: "@",
      urlPrefix: "https://www.instagram.com/",
    },
    telefone: {
      label: "Telefone Adicional",
      Icon: Phone,
      isLink: false,
      formatter: formataCelular,
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className=" bg-card w-full max-w-md rounded-xl shadow-2xl p-6 relative border border-border"
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
          Contatos Adicionais de: {cliente.nome}
        </h2>

        {contatos.length === 0 ? (
          <p className="text-muted-foreground italic">
            Nenhum contato adicional registrado.
          </p>
        ) : (
          <div className="space-y-4">
            {contatos.map(([key, value], index) => {
              const config = contactMap[key] || {
                label: key,
                Icon: Mail,
                isLink: false,
              };
              const { label, Icon, isLink, prefix, urlPrefix, formatter } =
                config;
              const displayValue = formatter ? formatter(String(value)) : value;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-foreground break-words"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      {label}
                    </p>
                    {isLink ? (
                      <a
                        href={`${urlPrefix}${String(value).replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-base text-blue-500 hover:underline"
                      >
                        {prefix}
                        {value}
                      </a>
                    ) : (
                      <span className="font-medium text-base">
                        {prefix}
                        {displayValue}
                      </span>
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

export const ClientTable = ({ clients }: ClientTableProps) => {
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

      // Normaliza strings
      const valA = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const valB = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
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
    <div className="overflow-x-auto bg-background rounded-2xl shadow-xs ">
      <div className="min-w-[700px] rounded-2xl border border-border shadow-2xl">
        <table className="w-full border-collapse text-sm">
          <thead className=" text-secondary-foreground uppercase tracking-wider text-xs font-bold sticky top-0">
            <tr>
              <th
                onClick={() => handleSort("nome")}
                className="px-4 py-3 text-left w-1/4 cursor-pointer select-none hover:text-primary"
              >
                <div className="flex items-center gap-1">
                  Nome {getSortIcon("nome")}
                </div>
              </th>
              <th
                onClick={() => handleSort("cpf")}
                className="px-4 py-3 text-left w-1/6 cursor-pointer select-none hover:text-primary"
              >
                <div className="flex items-center gap-1">
                  CPF {getSortIcon("cpf")}
                </div>
              </th>
              <th
                onClick={() => handleSort("whatsapp")}
                className="px-4 py-3 text-left w-1/6 cursor-pointer select-none hover:text-primary"
              >
                <div className="flex items-center gap-1">
                  WhatsApp {getSortIcon("whatsapp")}
                </div>
              </th>
              <th
                onClick={() => handleSort("nascimento")}
                className="px-4 py-3 text-left w-1/6 cursor-pointer select-none hover:text-primary"
              >
                <div className="flex items-center gap-1">
                  Nascimento {getSortIcon("nascimento")}
                </div>
              </th>
              <th className="px-4 py-3 text-center w-auto"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card">
            {sortedClients.map((client, index) => {
              const hasOtherContacts =
                client.outros_contatos &&
                Object.keys(client.outros_contatos).length > 0;

              return (
                <tr
                  key={index}
                  className="hover:bg-accent/10 transition-colors duration-150 text-card-foreground"
                >
                  <td className="px-4 py-4 font-semibold text-primary whitespace-nowrap">
                    {client.nome}
                  </td>
                  <td className="px-4 py-4 font-mono text-foreground">
                    {formataCPF(client.cpf || "")}
                  </td>
                  <td className="px-4 py-4 font-mono text-foreground">
                    {formataCelular(client.whatsapp || "")}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {client.nascimento
                      ? client.nascimento.split("-").reverse().join("/")
                      : "—"}
                  </td>
                  <td className="flex px-4 py-4 justify-end gap-2">
                    {hasOtherContacts ? (
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="inline-flex items-center gap-2 bg-primary/20 text-primary hover:bg-primary/40 transition-colors duration-200 px-3 py-1 rounded-sm text-xs font-medium cursor-pointer"
                        title={`Ver ${
                          Object.keys(client.outros_contatos!).length
                        } contatos adicionais`}
                      >
                        <Eye className="w-4 h-4" />
                        Contatos
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      className="inline-flex items-center gap-2 bg-primary/20 text-primary hover:bg-primary/40 transition-colors duration-200 px-3 py-1 rounded-sm text-xs font-medium cursor-pointer"
                      onClick={() =>
                        rota.push(`/dashboard/cliente/${client.id}`)
                      }
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className=" text-xs text-muted px-4 py-2 text-right">
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
