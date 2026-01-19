"use client"

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // 1. Logika Pemetaan Label secara Profesional
  const getLabel = () => {
    if (pathname === "/dashboard") return null // Sembunyikan jika di root dashboard
    if (pathname.includes("/admin/tickets")) return "Ticket Management"
    if (pathname.includes("/my-ticket")) return "My Tickets"
    if (pathname.includes("/profile")) return "Account Settings"
    return "Overview"
  }

  const label = getLabel()
  const isDetail = pathname.split("/").length > 4

  // Jangan tampilkan apa pun jika hanya di halaman dashboard utama
  if (!label) return <span className="text-[13px] font-medium text-slate-900">Dashboard</span>

  return (
    <nav className="flex items-center select-none">
      <div className="flex items-center gap-2">
        {/* Root Label - Selalu statis & muted */}
        <span className="text-[12px] font-medium text-slate-400 tracking-tight">
          Dashboard
        </span>
        
        <ChevronRight className="h-3 w-3 text-slate-300 stroke-[3px]" />

        {/* Active Page Label */}
        <span className={`text-[12px] tracking-tight transition-colors ${
          isDetail ? "font-medium text-slate-400" : "font-semibold text-slate-900"
        }`}>
          {label}
        </span>

        {/* Detail Indicator - Hanya muncul jika masuk ke ID tiket */}
        {isDetail && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-300 stroke-[3px]" />
            <span className="text-[12px] font-semibold text-primary tracking-tight bg-primary/5 px-2 py-0.5 rounded-md">
              Detail View
            </span>
          </>
        )}
      </div>
    </nav>
  )
}