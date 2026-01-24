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
      case "OPEN": return "bg-background text-primary border-emerald-200"
      case "IN_PROGRESS": return "bg-background text-blue-700 border-blue-200"
      case "CANCELED": return "bg-background text-amber-700 border-amber-200"
      case "CLOSED": return "bg-background text-slate-600 border-slate-200"
      default: return "bg-background text-slate-700"
    }
  }

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return
    
    setIsLoading(true)
    try {
      const numericId = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId
      const { data, error: ticketError } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", numericId)
        .select()

      if (ticketError) throw ticketError

      if (!data || data.length === 0) {
        throw new Error("Izin ditolak. Pastikan akun Anda memiliki role 'admin' di tabel profiles.")
      }

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
          message: `Ticket #${numericId} status update to ${newStatus}`,
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
  <DropdownMenuTrigger asChild disabled={isLoading}>
    <button className="group outline-none flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:border-primary transition-all active:scale-95 disabled:opacity-50">
      <span className="bg-slate-50 px-2 py-1.5 border-r border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
        Update Status
      </span>
      <div className="px-3 py-1.5 flex items-center gap-2">
        <span className={`${getStatusColor(status)} text-[10px] font-black uppercase tracking-wide`}>
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            status.replace('_', ' ')
          )}
        </span>
        <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
      </div>
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent 
    align="start" 
    sideOffset={8}
    className="w-52 p-1.5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-200 bg-white"
  >
    <div className="px-3 py-2 mb-1 border-b border-slate-50">
       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Select New Status</p>
    </div>
    
    {availableStatuses.map((s) => (
      <DropdownMenuItem 
        key={s} 
        onClick={() => handleUpdate(s)}
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase cursor-pointer transition-colors ${
          s === status 
            ? "bg-primary text-background" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(s).replace('text-', 'bg-')}`} />
           {s.replace('_', ' ')}
        </div>
        {s === status && <Check className="h-3 w-3 stroke-[3]" />}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
  )
}