// /app/api/login/route.ts
import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabase/supabase"

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    message: "Login realizado com sucesso",
    session: data.session,
    user: data.user,
  });
}
