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
  ChevronLeft, 
  ChevronRight,
  User,
  Building2,
  Paperclip
} from "lucide-react"
import { Ticket } from "@/app/types/ticket"

interface AllTicketsTableProps {
  statusFilter?: string
  tickets: Ticket[]
}

export default function AllTicketsTable({ statusFilter, tickets }: AllTicketsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.profiles?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Normalisasi status DB (OPEN/IN_PROGRESS) ke URL Format (open/in-progress)
      const dbStatusFormatted = ticket.status.toLowerCase().replace('_', '-');
      const matchesStatus = !statusFilter || statusFilter === 'all' || dbStatusFormatted === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
  }, [searchTerm, statusFilter, tickets])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const currentItems = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
          <input 
            placeholder="Cari nomor tiket, judul, atau user..." 
            className="flex h-9 w-full rounded-lg border border-input bg-background px-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <Card className="border-none shadow-none">
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
                <TableCell className="px-6 font-mono font-bold text-primary">{ticket.ticket_no}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 leading-none">{ticket.title}</span>
                    <span className="text-[10px] mt-1 text-slate-500 font-medium uppercase tracking-tight">
                      {ticket.profiles?.full_name || "Unknown"} • {ticket.category}
                    </span>
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

      {/* Pagination */}
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

function getStatusBadge(status: string) {
  const base = "px-2 py-0 rounded-full font-bold text-[9px] uppercase tracking-wider text-white shadow-sm border-b-2"
  const s = status.toUpperCase()
  if (s === "OPEN") return <Badge className={`${base} bg-emerald-600 border-emerald-800`}>Open</Badge>
  if (s === "IN_PROGRESS") return <Badge className={`${base} bg-amber-500 border-amber-700`}>In Progress</Badge>
  if (s === "CLOSED") return <Badge className={`${base} bg-slate-500 border-slate-700`}>Closed</Badge>
  return <Badge className={`${base} bg-red-600 border-red-800`}>Canceled</Badge>
}

function TicketDetailModal({ ticket }: { ticket: Ticket }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-background transition-all hover:bg-primary"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-xl bg-white">
        <div className="bg-primary px-6 py-5 text-white">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">{ticket.ticket_no}</DialogTitle>
          <p className="text-xs font-medium opacity-90 truncate">{ticket.title}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Requester</p><p className="font-bold text-xs text-slate-800 flex items-center justify-center truncate"><User className="h-3 w-3 mr-1" />{ticket.profiles?.full_name}</p></div>
            <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Category</p><p className="font-bold text-xs text-slate-800 flex items-center justify-center"><Building2 className="h-3 w-3 mr-1" />{ticket.category}</p></div>
          </div>
          
          <div className="space-y-1">
            <p className="text-[8px] font-bold text-slate-400 uppercase">Description</p>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100 italic">
              &quot;{ticket.description}&quot;
            </p>
          </div>

          {/* Menampilkan Gambar Lampiran jika ada */}
          {ticket.attachment_url && (
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Paperclip className="h-2 w-2" /> Attachment
              </p>
              <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                <img src={ticket.attachment_url} alt="Attachment" className="w-full h-32 object-cover" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center">
             <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Status</p><p className="font-black text-primary text-xs uppercase">{ticket.status}</p></div>
             <div><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Priority</p><Badge variant="outline" className={`rounded-full text-[9px]`}>{ticket.priority}</Badge></div>
          </div>
          <DialogClose asChild><Button className="w-full mt-2">Close View</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}