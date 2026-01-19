"use client"

import Link from "next/link"
import { Plus, LayoutDashboard } from "lucide-react"

interface DashboardHeroProps {
  userName: string
}

export default function DashboardHero({ userName }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-sm transition-all hover:border-emerald-200/50">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <LayoutDashboard className="h-64 w-64 -rotate-12 translate-x-12 -translate-y-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">
              Welcome back, <span className="text-primary">{userName}</span>!
            </h1>
            <p className="text-slate-500 max-w-lg text-xs md:text-sm font-medium leading-relaxed italic">
              Need technical assistance? Our IT team is ready to assist you. 
              Submit a new request and we`ll get back to you shortly.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link 
            href="/dashboard/my-ticket/new" 
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-primary/50 transition-all shadow-xl shadow-slate-200 active:scale-95 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create New Ticket
          </Link>
          
          <div className="hidden lg:block h-12 w-px bg-slate-100 mx-2" />
        </div>
      </div>
    </div>
  )
}