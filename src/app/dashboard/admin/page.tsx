"use server"

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import { Ticket } from "../../../../.next/dev/types/ticket"

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { status } = await searchParams
  const isAdmin = profileData?.role === "ADMIN"

  // LOGIKA QUERY TIKET
  let query = supabase
    .from("tickets")
    .select(`
      *,
      profiles!user_id (
        full_name
      )
    `)

  if (!isAdmin) {
    query = query.eq("user_id", user.id)
  }

  const { data: ticketsData, error: ticketsError } = await query.order("created_at", { ascending: false })

  const allTickets = (ticketsData as Ticket[]) || []
  
  // STATISTIK (Bisa digunakan untuk Dashboard Cards nanti)
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status?.toUpperCase() === "OPEN").length,
    inProgress: allTickets.filter(t => t.status?.toUpperCase() === "IN_PROGRESS").length, 
    closed: allTickets.filter(t => t.status?.toUpperCase() === "CLOSED").length,
  }

  return (
    <section className="flex flex-1 flex-col p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* INDIKATOR MODE ADMIN */}
      {isAdmin && (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-3 text-primary animate-in fade-in duration-500">
          <ShieldCheck className="h-5 w-5" />
          <div className="text-sm">
            <p className="font-bold uppercase tracking-tight">Admin View Enabled</p>
            <p className="opacity-80">You are currently viewing all tickets from all users in the system.</p>
          </div>
        </div>
      )}

      {/* TAMPILAN JIKA DATA KOSONG */}
      {allTickets.length === 0 && !ticketsError && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-blue-800 animate-in zoom-in-95 duration-300">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          <div className="text-sm">
            <p className="font-bold">No Data Found</p>
            <p>{isAdmin ? "There are no tickets in the entire system yet." : "You haven't created any technical support requests yet."}</p>
          </div>
        </div>
      )}

      {/* ERROR DATABASE */}
      {ticketsError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <div className="text-sm">
            <p className="font-bold">Database Error</p>
            <p>{ticketsError.message}</p>
          </div>
        </div>
      )}

      {/* TODO: Anda bisa menambahkan komponen Table atau List di sini */}
      {/* <AllTicketsTable tickets={allTickets} /> */}
      
    </section>
  )
}