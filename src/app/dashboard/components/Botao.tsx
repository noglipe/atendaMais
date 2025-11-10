import { Spinner } from "@/components/ui/spinner";

interface BotaoProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variante?: "destructive" | "default";
}

export default function Botao({
  children,
  className = "",
  type = "button",
  onClick,
  loading = false, // corrigido para não travar o botão
  disabled = false,
  variante = "default",
}: BotaoProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-secondary-foreground  transition transition-colors duration-200 shadow-md shadow-secondary cursor-pointer flex justify-center items-center gap-2 ${
        variante === "default"
          ? loading
            ? "bg-primary/50 cursor-not-allowed"
            : "bg-primary/80 hover:bg-primary hover:shadow-xl"
          : variante === "destructive" &&
            "bg-destructive/80 hover:bg-destructive"
      } ${className}`}
    >
      {loading && <Spinner />}
      <span>{children}</span>
    </button>
  );
}
