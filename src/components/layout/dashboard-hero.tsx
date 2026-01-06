"use client"

import React from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

interface DashboardHeroProps {
  userName: string
}

export default function DashboardHero({ userName }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome to SYSTIK, {userName}! 👋
          </h1>
          <p className="text-emerald-50 opacity-90 max-w-xl text-sm md:text-base">
            Need technical assistance? Our IT team is ready to assist you.
            Click the button next to create a new support request.
          </p>
        </div>
        
        <Link 
          href="/dashboard/my-ticket/new" 
          className="flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm shrink-0 active:scale-95"
        >
          <PlusCircle className="h-5 w-5" />
          Create New Ticket
        </Link>
      </div>

      {/* Dekorasi Estetik Background */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-40 w-40 bg-black/5 rounded-full blur-2xl"></div>
    </div>
  )
}