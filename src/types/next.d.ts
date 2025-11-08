type Perfil = {
  id: string
  nome: string
  role: string
  estabelecimento_id: string | null
  whatsapp: string
  created_at: string
  updated_at: string
}

type Endereco = {
  cep?: string
  rua?: string
  numero?: string
  cidade?: string
  estado?: string
}

type Estabelecimento = {
  id: string
  nome: string
  razao_social: string
  documento: string
  owner_name: string
  whatsapp: string
  endereco: Endereco
  created_at: string
  updated_at: string
}