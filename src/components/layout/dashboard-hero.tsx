"use client"

import { Card } from "@/components/ui/card"
import {
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  LucideIcon,
  Eye,
  MoreHorizontal,
} from "lucide-react"
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
import CreateTicketModal from "../tickets/create-ticket-modal"
import Link from "next/link"

const recentTickets = [
  { id: "T-2401", title: "Install Ulang PC Keuangan", category: "Hardware", priority: "High", status: "Open", date: "23/12/2025" },
  { id: "T-2402", title: "Lupa Password Email", category: "Account", priority: "Medium", status: "In Progress", date: "22/12/2025" },
  { id: "T-2403", title: "Printer Macet Lantai 2", category: "Hardware", priority: "Low", status: "Closed", date: "21/12/2025" },
  { id: "T-2404", title: "Akses VPN Bermasalah", category: "Network", priority: "High", status: "Canceled", date: "20/12/2025" },
]

export default function DashboardHero() {
  return (
    /* Menambahkan overflow-x-hidden pada container utama agar tidak goyang di HP */
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-1 sm:px-0">
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl border p-4 sm:p-6 bg-primary shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border bg-background shadow-sm shrink-0">
              <Ticket className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-background truncate">SYSTIK</h1> 
              <p className="text-xs sm:text-sm text-background/90 truncate">System Ticketing & Support Internal</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              <CreateTicketModal/>
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-background">
        <StatCard title="Total Ticket" value="128" description="All tickets" icon={Ticket} />
        <StatCard title="Open" value="34" description="Waiting to be processed" icon={Clock} />
        <StatCard title="In Progress" value="56" description="Being worked on" icon={Loader} spin />
        <StatCard title="Closed" value="30" description="Finished" icon={CheckCircle} />
        <StatCard title="Canceled" value="8" description="Failed or Canceled" icon={XCircle} />
      </div>

      {/* ================= TICKET LIST TABLE (OPTIMIZED) ================= */}
      <Card className="rounded-2xl border shadow-md overflow-hidden bg-primary">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-background">Recent Tickets</h2>
            <p className="text-xs sm:text-sm text-background font-medium opacity-90">latest ticket activity in the system.</p>
          </div>
          <Button variant="outline" size="sm" className="font-semibold shadow-sm w-fit" asChild>
            <Link href="/dashboard/tickets">
              View All Tickets
            </Link>
          </Button>
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
                {recentTickets.map((ticket) => (
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
                    <TableCell className="py-4 text-sm font-medium text-background">{ticket.category}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        ticket.priority === 'High' ? 'border-red-200 bg-red-50 text-red-600' : 
                        ticket.priority === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-600' : 
                        'border-slate-200 bg-slate-50 text-slate-600'
                      }`}>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ================= HELPER & SUB COMPONENTS ================= */

function getStatusBadge(status: string) {
  const baseClass = "px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-sm whitespace-nowrap"
  switch (status) {
    case "Open":
      return <Badge className={`${baseClass} bg-blue-600 hover:bg-blue-600 text-white`}>Open</Badge>
    case "In Progress":
      return <Badge className={`${baseClass} bg-amber-500 hover:bg-amber-500 text-white`}>In Progress</Badge>
    case "Closed":
      return <Badge className={`${baseClass} bg-green-600 hover:bg-green-600 text-white`}>Closed</Badge>
    case "Canceled":
      return <Badge variant="destructive" className={baseClass}>Canceled</Badge>
    default:
      return <Badge variant="secondary" className={baseClass}>{status}</Badge>
  }
}

function StatCard({ title, value, description, icon: Icon, spin = false }: { title: string, value: string, description: string, icon: LucideIcon, spin?: boolean }) {
  return (
    <Card className="rounded-xl p-3 sm:p-4 transition-all hover:scale-[1.02] hover:shadow-lg bg-primary border-none shadow-sm group">
      <div className="flex items-center justify-between gap-1">
        <p className="text-[10px] sm:text-xs font-bold text-background/80 uppercase tracking-widest truncate">{title}</p>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 text-background group-hover:rotate-12 transition-transform shrink-0 ${spin ? "animate-spin" : ""}`} />
      </div>
      <p className="mt-2 sm:mt-3 text-xl sm:text-3xl font-extrabold text-background">{value}</p>
      <p className="mt-1 text-[9px] sm:text-[10px] text-background/70 font-medium italic line-clamp-1">{description}</p>
    </Card>
  )
}