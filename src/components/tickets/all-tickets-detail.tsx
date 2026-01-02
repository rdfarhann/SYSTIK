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
  Tag
} from "lucide-react"

/* ================= TYPES & INTERFACES ================= */
interface TicketData {
  id: string
  title: string
  category: string
  priority: string
  status: string
  date: string
  user: string
  department: string
}

interface AllTicketsDetailProps {
  statusFilter?: string
}

/* ================= DATA DUMMY ================= */
const allTickets: TicketData[] = [
  { id: "T-2401", title: "Install Ulang PC Keuangan", category: "Hardware", priority: "High", status: "Open", date: "23/12/2025", user: "Budi Santoso", department: "Finance" },
  { id: "T-2402", title: "Lupa Password Email", category: "Account", priority: "Medium", status: "In Progress", date: "22/12/2025", user: "Siti Aminah", department: "HRD" },
  { id: "T-2403", title: "Printer Macet Lantai 2", category: "Hardware", priority: "Low", status: "Closed", date: "21/12/2025", user: "Agus Setiawan", department: "Operations" },
  { id: "T-2404", title: "Akses VPN Bermasalah", category: "Network", priority: "High", status: "Canceled", date: "20/12/2025", user: "Dewi Lestari", department: "IT" },
  { id: "T-2415", title: "Ganti Toner Printer HR", category: "Hardware", priority: "Medium", status: "Open", date: "09/12/2025", user: "Farhan", department: "Administrator" },
];

export default function AllTicketsDetail({ statusFilter }: AllTicketsDetailProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => {
      const matchesSearch = 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.toLowerCase().includes(searchTerm.toLowerCase());

      const normalizedStatus = ticket.status.toLowerCase().replace(/\s+/g, '-');
      const matchesStatus = !statusFilter || statusFilter === 'all' || normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
  }, [searchTerm, statusFilter])

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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest h-10 px-4 flex-1 sm:flex-none">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest h-10 px-4 flex-1 sm:flex-none">
            <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
          </Button>
        </div>
      </div>

      {/* Vertical List Cards */}
      <div className="flex flex-col gap-3">
        {currentItems.length > 0 ? (
          currentItems.map((ticket) => (
            <Card key={ticket.id} className="group flex flex-col sm:flex-row items-center border-slate-200 hover:border-[#00843D]/30 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl overflow-hidden border-l-4 border-l-[#00843D]">
              
              {/* Bagian ID & Status (Kiri) */}
              <div className="flex flex-row sm:flex-col items-center justify-center p-4 bg-slate-50/50 min-w-[120px] gap-2 border-b sm:border-b-0 sm:border-r border-slate-100 w-full sm:w-auto">
                <span className="font-mono text-xs font-black text-[#00843D] bg-[#00843D]/10 px-2 py-1 rounded-lg">
                  {ticket.id}
                </span>
                {getStatusBadge(ticket.status)}
              </div>

              {/* Bagian Detail (Tengah) */}
              <div className="flex-1 p-5 space-y-2 w-full">
                <h3 className="font-bold text-slate-800 leading-tight group-hover:text-[#00843D] transition-colors line-clamp-1">
                  {ticket.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center text-[11px] font-semibold text-slate-500">
                    <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {ticket.user}
                  </div>
                  <div className="flex items-center text-[11px] font-semibold text-slate-500">
                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {ticket.department}
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {ticket.date}
                  </div>
                </div>
              </div>

              {/* Bagian Priority & Action (Kanan) */}
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
            className="h-9 w-9 rounded-xl shadow-sm disabled:opacity-30" 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl shadow-sm disabled:opacity-30" 
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

/* ================= HELPERS & SUB-COMPONENTS ================= */

function getStatusBadge(status: string) {
  const base = "px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-tighter border shadow-sm"
  if (status === "Open") return <Badge className={`${base} bg-emerald-50 text-emerald-600 border-emerald-100`}>Open</Badge>
  if (status === "In Progress") return <Badge className={`${base} bg-amber-50 text-amber-600 border-amber-100`}>In Progress</Badge>
  if (status === "Closed") return <Badge className={`${base} bg-slate-50 text-slate-500 border-slate-100`}>Closed</Badge>
  return <Badge className={`${base} bg-rose-50 text-rose-600 border-rose-100`}>Canceled</Badge>
}

function getPriorityStyle(priority: string) {
  if (priority === 'High') return 'border-red-100 bg-red-50 text-red-600'
  if (priority === 'Medium') return 'border-amber-100 bg-amber-50 text-amber-600'
  return 'border-slate-100 bg-slate-50 text-slate-500'
}

function TicketDetailModal({ ticket }: { ticket: TicketData }) {
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
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-mono px-3">{ticket.id}</Badge>
            {getStatusBadge(ticket.status)}
          </div>
          <DialogTitle className="text-2xl font-black leading-tight uppercase tracking-tighter">
            {ticket.title}
          </DialogTitle>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Requester</p>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#00843D]" />
                    <span className="text-sm font-bold text-slate-700">{ticket.user}</span>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Department</p>
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#00843D]" />
                    <span className="text-sm font-bold text-slate-700">{ticket.department}</span>
                </div>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Priority Level</span>
                <Badge variant="outline" className={`font-black ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</Badge>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Category</span>
                <span className="font-bold text-slate-700">{ticket.category}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Created Date</span>
                <span className="font-bold text-slate-700">{ticket.date}</span>
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