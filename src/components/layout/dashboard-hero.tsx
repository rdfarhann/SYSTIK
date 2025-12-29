"use client"

import Link from "next/link" // Import Link
import {
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  LucideIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import CreateTicketModal from "../tickets/create-ticket-modal"
import AllTicketsTable from "../tickets/all-tickets-table"

export default function DashboardHero() {
  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-1 sm:px-0">
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl border p-4 sm:p-6 bg-background shadow-xl shadow-primary/10 border-foreground text-foreground hover:bg-primary hover:text-background ">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border shadow-2xl shrink-0">
              <Ticket className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate ">SYSTIK</h1> 
              <p className="text-xs sm:text-sm truncate font-medium">System Ticketing & Support Internal</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              <CreateTicketModal/>
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS DENGAN HREF ================= */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Ticket" value="128" description="All tickets" icon={Ticket} href="/dashboard/tickets" />
        <StatCard title="Open" value="34" description="Waiting to be processed" icon={Clock} href="/dashboard/tickets?status=open" />
        <StatCard title="In Progress" value="56" description="Being worked on" icon={Loader} spin href="/dashboard/tickets?status=in-progress" />
        <StatCard title="Closed" value="30" description="Finished" icon={CheckCircle} href="/dashboard/tickets?status=closed" />
        <StatCard title="Canceled" value="8" description="Failed or Canceled" icon={XCircle} href="/dashboard/tickets?status=canceled" />
      </div>

      {/* ================= TICKET LIST TABLE ================= */}
      <div className="w-full">
        <AllTicketsTable />
      </div>
    </div>
  )
}

/* ================= STAT CARD SUB-COMPONENT (Updated with href) ================= */
function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  spin = false,
  href = "#" // Default href jika lupa diisi
}: { 
  title: string, 
  value: string, 
  description: string, 
  icon: LucideIcon, 
  spin?: boolean,
  href?: string 
}) {
  return (
    // Membungkus Card dengan Link agar seluruh area bisa diklik
    <Link href={href} className="block no-underline">
      <Card className="rounded-xl p-3 sm:p-4 transition-all hover:scale-[1.03] bg-background text-foreground border-foreground shadow-md group hover:rotate-1 hover:bg-primary hover:text-background h-full cursor-pointer">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">{title}</p>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${spin ? "animate-spin" : ""}`} />
        </div>
        <p className="mt-2 sm:mt-3 text-xl sm:text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-[9px] sm:text-[10px] italic line-clamp-1">{description}</p>
      </Card>
    </Link>
  )
}