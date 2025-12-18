import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}
