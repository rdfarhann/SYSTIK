import { redirect } from "next/navigation"
import Link from "next/link"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { createSupabaseServer } from "@/lib/supabase/server"
import { ChevronDown, ChevronRight, LogOut, AlertTriangle, ShieldCheck } from "lucide-react"
import DashboardHero from "@/components/layout/dashboard-hero"
import NotificationBell from "@/components/layout/notification-bell"
import { Ticket } from "../types/ticket"

async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
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
  const displayExt = profileData?.extension ?? "-"
  const displayDept = profileData?.department ?? "-"
  const isAdmin = profileData?.role === "ADMIN"

  return (
    <SidebarProvider>
      <AppSidebar
        userProfile={{
          full_name: displayName,
          extension: profileData?.extension ?? "-",
          role: profileData?.role ?? "USER"
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="font-semibold text-slate-700">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full pl-3 pr-2 py-1 hover:bg-slate-50 transition-all outline-none">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-[15px] text-white font-bold">
                    {displayName?.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60 shadow-xl border-slate-200 p-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-slate-500 font-normal">
                    Account Connected: <br />
                    <span className="font-bold text-slate-900">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 flex flex-col gap-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Extension</span>
                      <span className="font-bold text-foreground">{displayExt}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Department</span>
                      <span className="font-bold text-foreground">{displayDept}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Access Level</span>
                        <span className="font-bold text-primary">Administrator</span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0">
                    <form action={logout} className="w-full">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Exit
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          <DashboardHero userName={displayName} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Latest Ticket</h2>
              <Link href="/dashboard/my-ticket" className="text-xs font-semibold text-emerald-600 hover:underline">
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
                    className="group bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-emerald-500/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${ticket.status?.toUpperCase() === 'OPEN' ? 'bg-blue-500' :
                          ticket.status?.toUpperCase() === 'IN_PROGRESS' ? 'bg-amber-500' :
                            'bg-emerald-500'
                        }`} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                          {ticket.title}
                        </p>
                        <p className="text-[11px] text-slate-400 uppercase font-medium">
                          Status: {ticket.status?.replace("_", " ")} • {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}