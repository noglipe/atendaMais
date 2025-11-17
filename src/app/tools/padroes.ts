import { TiposContatoType } from "@/types/next";
import Loading from "../dashboard/components/Loading";

export const CONTACT_OPTIONS: TiposContatoType[] = [
  "Email",
  "Telefone",
  "Instagram",
];

export const CLASS_NAME_LABEL =
  "block text-sm font-medium text-secondary-foreground mb-1";

export const CLASS_NAME_INPUT =
  "w-full p-3 border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent transition duration-150 text-primary";
