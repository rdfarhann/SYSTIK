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
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

/* ================= LIB ================= */
import { createSupabaseServer } from "@/lib/supabase/server"

/* ================= ICONS ================= */
import { ChevronDown, Bell, LogOut } from "lucide-react"

/* ================= COMPONENTS ================= */
import DashboardHero from "@/components/layout/dashboard-hero"

/* ================= LOGOUT ACTION ================= */
async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function AdminDashboardPage() {
  /* ================= AUTH ================= */
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

 /* ================= PROFILE + ROLE ================= */
const { data: profiles, error } = await supabase
    .from("profiles")
    .select("full_name, extension, department, role")
    .eq("id", user.id)
    .single()

  // Jika profil tidak ditemukan, redirect atau tangani error
  if (error || !profiles) {
    console.error("Profile not found:", error)
    // Jangan langsung redirect jika hanya profil yang hilang agar tidak loop
  }

  const displayName = profiles?.full_name ?? user.email?.split('@')[0]
  const displayExt = profiles?.extension ?? "-"
  const displayDept = profiles?.department ?? "-"

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: displayName,
          extension: displayExt,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col">
        {/* ================= HEADER ================= */}
        <header className="flex h-16 items-center border-b px-4">
          <div className="flex w-full items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="font-semibold">
                    <BreadcrumbLink>Admin Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <button className="relative rounded-lg p-2 hover:border">
                <Bell className="h-5 w-5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold uppercase hover:border">
                  {displayName}
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuLabel className="text-[11px]">
                    Informasi Pengguna
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="flex justify-between">
                    <span>Employee ID</span>
                    <span className="font-medium">{displayExt}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex justify-between">
                    <span>Department</span>
                    <span className="font-medium text-right">
                      {displayDept}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 text-red-600"
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

        {/* ================= CONTENT ================= */}
        <section className="flex flex-1 flex-col gap-6 p-6">
          <DashboardHero />
        </section>
      </main>
    </SidebarProvider>
  )
}
