import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";


export async function GET(req: Request) {

const { data, error } = await supabase.auth.signUp({
  email: 'nog.lipe@gmail.com',
  password: 'lipe2204',
  options: {
      data: {
        first_name: 'Filipe Nogueira',
        new_phone: "27997925394",
      }
}})

error && console.log(error)

return NextResponse.json({"sucess": "ok"})
}
