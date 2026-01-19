"use client"

import { useState, useEffect } from "react"
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
import { 
  Send, 
  Loader2, 
  Paperclip, 
  X, 
  Phone, 
  PlusCircle,
} from "lucide-react"
import { toast } from "sonner"

export default function NewTicketPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string>("")
  const [priority, setPriority] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [userData, setUserData] = useState<{id: string} | null>(null)

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
        return
      }
      setUserData({ id: user.id })
    }
    getUserData()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!category || !priority) {
      toast.error("Silakan pilih kategori dan prioritas")
      return
    }
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (!userData) {
      toast.error("Sesi berakhir. Silakan login kembali.")
      setLoading(false)
      return
    }
    let attachmentUrl = null
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${userData.id}/${fileName}`
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
    const ticketData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      phone_number: formData.get("phone_number") as string,
      category: category.toUpperCase(), 
      priority: priority.toUpperCase(), 
      status: "OPEN",
      user_id: userData.id,
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
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1">    
        <div className="flex items-center gap-2 sm:gap-3">
           <div className="p-2 bg-primary rounded-lg sm:rounded-xl shrink-0">
              <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 text-background" />
           </div>
           <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 uppercase">Create New Ticket</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Complete details to get technical assistance.</p>
           </div>
        </div>
      </div>

      <Card className="p-5 sm:p-8 border-slate-200 shadow-xl shadow-slate-200/50 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border-none">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Subject</label>
            <Input name="title" required className="rounded-xl sm:rounded-2xl border-slate-200 h-11 sm:h-12 text-sm focus:ring-primary/20 shadow-sm" placeholder="E.g Printer Ruang IT Macet" />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Category</label>
              <Select onValueChange={setCategory} required>
                <SelectTrigger className="rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm border-slate-200 shadow-sm w-full">
                  <SelectValue placeholder="select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="HARDWARE">Hardware</SelectItem>
                  <SelectItem value="SOFTWARE">Software</SelectItem>
                  <SelectItem value="NETWORK">Network</SelectItem>
                  <SelectItem value="ACCOUNT">Account</SelectItem>
                  <SelectItem value="GENERAL">General Inquiry</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Priority</label>
              <Select onValueChange={setPriority} required>
                <SelectTrigger className="rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm border-slate-200 shadow-sm w-full">
                  <SelectValue placeholder="select priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Phone className="h-3 w-3 text-primary" /> Phone Mobile / WhatsApp
            </label>
            <Input type="tel" name="phone_number" placeholder="E.g 08123456789" required className="rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm border-slate-200 shadow-sm focus:ring-primary/20" />
            <p className="text-[10px] text-slate-400 italic ml-1">* Technician will contact you via this number.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Description</label>
            <Textarea name="description" required className="min-h-[120px] sm:min-h-[150px] rounded-xl sm:rounded-[2rem] border-slate-200 shadow-sm text-sm p-4" placeholder="Please explain in detail the problems..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Image Attachment</label>
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-slate-100 border-dashed rounded-xl sm:rounded-[2rem] cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-all group">
                <div className="p-2 sm:p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-primary">Click or drag image</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 uppercase">Max 5MB (PNG, JPG)</span>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*" />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-xl sm:rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                   <div className="p-2 bg-primary/10 rounded-lg shrink-0"><Paperclip className="h-4 w-4 text-primary" /></div>
                   <span className="text-xs sm:text-sm text-primary font-bold truncate">{file.name}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} className="hover:bg-primary/10 text-primary h-8 w-8 p-0 rounded-full"><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>

          <div className="pt-2 sm:pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 sm:py-7 rounded-xl sm:rounded-[2rem] shadow-lg shadow-primary/20 active:scale-[0.98] text-sm uppercase tracking-widest">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />Submit Ticket</>)}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}