"use client"

import * as React from "react"
import Image from "next/image"
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
import { NavUser } from "@/components/nav-user"
import {
  LayoutDashboard,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react"

interface AppSidebarProps {
  userProfile?: {
    full_name?: string | null
    email?: string | null
    employee_id?: string | null
  } | null
}

export function AppSidebar({ userProfile }: AppSidebarProps) {
  return (
    <Sidebar className="w-64">
      {/* ===== HEADER ===== */}
      <SidebarHeader>
        <div className="flex items-center gap-4">
          <Image
            src="/systik_round.png"
            width={40}
            height={40}
            alt="Logo"
          />
          <div className="leading-tight">
            <p className="font-bold text-lg">SYSTIK</p>
            <p className="text-xs text-muted-foreground">
              Solve Your Issue
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* ===== CONTENT ===== */}
      <SidebarContent className="px-2 py-3 space-y-2">
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 gap-3 rounded-lg px-3"
            >
              <a href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Accordion Status */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="status" className="border-none">
              <AccordionTrigger className="h-12 rounded-lg px-3 hover:bg-background hover:text-foreground">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5" />
                  <span className="font-medium">Ticket Status</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-1 space-y-1">
                {[
                  { label: "Open", icon: AlertCircle, href: "/tickets/open" },
                  { label: "In Progress", icon: Clock, href: "/tickets/progress" },
                  { label: "Closed", icon: CheckCircle, href: "/tickets/closed" },
                  { label: "Canceled", icon: XCircle, href: "/tickets/canceled" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex h-11 items-center gap-3 rounded-md px-9 text-sm text-background hover:bg-background hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
                  </a>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarMenu>
      </SidebarContent>

      {/* ===== FOOTER ===== */}
      <SidebarFooter className="border-t p-2">
        <NavUser
          user={{
            name: userProfile?.full_name ?? "Full Name",
            email:
              `${userProfile?.employee_id ?? "EMP"} · ${userProfile?.email ?? "email@company.com"}`,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
