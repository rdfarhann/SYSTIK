"use server"

import { createClient } from '@supabase/supabase-js'

// Definisikan Interface agar tipe data jelas
interface InviteFormData {
  email: string;
  full_name: string;
  extension: string;
  department: string;
  role: string;
}

export async function inviteNewUser(formData: InviteFormData) {
  // Pastikan memanggil variabel tanpa NEXT_PUBLIC untuk Service Role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { 
      auth: { 
        autoRefreshToken: false, 
        persistSession: false 
      } 
    }
  )

  try {
    // 1. Proses Invite via Auth Admin
    const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      formData.email, 
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm-password`,
        data: { 
          full_name: formData.full_name,
          extension: formData.extension,
          department: formData.department,
          role: formData.role
        }
      }
    )

    if (inviteError) throw new Error(inviteError.message)
    if (!data?.user) throw new Error("User data not returned from Supabase")

    // 2. Simpan/Update ke tabel profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: formData.full_name,
        extension: formData.extension, 
        department: formData.department,
        role: formData.role,
        email: formData.email // Tambahkan baris ini sesuai skema database Anda
      }, { onConflict: 'id' })

    if (profileError) throw new Error("Database Error: " + profileError.message)

    return { success: true }

  } catch (error: unknown) {
    // Perbaikan error 'any': Cek apakah error adalah instance dari Error
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    
    console.error("Invite User Error:", errorMessage)
    return { 
      success: false, 
      error: errorMessage 
    }
  }
}