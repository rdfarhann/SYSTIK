import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Users } from "lucide-react"
import { AddUserDialog } from "@/components/user/add-user-dialog"
import UserListTable from "@/components/user/user-list-table"

export default async function UserManagementPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "ADMIN") {
    redirect("/dashboard")
  }
  
  const { data: allUsers, error: usersError } = await supabase
    .from("profiles")
    .select("id, full_name, extension, email, department, role")
    .order('full_name', { ascending: true })

  if (usersError) {
    return (
      <div className="p-10 text-red-500 bg-red-50 m-6 rounded-xl border border-red-200">
        <h2 className="font-bold">Database Error Detected</h2>
        <p className="text-sm">{usersError.message}</p>
      </div>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto w-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl shadow-md text-primary-foreground shrink-0">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
              Manage Users
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">
              System Access Control
            </p>
          </div>
        </div>
        <AddUserDialog />
      </div>
      <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <UserListTable users={allUsers || []} />
      </div>
    </section>
  )
}