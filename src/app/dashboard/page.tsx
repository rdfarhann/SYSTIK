import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import type { RowDataPacket } from "mysql2"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface DashboardUser {
  id: number
  name: string
  email: string
  employee_id: string
}

export default async function Page() {
  
  const cookieStore = await cookies()
  const isLogin = cookieStore.get("login")
  const userId = cookieStore.get("user_id")?.value

  
  if (!isLogin || !userId) {
    redirect("/login")
  }

 
  const [rows] = await db.query<RowDataPacket[] & DashboardUser[]>(
    "SELECT id, name, email, employee_id FROM users WHERE id = ? LIMIT 1",
    [userId]
  )

 
  if (rows.length === 0) {
    redirect("/login")
  }

  const user = rows[0]

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* 👤 USER INFO */}
            <div className="text-right">
              <p className="text-sm font-medium">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email} · {user.employee_id}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
