"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, X, MessageCircle, User as UserIcon, Building2 } from "lucide-react"

// Interface disesuaikan dengan skema database Anda
export interface TicketWithProfile {
  id: number; 
  ticket_no: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  user_id: string;
  assigned_to?: string | null;
  created_at: string;
  closed_at?: string | null;
  attachment_url?: string | null; 
  phone_number?: string;
  profiles: {
    full_name: string | null;
    department: string | null;
  } | null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    CANCELLED: "bg-amber-100 text-amber-700 border-amber-200",
    CANCELED: "bg-amber-100 text-amber-700 border-amber-200",
  }
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles[status] || styles.CLOSED}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function TicketListClient({ 
  tickets = [], // BERIKAN DEFAULT VALUE ARRAY KOSONG DI SINI
  pageTitle 
}: { 
  tickets: TicketWithProfile[], 
  pageTitle: string 
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filteredTickets = useMemo(() => {
    // TAMBAHKAN PENGECEKAN: Jika tickets undefined atau null, kembalikan array kosong
    if (!tickets) return [];

    return tickets.filter((t) => {
      const s = query.toLowerCase()
      return (
        t.title?.toLowerCase().includes(s) ||
        t.profiles?.full_name?.toLowerCase().includes(s) ||
        t.profiles?.department?.toLowerCase().includes(s) ||
        t.ticket_no?.toLowerCase().includes(s)
      )
    })
  }, [query, tickets])

  return (
    <>
      {/* Search Header Toggle */}
      <div className="flex items-center justify-between gap-4 mb-2">
        {!isSearchOpen ? (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="ml-auto p-2 hover:bg-slate-100 rounded-full transition-all border border-slate-200 bg-white shadow-sm"
          >
            <Search className="h-4 w-4 text-slate-500" />
          </button>
        ) : (
          <div className="flex-1 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Cari judul, user, atau departemen..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-primary/20 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
              />
            </div>
            <button 
              onClick={() => { setIsSearchOpen(false); setQuery(""); }}
              className="p-2 hover:bg-slate-100 text-slate-500 rounded-full border border-slate-200 bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      #{ticket.ticket_no || ticket.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                        {ticket.profiles?.full_name || "Guest"}
                      </span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      <Building2 className="h-3 w-3 text-primary/60" />
                      <span className="text-[9px] font-black uppercase tracking-tight text-primary/80">
                        {ticket.profiles?.department || "General"}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                    {ticket.title || "No Title"}
                  </h3>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-4 italic font-medium">
                {"\""}{ticket.description}{"\""}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-[11px]">
                    {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <Link 
                  href={`/dashboard/admin/tickets/${ticket.id}`}
                  className="text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Progress Details →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              {query ? `Tidak ada hasil untuk "${query}"` : `Belum ada tiket di ${pageTitle}`}
            </p>
          </div>
        )}
      </div>
    </>
  )
}