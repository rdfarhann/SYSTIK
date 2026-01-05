"use client"

import React, { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { 
  Eye, 
  Search, 
  Filter, 
  ArrowUpDown, 
  User, 
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Tag,
  Paperclip
} from "lucide-react"
// Impor tipe Ticket yang sudah kita buat sebelumnya
import { Ticket } from "@/app/types/ticket"

interface AllTicketsDetailProps {
  statusFilter?: string
  tickets: Ticket[] // Sekarang menerima data dari props
}

export default function AllTicketsDetail({ statusFilter, tickets }: AllTicketsDetailProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredTickets = useMemo(() => {
    // Menggunakan data 'tickets' dari props, bukan dummy lagi
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.profiles?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Normalisasi status database (OPEN/IN_PROGRESS) agar cocok dengan filter URL
      const normalizedStatus = ticket.status.toLowerCase().replace(/_/g, '-');
      const matchesStatus = !statusFilter || statusFilter === 'all' || normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
  }, [searchTerm, statusFilter, tickets])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const currentItems = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-5">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#00843D] transition-colors" />
          <input 
            placeholder="Cari ID, judul, atau nama pengirim..." 
            className="flex h-10 w-full rounded-xl border border-input bg-white px-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00843D]/20 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Vertical List Cards */}
      <div className="flex flex-col gap-3">
        {currentItems.length > 0 ? (
          currentItems.map((ticket) => (
            <Card key={ticket.id} className="group flex flex-col sm:flex-row items-center border-slate-200 hover:border-[#00843D]/30 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl overflow-hidden border-l-4 border-l-[#00843D]">
              
              {/* Bagian ID & Status */}
              <div className="flex flex-row sm:flex-col items-center justify-center p-4 bg-slate-50/50 min-w-[140px] gap-2 border-b sm:border-b-0 sm:border-r border-slate-100 w-full sm:w-auto">
                <span className="font-mono text-[10px] font-black text-[#00843D] bg-[#00843D]/10 px-2 py-1 rounded-lg">
                  {ticket.ticket_no}
                </span>
                {getStatusBadge(ticket.status)}
              </div>

              {/* Bagian Detail */}
              <div className="flex-1 p-5 space-y-2 w-full">
                <h3 className="font-bold text-slate-800 leading-tight group-hover:text-[#00843D] transition-colors line-clamp-1">
                  {ticket.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center text-[11px] font-semibold text-slate-500">
                    <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {ticket.profiles?.full_name || "Unknown"}
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                  </div>
                  {ticket.attachment_url && (
                    <div className="flex items-center text-[11px] font-bold text-emerald-600">
                      <Paperclip className="h-3.5 w-3.5 mr-1" /> Attached
                    </div>
                  )}
                </div>
              </div>

              {/* Bagian Priority & Action */}
              <div className="flex items-center gap-4 px-6 py-4 sm:py-0 bg-slate-50/30 sm:bg-transparent w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-[9px] font-black uppercase ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority}
                    </Badge>
                    <div className="hidden lg:flex items-center text-[10px] font-bold text-slate-400 uppercase">
                        <Tag className="h-3 w-3 mr-1" /> {ticket.category}
                    </div>
                </div>
                <TicketDetailModal ticket={ticket} />
              </div>

            </Card>
          ))
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <AlertCircle className="h-10 w-10 text-slate-200 mb-2" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tidak ada tiket ditemukan</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Halaman {currentPage} dari {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl shadow-sm" 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl shadow-sm" 
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

/* ================= HELPERS ================= */

function getStatusBadge(status: string) {
  const base = "px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-tighter border shadow-sm"
  const s = status.toUpperCase()
  if (s === "OPEN") return <Badge className={`${base} bg-emerald-50 text-emerald-600 border-emerald-100`}>Open</Badge>
  if (s === "IN_PROGRESS") return <Badge className={`${base} bg-amber-50 text-amber-600 border-amber-100`}>In Progress</Badge>
  if (s === "CLOSED") return <Badge className={`${base} bg-slate-50 text-slate-500 border-slate-100`}>Closed</Badge>
  return <Badge className={`${base} bg-rose-50 text-rose-600 border-rose-100`}>Canceled</Badge>
}

function getPriorityStyle(priority: string) {
  const p = priority.toUpperCase()
  if (p === 'HIGH') return 'border-red-100 bg-red-50 text-red-600'
  if (p === 'MEDIUM') return 'border-amber-100 bg-amber-50 text-amber-600'
  return 'border-slate-100 bg-slate-50 text-slate-500'
}

function TicketDetailModal({ ticket }: { ticket: Ticket }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest hover:bg-[#00843D] hover:text-white transition-all shadow-sm">
          <Eye className="h-4 w-4 mr-2" /> Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] bg-white">
        <div className="bg-[#00843D] p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-mono px-3">{ticket.ticket_no}</Badge>
            {getStatusBadge(ticket.status)}
          </div>
          <DialogTitle className="text-2xl font-black leading-tight uppercase tracking-tighter">
            {ticket.title}
          </DialogTitle>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Requester</p>
              <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#00843D]" />
                  <span className="text-sm font-bold text-slate-700">{ticket.profiles?.full_name || "Unknown"}</span>
              </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Description</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">&quot;{ticket.description}&quot;</p>
            </div>

            {ticket.attachment_url && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase">Attachment</p>
                <div className="rounded-xl border overflow-hidden">
                  <img src={ticket.attachment_url} alt="Attachment" className="w-full h-32 object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
             <div className="flex flex-col">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Priority Level</span>
                <span className={`text-xs font-black uppercase ${getPriorityStyle(ticket.priority).split(' ')[2]}`}>{ticket.priority}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Category</span>
                <span className="text-xs font-black text-slate-700 uppercase">{ticket.category}</span>
             </div>
          </div>

          <DialogClose asChild>
            <Button className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest bg-[#00843D] hover:bg-[#006830] shadow-lg shadow-[#00843D]/20 mt-4">
              Tutup Pratinjau
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}