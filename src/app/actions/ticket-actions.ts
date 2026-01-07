"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTicketStatus(ticketId: number, newStatus: string, adminNote: string) {
  const supabase = await createSupabaseServer()

  // 1. Update Tabel Utama
  const { data, error: updateError } = await supabase
  .from("tickets")
  .update({ status: newStatus })
  .eq("id", ticketId)
  .select();

if (updateError) {
  // Lihat pesan ini di terminal VS Code Anda!
  console.log("DETIL ERROR SUPABASE:", updateError.message); 
  console.log("KODE ERROR:", updateError.code);
  throw new Error(updateError.message);
}

  // 2. Insert ke Log (Hanya jika update berhasil)
  await supabase.from("ticket_logs").insert({
    ticket_id: ticketId,
    status_update: `Status diupdate ke ${newStatus}`,
    notes: adminNote,
  })

  revalidatePath("/tickets")
}