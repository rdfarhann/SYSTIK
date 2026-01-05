"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket as TicketIcon, Clock, CheckCircle2, XCircle, Activity } from "lucide-react"
import AllTicketsDetail from "@/components/tickets/all-tickets-detail"
import { Ticket } from "@/app/types/ticket"
import AllTicketsTable from "../tickets/all-tickets-table"

// Definisikan tipe data stats agar tidak menggunakan 'any'
interface DashboardStats {
  total: number
  open: number
  inProgress: number
  closed: number
  canceled: number
}

interface DashboardHeroProps {
  stats: DashboardStats // Ganti 'any' dengan interface DashboardStats
  tickets: Ticket[]
}

export default function DashboardHero({ stats, tickets }: DashboardHeroProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentFilter = searchParams.get("status") || "all"

  // Data untuk mapping card statistik
  const statConfig = [
    { label: "Total", val: stats.total, icon: TicketIcon, filter: "all", color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Open", val: stats.open, icon: Clock, filter: "open", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Progress", val: stats.inProgress, icon: Activity, filter: "in-progress", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Closed", val: stats.closed, icon: CheckCircle2, filter: "closed", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Canceled", val: stats.canceled, icon: XCircle, filter: "canceled", color: "text-red-600", bg: "bg-red-50" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statConfig.map((s) => (
          <Card 
            key={s.label}
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              if (s.filter === "all") p.delete("status"); else p.set("status", s.filter);
              router.push(`?${p.toString()}`);
            }}
            className={`p-4 cursor-pointer transition-all border-b-4 ${
              currentFilter === s.filter ? "border-primary bg-white shadow-sm" : "border-transparent bg-white/50"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.val}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-slate-800 uppercase tracking-tighter text-lg">
            Ticket Management
          </h2>
          <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[10px]">
            Filter: {currentFilter}
          </Badge>
        </div>
        
        <AllTicketsTable statusFilter={currentFilter} tickets={tickets} />
      </div>
    </div>
  )
}