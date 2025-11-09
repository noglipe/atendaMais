import { TiposContatoType } from "@/types/next";
import { formataCelular, formataCPF } from "@/utils/nogDevFormatar";

export function formataContatoPorTipo(tipo: string, valor: string) {
  switch (tipo) {
    case "Telefone":
      return formataCelular(valor);
    case "CPF":
      return formataCPF(valor);
    default:
      return valor;
  }
}

export const parseDbContacts = (
  dbContacts: Record<string, any> | undefined
): any[] => {
  if (!dbContacts || Object.keys(dbContacts).length === 0) return [];

  return Object.entries(dbContacts)
    .map(([key, value]) => ({
      key: (key.charAt(0).toUpperCase() + key.slice(1)) as TiposContatoType,
      value: value || "",
    }))
    .filter((c) => c.value);
};
