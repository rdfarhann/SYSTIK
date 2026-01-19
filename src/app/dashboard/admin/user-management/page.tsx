import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Users, ShieldCheck, AlertCircle } from "lucide-react"
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
      <div className="flex items-center gap-3 p-6 m-6 text-red-800 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight">Database Error</h2>
          <p className="text-xs opacity-80">{usersError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl text-primary shadow-sm border border-primary/20 shrink-0">
            <Users className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase tracking-tight leading-none">
                Manage Users
              </h1>
              <span className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                <ShieldCheck className="h-2.5 w-2.5" />
                Admin Secure
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase opacity-70">
              User Directory & Access Control System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right pr-4 border-r border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Members</p>
            <p className="text-xl font-black text-primary leading-none">{allUsers?.length || 0}</p>
          </div>
          <AddUserDialog />
        </div>
      </div>

      {/* Stats Quick Overview (Optional but Professional) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase">Administrator</p>
          <p className="text-lg font-bold text-slate-800">
            {allUsers?.filter(u => u.role === 'ADMIN').length || 0}
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase">Staff/Users</p>
          <p className="text-lg font-bold text-slate-800">
            {allUsers?.filter(u => u.role !== 'ADMIN').length || 0}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="overflow-x-auto">
          <UserListTable users={allUsers || []} />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="h-1 w-1 rounded-full bg-slate-300" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          End of user directory
        </p>
        <div className="h-1 w-1 rounded-full bg-slate-300" />
      </div>
    </section>
  )
}