"use client"

import * as React from "react"
import { useState } from "react"
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

import {
  LayoutDashboard,
  Ticket,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface AppSidebarAdminProps {
  userProfile?: {
    full_name?: string | null
    employee_id?: string | null
  } | null
}

export function AppSidebarAdmin({ userProfile }: AppSidebarAdminProps) {
  const [isTicketsOpen, setIsTicketsOpen] = useState(false)
  const pathname = usePathname()

  const subMenuItems = [
    { label: "All Tickets", href: "/dashboard/tickets" },
    { label: "Open", href: "/dashboard/tickets/open" },
    { label: "In Progress", href: "/dashboard/tickets/progress" },
    { label: "Closed", href: "/dashboard/tickets/closed" },
    { label: "Canceled", href: "/dashboard/tickets/canceled" },
  ]

  return (
    <Sidebar className="w-64 bg-sidebar text-background border-r-0 shadow-xl">
      {/* ================= HEADER ================= */}
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
            <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold truncate">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
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

          {/* TICKET MANAGEMENT (MANUAL DROP-DOWN - NO WRAP) */}
          <SidebarMenuItem className="flex flex-col">
            <button 
              onClick={() => setIsTicketsOpen(!isTicketsOpen)}
              className="flex items-center justify-between h-10 w-full px-3 rounded-md hover:bg-background hover:text-foreground transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Ticket className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px] whitespace-nowrap overflow-hidden">
                  Ticket Management
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isTicketsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* SUB-MENU CONTAINER */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isTicketsOpen ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-5 border-l-2 border-white/10 flex flex-col gap-0.5">
                {subMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex h-9 items-center gap-2 pl-4 pr-2 text-[14px] text-white/70 hover:text-foreground hover:bg-white rounded-r-md transition-colors whitespace-nowrap"
                  >
                    <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </SidebarMenuItem>

          {/* LAINNYA */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 ">
              <Link href="/dashboard/user-management" className="flex items-center gap-3">
                <Users className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px]">User Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 ">
              <Link href="/dashboard/admin/agents" className="flex items-center gap-3">
                <UserCog className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px]">Agent Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 ">
              <Link href="/dashboard/admin/reports" className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px]">Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 ">
              <Link href="/dashboard/admin/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[14px]">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter className="border-t border-white/10 px-4 py-4 bg-black/10">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Logged In As</p>
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold shadow-inner shrink-0 border border-white/5">
               {userProfile?.full_name?.substring(0,2).toUpperCase() ?? "AD"}
             </div>
             <div className="min-w-0">
                <p className="font-semibold text-[13px] truncate drop-shadow-sm leading-none mb-1">
                  {userProfile?.full_name ?? "Admin"}
                </p>
                <p className="text-[10px] opacity-50 truncate leading-none italic">Administrator</p>
             </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}