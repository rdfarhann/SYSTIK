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
import Link from "next/link"
import { toast } from "sonner"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ChevronDown, LogOut } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import NotificationBell from "@/components/layout/notification-bell"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserData {
  id: string;
  email?: string;
  full_name?: string;
  department?: string;
  extension?: string;
}

export default function NewTicketPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string>("")
  const [priority, setPriority] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
        return
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, department, extension")
        .eq("id", user.id)
        .single()
      if (error) console.error("Error fetching profile:", error)
      setUserData({
        id: user.id,
        email: user.email,
        full_name: profile?.full_name,
        department: profile?.department,
        extension: profile?.extension
      })
    }
    getUserData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

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

  const displayName = userData?.full_name ?? userData?.email?.split('@')[0] ?? "User"
  const displayExt = userData?.extension ?? "-"
  const displayDept = userData?.department ?? "-"

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-slate-50/50 min-h-screen">
        <header className="flex h-16 items-center border-b px-4 bg-background shrink-0 sticky top-0 z-20 shadow-sm border-slate-200">
          <div className="flex w-full items-center overflow-hidden">
              <SidebarTrigger className="text-foreground hover:bg-background hover:text-foreground transition-all rounded-lg shrink-0" />
              <Separator orientation="vertical" className="h-4 mx-1 shrink-0" />
              <Breadcrumb className="truncate">
                <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem className="text-[10px] sm:text-sm shrink-0">
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="font-semibold hover:text-primary transition-colors">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0" />
                  <BreadcrumbItem className="font-bold text-[10px] sm:text-sm truncate">
                    <span className="text-foreground opacity-60 capitalize truncate">
                      Create New Ticket
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
              <NotificationBell/> 
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 sm:gap-2 rounded-full pl-2 sm:pl-3 pr-1 sm:pr-2 py-1 hover:bg-slate-100 transition-all outline-none border border-transparent">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-primary flex items-center justify-center text-[12px] sm:text-[15px] text-white font-bold shadow-inner shrink-0">
                    {displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>  
                <DropdownMenuContent align="end" className="w-56 sm:w-60 shadow-xl border-slate-200 p-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-[11px] text-slate-500 font-medium uppercase tracking-wider">Account</DropdownMenuLabel>
                  <div className="px-2 pb-2"><p className="text-sm font-bold text-slate-900 truncate">{userData?.email}</p></div>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Extension</span>
                      <span className="font-bold text-foreground bg-slate-100 px-1.5 rounded">{displayExt}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Department</span>
                      <span className="font-bold text-foreground">{displayDept}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0 mt-1" onSelect={(e) => e.preventDefault()}>
                    <form action={handleLogout} className="w-full">
                      <button type="submit" className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors">
                        <LogOut className="h-4 w-4" /> Exit
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </header>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Category</label>
                  <Select onValueChange={setCategory} required>
                    <SelectTrigger className="rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm border-slate-200 shadow-sm">
                      <SelectValue placeholder="select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="HARDWARE">Hardware</SelectItem>
                      <SelectItem value="SOFTWARE">Software</SelectItem>
                      <SelectItem value="NETWORK">Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-[11px]">Priority</label>
                  <Select onValueChange={setPriority} required>
                    <SelectTrigger className="rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm border-slate-200 shadow-sm">
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
                <p className="text-[9px] sm:text-[10px] text-slate-400 italic ml-1">* Technician will contact you via this number.</p>
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
      </main>
    </SidebarProvider>
  )
}