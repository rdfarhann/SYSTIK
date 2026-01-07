"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { updateTicketStatus } from "@/app/actions/ticket-actions" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { 
  Search, 
  User, 
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageCircle,
  Phone,
  Settings2,
  CheckCircle2
} from "lucide-react"
import { Ticket } from "@/app/types/ticket"

interface AllTicketsDetailProps {
  statusFilter?: string
  tickets: Ticket[]
}

export default function AllTicketsDetail({ statusFilter, tickets }: AllTicketsDetailProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.ticket_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.profiles?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const normalizedStatus = ticket.status.toLowerCase().replace(/_/g, '-');
      const matchesStatus = !statusFilter || statusFilter === 'all' || normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
  }, [searchTerm, statusFilter, tickets])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const currentItems = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Search for ID, Title, or sender name..." 
            className="flex h-10 w-full rounded-xl border border-input bg-white px-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid gap-4">
        {currentItems.length > 0 ? (
          currentItems.map((ticket) => (
            <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    #{ticket.ticket_no || ticket.id.toString().slice(0, 8)}
                  </span>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {ticket.title || "No Title"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <User className="h-3 w-3" /> {ticket.profiles?.full_name || "Unknown"}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-4 italic">
                {"\""}{ticket.description}{"\""}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                </div>
                <TicketDetailModal ticket={ticket} />
              </div>
            </div>
          ))
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <AlertCircle className="h-10 w-10 text-slate-200 mb-2" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No tickets found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Page {currentPage} dari {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" size="icon" className="h-9 w-9 rounded-xl shadow-sm" 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" size="icon" className="h-9 w-9 rounded-xl shadow-sm" 
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase() || "UNKNOWN"
  const styles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
    CLOSED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELED: "bg-slate-100 text-slate-600 border-slate-200",
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[s] || "bg-slate-50 text-slate-500"}`}>
      {s.replace("_", " ")}
    </span>
  )
}

function TicketDetailModal({ ticket }: { ticket: Ticket }) {
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(ticket.status)
  const router = useRouter()

  async function handleAdminAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const status = formData.get("status") as string
    const note = formData.get("note") as string

    try {
      await updateTicketStatus(Number(ticket.id), status, note)
      
      // Sinkronisasi UI Seketika
      setCurrentStatus(status) 
      router.refresh() // Mengupdate list tiket di background
      
      alert("Status tiket berhasil diperbarui!")
    } catch (err) {
      console.error(err)
      alert("Gagal memperbarui tiket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
          Progress Details →
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
        {/* Header Modal - Warna mengikuti Primary Green */}
        <div className="bg-primary p-8 text-white relative">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-mono px-3">
                #{ticket.ticket_no || ticket.id.toString().slice(0, 8)}
            </Badge>
            <StatusBadge status={currentStatus} />
          </div>
          <DialogTitle className="text-2xl font-black leading-tight uppercase tracking-tighter">
            {ticket.title}
          </DialogTitle>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Section: Admin Action Panel */}
          <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Settings2 className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Update Progres</span>
            </div>
            
            <form onSubmit={handleAdminAction} className="space-y-3">
              <select 
                name="status"
                defaultValue={currentStatus}
                className="w-full h-10 rounded-xl bg-white border border-emerald-200 text-xs font-bold px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
                <option value="CANCELED">CANCELED</option>
              </select>
              
              <input 
                name="note"
                placeholder="Tulis catatan (mis: Sedang diperbaiki IT)..."
                className="w-full h-10 rounded-xl bg-white border border-emerald-200 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-bold text-xs uppercase transition-all shadow-md shadow-emerald-200"
              >
                {loading ? "Memproses..." : "Simpan Perubahan"}
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Section: Requester Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pelapor</p>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-slate-700">{ticket.profiles?.full_name || "Unknown"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Kontak</p>
                <div className="flex items-center gap-2 justify-end text-primary">
                    <span className="text-xs font-bold">{ticket.phone_number || "-"}</span>
                    <Phone className="h-3.5 w-3.5" />
                </div>
              </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Kendala</p>
              <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                &quot;{ticket.description}&quot;
              </p>
            </div>

            {ticket.attachment_url && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lampiran</p>
                <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 group">
                  <img 
                    src={ticket.attachment_url} 
                    alt="Attachment" 
                    className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
             <div className="flex flex-col">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Prioritas</span>
                <span className="text-xs font-black uppercase text-slate-700">{ticket.priority}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Kategori</span>
                <span className="text-xs font-black text-slate-700 uppercase">{ticket.category}</span>
             </div>
          </div>

          <DialogClose asChild>
            <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 text-xs">
              Tutup Pratinjau
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}