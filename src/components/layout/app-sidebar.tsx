"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import UserAvatar from "../user/user-avatar"
import {
  LayoutDashboard,
  Ticket,
  Settings
} from "lucide-react"

interface AppSidebarProps {
  userProfile?: {
    full_name?: string | null
    extension?: string | null
    role?: string | null
    avatar_url?: string | null 
  } | null
}

export function AppSidebar({ userProfile }: AppSidebarProps) {
  const pathname = usePathname()
  const avatarUrl = userProfile?.avatar_url || null
  const displayName = userProfile?.full_name || "User"
  const extension = userProfile?.extension || "-"



  return (
    <Sidebar className="w-64 bg-sidebar text-background border-r-0 shadow-xl">
      <SidebarHeader className="border-b border-white/10">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="bg-white/10 p-1.5 rounded-xl shadow-lg border border-white/10 shrink-0">
            <Image
              src="/systik_round.png"
              width={32}
              height={32}
              alt="Logo"
              className="drop-shadow-md"
            />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-bold text-lg tracking-tight truncate drop-shadow-sm">SYSTIK</p>
            <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold truncate">User Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarMenu className="gap-1">
          
          {/* DASHBOARD */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 active:scale-[0.98] transition-all">
              <Link href="/dashboard" className="flex items-center gap-3 w-full">
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px]">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 active:scale-[0.98] transition-all">
                  <Link href="/dashboard/my-ticket" className="flex items-center gap-3 w-full">
                    <Ticket className="h-8 w-8 shrink-0" />
                    <span className="font-medium text-[14px]">My Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>     
            </SidebarMenu>
          </SidebarContent>
      <SidebarFooter className="border-t border-white/10 px-4 py-4 bg-black/10">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-white">Logged In As</p>
              <div className="flex items-center gap-3">
                <UserAvatar 
                  src={avatarUrl} 
                  fallback={displayName.substring(0, 2).toUpperCase()} 
                />
                <div className="min-w-0 flex flex-col">
                  <span className="text-[13px] font-bold leading-tight text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                    Ext: {extension}
                  </span>
                </div>
              </div>
            </div>
          </SidebarFooter>
    </Sidebar>
  )
}