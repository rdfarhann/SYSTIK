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
import { Users, ChevronDown, LogOut } from "lucide-react"
import { AddUserDialog } from "@/components/user/add-user-dialog"
import UserListTable from "@/components/user/user-list-table"
import NotificationBell from "@/components/layout/notification-bell"

// Server Action untuk Logout
async function logout() {
  "use server"
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/login")
}

export default async function UserManagementPage() {
  const supabase = await createSupabaseServer()
  
  /* ================= AUTH & PROFILE ADMIN ================= */
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, extension, department, role")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Profile not found:", error)
  }

  /* ================= FETCH ALL USERS DATA ================= */
  // Tambahkan baris ini untuk mengambil data semua user yang akan ditampilkan di tabel
  const { data: allUsers, error: usersError } = await supabase
    .from("profiles")
    .select("id, full_name, extension, email, department, role")
    .order('full_name', { ascending: true })

  // app/dashboard/user-management/page.tsx
// app/dashboard/user-management/page.tsx
if (usersError) {
  console.log("--- DATABASE ERROR DETECTED ---");
  console.log("Message:", usersError?.message || "No message");
  console.log("Code:", usersError?.code || "No code");
  // Cek apakah tabel 'profiles' benar-benar ada di database
  return <div className="p-10 text-red-500 font-bold">Database Error: {usersError.message}</div>;
}

  const displayName = profile?.full_name ?? user.email?.split('@')[0]
  const displayExt = profile?.extension ?? "-"
  const displayDept = profile?.department ?? "-"

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: displayName,
          extension: displayExt,
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50/50">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hover:bg-accent transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="font-semibold hover:text-primary">Dashboard</Link>
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
                        Exit Application
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl shadow-md text-primary-foreground">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Manage Users</h1>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">System Access Control</p>
              </div>
            </div>
            <AddUserDialog />
          </div>
          
          <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
            {/* Variabel allUsers sekarang sudah terisi data */}
            <UserListTable users={allUsers || []} />
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}