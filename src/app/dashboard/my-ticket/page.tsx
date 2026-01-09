import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Ticket } from "../../../../.next/dev/types/ticket"
import { Clock, MessageCircle, AlertCircle } from "lucide-react"

export default async function MyTicketsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const allTickets = (tickets as Ticket[]) || []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Ticket History</h1>
        <p className="text-muted-foreground text-sm font-medium">Monitor the progress of your technical assistance.</p>
      </div>

      {ticketsError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Gagal memuat data: {ticketsError.message}</p>
        </div>
      )}

      {allTickets.length === 0 && !ticketsError ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
          <Clock className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="font-bold text-lg text-slate-900">No tickets yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1 font-medium">
            You do not have any technical support requests.
          </p>
          <Link href="/dashboard/my-ticket/new" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            Create New Ticket
          </Link>
        </div>
      ) : (

        <div className="grid gap-4">
          {allTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    #{ticket.id.toString().slice(0, 8)}
                  </span>
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
                  href={`/dashboard/my-ticket/${ticket.id}`}
                  className="text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Progress Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase() || "UNKNOWN"
  const styles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
    CLOSED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELED: "bg-slate-100 text-slate-600 border-slate-200",
  }

  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full border shadow-sm uppercase ${styles[s] || "bg-slate-50 text-slate-500"}`}>
      {s.replace("_", " ")}
    </span>
  )
}