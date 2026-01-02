"use server"

import { createClient } from '@supabase/supabase-js'

export async function inviteNewUser(formData: {
  email: string,
  full_name: string,
  extension: string,
  department: string,
  role?: string
}) {
  // Gunakan Service Role Key untuk akses Admin
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 1. Proses Invite via Supabase Auth
  const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    formData.email, 
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm-password`,
      data: { 
        full_name: formData.full_name,
        extension: formData.extension,
        department: formData.department
      }
    }
  )

  if (inviteError) return { success: false, error: inviteError.message };

  // 2. Simpan ke tabel Profiles
  // Pastikan kolom 'extension' sudah ada di database (Langkah SQL di atas)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: data.user.id,
      full_name: formData.full_name,
      extension: formData.extension, 
      department: formData.department,
      role: formData.role || 'USER'
    }, { onConflict: 'id' })

  if (profileError) return { success: false, error: "Database: " + profileError.message };

  return { success: true };
}