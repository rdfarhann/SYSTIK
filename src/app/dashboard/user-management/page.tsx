import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"
import { AddUserDialog } from "@/components/user/add-user-dialog"
import UserListTable  from "@/components/user/user-list-table"

export default async function UserManagementPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select(`full_name, employee_id`)
    .eq("id", user.id)
    .single()

  return (
    <SidebarProvider>
      <AppSidebarAdmin
        userProfile={{
          full_name: profile?.full_name ?? "Admin",
          employee_id: profile?.employee_id ?? "-",
        }}
      />

      <main className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-background">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-10 shadow-md shadow-black/5 border-white/10">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shadow-xl hover:bg-background hover:border hover:text-foreground transition-all rounded-lg" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <h2 className="text-sm font-bold">User Management</h2>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl shadow-md text-background">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Manage Users</h1>
                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">System Access Control</p>
              </div>
            </div>
            <AddUserDialog />
          </div>
          
          <div className="w-full">
            <UserListTable />
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}