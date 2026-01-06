import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, Calendar, Tag, AlertCircle, Download, 
  ExternalLink, User, Send, Paperclip, MessageSquare 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !ticket) notFound()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header: Navigasi & Status */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div className="space-y-2">
          <Link href="/dashboard/my-ticket" className="flex items-center gap-1 text-slate-400 hover:text-emerald-600 text-sm transition-colors mb-2 w-fit">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-0.5 rounded-full text-xs">
              {ticket.status}
            </Badge>
          </div>
          <div className="flex gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
            <span className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> {ticket.category}</span>
            <span className="flex items-center gap-1.5"><AlertCircle className="h-3 w-3" /> {ticket.priority}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Konten Utama */}
        <div className="space-y-10">
          
          {/* Section: Laporan Awal */}
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Anda <span className="text-slate-400 font-normal ml-2">Melaporkan kendala</span></p>
                <div className="mt-2 text-slate-600 text-sm leading-relaxed max-w-2xl">
                  {ticket.description}
                </div>
              </div>

              {/* Lampiran Simpel (Kecil & Informatif) */}
              {ticket.attachment_url && (
                <div className="flex items-center gap-3 p-2 pr-4 border rounded-2xl w-fit bg-slate-50/50 group hover:border-emerald-200 transition-colors">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border bg-white shrink-0">
                    <img src={ticket.attachment_url} className="h-full w-full object-cover" alt="preview" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Lampiran Gambar</span>
                    <div className="flex gap-3 mt-0.5">
                      <a href={ticket.attachment_url} target="_blank" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> Lihat
                      </a>
                      <a href={ticket.attachment_url} download className="text-xs font-bold text-slate-500 hover:underline flex items-center gap-1">
                        <Download className="h-3 w-3" /> Unduh
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <Separator className="mt-6 opacity-50" />
            </div>
          </div>

          {/* Section: Diskusi / Komentar */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Diskusi
            </h3>

            {/* Bubble Chat: Agent */}
            <div className="flex gap-4 group">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
                <span className="text-[10px] text-white font-black">IT</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 mb-1">Support Agent <span className="text-slate-400 font-normal ml-2">10 menit yang lalu</span></p>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 max-w-xl leading-relaxed">
                  Halo! Laporan Anda sudah kami terima. Saat ini tim sedang melakukan pengecekan jaringan di lantai tempat Anda berada. Mohon tunggu sekitar 15 menit.
                </div>
              </div>
            </div>

            {/* Input Form Simpel */}
            <div className="flex gap-4 pt-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex-1 space-y-3">
                <Textarea 
                  placeholder="Balas pesan..." 
                  className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none p-4 text-sm shadow-sm"
                />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 italic">Tekan Kirim untuk membalas</p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold flex gap-2 h-10 shadow-lg shadow-emerald-100 active:scale-95 transition-all">
                    Kirim Pesan <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}