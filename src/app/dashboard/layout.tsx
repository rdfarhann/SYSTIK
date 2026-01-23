import UserAvatar from "@/components/user/user-avatar"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator" 
import NotificationBell from "@/components/layout/notification-bell"
import { ChevronDown, LogOut, Settings, User, ChevronRight} from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DynamicHeader } from "@/components/layout/dynamic-header"


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
            role: "ADMIN",
            avatar_url: profile?.avatar_url,
          }} 
        />
      ) : (
        <AppSidebar 
          userProfile={{
            full_name: displayName,
            extension: profile?.extension ?? "-",
            role: "USER",
            avatar_url: profile?.avatar_url
          }} 
        />
      )}

      <main className="flex min-h-screen flex-1 flex-col bg-slate-50/50 overflow-x-hidden">
        <header className="flex h-16 items-center border-b px-4 bg-background sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center justify-between">
            
            <div className="flex items-center gap-2">
              <SidebarTrigger className="bg-background text-foreground hover:bg-slate-100 border hover:text-foreground border-transparent hover:border-slate-200 transition-all outline-none"/>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <DynamicHeader />
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full p-1 hover:bg-slate-200/60 transition-colors duration-200 outline-none">
                  <div className="relative">
                    <UserAvatar 
                      src={profile?.avatar_url} 
                      fallback={displayName?.substring(0, 2).toUpperCase() || "SR"} 
                      className="h-9 w-9 border border-slate-200 shadow-sm"
                      unoptimized={true}
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-600"></div>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={8}
                  className="w-[360px] rounded-xl border-none bg-white p-2 shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)]"
                >
                  <Link href="/dashboard/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors mb-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <UserAvatar 
                      src={profile?.avatar_url} 
                      fallback={displayName?.substring(0, 2).toUpperCase() || "SR"} 
                      className="h-10 w-10"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[15px] font-semibold text-slate-900 leading-tight">
                        {displayName || "User Name"}
                      </span>
                      <span className="text-[13px] text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </Link>

                  <div className="h-[1px] bg-slate-200 mx-2 my-1" />
                  <div className="space-y-1">
                    <DropdownMenuItem asChild className="rounded-lg focus:bg-slate-100 cursor-pointer p-2">
                      <Link href="/dashboard/profile" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
                          <User className="h-5 w-5 text-slate-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-slate-900">Profil</span>
                          <span className="text-[12px] text-slate-500">Set profile info and extensions ({profile?.extension})</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg focus:bg-slate-100 cursor-pointer p-0 overflow-hidden">
                      <form action={handleLogout} className="w-full">
                        <button type="submit" className="flex w-full items-center gap-3 p-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                            <LogOut className="h-5 w-5 text-red-500" />
                          </div>
                          <span className="text-[14px] font-medium text-red-500">Exit</span>
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </div>
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