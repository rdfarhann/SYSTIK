import { redirect } from "next/navigation"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
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
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { createSupabaseServer } from "@/lib/supabase/server"
import { ChevronDown, Bell, LogOut } from "lucide-react"
import DashboardHero from "@/components/layout/dashboard-hero"
import NotificationBell from "@/components/layout/notification-bell"


async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function UserDashboardPage() {
  /* ================= AUTH ================= */
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  /* ================= PROFILE ================= */
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      full_name,
      employee_id,
      department
    `)
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

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        {/* ================= HEADER WITH SHADOW ================= */}
        {/* Menambahkan shadow-sm dan z-index agar header terlihat di atas konten */}
       <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-10 shadow-md shadow-black/5 border-white/10">
          <div className="flex w-full items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              {/* Menambahkan shadow-sm pada SidebarTrigger */}
              <SidebarTrigger className="shadow-xl hover:bg-background hover:text-foreground hover:border transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs sm:text-sm">
                    <BreadcrumbLink href="/dashboard" className="font-semibold hover:text-primary transition-colors">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <NotificationBell/>
              <DropdownMenu>
                {/* Profile Trigger dengan shadow-sm saat hover */}
                <DropdownMenuTrigger className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] sm:text-sm font-semibold uppercase border border-transparent hover:border-slate-200 hover:bg-background hover:shadow-sm outline-none transition-all">
                  <span className="max-w-[80px] sm:max-w-none truncate">{displayName}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                {/* Dropdown Content dengan shadow-lg yang kuat */}
                <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg shadow-black/10 border-slate-200 animate-in fade-in zoom-in-95">
                  <DropdownMenuLabel className="text-[11px] text-foreground">
                    Informasi Pengguna
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="flex justify-between text-foreground">
                    <span>Employee ID</span>
                    <span className="font-medium text-right text-foreground">{displayId}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex justify-between text-foreground">
                    <span>Department</span>
                    <span className="font-medium text-right text-foreground">
                      {displayDepartment}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col p-0 sm:p-6">
          <DashboardHero/>
        </section>
      </main>
    </SidebarProvider>
  )
}