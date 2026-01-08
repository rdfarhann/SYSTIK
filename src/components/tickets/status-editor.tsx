"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Loader2, Check } from "lucide-react"

interface StatusEditorProps {
  ticketId: string | number
  initialStatus: string
  ownerId: string
}

export default function StatusEditor({ ticketId, initialStatus, ownerId }: StatusEditorProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const getStatusColor = (s: string) => {
    switch (s.toUpperCase()) {
      case "OPEN": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200"
      case "CANCELED": return "bg-amber-100 text-amber-700 border-amber-200"
      case "CLOSED": return "bg-slate-100 text-slate-600 border-slate-200"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return
    
    setIsLoading(true)
    try {
      // Konversi ke Number karena database menggunakan int8
      const numericId = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId

      // 1. Update Tabel Tickets
      const { data, error: ticketError } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", numericId)
        .select()

      if (ticketError) throw ticketError

      // Jika RLS memblokir, data akan kosong
      if (!data || data.length === 0) {
        throw new Error("Izin ditolak. Pastikan akun Anda memiliki role 'admin' di tabel profiles.")
      }

      // 2. Insert Log & Notifikasi (Parallel)
      await Promise.allSettled([
        supabase.from("ticket_logs").insert({
          ticket_id: numericId,
          status_update: `Status changed to ${newStatus.replace('_', ' ')}`,
          notes: "Updated by Admin System"
        }),
        supabase.from("notifications").insert({
          user_id: ownerId,
          ticket_id: numericId,
          title: "Update Tiket",
          message: `Tiket #${numericId} kini berstatus ${newStatus}`,
          is_read: false
        })
      ])

      setStatus(newStatus)
      router.refresh()
      
    } catch (err: unknown) {
      let errorMessage = "Terjadi kesalahan sistem"
      if (err instanceof Error) {
        errorMessage = err.message
      }
      console.error("Update Error:", err)
      alert(`Gagal: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const availableStatuses = ["OPEN", "IN_PROGRESS", "CANCELED", "CLOSED"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" disabled={isLoading}>
        <Badge className={`${getStatusColor(status)} border font-black px-3 py-1 rounded-full uppercase text-[10px] cursor-pointer hover:opacity-80 flex items-center gap-2 transition-all`}>
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              {status.replace('_', ' ')}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </>
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-1 rounded-2xl shadow-xl border-slate-200 bg-white font-bold">
        {availableStatuses.map((s) => (
          <DropdownMenuItem 
            key={s} 
            onClick={() => handleUpdate(s)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] uppercase cursor-pointer ${s === status ? "bg-slate-50 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {s.replace('_', ' ')}
            {s === status && <Check className="h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}