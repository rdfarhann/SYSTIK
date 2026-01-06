"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client" 
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ChevronLeft, Send, Loader2, Paperclip, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewTicketPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string>("")
  const [priority, setPriority] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Database Check Constraint: LOW, MEDIUM, HIGH, URGENT (Uppercase)
    if (!category || !priority) {
      toast.error("Silakan pilih kategori dan prioritas")
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Sesi berakhir. Silakan login kembali.")
      setLoading(false)
      return
    }

    let attachmentUrl = null

    // --- PROSES UPLOAD FILE ---
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ticket-attachments') 
        .upload(filePath, file)

      if (uploadError) {
        toast.error("Gagal unggah gambar: " + uploadError.message)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ticket-attachments')
        .getPublicUrl(filePath)
      
      attachmentUrl = publicUrl
    }

    // --- SIMPAN DATA (Sesuai Constraint UPPERCASE) ---
    const ticketData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: category.toUpperCase(), 
      priority: priority.toUpperCase(), 
      status: "OPEN",
      user_id: user.id,
      attachment_url: attachmentUrl,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("tickets").insert([ticketData])

    if (error) {
      toast.error("Gagal mengirim tiket: " + error.message)
      setLoading(false)
    } else {
      toast.success("Tiket berhasil dibuat!")
      router.push("/dashboard/my-ticket")
      router.refresh()
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/my-ticket" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors w-fit group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium font-bold">Kembali ke Daftar</span>
      </Link>

      <Card className="p-6 border-slate-200 shadow-xl rounded-3xl bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Subjek Kendala</label>
            <Input name="title" required className="rounded-xl border-slate-200 h-11" placeholder="Judul kendala..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kategori</label>
              <Select onValueChange={setCategory} required>
                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HARDWARE">Hardware</SelectItem>
                  <SelectItem value="SOFTWARE">Software</SelectItem>
                  <SelectItem value="NETWORK">Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Prioritas</label>
              <Select onValueChange={setPriority} required>
                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Pilih Prioritas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Deskripsi Detail</label>
            <Textarea name="description" required className="min-h-[120px] rounded-2xl border-slate-200" placeholder="Detail kendala..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Lampiran</label>
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                <Paperclip className="w-8 h-8 mb-2 text-slate-400" />
                <span className="text-xs text-slate-500">Klik untuk unggah screenshot</span>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*" />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-sm text-emerald-700 font-medium truncate">{file.name}</span>
                <X className="h-4 w-4 text-emerald-600 cursor-pointer" onClick={() => setFile(null)} />
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-2xl transition-all shadow-lg active:scale-[0.98]">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengirim...</> : <><Send className="mr-2 h-4 w-4" />Kirim Tiket Sekarang</>}
          </Button>
        </form>
      </Card>
    </div>
  )
}