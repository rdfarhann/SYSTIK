import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DynamicBreadcrumb } from "@/components/layout/dynamic-breadcrumb"
import NotificationBell from "@/components/layout/notification-bell"
import { ChevronDown, LogOut } from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createSupabaseServer()


  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.role === "ADMIN"
  const displayName = profile?.full_name ?? user.email?.split('@')[0]

  async function handleLogout() {
    "use server"
    const supabase = await createSupabaseServer()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <SidebarProvider>
      {isAdmin ? (
        <AppSidebarAdmin 
          userProfile={{
            full_name: displayName,
            extension: profile?.extension ?? "-",
            role: "ADMIN"
          }} 
        />
      ) : (
        <AppSidebar 
          userProfile={{
            full_name: displayName,
            extension: profile?.extension ?? "-",
            role: "USER"
          }} 
        />
      )}

      <main className="flex min-h-screen flex-1 flex-col bg-slate-50/50 overflow-x-hidden">
        <header className="flex h-16 items-center border-b px-4 bg-background sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            
            <div className="flex items-center gap-2">
              <SidebarTrigger className="bg-background text-foreground hover:bg-slate-100 border hover:text-foreground border-transparent hover:border-slate-200 transition-all outline-none"/>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <DynamicBreadcrumb />
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full pl-3 pr-2 py-1 over:bg-slate-100 border hover:text-foreground border-transparent hover:border-slate-200 transition-all outline-none">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[13px] text-white font-bold">
                    {displayName?.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60 shadow-xl p-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-[11px] text-slate-500 font-normal uppercase">
                    Account Connected
                  </DropdownMenuLabel>
                  <div className="px-2 pb-2">
                    <p className="text-sm font-bold truncate text-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0 focus:bg-transparent">
                    <form action={handleLogout} className="w-full">
                      <button type="submit" className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-md transition-colors">
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

        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}