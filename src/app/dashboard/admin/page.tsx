"use server"

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { AlertTriangle, ShieldCheck, TicketIcon, Clock, CheckCircle2, XCircle, BarChart3, History } from "lucide-react"
import { Ticket } from "../../../../.next/dev/types/ticket" 
import Link from "next/link"


interface TicketLog {
  id: number;
  status_update: string;
  notes: string;
  created_at: string;
  ticket_id: number;
}

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
    .select("role, *")
    .eq("id", user.id)
    .single()

    if (profileData.role !== "ADMIN"){
      redirect("/dashboard");
    }

  const isAdmin = profileData?.role === "ADMIN"

  let query = supabase
    .from("tickets")
    .select(`*, profiles!user_id (full_name)`)

  if (!isAdmin) {
    query = query.eq("user_id", user.id)
  }

  const { data: ticketsData, error: ticketsError } = await query.order("created_at", { ascending: false })
  const allTickets = (ticketsData as Ticket[]) || []
  
  const { data: logsData } = await supabase
    .from("ticket_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const allLogs = (logsData as TicketLog[]) || []
  const chartGroup = allTickets.reduce<Record<string, {date: string, count: number}>>((acc, t) => {
    const date = new Date(t.created_at).toISOString().split('T')[0]
    if (!acc[date]) acc[date] = { date, count: 0 }
    acc[date].count += 1
    return acc
  }, {})

  const chartData = Object.values(chartGroup).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status?.toUpperCase() === "OPEN").length,
    inProgress: allTickets.filter(t => t.status?.toUpperCase() === "IN_PROGRESS").length, 
    closed: allTickets.filter(t => t.status?.toUpperCase() === "CLOSED").length,
    canceled: allTickets.filter(t => t.status?.toUpperCase() === "CANCELED").length,
  }

  return (
    <section className="flex flex-1 flex-col p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full bg-background min-h-screen text-white">
      {isAdmin && (
        <div className="bg-background border border-primary p-4 rounded-2xl flex items-center gap-3 text-zinc-400">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-bold uppercase tracking-tight text-primary">Admin View Enabled</p>
            <p className="text-slate-400 ">Monitoring all system activity.</p>
          </div>
        </div>
      )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          <Link href="/dashboard/admin/tickets" className="block transition-transform hover:scale-[1.02] h-full">
            <StatCard title="Total Tickets" value={stats.total} description="All time requests" icon={<TicketIcon className="h-4 w-4" />} color="text-primary" />
          </Link>
          <Link href="/dashboard/admin/tickets?status=OPEN" className="block transition-transform hover:scale-[1.02] h-full">
            <StatCard title="Tickets Open" value={stats.open} description="Waiting for review" icon={<Clock className="h-4 w-4" />} color="text-primary" />
          </Link>
          <Link href="/dashboard/admin/tickets?status=IN PROGRESS" className="block transition-transform hover:scale-[1.02] h-full">
            <StatCard title="In Progress" value={stats.inProgress} description="Currently being handled" icon={<BarChart3 className="h-4 w-4" />} color="text-primary" />
          </Link>
          <Link href="/dashboard/admin/tickets?status=CLOSED" className="block transition-transform hover:scale-[1.02] h-full">
            <StatCard title="Tickets Closed" value={stats.closed} description="Successfully resolved" icon={<CheckCircle2 className="h-4 w-4" />} color="text-primary" />
          </Link>
          <Link href="/dashboard/admin/tickets?status=CANCELED" className="block transition-transform hover:scale-[1.02] h-full">
            <StatCard title="Canceled" value={stats.canceled} description="Voided or rejected" icon={<XCircle className="h-4 w-4" />} color="text-primary" />
          </Link>
        </div>
          <div>
          <div className="bg-background border border-primary p-6 rounded-2xl flex flex-col space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
              <History className="h-4 w-4 text-primary" />
              <h1 className="font-bold uppercase tracking-tighter text-sm text-primary">Recent Activities</h1>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {allLogs.length > 0 ? (
                allLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">
                      {new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs font-bold text-foreground mt-1">
                      Ticket #{log.ticket_id}: {log.status_update}
                    </p>
                    <p className="text-[10px] text-foreground mt-1 italic leading-relaxed">
                      {log.notes}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-zinc-500">No recent logs found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {allTickets.length === 0 && !ticketsError && (
          <div className="bg-background border border-zinc-800 p-8 rounded-3xl text-center text-foreground">
            <p>No ticket data available to display.</p>
          </div>
        )}

      {ticketsError && (
        <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-2xl flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">Database Error: {ticketsError.message}</p>
        </div>
      )}
    </section>
  )
}

function StatCard({ title, value, description, icon, color }: { title: string, value: number, description: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-background border border-primary p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-400/50 transition-colors group h-full min-h-[120px] sm:min-h-[140px]">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
        <div className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className={`text-2xl sm:text-3xl font-black tracking-tighter ${color}`}>{value.toLocaleString()}</h3>
        <p className="text-[10px] text-zinc-600 mt-1 font-medium leading-tight">{description}</p>
      </div>
    </div>
  )
}