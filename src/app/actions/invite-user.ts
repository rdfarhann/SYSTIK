"use server"

import { createClient } from '@supabase/supabase-js'

interface InviteFormData {
  email: string;
  full_name: string;
  extension: string;
  department: string;
  role: string;
}

export async function inviteNewUser(formData: InviteFormData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://systik.vercel.app';
  
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
    const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      formData.email, 
      {
        redirectTo: `${siteUrl}/password/confirm-password`,
        data: { 
          full_name: formData.full_name,
          role: formData.role
        }
      }
    )

    if (inviteError) throw new Error(inviteError.message)
    if (!data?.user) throw new Error("User data not returned from Supabase")

 
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: formData.full_name,
        extension: formData.extension, 
        department: formData.department,
        role: formData.role,
        email: formData.email 
      }, { onConflict: 'id' })

    if (profileError) throw new Error("Database Error: " + profileError.message)

    return { success: true }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Invite User Error:", errorMessage)
    return { success: false, error: errorMessage }
  }
}