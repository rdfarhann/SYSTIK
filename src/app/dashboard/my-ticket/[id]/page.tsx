import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, Calendar, Tag, AlertCircle, FileText, 
  Download, ExternalLink, Phone, Clock, User
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import TicketComments from "@/components/tickets/ticket-comments"

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

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(`
      *, 
      ticket_logs (*),
      profiles!user_id (full_name, avatar_url, email, department)
    `)
    .eq("id", id)
    .single()

  if (error || !ticket) notFound()

  const { data: commentsRaw } = await supabase
    .from("ticket_comments")
    .select(`*`)
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const userIds = [...new Set(commentsRaw?.map(c => c.user_id) || [])];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .in("id", userIds);

  const initialComments = commentsRaw?.map(comment => ({
    ...comment,
    profiles: profiles?.find(p => p.id === comment.user_id) || null
  })) || [];

  const logs: TicketLog[] = (ticket.ticket_logs || []).sort((a: TicketLog, b: TicketLog) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return "bg-blue-100 text-blue-700 border-blue-200"
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700 border-amber-200"
      case "CLOSED": return "bg-primary text-white border-primary"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/my-ticket" className="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors group">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to List</span>
        </Link>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">ID: #{String(ticket.id).slice(0, 8)}</span>
           <Badge className={`${getStatusColor(ticket.status)} border font-bold uppercase text-[10px] px-3`}>
             {ticket.status.replace('_', ' ')}
           </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{ticket.title}</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">{new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">{ticket.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Priority: {ticket.priority}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                Ticket Description
              </div>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-primary/20 pl-4">
                {ticket.description}
              </div>
              
              {ticket.attachment_url && (
                <div className="pt-2">
                  <div className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50 group transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 shadow-sm">
                        <img src={ticket.attachment_url} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[11px] font-bold text-slate-700 truncate">Attachment_Image.jpg</span>
                        <span className="text-[9px] text-slate-400 font-medium">Click to view/download</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary">
                        <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary">
                        <a href={ticket.attachment_url} download><Download className="h-4 w-4" /></a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <div className="p-1"> 
              <TicketComments 
                ticketId={Number(ticket.id)} 
                initialComments={initialComments} 
                currentUserId={user.id} 
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card className="p-5 rounded-2xl border-slate-200 shadow-sm bg-white">
            <h3 className="font-bold text-slate-800 mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Activity Log
            </h3>
            <div className="relative pl-6 space-y-5 before:absolute before:inset-0 before:left-[7px] before:h-full before:w-[1.5px] before:bg-slate-100">
              {logs.slice(0, 5).map((log: TicketLog, index: number) => (
                <div key={log.id} className="relative">
                  <div className={`absolute -left-[23px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    index === 0 ? "bg-primary" : "bg-slate-300"
                  }`} />
                  <p className={`text-[12px] leading-tight ${index === 0 ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>
                    {log.status_update}
                  </p>
                  <time className="text-[10px] text-slate-400 font-medium">
                    {new Date(log.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              ))}
              <div className="relative">
                <div className="absolute -left-[23px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300" />
                <p className="text-[12px] font-medium text-slate-500">Ticket Created</p>
                <time className="text-[10px] text-slate-400 font-medium">
                   {new Date(ticket.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            </div>
          </Card>
          <Card className="p-5 rounded-2xl border-slate-200 shadow-sm bg-slate-50/50">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-15 w-15 rounded-full bg-primary overflow-hidden flex items-center justify-center text-white shadow-md">
                      {ticket.profiles?.avatar_url ? (
                        <img src={ticket.profiles.avatar_url} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reporter</p>
                      <p className="text-sm font-bold text-slate-800">{ticket.profiles?.full_name || "Unknown User"}</p>
                      <p className="text-xs font-semibold text-slate-500">Email :{ticket.profiles?.email || "-"}</p>
                      <p className="text-xs font-semibold text-slate-500">Department :{ticket.profiles?.department || "-"}</p>
                   </div>
                </div>
                
                <Separator className="bg-slate-200/60" />

                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</p>
                      <p className="text-[13px] font-bold text-slate-700">{ticket.phone_number || "-"}</p>
                   </div>
                   {ticket.phone_number && (
                     <Button asChild className="w-full bg-primary hover:bg-primary/50 text-white rounded-xl h-9 text-xs font-bold gap-2">
                       <a href={`https://wa.me/62${ticket.phone_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                         <Phone className="h-3.5 w-3.5" />
                         Contact Via WhatsApp
                       </a>
                     </Button>
                   )}
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}