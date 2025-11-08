"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Estabelecimento, Perfil } from "@/types/next";

export default function PerfilPage() {
  const supabase = createClientComponentClient();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [estab, setEstab] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // --- ESTABELECIMENTO ---
      let { data: estabData } = await supabase
        .from("estabelecimento")
        .select("*")
        .eq("owner_name", user.id)
        .single();

      if (!estabData) {
        const { data: novoEstab } = await supabase
          .from("estabelecimento")
          .insert({
            nome: "Novo Estabelecimento",
            owner_name: user.id,
            endereco: { cep: "", rua: "", numero: "", cidade: "", estado: "" },
          })
          .select()
          .single();
        estabData = novoEstab;
      }
      setEstab(estabData);

      // --- PERFIL ---
      let { data: perfilData } = await supabase
        .from("perfil")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!perfilData) {
        const { data: novoPerfil } = await supabase
          .from("perfil")
          .insert({
            id: user.id,
            nome: (user.user_metadata as any)?.nome || "",
            email: user.email,
            whatsapp: "",
            estabelecimento_id: estabData.id,
          })
          .select()
          .single();
        perfilData = novoPerfil;
      }
      setPerfil(perfilData);

      setLoading(false);
    };

    loadData();
  }, [supabase]);

  useEffect(() => {
    const cep = estab?.endereco?.cep?.replace(/\D/g, "");
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
          );
        });
    }
  }, [estab?.endereco?.cep]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil || !estab) return;

    setLoading(true);
    perfil.estabelecimento_id = estab.id;

    await supabase
      .from("perfil")
      .update({
        nome: perfil.nome,
        whatsapp: perfil.whatsapp,
        estabelecimento_id: perfil.estabelecimento_id,
      })
      .eq("id", perfil.id);

    await supabase
      .from("estabelecimento")
      .update({
        nome: estab.nome,
        razao_social: estab.razao_social,
        documento: estab.documento,
        owner_name: estab.owner_name,
        whatsapp: estab.whatsapp,
        endereco: estab.endereco,
      })
      .eq("id", estab.id);

    setLoading(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEstabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstab((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    );
  };

  const inputStyle =
    "block w-full rounded-md border-0 py-2 px-3 text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-primary focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelStyle = "block text-sm font-medium leading-6 text-primary mb-1";

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:p-8 border border-indigo-500 shadow-2xl p-4 rounded-sm">
        <h1 className="text-3xl font-bold mb-6 text-pretty border-b-2 border-indigo-600 pb-4">
          Perfil
        </h1>

        <form
          className="bg-background shadow-lg rounded-xl overflow-hidden"
          onSubmit={handleSave}
        >
          <div className="divide-y divide-border">
            {/* PERFIL */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-semibold text-primary">
                Seu Perfil
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-1">
                  <label htmlFor="perfil-nome" className={labelStyle}>
                    Nome
                  </label>
                  <input
                    type="text"
                    id="perfil-nome"
                    name="nome"
                    placeholder="Seu nome"
                    value={perfil?.nome || ""}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="perfil-email" className={labelStyle}>
                    Email
                  </label>
                  <input
                    type="text"
                    id="perfil-email"
                    name="email"
                    placeholder="Seu email"
                    value={perfil?.email || ""}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="perfil-whatsapp" className={labelStyle}>
                    Whatsapp
                  </label>
                  <input
                    type="text"
                    id="perfil-whatsapp"
                    name="whatsapp"
                    placeholder="(XX) XXXXX-XXXX"
                    value={perfil?.whatsapp || ""}
                    onChange={handlePerfilChange}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* ESTABELECIMENTO */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-2xl font-semibold text-primary">
                Estabelecimento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                <div className="sm:col-span-3">
                  <label htmlFor="estab-nome" className={labelStyle}>
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    id="estab-nome"
                    name="nome"
                    value={estab?.nome || ""}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-razao" className={labelStyle}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="estab-razao"
                    name="razao_social"
                    value={estab?.razao_social || ""}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-doc" className={labelStyle}>
                    Documento (CNPJ/CPF)
                  </label>
                  <input
                    type="text"
                    id="estab-doc"
                    name="documento"
                    value={estab?.documento || ""}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="estab-whatsapp" className={labelStyle}>
                    Whatsapp do Estabelecimento
                  </label>
                  <input
                    type="text"
                    id="estab-whatsapp"
                    name="whatsapp"
                    value={estab?.whatsapp || ""}
                    onChange={handleEstabChange}
                    className={inputStyle}
                  />
                </div>

                <h3 className="sm:col-span-6 text-lg font-medium text-primary pt-4 border-t border-border mt-2">
                  Endereço
                </h3>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cep" className={labelStyle}>
                    CEP
                  </label>
                  <input
                    type="text"
                    id="endereco-cep"
                    name="cep"
                    value={estab?.endereco?.cep || ""}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="endereco-rua" className={labelStyle}>
                    Rua
                  </label>
                  <input
                    type="text"
                    id="endereco-rua"
                    name="rua"
                    value={estab?.endereco?.rua || ""}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-numero" className={labelStyle}>
                    Número
                  </label>
                  <input
                    type="text"
                    id="endereco-numero"
                    name="numero"
                    value={estab?.endereco?.numero || ""}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-cidade" className={labelStyle}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="endereco-cidade"
                    name="cidade"
                    value={estab?.endereco?.cidade || ""}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="endereco-estado" className={labelStyle}>
                    Estado
                  </label>
                  <input
                    type="text"
                    id="endereco-estado"
                    name="estado"
                    value={estab?.endereco?.estado || ""}
                    onChange={handleEnderecoChange}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-bottom flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 transition-colors duration-150"
            >
              {loading ? <Spinner /> : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
