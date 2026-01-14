"use server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react"
import DashboardHero from "@/components/layout/dashboard-hero"
import { Ticket } from "../../../.next/dev/types/ticket"

export default async function UserDashboardPage({
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

  if (profileData?.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const recentTickets = (ticketsData as Ticket[]) || []
  const displayName = profileData?.full_name ?? user.email?.split('@')[0]

  return (
    <section className="flex flex-1 flex-col p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
      <DashboardHero userName={displayName} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Latest Ticket</h2>
          <Link href="/dashboard/my-ticket" className="text-xs font-semibold text-primary hover:underline">
            See All
          </Link>
        </div>
        
        {ticketsError ? (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Gagal memuat data tiket.
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <ShieldCheck className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-sm text-slate-400 font-medium">There is no ticket activity at this time.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/my-ticket/${ticket.id}`}
                className="group bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${ticket.status?.toUpperCase() === 'OPEN' ? 'bg-blue-500' :
                    ticket.status?.toUpperCase() === 'IN_PROGRESS' ? 'bg-amber-500' :
                      'bg-primary'
                    }`} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                      {ticket.title}
                    </p>
                    <p className="text-[11px] text-slate-400 uppercase font-medium">
                      Status: {ticket.status?.replace("_", " ")} • {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}