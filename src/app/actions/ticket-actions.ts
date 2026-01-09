"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Update status tiket dan catat log aktivitas.
 * ticketId: string | number (sesuaikan dengan tipe data UUID/Serial di DB)
 * newStatus: string (contoh: 'IN_PROGRESS', 'CLOSED')
 * adminNote: string (catatan dari textarea editor)
 */
export async function updateTicketStatus(
  ticketId: string | number, 
  newStatus: string, 
  adminNote: string
) {
  const supabase = await createSupabaseServer()

  // 1. Update Tabel Utama (Tickets)
  const { error: updateError } = await supabase
    .from("tickets")
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString() 
    })
    .eq("id", ticketId)

  if (updateError) {
    console.error("ERROR UPDATE TICKET:", updateError.message)
    throw new Error(`Gagal update status: ${updateError.message}`)
  }

  // 2. Insert ke Log (Satu-satunya sumber log setelah trigger dihapus)
  // Format teks disesuaikan agar rapi di UI Progress
  const { error: logError } = await supabase
    .from("ticket_logs")
    .insert({
      ticket_id: ticketId,
      status_update: `Status diupdate ke ${newStatus.replace('_', ' ')}`,
      notes: adminNote || "Tidak ada catatan",
      created_at: new Date().toISOString()
    })

  if (logError) {
    // Log error ke konsol tapi jangan batalkan proses jika hanya log yang gagal
    console.error("ERROR INSERT LOG:", logError.message)
  }

  // 3. Revalidate Path (Sinkronisasi UI Admin dan User)
  try {
    // Revalidate halaman detail & list untuk Admin
    revalidatePath(`/dashboard/admin/tickets/${ticketId}`)
    revalidatePath("/dashboard/admin/tickets")

    // Revalidate halaman detail & list untuk User (my-tickets)
    revalidatePath(`/dashboard/user/my-tickets/${ticketId}`)
    revalidatePath("/dashboard/user/my-tickets")
  } catch (revalidateError) {
    console.error("Revalidation error:", revalidateError)
  }

  return { success: true }
}