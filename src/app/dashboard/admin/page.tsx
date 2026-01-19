"use server"

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { 
  AlertTriangle, 
  ShieldCheck, 
  Ticket as TicketIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  History,
  Activity,
  LucideIcon 
} from "lucide-react"
import { Ticket } from "../../../../.next/dev/types/ticket" 
import Link from "next/link"

interface TicketLog {
  id: number;
  status_update: string;
  notes: string;
  created_at: string;
  ticket_id: number;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role, *")
    .eq("id", user.id)
    .single()

  if (profileData?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select(`*, profiles!user_id (full_name)`)
    .order("created_at", { ascending: false })

  const allTickets = (ticketsData as Ticket[]) || []
  
  const { data: logsData } = await supabase
    .from("ticket_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const allLogs = (logsData as TicketLog[]) || []

  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status?.toUpperCase() === "OPEN").length,
    inProgress: allTickets.filter(t => t.status?.toUpperCase() === "IN_PROGRESS").length, 
    closed: allTickets.filter(t => t.status?.toUpperCase() === "CLOSED").length,
    canceled: allTickets.filter(t => t.status?.toUpperCase() === "CANCELED").length,
  }

  return (
    <section className="flex flex-1 flex-col p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full bg-slate-50/30 min-h-screen">
      <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-2xl border border-primary/20">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">System Overview</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Monitoring global ticket activities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link href="/dashboard/admin/tickets" className="transition-transform hover:scale-[1.02]">
          <StatCard title="Total Tickets" value={stats.total} description="All time records" icon={TicketIcon} color="text-slate-900" bgColor="bg-slate-100" />
        </Link>
        <Link href="/dashboard/admin/tickets?status=OPEN" className="transition-transform hover:scale-[1.02]">
          <StatCard title="Open" value={stats.open} description="Awaiting action" icon={Clock} color="text-slate-900" bgColor="bg-slate-100" />
        </Link>
        <Link href="/dashboard/admin/tickets?status=IN_PROGRESS" className="transition-transform hover:scale-[1.02]">
          <StatCard title="Progress" value={stats.inProgress} description="Currently active" icon={BarChart3} color="text-slate-900" bgColor="bg-slate-100" />
        </Link>
        <Link href="/dashboard/admin/tickets?status=CLOSED" className="transition-transform hover:scale-[1.02]">
          <StatCard title="Closed" value={stats.closed} description="Completed" icon={CheckCircle2} color="text-slate-900" bgColor="bg-slate-100" />
        </Link>
        <Link href="/dashboard/admin/tickets?status=CANCELED" className="transition-transform hover:scale-[1.02]">
          <StatCard title="Canceled" value={stats.canceled} description="Voided" icon={XCircle} color="text-slate-900" bgColor="bg-slate-100" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="font-black uppercase tracking-tighter text-sm text-slate-900">Recent System Logs</h2>
            </div>
            <span className="text-[9px] font-black bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400 uppercase tracking-widest">Last 10 Actions</span>
          </div>
          
          <div className="p-6 space-y-0 divide-y divide-slate-100">
            {allLogs.length > 0 ? (
              allLogs.map((log) => (
                <div key={log.id} className="py-4 first:pt-0 last:pb-0 group transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className="text-[9px] font-mono font-black text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                          ID: #{log.ticket_id}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                        Status Updated: {log.status_update}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic font-medium leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">No activity detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {ticketsError && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-[11px] font-black uppercase tracking-widest">Database Sync Error: {ticketsError.message}</p>
        </div>
      )}
    </section>
  )
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  title: string, 
  value: number, 
  description: string, 
  icon: LucideIcon, 
  color: string, 
  bgColor: string 
}) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/30 transition-all shadow-sm h-full group">
      <div className="flex justify-between items-start mb-6">
        <div className={`${bgColor} ${color} p-2 rounded-xl border border-current/10`}>
          <Icon className="h-5 w-5" /> 
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      <div>
        <h3 className={`text-2xl font-black tracking-tighter text-slate-900 group-hover:${color} transition-colors`}>
          {value.toLocaleString()}
        </h3>
        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight opacity-70">{description}</p>
      </div>
    </div>
  )
}