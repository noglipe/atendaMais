'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'


export default function PerfilPage() {
  const supabase = createClientComponentClient()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [estab, setEstab] = useState<Estabelecimento | null>(null)
  const [loading, setLoading] = useState(true)

  // --- LÓGICA DE CARREGAMENTO (Sem alteração) ---
  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // PERFIL
      let { data: perfilData } = await supabase
        .from('perfil')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!perfilData) {
        const { data: novoPerfil } = await supabase
          .from('perfil')
          .insert({
            id: user.id,
            nome: user.email,
            role: 'funcionario',
            whatsapp: '',
          })
          .select()
          .single()
        perfilData = novoPerfil
      }
      setPerfil(perfilData)

      // ESTABELECIMENTO
      let { data: estabData } = await supabase
        .from('estabelecimento')
        .select('*')
        .eq('owner_name', user.id)
        .single()

      if (!estabData) {
        const { data: novoEstab } = await supabase
          .from('estabelecimento')
          .insert({
            nome: 'Novo Estabelecimento',
            owner_name: user.id,
            endereco: { cep: '', rua: '', numero: '', cidade: '', estado: '' },
          })
          .select()
          .single()
        estabData = novoEstab
      }
      setEstab(estabData)
      setLoading(false)
    }

    loadData()
  }, [supabase])

  // --- LÓGICA VIA CEP (Sem alteração) ---
  useEffect(() => {
    const cep = estab?.endereco?.cep?.replace(/\D/g, '')
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setEstab((prev) =>
            prev
              ? {
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    rua: data.logradouro || prev.endereco.rua,
                    cidade: data.localidade || prev.endereco.cidade,
                    estado: data.uf || prev.endereco.estado,
                  },
                }
              : prev
          )
        })
    }
  }, [estab?.endereco?.cep])

  // --- LÓGICA DE SALVAR (Sem alteração) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault() // Impede o recarregamento da página
    if (!perfil || !estab) return

    await supabase
      .from('perfil')
      .update({
        nome: perfil.nome,
        role: perfil.role,
        whatsapp: perfil.whatsapp,
        estabelecimento_id: perfil.estabelecimento_id,
      })
      .eq('id', perfil.id)

    await supabase
      .from('estabelecimento')
      .update({
        nome: estab.nome,
        razao_social: estab.razao_social,
        documento: estab.documento,
        owner_name: estab.owner_name,
        whatsapp: estab.whatsapp,
        endereco: estab.endereco,
      })
      .eq('id', estab.id)

      toast.success('Dados atualizados com sucesso!')


  }

  // --- [NOVO] HANDLERS PARA ATUALIZAR O ESTADO ---
  const handlePerfilChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPerfil((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleEstabChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEstab((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEstab((prev) =>
      prev
        ? {
            ...prev,
            endereco: {
              ...prev.endereco,
              [name]: value,
            },
          }
        : prev
    )
  }

  // --- ESTILOS REUTILIZÁVEIS ---
  const inputStyle =
    'block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
  const labelStyle = 'block text-sm font-medium leading-6 text-gray-900 mb-1'

  if (loading) return <p className="text-center mt-10">Carregando...</p>

  // --- [NOVO] RENDER JSX ---
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Gestão de Perfil e Estabelecimento
        </h1>

        {/* Usamos <form> para semântica e adicionamos onSubmit */}
        <form
          className="bg-white shadow-lg rounded-xl overflow-hidden"
          onSubmit={handleSave}
        >
          {/* Divisor interno para as seções */}
          <div className="divide-y divide-gray-200">
            {/* --- SEÇÃO PERFIL --- */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Seu Perfil</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nome Perfil */}
                <div className="sm:col-span-1">
                  <label htmlFor="perfil-nome" className={labelStyle}>
                    Nome
                  </label>
                  <input
                    type="text"
                    id="perfil-nome"
                    name="nome"
                    placeholder="Seu nome"
                    value={perfil?.nome || ''}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  />
                </div>

                {/* Whatsapp Perfil */}
                <div className="sm:col-span-1">
                  <label htmlFor="perfil-whatsapp" className={labelStyle}>
                    Whatsapp
                  </label>
                  <input
                    type="text"
                    id="perfil-whatsapp"
                    name="whatsapp"
                    placeholder="(XX) XXXXX-XXXX"
                    value={perfil?.whatsapp || ''}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  />
                </div>

                {/* Role Perfil */}
                <div className="sm:col-span-1">
                  <label htmlFor="perfil-role" className={labelStyle}>
                    Função (Role)
                  </label>
                  <select
                    id="perfil-role"
                    name="role"
                    value={perfil?.role || ''}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  >
                    <option value="admin">Admin</option>
                    <option value="gerente">Gerente</option>
                    <option value="funcionario">Funcionário</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- SEÇÃO ESTABELECIMENTO --- */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Estabelecimento
              </h2>
              {/* Grid mais complexo para endereço */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                {/* Nome Fantasia */}
                <div className="sm:col-span-3">
                  <label htmlFor="estab-nome" className={labelStyle}>
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    id="estab-nome"
                    name="nome"
                    value={estab?.nome || ''}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                {/* Razão Social */}
                <div className="sm:col-span-3">
                  <label htmlFor="estab-razao" className={labelStyle}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="estab-razao"
                    name="razao_social"
                    value={estab?.razao_social || ''}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                {/* Documento */}
                <div className="sm:col-span-3">
                  <label htmlFor="estab-doc" className={labelStyle}>
                    Documento (CNPJ/CPF)
                  </label>
                  <input
                    type="text"
                    id="estab-doc"
                    name="documento"
                    value={estab?.documento || ''}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                {/* Whatsapp Estabelecimento */}
                <div className="sm:col-span-3">
                  <label htmlFor="estab-whatsapp" className={labelStyle}>
                    Whatsapp do Estabelecimento
                  </label>
                  <input
                    type="text"
                    id="estab-whatsapp"
                    name="whatsapp"
                    value={estab?.whatsapp || ''}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                {/* Subtítulo Endereço */}
                <h3 className="sm:col-span-6 text-lg font-medium text-gray-800 pt-4 border-t border-gray-200 mt-2">
                  Endereço
                </h3>

                {/* CEP */}
                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cep" className={labelStyle}>
                    CEP
                  </label>
                  <input
                    type="text"
                    id="endereco-cep"
                    name="cep"
                    value={estab?.endereco?.cep || ''}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                {/* Rua */}
                <div className="sm:col-span-4">
                  <label htmlFor="endereco-rua" className={labelStyle}>
                    Rua
                  </label>
                  <input
                    type="text"
                    id="endereco-rua"
                    name="rua"
                    value={estab?.endereco?.rua || ''}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                {/* Número */}
                <div className="sm:col-span-2">
                  <label htmlFor="endereco-numero" className={labelStyle}>
                    Número
                  </label>
                  <input
                    type="text"
                    id="endereco-numero"
                    name="numero"
                    value={estab?.endereco?.numero || ''}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                {/* Cidade */}
                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cidade" className={labelStyle}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="endereco-cidade"
                    name="cidade"
                    value={estab?.endereco?.cidade || ''}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                {/* Estado */}
                <div className="sm:col-span-2">
                  <label htmlFor="endereco-estado" className={labelStyle}>
                    Estado
                  </label>
                  <input
                    type="text"
                    id="endereco-estado"
                    name="estado"
                    value={estab?.endereco?.estado || ''}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- RODAPÉ COM BOTÃO SALVAR --- */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 transition-colors duration-150"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}