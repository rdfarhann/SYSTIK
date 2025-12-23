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
// Anda bisa membuat komponen tabel terpisah atau memanggilnya di sini
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
  const displayDepartment = profile.department ?? "-"

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: displayName,
          employee_id: displayId,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        {/* ================= HEADER (Tetap Ada) ================= */}
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-semibold text-xs sm:text-sm">
                    <BreadcrumbLink>Tickets</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative rounded-lg p-2 hover:bg-muted">
                <Bell className="h-5 w-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 rounded-md px-2 py-1 text-[10px] sm:text-sm font-semibold uppercase hover:bg-muted outline-none">
                  <span className="max-w-[80px] sm:max-w-none truncate">{displayName}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuLabel className="text-[11px]">Informasi Pengguna</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between">
                    <span>Employee ID</span>
                    <span className="font-medium">{displayId}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                      <button type="submit" className="flex w-full items-center gap-2 text-red-600">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* ================= CONTENT: DAFTAR SEMUA TIKET ================= */}
        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight uppercase">all Tickets</h1>
              <p className="text-sm text-muted-foreground font-semibold">manage and monitor all support tickets here.</p>
            </div>
          </div>
          
          {/* Tabel Utama */}
          <AllTicketsTable/>
        </section>
      </main>
    </SidebarProvider>
  )
}