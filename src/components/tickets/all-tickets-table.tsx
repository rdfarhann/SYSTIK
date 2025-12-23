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
  Ticket
} from "lucide-react"

/* ================= TYPES & INTERFACES ================= */
interface TicketData {
  id: string
  title: string
  category: string
  priority: string
  status: string
  date: string
}

/* ================= DATA DUMMY ================= */
const allTickets: TicketData[] = [
  { id: "T-2401", title: "Install Ulang PC Keuangan", category: "Hardware", priority: "High", status: "Open", date: "23/12/2025" },
  { id: "T-2402", title: "Lupa Password Email", category: "Account", priority: "Medium", status: "In Progress", date: "22/12/2025" },
  { id: "T-2403", title: "Printer Macet Lantai 2", category: "Hardware", priority: "Low", status: "Closed", date: "21/12/2025" },
  { id: "T-2404", title: "Akses VPN Bermasalah", category: "Network", priority: "High", status: "Canceled", date: "20/12/2025" },
  { id: "T-2405", title: "Update Aplikasi HRIS", category: "Software", priority: "Medium", status: "Open", date: "19/12/2025" },
  { id: "T-2406", title: "Keyboard Macet", category: "Hardware", priority: "Low", status: "Closed", date: "18/12/2025" },
]

export default function AllTicketsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const currentItems = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1 sm:px-0">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Search ticket..." 
            className="flex h-10 w-full rounded-xl border border-muted-foreground/20 bg-background px-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm font-medium transition-all"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 font-bold shadow-md rounded-xl border-muted-foreground/10"><Filter className="h-4 w-4" /> Filter</Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 font-bold shadow-md rounded-xl border-muted-foreground/10"><ArrowUpDown className="h-4 w-4" /> Sort</Button>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-2xl shadow-black/10 overflow-hidden bg-primary border-white/10">
        <div className="p-4 sm:p-6 text-background">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight drop-shadow-sm uppercase">Ticket Database</h2>
          <p className="text-xs sm:text-sm font-medium opacity-90">Total {filteredTickets.length} support activities monitored.</p>
        </div>

        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-[900px] w-full align-middle">
            <Table>
              <TableHeader className="bg-background shadow-sm">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[120px] py-4 px-6 font-bold text-foreground">ID TICKET</TableHead>
                  <TableHead className="min-w-[250px] py-4 font-bold text-foreground">TITLE</TableHead>
                  <TableHead className="py-4 font-bold text-foreground">CATEGORY</TableHead>
                  <TableHead className="py-4 font-bold text-foreground">PRIORITY</TableHead>
                  <TableHead className="py-4 font-bold text-foreground text-center">STATUS</TableHead>
                  <TableHead className="py-4 font-bold text-foreground text-center">DATE</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 text-right font-bold text-foreground">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/10 transition-all border-b last:border-0 border-background/20 group">
                      <TableCell className="py-4 px-6 font-mono font-bold text-background drop-shadow-sm">{ticket.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col text-background">
                          <span className="font-semibold leading-none drop-shadow-sm">{ticket.title}</span>
                          <span className="text-[11px] mt-1.5 uppercase tracking-tighter opacity-80 font-bold italic">Support Request</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-background">{ticket.category}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full shadow-sm border font-bold ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell className="py-4 text-center">{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell className="py-4 text-right font-medium text-background tabular-nums text-sm">{ticket.date}</TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <TicketDetailModal ticket={ticket} />
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-background hover:bg-white/20 hover:text-white"><MoreHorizontal className="h-4.5 w-4.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-background font-bold opacity-50 italic">No tickets found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between px-2 pb-10 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
        <span>Page {currentPage} / {totalPages || 1}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shadow-sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  )
}

/* ================= DETAIL MODAL COMPONENT (SIMPLE & FUNCTIONAL) ================= */
function TicketDetailModal({ ticket }: { ticket: TicketData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-background hover:bg-white/20 hover:text-white transition-all shadow-sm"
        >
          <Eye className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        {/* HEADER */}
        <div className="bg-primary px-8 py-10 text-background relative">
          <DialogHeader className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 opacity-70 mb-1">
              <Ticket className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Support Ticket</span>
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight uppercase">
              {ticket.id}
            </DialogTitle>
            <p className="text-lg font-medium opacity-90 leading-snug">
              {ticket.title}
            </p>
          </DialogHeader>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <DetailItem label="Category" value={ticket.category} />
            <DetailItem label="Priority" value={ticket.priority} isBadge priority={ticket.priority} />
          </div>

          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <DetailItem label="Date Created" value={ticket.date} />
            <DetailItem label="Status" value={ticket.status} isStatus />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Message</p>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              &quot;Informasi detail mengenai tiket ini tercatat secara otomatis oleh sistem. Silakan proses sesuai SOP.&quot;
            </p>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="px-8 py-4 bg-slate-50 flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="font-bold rounded-lg border-slate-200">
              Close View
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ================= DETAIL ITEM (SIMPLE TYPOGRAPHY) ================= */
function DetailItem({ label, value, isBadge, isStatus, priority }: { label: string, value: string, isBadge?: boolean, isStatus?: boolean, priority?: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      
      {isBadge ? (
        <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${
          priority === 'High' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
          priority === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 
          'bg-slate-50 text-slate-700 ring-slate-600/20'
        }`}>
          {value}
        </div>
      ) : isStatus ? (
        <p className="font-bold text-foreground text-base uppercase tracking-tight">
          {value}
        </p>
      ) : (
        <p className="font-semibold text-base text-slate-900 leading-none">
          {value}
        </p>
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
  const base = "px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-md border-b-2 active:translate-y-[1px] transition-all"
  if (status === "Open") return <Badge className={`${base} bg-blue-600 border-blue-800 text-white`}>Open</Badge>
  if (status === "In Progress") return <Badge className={`${base} bg-amber-500 border-amber-700 text-white`}>In Progress</Badge>
  if (status === "Closed") return <Badge className={`${base} bg-green-600 border-green-800 text-white`}>Closed</Badge>
  return <Badge className={`${base} bg-red-600 border-red-800 text-white`}>Canceled</Badge>
}