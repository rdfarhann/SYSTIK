"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTicketStatus(
  ticketId: string | number, 
  newStatus: string, 
  adminNote: string
) {
  const supabase = await createSupabaseServer()

  const { data: ticket, error: fetchError } = await supabase
    .from("tickets")
    .select("sla_deadline, status")
    .eq("id", ticketId)
    .single()

  if (fetchError) throw new Error("Gagal mengambil data tiket")

  let slaStatusUpdate = {}

  if (newStatus === "CLOSED" && ticket.sla_deadline) {
    const isBreached = new Date() > new Date(ticket.sla_deadline)
    slaStatusUpdate = {
      sla_status: isBreached ? "BREACHED" : "ACHIEVED",
      closed_at: new Date().toISOString()
    }
  }

  const { error: updateError } = await supabase
    .from("tickets")
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...slaStatusUpdate 
    })
    .eq("id", ticketId)

  if (updateError) {
    console.error("ERROR UPDATE TICKET:", updateError.message)
    throw new Error(`Gagal update status: ${updateError.message}`)
  }

  const { error: logError } = await supabase
    .from("ticket_logs")
    .insert({
      ticket_id: ticketId,
      status_update: `Status diupdate ke ${newStatus.replace('_', ' ')}`,
      notes: adminNote || "Tidak ada catatan",
      created_at: new Date().toISOString()
    })

  if (logError) console.error("ERROR INSERT LOG:", logError.message)


  try {
    revalidatePath(`/dashboard/admin/tickets/${ticketId}`)
    revalidatePath("/dashboard/admin/tickets")
    revalidatePath(`/dashboard/user/my-tickets/${ticketId}`)
    revalidatePath("/dashboard/user/my-tickets")
  } catch (revalidateError) {
    console.error("Revalidation error:", revalidateError)
  }

  return { success: true }
}