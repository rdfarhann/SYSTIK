"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  LayoutDashboard,
  Ticket,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react"

interface AppSidebarAdminProps {
  userProfile?: {
    full_name?: string | null
    employee_id?: string | null
  } | null
}

export function AppSidebarAdmin({ userProfile }: AppSidebarAdminProps) {
  return (
    <Sidebar className="w-64 bg-primary text-background">
      {/* ================= HEADER ================= */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <Image
            src="/systik_round.png"
            width={40}
            height={40}
            alt="Logo"
          />
          <div className="leading-tight">
            <p className="font-bold text-lg">SYSTIK</p>
            <p className="text-xs opacity-80">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent className="px-2 py-3 space-y-2">
        <SidebarMenu>
          {/* DASHBOARD */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 gap-3 rounded-lg px-3">
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ================= TICKET MANAGEMENT ================= */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tickets" className="border-none">
              <AccordionTrigger className="h-12 rounded-lg px-3 hover:bg-background hover:text-foreground">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5" />
                  <span className="font-medium">Ticket Management</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-1 space-y-1 text-background">
                {[
                  { label: "All Tickets", href: "/dashboard/tickets" },
                  { label: "Open", href: "/dashboard/tickets/open" },
                  { label: "In Progress", href: "/dashboard/tickets/progress" },
                  { label: "Closed", href: "/dashboard/tickets/closed" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex h-11 items-center gap-3 rounded-md px-9 text-sm hover:bg-background hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4 opacity-60" />
                    {item.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* USER MANAGEMENT */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 gap-3 rounded-lg px-3">
              <Link href="/dashboard/admin/users">
                <Users className="h-5 w-5" />
                <span className="font-medium">User Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* AGENT MANAGEMENT */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 gap-3 rounded-lg px-3">
              <Link href="/dashboard/admin/agents">
                <UserCog className="h-5 w-5" />
                <span className="font-medium">Agent Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* REPORTS */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 gap-3 rounded-lg px-3">
              <Link href="/dashboard/admin/reports">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* SETTINGS */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 gap-3 rounded-lg px-3">
              <Link href="/dashboard/admin/settings">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter className="border-t border-white/20 px-3 py-3 text-xs opacity-80">
        Logged in as <br />
        <span className="font-semibold">
          {userProfile?.full_name ?? "Admin"}
        </span>
      </SidebarFooter>
    </Sidebar>
  )
}
