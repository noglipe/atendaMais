"use client";

import { supabase } from "@/lib/supabase/supabase";
import { Cliente, Estabelecimento, Perfil } from "@/types/next";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface PerfilContextType {
  perfil: Perfil | null;
  estabelecimento: Estabelecimento | null;
  loading: boolean;
}

const PerfilContext = createContext<PerfilContextType>({
  perfil: null,
  estabelecimento: null,
  loading: true,
});

interface PerfilProviderProps {
  children: ReactNode;
}

export const ClientProvider = ({ children }: PerfilProviderProps) => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPerfil(null);
        setEstabelecimento(null);
        setLoading(false);
        return;
      }

      let { data: perfil, error: errorPerfil } = await supabase
        .from("perfil")
        .select("*")
        .eq("id", user.id)
        .single();

      let { data: estabelecimento, error: errorEstabelecimento } =
        await supabase
          .from("estabelecimento")
          .select("*")
          .eq("id", perfil.estabelecimento_id)
          .single();

      if (errorPerfil || errorEstabelecimento) {
        console.error("Erro Provider Perfil:");
        setPerfil(null);
        setEstabelecimento(null);
      } else if (perfil && estabelecimento) {
        // Supabase retorna relacionamento como array, pegamos o primeiro
        setPerfil(perfil);
        setEstabelecimento(estabelecimento);
      }

      setLoading(false);
    };

    fetchCliente();
  }, []);

  return (
    <PerfilContext.Provider value={{ perfil, estabelecimento, loading }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => useContext(PerfilContext);
