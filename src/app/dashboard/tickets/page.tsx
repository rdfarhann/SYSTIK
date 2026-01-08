import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Ticket as TicketIcon, AlertTriangle } from "lucide-react"
import AllTicketsDetail from "@/components/tickets/all-tickets-detail"
import { Ticket } from "@/app/types/ticket"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  /* ================= AUTH & DATA FETCHING ================= */
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  // Fetching tickets (Profile sudah ditangani di layout)
  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select(`
      *,
      profiles!user_id (
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  const allTickets = (ticketsData as Ticket[]) || [];
  
  const pageTitle = status 
    ? status.replace("-", " ").toUpperCase() 
    : "ALL TICKETS";

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl border shadow-md shrink-0">
          <TicketIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
            {pageTitle}
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold opacity-80 uppercase tracking-widest mt-1">
            Database Management System
          </p>
        </div>
      </div>
      
      {/* ERROR BANNER */}
      {ticketsError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-xs font-medium">Database Error: {ticketsError.message}</p>
        </div>
      )}

      {/* TABLE / CONTENT AREA */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <AllTicketsDetail 
          key={status || "all"} 
          statusFilter={status} 
          tickets={allTickets}
        />
      </div>
    </section>
  )
}