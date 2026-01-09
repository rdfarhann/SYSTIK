import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, Calendar, Tag, AlertCircle, FileText, 
  Download, ExternalLink, Paperclip, Phone, Clock 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import StatusEditor from "@/components/tickets/status-editor"

interface TicketLog {
  id: string;
  ticket_id: string;
  status_update: string;
  notes?: string;
  created_at: string;
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  // MODIFIKASI ADMIN: Menghapus filter .eq("user_id", user.id) agar admin bisa melihat semua tiket
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(`
      *,
      ticket_logs (*),
      profiles!user_id (full_name)
    `)
    .eq("id", id)
    .single()

  if (error || !ticket) notFound()

  const logs: TicketLog[] = (ticket.ticket_logs || []).sort((a: TicketLog, b: TicketLog) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return "bg-blue-100 text-blue-700 border-blue-200"
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700 border-amber-200"
      case "CANCELED": return "bg-amber-100 text-amber-700 border-amber-200"
      case "CLOSED": return "bg-primary text-background border-primary"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/admin/tickets" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors w-fit group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Back</span>
      </Link>

      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{ticket.title}</h1>
            <Badge className={`${getStatusColor(ticket.status)} border font-bold uppercase text-[10px]`}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm">ID Ticket: <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">#{String(ticket.id).slice(0, 8)}</span></p>
        </div>
      </div>
      <StatusEditor 
            ticketId={ticket.id} 
            initialStatus={ticket.status} 
            ownerId={ticket.user_id} 
        />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Clock className="h-5 w-5 text-primary" />
                Ticket Progress
              </div>
              <Separator />
              
              <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] before:h-full before:w-[2px] before:bg-slate-100 before:content-['']">
                {logs.length > 0 ? (
                  logs.map((log: TicketLog, index: number) => (
                    <div key={log.id} className="relative">
                      <div className={`absolute -left-[27px] mt-1 h-4 w-4 rounded-full border-4 border-white ${
                        index === 0 
                        ? "bg-primary"
                        : "bg-slate-300"
                      }`} />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className={`text-sm ${index === 0 ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>
                          {log.status_update || log.notes}
                        </p>
                        <time className="text-[11px] font-bold text-slate-400 uppercase">
                          {new Date(log.created_at).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </time>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[27px] mt-1 h-4 w-4 rounded-full border-4 border-white bg-primary shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-bold text-slate-900">Ticket created successfully</p>
                      <time className="text-[11px] font-bold text-slate-400 uppercase">
                        {new Date(ticket.created_at).toLocaleString('id-ID', {
                           day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-800"><FileText className="h-5 w-5 text-primary" />Description</div>
              <Separator />
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{ticket.description}</div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-800"><Paperclip className="h-5 w-5 text-primary" />Attachment</div>
              <Separator />
              {ticket.attachment_url ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={ticket.attachment_url} alt="Lampiran" className="w-full h-auto max-h-[400px] object-contain mx-auto" />
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1 rounded-xl border-primary text-primary hover:bg-slate-500/50">
                      <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Open</a>
                    </Button>
                    <Button asChild className="flex-1 rounded-xl bg-primary hover:bg-primary/50"><a href={ticket.attachment_url} download><Download className="mr-2 h-4 w-4" />Download</a></Button>
                  </div>
                </div>
              ) : <p className="text-sm text-slate-400 italic text-center py-4">No attachments</p>}
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-slate-50/50">
            <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-widest">Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-1" />
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Create</p><p className="text-sm font-semibold">{new Date(ticket.created_at).toLocaleDateString('id-ID')}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-slate-400 mt-1" />
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Category</p><p className="text-sm font-semibold">{ticket.category}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400 mt-1" />
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Priority</p><Badge variant="outline" className="mt-1 font-bold border-slate-300">{ticket.priority}</Badge></div>
              </div>
              
              <div className="flex items-start gap-3 pt-1">
                <Phone className="h-4 w-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                  <p className="text-sm font-semibold mb-2">{ticket.phone_number || "-"}</p>
                  {ticket.phone_number && (
                    <Button asChild className="w-full bg-primary hover:bg-primary text-white rounded-xl h-8 text-[11px] font-bold">
                      <a href={`https://wa.me/62${ticket.phone_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        Contact via WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Separator />
              <div className="flex items-center gap-3 pt-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold uppercase">
                  {ticket.profiles?.full_name?.substring(0, 2) || "US"}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Reporter</p>
                  <p className="text-sm font-semibold">{ticket.profiles?.full_name || "Unknown User"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
