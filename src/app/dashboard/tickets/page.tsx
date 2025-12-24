import { redirect } from "next/navigation"

/* ================= UI PROVIDER & SIDEBAR ================= */
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"

/* ================= UI COMPONENTS ================= */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

/* ================= LIB ================= */
import { createSupabaseServer } from "@/lib/supabase/server"

/* ================= ICONS ================= */
import { ChevronDown, Bell, LogOut, Ticket } from "lucide-react"

/* ================= COMPONENTS ================= */
import AllTicketsTable from "@/components/tickets/all-tickets-table"

/* ================= LOGOUT ACTION ================= */
async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function TicketsPage() {
  /* ================= AUTH ================= */
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  /* ================= PROFILE ================= */
  const { data: profile } = await supabase
    .from("profiles")
    .select(`full_name, employee_id, department`)
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/")

  const displayName = profile.full_name ?? "User"
  const displayId = profile.employee_id ?? "-"

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: displayName,
          employee_id: displayId,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-background">
        {/* ================= HEADER (Modified with Stronger Shadow) ================= */}
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-10 shadow-md shadow-black/5 border-white/10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shadow-xl hover:bg-background hover:text-foreground hover:border transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink href="/dashboard" className="font-semibold hover:text-primary transition-colors">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-bold text-xs sm:text-sm">
                    <BreadcrumbLink className="text-foreground cursor-default opacity-60">All Tickets</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Notification & User Actions (Opsional, tapi biasanya ada di header) */}
            <div className="flex items-center gap-3">
               <button className="p-2 hover:bg-background rounded-full transition-all relative hover:rotate-45">
                  <Bell className="h-5 w-5 text-foreground " />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
               </button>
            </div>
          </div>
        </header>

        {/* ================= CONTENT AREA ================= */}
        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          
          {/* Section Heading with Icon Box */}
          <div className="flex items-center gap-4">
            <div className="bg-primary flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border bg-background shadow-md drop-shadow-md shrink-0">
              <Ticket className="h-6 w-6 sm:h-7 sm:w-7 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase drop-shadow-sm">All Tickets</h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-bold opacity-80 uppercase tracking-widest">
                Database Management System
              </p>
            </div>
          </div>
          
          {/* Container Tabel Utama dengan Shadow Pop-out (Melalui Komponen AllTicketsTable) */}
          <div className="w-full">
            <AllTicketsTable/>
          </div>

        </section>
      </main>
    </SidebarProvider>
  )
}