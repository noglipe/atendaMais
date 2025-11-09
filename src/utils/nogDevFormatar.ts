/**
 * formataCPF
 * Recebe qualquer string/número, extrai dígitos e retorna no formato 000.000.000-00.
 * Se houver menos de 11 dígitos, retorna a string original sanitizada (ou uma string vazia).
 */
export function formataCPF(value: string | number): string {
  const str = String(value ?? "").replace(/\D/g, ""); // remove tudo que não é dígito
  if (str.length === 0) return "";
  // Se tiver menos que 11 dígitos, retorna os dígitos (opcional: padLeft ou erro)
  if (str.length < 11) return str;
  const d = str.slice(0, 11);
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

/* retornaNumeros
 * Recebe qualquer string e retorna uma string de apenas com os numeros do cpf.
 */
export function retornaNumeros(cpf: string | null | undefined): string {
  if (!cpf) return "";
  return String(cpf).replace(/\D/g, "");
}

/**
 * formataTelefone
 * Recebe string ou número e devolve no formato (00) 00000-0000
 * Ajusta automaticamente se o número tiver 10 ou 11 dígitos.
 */
export function formataTelefone(value: string | number): string {
  const str = String(value ?? "").replace(/\D/g, ""); // limpa tudo que não é número
  if (!str) return "";

  if (str.length <= 10) {
    // Formato tradicional: (00) 0000-0000
    return str.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3").trim();
  }

  // Formato moderno (celular): (00) 00000-0000
  return str.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").trim();
}

/**
 * formataCelular
 * Recebe uma string ou número, remove tudo que não é dígito e
 * retorna no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formataCelular(value: string | number): string {
  const digits = String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
