"use client"

import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { 
  Eye, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Ticket,
  User,
  Building2
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

/* ================= DATA DUMMY ================= */
const allTickets: TicketData[] = [
  { id: "T-2401", title: "Install Ulang PC Keuangan", category: "Hardware", priority: "High", status: "Open", date: "23/12/2025", user: "Budi Santoso", department: "Finance" },
  { id: "T-2402", title: "Lupa Password Email", category: "Account", priority: "Medium", status: "In Progress", date: "22/12/2025", user: "Siti Aminah", department: "HRD" },
  { id: "T-2403", title: "Printer Macet Lantai 2", category: "Hardware", priority: "Low", status: "Closed", date: "21/12/2025", user: "Agus Setiawan", department: "Operations" },
  { id: "T-2404", title: "Akses VPN Bermasalah", category: "Network", priority: "High", status: "Canceled", date: "20/12/2025", user: "Dewi Lestari", department: "IT" },
  { id: "T-2405", title: "Update Aplikasi HRIS", category: "Software", priority: "Medium", status: "Open", date: "19/12/2025", user: "Eko Prasetyo", department: "HRD" },
  { id: "T-2406", title: "Keyboard Macet", category: "Hardware", priority: "Low", status: "Closed", date: "18/12/2025", user: "Indah Permata", department: "Finance" },
  { id: "T-2407", title: "Setting Email Outlook Baru", category: "Account", priority: "Medium", status: "Open", date: "17/12/2025", user: "Rian Hidayat", department: "Sales" },
  { id: "T-2408", title: "Layar Monitor Bergaris", category: "Hardware", priority: "High", status: "In Progress", date: "16/12/2025", user: "Maya Safitri", department: "Marketing" },
  { id: "T-2409", title: "Wifi Lemot di Meeting Room", category: "Network", priority: "Medium", status: "Open", date: "15/12/2025", user: "Dedi Kurniawan", department: "General Affairs" },
  { id: "T-2410", title: "Error Input Data Sales", category: "Software", priority: "High", status: "Closed", date: "14/12/2025", user: "Ani Wijaya", department: "Sales" },
  { id: "T-2411", title: "Request Mouse Wireless", category: "Hardware", priority: "Low", status: "Open", date: "13/12/2025", user: "Fajar Nugraha", department: "Finance" },
  { id: "T-2412", title: "Integrasi API Payment", category: "Software", priority: "High", status: "In Progress", date: "12/12/2025", user: "Kevin Sanjaya", department: "IT" },
  { id: "T-2413", title: "Kabel LAN Terputus", category: "Network", priority: "Medium", status: "Closed", date: "11/12/2025", user: "Siska Putri", department: "Warehouse" },
  { id: "T-2414", title: "Izin Instalasi Photoshop", category: "Software", priority: "Low", status: "Canceled", date: "10/12/2025", user: "Bambang Sugio", department: "Creative" },
  { id: "T-2415", title: "Ganti Toner Printer HR", category: "Hardware", priority: "Medium", status: "Open", date: "09/12/2025", user: "Raden Muhamad Farhan", department: "Administrator" },
];

export default function AllTicketsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const currentItems = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
          <input 
            placeholder="Cari tiket atau user..." 
            className="flex h-9 w-full rounded-lg border border-input bg-background px-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="rounded-lg font-semibold"><Filter className="h-3.5 w-3.5 mr-2" /> Filter</Button>
          <Button variant="outline" size="sm" className="rounded-lg font-semibold"><ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Sort</Button>
        </div>
      </div>

      <Card className="rounded-xl border shadow-sm overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200">
                <TableHead className="w-[100px] font-bold text-slate-700 px-6">ID</TableHead>
                <TableHead className="font-bold text-slate-700">TITLE & REQUESTER</TableHead>
                <TableHead className="font-bold text-slate-700 text-center">PRIORITY</TableHead>
                <TableHead className="font-bold text-slate-700 text-center">STATUS</TableHead>
                <TableHead className="font-bold text-slate-700 text-center">DATE</TableHead>
                <TableHead className="w-[100px] text-right font-bold text-slate-700 px-6">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0">
                  <TableCell className="px-6 font-mono font-bold text-primary">{ticket.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 leading-none">{ticket.title}</span>
                      <span className="text-[10px] mt-1 text-slate-500 font-medium uppercase tracking-tight">{ticket.user} • {ticket.department}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`px-2 py-0 rounded-full text-[10px] font-bold ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell className="text-center text-xs font-medium text-slate-600">{ticket.date}</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <TicketDetailModal ticket={ticket} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Page {currentPage} of {totalPages || 1}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  )
}

/* ================= COMPACT DETAIL MODAL ================= */
function TicketDetailModal({ ticket }: { ticket: TicketData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-primary transition-all shadow-sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-xl bg-white">
        {/* Header Ramping (Warna Hijau) */}
        <div className="bg-primary px-6 py-5 text-white relative">
          <div className="relative z-10 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 opacity-80">
              <Ticket className="h-3 w-3" />
              <span className="text-[8px] font-black tracking-[0.2em] uppercase">Support Ticket</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase leading-none">{ticket.id}</DialogTitle>
            <p className="text-xs font-medium opacity-90 truncate">{ticket.title}</p>
          </div>
        </div>

        {/* Content Ramping */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <DetailItem label="Requester" value={ticket.user} icon={<User className="h-3 w-3 mr-1" />} />
            <DetailItem label="Dept" value={ticket.department} icon={<Building2 className="h-3 w-3 mr-1" />} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Category" value={ticket.category} />
            <DetailItem label="Priority" value={ticket.priority} isBadge priority={ticket.priority} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <DetailItem label="Created At" value={ticket.date} />
            <DetailItem label="Current Status" value={ticket.status} isStatus />
          </div>

          <div className="pt-3 border-t border-slate-50">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">
              * Detail tercatat otomatis oleh sistem.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 flex justify-end border-t">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg px-4 border-slate-200">
              Close View
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ================= COMPACT DETAIL ITEM ================= */
function DetailItem({ label, value, isBadge, isStatus, priority, icon }: { label: string, value: string, isBadge?: boolean, isStatus?: boolean, priority?: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {isBadge ? (
        <Badge variant="outline" className={`px-2.5 py-0 rounded-full text-[9px] font-bold ${getPriorityStyle(priority || '')}`}>
          {value}
        </Badge>
      ) : isStatus ? (
        <p className={`font-black text-base uppercase tracking-tighter ${
          value === 'Open' ? 'text-emerald-600' : 
          value === 'In Progress' ? 'text-amber-500' : 
          value === 'Closed' ? 'text-slate-500' : 'text-red-600'
        }`}>{value}</p>
      ) : (
        <p className="font-bold text-xs text-slate-800 flex items-center">{icon}{value}</p>
      )}
    </div>
  )
}

/* ================= HELPERS ================= */
function getPriorityStyle(priority: string) {
  if (priority === 'High') return 'border-red-200 bg-red-50 text-red-600'
  if (priority === 'Medium') return 'border-amber-200 bg-amber-50 text-amber-600'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

function getStatusBadge(status: string) {
  const base = "px-2 py-0 rounded-full font-bold text-[9px] uppercase tracking-wider shadow-sm border-b-2 inline-block mx-auto text-white"
  if (status === "Open") return <Badge className={`${base} bg-emerald-600 border-emerald-800`}>Open</Badge>
  if (status === "In Progress") return <Badge className={`${base} bg-amber-500 border-amber-700`}>In Progress</Badge>
  if (status === "Closed") return <Badge className={`${base} bg-slate-500 border-slate-700`}>Closed</Badge>
  return <Badge className={`${base} bg-red-600 border-red-800`}>Canceled</Badge>
}