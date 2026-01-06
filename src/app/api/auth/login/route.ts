import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const supabase = await createSupabaseServer()

  // 1. Proses Sign In
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    )
  }

  // 2. Ambil Role dari tabel Profiles sesuai ERD
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profil tidak ditemukan" },
      { status: 404 }
    )
  }

  // 3. Tentukan tujuan redirect
  const redirectTo = profile.role === "ADMIN" ? "/dashboard/admin" : "/dashboard"

  return NextResponse.json({
    success: true,
    redirectTo, // Kirim URL tujuan ke frontend
    user: {
      id: authData.user.id,
      email: authData.user.email,
      role: profile.role,
    },
  })
}