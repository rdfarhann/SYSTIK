import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Ticket as TicketIcon, AlertTriangle, MessageCircle, User as UserIcon, Building2 } from "lucide-react"
import { redirect } from "next/navigation"
import { Ticket } from "../../../../../.next/dev/types/ticket"

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    CANCELLED: "bg-amber-100 text-amber-700 border-amber-200",
    CANCELED: "bg-amber-100 text-amber-700 border-amber-200",
  }

  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles[status] || styles.CLOSED}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")
  const statusFormatted = status && status !== "all" ? status.replace("-", "_").toUpperCase() : null;
  const query = supabase
    .from("tickets")
    .select(`
      *,
      profiles:user_id (
        full_name,
        department
      )
    `)
    .order("created_at", { ascending: false });

  if (statusFormatted) {
    query.eq("status", statusFormatted);
  }
  
  const { data: ticketsData, error: ticketsError } = await query;


  const allTickets = (ticketsData as (Ticket & { 
    profiles: { 
      full_name: string;
      department: string; 
    } | null
  })[]) || [];
  
  const pageTitle = status && status !== "all"
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
      
      {ticketsError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-xs font-medium">Database Error: {ticketsError.message}</p>
        </div>
      )}
      <div className="grid gap-4">
          {allTickets.length > 0 ? (
            allTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        #{ticket.id.toString().slice(0, 8)}
                      </span>
                      <span className="text-slate-300">•</span>
                      
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                          {ticket.profiles?.full_name || "Guest"}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        <Building2 className="h-3 w-3 text-primary/60" />
                        <span className="text-[9px] font-black uppercase tracking-tight text-primary/80">
                          {ticket.profiles?.department || "General"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {ticket.title || "No Title"}
                    </h3>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 italic font-medium">
                  {"\""}{ticket.description}{"\""}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span className="text-[11px]">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <Link 
                    href={`/dashboard/admin/tickets/${ticket.id}`}
                    className="text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    Progress Details →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No tickets found in {pageTitle}</p>
            </div>
          )}
        </div>
    </section>
  )
}