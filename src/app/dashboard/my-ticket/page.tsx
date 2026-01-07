import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import NotificationBell from "@/components/layout/notification-bell"
import { Separator } from "@/components/ui/separator"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Ticket } from "@/app/types/ticket"
import { ChevronDown, LogOut, Clock, MessageCircle, AlertCircle  } from "lucide-react"

async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function MyTicketsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const allTickets = (tickets as Ticket[]) || []
  const displayName = profileData?.full_name ?? user.email?.split('@')[0]
  const displayExt = profileData?.extension ?? "-"
  const displayDept = profileData?.department ?? "-"
  const isAdmin = profileData?.role === "ADMIN"

  return (
    <SidebarProvider>
      <AppSidebar
        userProfile={{
          full_name: profileData?.full_name,
          extension: profileData?.extension,
          role: profileData?.role ?? "user"
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col bg-slate-50/50">
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


        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">My Ticket History</h1>
            <p className="text-muted-foreground text-sm">Monitor the progress of your technical assistance.</p>
          </div>

          {ticketsError && (
             <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Gagal memuat data: {ticketsError.message}</p>
             </div>
          )}

          {allTickets.length === 0 && !ticketsError ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
              <Clock className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-lg text-slate-900">No tickets yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
                You do not have any technical support requests.
              </p>
              <Link href="/dashboard/my-ticket/new" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
                Create New Ticket
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {allTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        #{ticket.id.toString().slice(0, 8)}
                      </span>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {ticket.title || "No Title"}
                      </h3>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 italic">
                    {"\""}{ticket.description}{"\""}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">
                          {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                          })}
                        </span>
                    </div>
                    <Link 
                      href={`/dashboard/my-ticket/${ticket.id}`}
                      className="text-xs font-bold text-primary hover:text-primary/80"
                    >
                      Progress Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </SidebarProvider>
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
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[s] || "bg-slate-50 text-slate-500"}`}>
      {s.replace("_", " ")}
    </span>
  )
}