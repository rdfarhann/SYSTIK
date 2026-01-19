"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Ticket } from "@/types/ticket"

export async function createTicket(formData: Ticket, base64Image?: string) {
  const supabase = await createSupabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  let publicUrl = null;

 
  if (base64Image && base64Image.includes("base64")) {
    const fileName = `${user.id}/${Date.now()}.png`;
    const buffer = Buffer.from(base64Image.split(",")[1], 'base64');

    const { error: uploadError } = await supabase.storage
      .from('ticket-attachments')
      .upload(fileName, buffer, { 
        contentType: 'image/png',
        upsert: true 
      });

    if (uploadError) return { success: false, error: "Gagal upload: " + uploadError.message };

    const { data } = supabase.storage.from('ticket-attachments').getPublicUrl(fileName);
    publicUrl = data.publicUrl;
  }


  const ticketNo = `T-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`


  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .insert([{
      ticket_no: ticketNo,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: "OPEN",
      user_id: user.id,
      attachment_url: publicUrl 
    }])
    .select()
    .single()

  if (ticketError) return { success: false, error: ticketError.message }


  await supabase.from("notifications").insert([{
    user_id: user.id,
    ticket_id: ticketData.id,
    title: "Ticket Sent",
    message: `Ticket ${ticketNo} successfully created.`,
    is_read: false
  }]);

  revalidatePath("/dashboard")
  return { success: true }
}