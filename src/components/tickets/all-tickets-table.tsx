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

interface AllTicketsTableProps {
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

export default function AllTicketsTable({ statusFilter }: AllTicketsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
          <input 
            placeholder="Cari tiket atau user..." 
            className="flex h-9 w-full rounded-lg border border-input bg-background px-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg font-semibold"><Filter className="h-3.5 w-3.5 mr-2" /> Filter</Button>
          <Button variant="outline" size="sm" className="rounded-lg font-semibold"><ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Sort</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-6 font-bold text-slate-700">ID</TableHead>
              <TableHead className="font-bold text-slate-700">TITLE & REQUESTER</TableHead>
              <TableHead className="text-center font-bold text-slate-700">STATUS</TableHead>
              <TableHead className="text-right px-6 font-bold text-slate-700">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? currentItems.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="px-6 font-mono font-bold text-primary">{ticket.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 leading-none">{ticket.title}</span>
                    <span className="text-[10px] mt-1 text-slate-500 font-medium uppercase tracking-tight">{ticket.user} • {ticket.department}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className="px-6 text-right">
                    <TicketDetailModal ticket={ticket} />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium">Tidak ada tiket ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Page {currentPage} of {totalPages || 1}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  )
}

/* ================= HELPERS & SUB-COMPONENTS ================= */
function getStatusBadge(status: string) {
  const base = "px-2 py-0 rounded-full font-bold text-[9px] uppercase tracking-wider text-white shadow-sm border-b-2"
  if (status === "Open") return <Badge className={`${base} bg-emerald-600 border-emerald-800`}>Open</Badge>
  if (status === "In Progress") return <Badge className={`${base} bg-amber-500 border-amber-700`}>In Progress</Badge>
  if (status === "Closed") return <Badge className={`${base} bg-slate-500 border-slate-700`}>Closed</Badge>
  return <Badge className={`${base} bg-red-600 border-red-800`}>Canceled</Badge>
}

function getPriorityStyle(priority: string) {
  if (priority === 'High') return 'border-red-200 bg-red-50 text-red-600'
  if (priority === 'Medium') return 'border-amber-200 bg-amber-50 text-amber-600'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

function TicketDetailModal({ ticket }: { ticket: TicketData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-background transition-all"><Eye className="h-4 w-4" /></Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-xl bg-white">
        <div className="bg-primary px-6 py-5 text-white">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">{ticket.id}</DialogTitle>
          <p className="text-xs font-medium opacity-90 truncate">{ticket.title}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Requester</p><p className="font-bold text-xs text-slate-800 flex items-center justify-center"><User className="h-3 w-3 mr-1" />{ticket.user}</p></div>
            <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Dept</p><p className="font-bold text-xs text-slate-800 flex items-center justify-center"><Building2 className="h-3 w-3 mr-1" />{ticket.department}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
             <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Status</p><p className="font-black text-emerald-600 uppercase">{ticket.status}</p></div>
             <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Priority</p><Badge variant="outline" className={`rounded-full text-[9px] ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</Badge></div>
          </div>
          <DialogClose asChild><Button className="w-full mt-4">Close View</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}