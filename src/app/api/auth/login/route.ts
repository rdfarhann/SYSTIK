import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const supabase = await createSupabaseServer()

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 401 }
    )
  }


  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    )
  }

  const redirectTo = profile.role === "ADMIN" ? "/dashboard/admin" : "/dashboard"

  return NextResponse.json({
    success: true,
    redirectTo, 
    user: {
      id: authData.user.id,
      email: authData.user.email,
      role: profile.role,
    },
  })
}