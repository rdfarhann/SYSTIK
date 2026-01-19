import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Ticket as TicketType } from "@/types/ticket"
import { 
  Ticket as TicketIcon, 
  Clock, 
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  User as UserIcon,
  Plus
} from "lucide-react"


const getPriorityStyle = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case 'URGENT': return "text-red-600 bg-red-50 border-red-100"
    case 'HIGH': return "text-orange-600 bg-orange-50 border-orange-100"
    default: return "text-slate-500 bg-slate-50 border-slate-100"
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CLOSED: "bg-slate-50 text-slate-600 border-slate-100",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-100",
    CANCELLED: "bg-amber-50 text-amber-700 border-amber-100",
    CANCELED: "bg-amber-50 text-amber-700 border-amber-100",
  }

  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles[status] || styles.CLOSED}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

export default async function MyTicketsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const allTickets = (tickets as TicketType[]) || []

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl text-primary shadow-sm border border-primary/20 shrink-0">
            <TicketIcon className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-slate-900">
                MY TICKETS
              </h1>
              <span className="hidden sm:flex items-center gap-1 bg-primary/5 text-primary text-[9px] font-black px-2 py-0.5 rounded-full border border-primary/10 uppercase tracking-widest">
                <ShieldCheck className="h-2.5 w-2.5" />
                User View
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase opacity-70">
              Support Management System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right pr-4 border-r border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Your Submissions</p>
            <p className="text-xl font-black text-primary leading-none">{allTickets.length}</p>
          </div>
          <Link 
            href="/dashboard/my-ticket/new" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/50 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Ticket
          </Link>
        </div>
      </div>


      {ticketsError && (
        <div className="flex items-center gap-3 p-4 text-red-700 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-[11px] font-black uppercase">Failed to sync: {ticketsError.message}</p>
        </div>
      )}

      <div className="grid gap-3">
        {allTickets.length > 0 ? (
          allTickets.map((ticket) => (
            <Link 
              key={ticket.id} 
              href={`/dashboard/my-ticket/${ticket.id}`}
              className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                      #{ticket.id.toString().slice(0, 5)}
                    </span>
                    <StatusBadge status={ticket.status} />
                    {ticket.priority && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getPriorityStyle(ticket.priority)}`}>
                        <AlertCircle className="h-2.5 w-2.5" />
                        {ticket.priority}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors leading-snug">
                    {ticket.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-1 mt-1 font-medium italic">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:border-l md:pl-6 border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="bg-slate-100 p-1 rounded">
                        <UserIcon className="h-3 w-3 text-slate-500" />
                      </div>
                      <span className="text-xs font-bold truncate">Me</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <time className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(ticket.created_at).toLocaleString('id-ID', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric',
                            hour12: false 
                          })}
                      </time>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                     <span className="text-[10px] font-black uppercase tracking-widest italic underline underline-offset-4">Progress Details</span>
                     <ChevronRight className="h-3 w-3" />
                  </div>
                </div>

              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No tickets found in your history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="h-1 w-1 rounded-full bg-slate-300" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          End of ticket history
        </p>
        <div className="h-1 w-1 rounded-full bg-slate-300" />
      </div>

    </section>
  )
}