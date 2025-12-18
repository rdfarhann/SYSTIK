import { redirect } from "next/navigation"

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  /* ================= AUTH ================= */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  /* ================= PROFILE ================= */
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, employee_id")
    .eq("id", user.id)
    .single()

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "User"

  const displayEmail = user.email ?? "-"
  const displayId = profile?.employee_id ?? "No ID"

  return (
    <SidebarProvider>
      {/* ================= SIDEBAR ================= */}
      <AppSidebar userProfile={{
        full_name: profile?.full_name,
        email: user.email,
      }}></AppSidebar>
      

      {/* ================= MAIN ================= */}
      <main className="flex min-h-screen flex-1 flex-col">
        {/* ---------- HEADER ---------- */}
        <header className="flex h-16 items-center border-b px-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />

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

            <div className="text-right">
              <p className="text-sm font-semibold uppercase">
                {displayName}
              </p>
              <p className="mt-1 text-[10px] leading-none text-muted-foreground">
                {displayEmail}
                <span className="mx-1">•</span>
                {displayId}
              </p>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4 p-4">
          {!profile?.full_name && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700">
              Info: Profil Anda belum lengkap. Hubungi Admin untuk
              memperbarui Nama dan ID Karyawan.
            </div>
          )}

          {/* <div className="grid gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl border bg-muted/50" />
            <div className="aspect-video rounded-xl border bg-muted/50" />
            <div className="aspect-video rounded-xl border bg-muted/50" />
          </div>

          <div className="flex-1 rounded-xl border border-dashed bg-muted/50" /> */}
        </section>
      </main>
    </SidebarProvider>
  )
}
