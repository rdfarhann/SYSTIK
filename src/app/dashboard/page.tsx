import { redirect } from "next/navigation"
import Link from "next/link"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { createSupabaseServer } from "@/lib/supabase/server"
import { ChevronDown, LogOut, AlertTriangle, ShieldCheck } from "lucide-react"
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


  if (profileData?.role === "admin") {
    redirect("/dashboard/admin")
  }

  const { status } = await searchParams
  let query = supabase
    .from("tickets")
    .select(`
      *,
      profiles!user_id (
        full_name
      )
    `)

  query = query.eq("user_id", user.id)

  const { data: ticketsData, error: ticketsError } = await query.order("created_at", { ascending: false })

  const allTickets = (ticketsData as Ticket[]) || []
  

  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status?.toUpperCase() === "OPEN").length,
    inProgress: allTickets.filter(t => t.status?.toUpperCase() === "IN_PROGRESS").length, 
    closed: allTickets.filter(t => t.status?.toUpperCase() === "CLOSED").length,
    canceled: allTickets.filter(t => t.status?.toUpperCase() === "CANCELED").length,
  }

  const displayName = profileData?.full_name ?? user.email?.split('@')[0]
  const displayExt = profileData?.extension ?? "-"
  const displayDept = profileData?.department ?? "-"

  return (
    <SidebarProvider>
      <AppSidebar
        userProfile={{
          full_name: displayName,
          extension: displayExt,
          role: profileData?.role ?? "user"
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground hover:bg-background hover:text-foreground transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="font-semibold hover:text-primary">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-bold text-xs sm:text-sm">
                    <span className="text-foreground opacity-60 capitalize">
                      {status ? status.replace("-", " ") : "My Tickets"}
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell/> 

              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full pl-3 pr-2 py-1 hover:bg-slate-50 transition-all outline-none">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-[15px] text-white font-bold">
                    {displayName?.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>   

                <DropdownMenuContent align="end" className="w-60 shadow-xl border-slate-200 p-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-slate-500 font-normal">
                    Account Connected: <br/>
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

        <section className="flex flex-1 flex-col p-4 sm:p-6 space-y-6">
          {/* Status Display */}
          {allTickets.length === 0 && !ticketsError && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-blue-800">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <div className="text-sm font-medium">
                Anda belum memiliki riwayat tiket. Silakan buat tiket baru jika membutuhkan bantuan.
              </div>
            </div>
          )}

          {ticketsError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-sm">
                <p className="font-bold">Database Connection Error</p>
                <p className="text-xs opacity-80">{ticketsError.message}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </SidebarProvider>
  )
}