import { redirect } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { createSupabaseServer } from "@/lib/supabase/server"
import { ChevronDown, Bell, LogOut } from "lucide-react"
import UserManagementClient from "./user-management-client"


async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function UserManagementPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, employee_id, department")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/")

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: profile.full_name ?? "User",
          employee_id: profile.employee_id ?? "-",
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 shadow-sm z-10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="bg-background hover:bg-background shadow-sm border border-transparent transition-all"/>
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="font-semibold text-xs sm:text-sm">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="font-bold text-xs sm:text-sm text-foreground">
                    <BreadcrumbLink>User Management</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative rounded-lg p-2 hover:bg-background border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background shadow-sm"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] sm:text-sm font-semibold uppercase border border-transparent hover:border-slate-200 hover:bg-background hover:shadow-sm outline-none transition-all">
                  <span>{profile.full_name}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg border-slate-200">
                  <DropdownMenuLabel className="text-[11px]">Informasi Pengguna</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between">
                    <span>Employee ID</span> <span className="font-medium">{profile.employee_id}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                      <button type="submit" className="flex w-full items-center gap-2 text-red-600 font-semibold">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section className="flex-1 p-4 sm:p-6">
          {/* Komponen interaktif dipisahkan ke Client Component */}
          <UserManagementClient />
        </section>
      </main>
    </SidebarProvider>
  )
}