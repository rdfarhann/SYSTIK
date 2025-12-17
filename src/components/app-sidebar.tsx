"use client"

import * as React from "react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"



interface SubMenuItem {
  title: string;
  url: string;
  isActive?: boolean;
}

interface MainMenuItem {
  title: string;
  url: string;
  items?: SubMenuItem[];
}

interface SidebarData {
  navMain: MainMenuItem[];
}



const data: SidebarData = {
  navMain: [
    {
      title: "Ticket Dashboard",
      url: "#",
      items: [
        {
          title: "Assigned to Me",
          url: "#",
          isActive: false,
        },
        {
          title: "Your Tikcet",
          url: "#",
          isActive: false,
        },
        {
          title: "Open",
          url: "#",
          isActive: false,
        },
        {
          title: "Closed",
          url: "#",
          isActive: false,
        },
        {
          title: "Pending",
          url: "#",
          isActive: false,
        },
        {
          title: "In Progress",
          url: "#",
          isActive: false,
        },
        {
          title: "Waiting for Response",
          url: "#",
          isActive: false,
        },
        {
          title: "Canceled",
          url: "#",
          isActive: false,
        },
      ],
    },
  ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                  <Image
                  src ="/systik_round.png"
                  width={50}
                  height={50}
                  alt="Logo Dashboard"
                  />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">SYSTIK</span>
                  <span className="">Solve Your Issue</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-semibold">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}