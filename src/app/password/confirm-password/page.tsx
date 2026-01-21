"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Lock } from "lucide-react"

export default function ConfirmPasswordPage() {
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(true) 
  const [loading, setLoading] = useState(false) 
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event)
      
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        setIsVerifying(false)
      } else if (event === "INITIAL_SESSION" && !session) {
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession()
          if (!data.session) {
            toast.error("Sesi tidak valid atau telah kedaluwarsa.")
            router.push("/login")
          } else {
            setIsVerifying(false)
          }
        }, 3000)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error("Gagal update password: " + error.message)
      setLoading(false)
    } else {
      toast.success("Password berhasil diatur!")
      
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium">Memverifikasi tautan anda...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 rounded-[2rem] shadow-xl border-none">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Set Password</h1>
          <p className="text-sm text-slate-500 text-center mt-1">
            Welcome to Systik! Please set your new password to continue.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-700 ml-1 tracking-wider">
              New Password
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 shadow-sm"
            />
            <p className="text-[10px] text-slate-400 ml-1">
              * Minimal 6 characters.
            </p>
          </div>
          
          <Button 
            type="submit"
            disabled={loading} 
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...</>
            ) : (
              "Save Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}