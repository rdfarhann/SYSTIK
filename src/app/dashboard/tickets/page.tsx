import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Ticket } from "lucide-react"
import AllTicketsTable from "@/components/tickets/all-tickets-table"
import NotificationBell from "@/components/layout/notification-bell"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  /* ================= AUTH & PROFILE ================= */
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select(`full_name, employee_id`)
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/")

  // Judul dinamis berdasarkan status URL
  const pageTitle = status 
    ? status.replace("-", " ").toUpperCase() 
    : "ALL TICKETS";

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: profile.full_name,
          employee_id: profile.employee_id,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-background">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-10 shadow-md shadow-black/5 border-white/10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shadow-xl hover:bg-background hover:border hover:text-foreground transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink href="/dashboard" className="font-semibold">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-bold text-xs sm:text-sm">
                    <BreadcrumbLink className="text-foreground opacity-60 capitalize">
                      {status ? status.replace("-", " ") : "All Tickets"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell/>   
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl border shadow-md shrink-0">
              <Ticket className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">{pageTitle}</h1>
              <p className="text-xs text-muted-foreground font-bold opacity-80 uppercase tracking-widest">
                Database Management System
              </p>
            </div>
          </div>
          
          <div className="w-full">
            {/* PENTING: key={status} mencegah error cascading render & mereset pagination otomatis */}
            <AllTicketsTable key={status || "all"} statusFilter={status} />
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}