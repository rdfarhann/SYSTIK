"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CreateTicketInput {
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  phone_number: string;
}

export async function createTicket(formData: CreateTicketInput, base64Image?: string) {
  const supabase = await createSupabaseServer()
  
  // LOG 1: Cek data mentah yang masuk dari Form
  console.log("--- DATA DITERIMA SERVER ---");
  console.log("Priority dari Client:", formData.priority);
  console.log("Title:", formData.title);

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Auth failed" }

  // LOG 2: Paksa Priority jika Undefined agar SLA tetap muncul
  const validPriority = formData.priority ? formData.priority.toUpperCase() : "MEDIUM";
  
  const slaMapping: Record<string, number> = {
    URGENT: 2,
    HIGH: 4,
    MEDIUM: 12,
    LOW: 24,
  };

  const slaHours = slaMapping[validPriority] || 12;
  const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

  console.log("SLA Dihitung:", slaDeadline.toISOString());

  const ticketNo = `T-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .insert([{
      ticket_no: ticketNo,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: validPriority, // Gunakan yang sudah divalidasi
      phone_number: formData.phone_number,
      status: "OPEN",
      user_id: user.id,
      sla_deadline: slaDeadline.toISOString(), // INI HARUS MASUK
      sla_status: "PENDING"
    }])
    .select()
    .single();

  if (ticketError) {
    console.error("DATABASE ERROR:", ticketError.message);
    return { success: false, error: ticketError.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}