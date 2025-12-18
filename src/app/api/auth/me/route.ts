import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  // ✅ Gunakan Supabase server client
  const supabase = await createSupabaseServer()

  // ✅ Ambil user dari session Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // ✅ Ambil profile dari table "profiles"
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, employee_id, department, avatar_url")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      employee_id: profile.employee_id,
      department: profile.department,
      avatar_url: profile.avatar_url,
    },
  })
}
