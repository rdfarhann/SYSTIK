// app/tickets/page.tsx
import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Ticket as TicketIcon, ChevronDown, LogOut, AlertTriangle } from "lucide-react"
import NotificationBell from "@/components/layout/notification-bell"
import AllTicketsDetail from "@/components/tickets/all-tickets-detail"
import { Ticket } from "@/app/types/ticket"

// Server Action untuk Logout
async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/") // Disarankan kembali ke login
}

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

  // Mengambil profile dan tickets secara paralel
  const [profileRes, ticketsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select(`full_name, extension, department`) 
      .eq("id", user.id)
      .single(),
    
    supabase
      .from("tickets")
      .select(`
        *,
        profiles!user_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false })
  ])

  // Validasi Profile
  if (profileRes.error || !profileRes.data) {
    console.error("Error fetching profile:", profileRes.error)
    redirect("/")
  }

  const profile = profileRes.data;
  const allTickets = (ticketsRes.data as Ticket[]) || [];
  const displayName = profile?.full_name ?? user.email?.split('@')[0]
  const displayExt = profile?.extension ?? "-"
  const displayDept = profile?.department ?? "-"

  const pageTitle = status 
    ? status.replace("-", " ").toUpperCase() 
    : "ALL TICKETS";

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: displayName,
          extension: displayExt,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        {/* HEADER */}
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground hover:bg-background hover:text-foreground transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="font-semibold hover:text-primary transition-colors">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-bold text-xs sm:text-sm">
                    <span className="text-foreground opacity-60 capitalize">
                      {status ? status.replace("-", " ") : "All Tickets"}
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell/> 

              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full pl-3 pr-2 py-1 hover:bg-slate-100 transition-all outline-none border border-transparent hover:border-slate-200">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-[15px] text-white font-bold shadow-inner">
                    {displayName?.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>  

                <DropdownMenuContent align="end" className="w-60 shadow-xl border-slate-200 p-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    Account
                  </DropdownMenuLabel>
                  <div className="px-2 pb-2">
                     <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <div className="px-2 py-2 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Extension</span>
                      <span className="font-bold text-foreground bg-slate-100 px-1.5 rounded">{displayExt}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Department</span>
                      <span className="font-bold text-foreground">{displayDept}</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0 mt-1">
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

        {/* CONTENT */}
        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl border shadow-md shrink-0">
              <TicketIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">{pageTitle}</h1>
              <p className="text-[10px] text-muted-foreground font-bold opacity-80 uppercase tracking-widest mt-1">
                Database Management System
              </p>
            </div>
          </div>
          
          {/* Tampil Banner Jika Ada Error Database */}
          {ticketsRes.error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-xs font-medium">Database Error: {ticketsRes.error.message}</p>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AllTicketsDetail 
              key={status || "all"} 
              statusFilter={status} 
              tickets={allTickets}
            />
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}