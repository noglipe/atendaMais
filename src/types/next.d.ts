type TiposContatoType = "Email" | "Telefone" | "Instagran";

interface ContatoType {
  email?: string;
  telefone?: string;
  instagram?: string;
}

type EnderecoType = {
  cep?: string;
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
};

type EstabelecimentoType = {
  id: string;
  nome: string;
  razao_social: string;
  documento: string;
  owner_name: string;
  whatsapp: string;
  endereco: EnderecoType;
  created_at?: string;
  updated_at?: string;
};

type PerfilType = {
  id: string;
  nome: string;
  email: string;
  role: string;
  estabelecimento_id: EstabelecimentoType | string;
  whatsapp: string;
  created_at?: string;
  updated_at?: string;
};

export interface ClienteType {
  id: string;
  estabelecimento_id: EstabelecimentoType;
  nome: string;
  cpf?: string;
  whatsapp?: string;
  outros_contatos?: ContatoType;
  notas?: string;
  created_at?: string;
  updated_at?: string;
  nascimento?: string;
}
