import { redirect } from "next/navigation"
import Link from "next/link"

/* ================= UI PROVIDER & SIDEBAR ================= */
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

/* ================= UI COMPONENTS ================= */
import { Button } from "@/components/ui/button"

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
import {
  ChevronDown,
  Bell,
  Plus,
} from "lucide-react"

/* ================= COMPONENTS ================= */
import DashboardHero from "@/components/dashboard-hero"

export default async function DashboardPage() {
  /* ================= AUTH ================= */
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  /* ================= PROFILE ================= */
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, employee_id, department")
    .eq("id", user.id)
    .single()

  const displayName = profile?.full_name ?? "User"
  const displayId = profile?.employee_id ?? "No ID"
  const displayDepartment = profile?.department ?? "No Department"

  return (
    <SidebarProvider>
      <AppSidebar
        userProfile={{
          full_name: profile?.full_name,
          employee_id: profile?.employee_id,
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
                    <BreadcrumbLink href="#">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* NOTIFICATION */}
              <button className="relative rounded-lg p-2 hover:bg-muted">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* USER DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold uppercase hover:bg-foreground hover:text-background">
                  {displayName}
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                    Informasi Pengguna
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="flex justify-between">
                    <span>Employee ID</span>
                    <span className="font-medium">{displayId}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex justify-between">
                    <span>Department</span>
                    <span className="font-medium">{displayDepartment}</span>
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
