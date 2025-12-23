"use client"

import React, { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Eye, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react"

// DATA DUMMY
const allTickets = [
  { id: "T-2401", title: "Install Ulang PC Keuangan", category: "Hardware", priority: "High", status: "Open", date: "23/12/2025" },
  { id: "T-2402", title: "Lupa Password Email", category: "Account", priority: "Medium", status: "In Progress", date: "22/12/2025" },
  { id: "T-2403", title: "Printer Macet Lantai 2", category: "Hardware", priority: "Low", status: "Closed", date: "21/12/2025" },
  { id: "T-2404", title: "Akses VPN Bermasalah", category: "Network", priority: "High", status: "Canceled", date: "20/12/2025" },
  { id: "T-2405", title: "Update Aplikasi HRIS", category: "Software", priority: "Medium", status: "Open", date: "19/12/2025" },
  { id: "T-2406", title: "Keyboard Macet", category: "Hardware", priority: "Low", status: "Closed", date: "18/12/2025" },
  { id: "T-2407", title: "Setting Email Outlook", category: "Account", priority: "Medium", status: "In Progress", date: "17/12/2025" },
  { id: "T-2408", title: "Internet Lambat di Ruang Rapat", category: "Network", priority: "High", status: "Open", date: "16/12/2025" },
]

export default function AllTicketsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTickets = allTickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* ================= TOOLS: SEARCH & FILTER ================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-1 sm:px-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ticket ID or title..." 
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 font-semibold">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 font-semibold">
            <ArrowUpDown className="h-4 w-4" /> Sort
          </Button>
        </div>
      </div>

      {/* ================= TABLE AREA (MATCHED DESIGN) ================= */}
      <Card className="rounded-2xl border shadow-md overflow-hidden bg-primary">
        <div className="p-4 sm:p-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-background uppercase">Ticket Database</h2>
            <p className="text-xs sm:text-sm text-background font-medium opacity-90">manage and monitor all support activities.</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-[800px] w-full align-middle">
            <Table>
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="w-[120px] py-4 px-6 font-bold text-foreground">ID TICKET</TableHead>
                  <TableHead className="min-w-[250px] py-4 font-bold text-foreground">TITLE</TableHead>
                  <TableHead className="py-4 font-bold text-foreground">CATEGORY</TableHead>
                  <TableHead className="py-4 font-bold text-foreground">PRIORITY</TableHead>
                  <TableHead className="py-4 font-bold text-foreground text-center">STATUS</TableHead>
                  <TableHead className="py-4 font-bold text-foreground text-right">DATE</TableHead>
                  <TableHead className="w-[100px] py-4 px-6 text-right font-bold text-foreground">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/30 transition-all border-b last:border-0 border-background/20">
                      <TableCell className="py-4 px-6 font-mono font-bold text-background">
                        {ticket.id}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-background leading-none">{ticket.title}</span>
                          <span className="text-[11px] text-background mt-1.5 uppercase tracking-tighter opacity-80">Support Request</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-background">
                        {ticket.category}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full whitespace-nowrap font-bold ${getPriorityStyle(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="py-4 text-right font-medium text-background tabular-nums text-sm whitespace-nowrap">
                        {ticket.date}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-background hover:bg-primary/10 hover:text-white">
                            <Eye className="h-4.5 w-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-background">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-background font-medium">
                      No tickets match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
      
      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between px-2 pb-4">
        <p className="text-xs text-muted-foreground font-medium">
          Showing <strong>{filteredTickets.length}</strong> of <strong>{allTickets.length}</strong> entries
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 font-semibold" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="h-8 font-semibold">Next</Button>
        </div>
      </div>
    </div>
  )
}

/* ================= HELPER FUNCTIONS (IDENTICAL) ================= */

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'High': return 'border-red-200 bg-red-50 text-red-600'
    case 'Medium': return 'border-amber-200 bg-amber-50 text-amber-600'
    default: return 'border-slate-200 bg-slate-50 text-slate-600'
  }
}

function getStatusBadge(status: string) {
  const baseClass = "px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-sm whitespace-nowrap"
  switch (status) {
    case "Open":
      return <Badge className={`${baseClass} bg-blue-600 hover:bg-blue-600 text-white border-none`}>Open</Badge>
    case "In Progress":
      return <Badge className={`${baseClass} bg-amber-500 hover:bg-amber-500 text-white border-none`}>In Progress</Badge>
    case "Closed":
      return <Badge className={`${baseClass} bg-green-600 hover:bg-green-600 text-white border-none`}>Closed</Badge>
    case "Canceled":
      return <Badge variant="destructive" className={`${baseClass} border-none`}>Canceled</Badge>
    default:
      return <Badge variant="secondary" className={baseClass}>{status}</Badge>
  }
}