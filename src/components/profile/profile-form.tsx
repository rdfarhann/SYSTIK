"use client"

import { useState, useRef, ChangeEvent } from "react"
import { User, Mail, Building2, PhoneForwarded, Camera, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { UserProfile } from "../../../.next/dev/types/profile"

export default function ProfileForm({ 
  profile, 
  userEmail 
}: { 
  profile: UserProfile | null, 
  userEmail: string 
}) {
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.avatar_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB")
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${profile?.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    try {
      setLoading(true)
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile?.id)

    } catch (error) {
      alert("Gagal mengunggah gambar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <form className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              defaultValue={profile?.full_name || ""} 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input 
              type="email" 
              value={userEmail} 
              disabled 
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Department</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                defaultValue={profile?.department || ""} 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Extension / Employee ID</label>
            <div className="relative group">
              <PhoneForwarded className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                defaultValue={profile?.extension || ""} 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>
        </div>

        <Button disabled={loading} className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </form>

      <div className="space-y-6">
        <div className="bg-primary h-100 w-80 rounded-[2.5rem] text-center text-white shadow-xl flex flex-col items-center group">
          <div 
            className="relative cursor-pointer" 
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <div className="mt-20 h-35 w-35 rounded-full border-2 border-foreground overflow-hidden bg-background flex items-center justify-center ring-4 ring-primary/20 transition-all group-hover:ring-primary/50">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-primary" />
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-background p-2 rounded-full shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png" 
              onChange={handleImageChange} 
            />
          </div>
          
          <div className="mt-10">
            <h2 className="font-bold text-lg leading-tight">{profile?.full_name || "User"}</h2>
            <p className="text-[10px] font-black text-background uppercase tracking-[0.2em] mt-2">{profile?.role || "Staff"}</p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800 w-full">
            <p className="text-[9px] text-background leading-relaxed uppercase font-bold tracking-widest">
              Format: JPG, PNG (Maks 1MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}