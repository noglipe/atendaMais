type TiposContato = "Email" | "Telefone" | "Instagran";

interface Contato {
  key: TiposContato;
  value: string;
}

type Perfil = {
  id: string;
  nome: string;
  email: string;
  role: string;
  estabelecimento_id: Estabelecimento | string;
  whatsapp: string;
  created_at?: string;
  updated_at?: string;
};

type Endereco = {
  cep?: string;
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
};

type Estabelecimento = {
  id: string;
  nome: string;
  razao_social: string;
  documento: string;
  owner_name: string;
  whatsapp: string;
  endereco: Endereco;
  created_at?: string;
  updated_at?: string;
};

export interface Cliente {
  id: string;
  estabelecimento_id: Estabelecimento;
  nome: string;
  cpf?: string;
  whatsapp?: string;
  outros_contatos?: Record<string, any>;
  notas?: string;
  created_at?: string;
  updated_at?: string;
  nascimento?: string;
}
