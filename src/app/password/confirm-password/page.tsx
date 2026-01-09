"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Loader2, Lock, ShieldCheck, KeyRound, AlertCircle } from "lucide-react"

export default function ConfirmPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsSessionReady(true)
        return
      }

      const hash = window.location.hash
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace("#", "?"))
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!error) setIsSessionReady(true)
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) setIsSessionReady(true)
      })

      return () => subscription.unsubscribe()
    }

    handleAuth()
  }, [supabase])

  const handleUpdatePassword = async () => {
    if (!isSessionReady || password.length < 6 || password !== confirmPassword) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    
    if (error) {
      alert("Gagal update: " + error.message)
      setLoading(false)
    } else {
      alert("Password successfully set! You will be redirected to the login page.")
      router.push("/")
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] grayscale" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-primary p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-4 border border-white/30">
                <ShieldCheck className="text-white h-8 w-8" />
             </div>
             <h1 className="text-2xl font-black text-white tracking-tight uppercase">Set Password</h1>
             <p className="text-primary text-xs font-bold tracking-widest uppercase opacity-80 mt-1">SYSTIK Management System</p>
          </div>

          <div className="p-8 space-y-5">
            <div className="space-y-4">
              {/* Input New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Minimal 6 karakter" 
                    className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Repeat Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Konfirmasi password baru" 
                    className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {password !== confirmPassword && confirmPassword.length > 0 && (
                  <p className="text-[10px] text-red-500 font-bold italic ml-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Password tidak cocok
                  </p>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleUpdatePassword}
              disabled={!isSessionReady || loading || password.length < 6 || password !== confirmPassword}
              className="w-full bg-primary hover:bg-[#006830] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:pointer-events-none flex items-center justify-center gap-3"
            >
              {!isSessionReady ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghubungkan...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : "Aktivasi Akun Sekarang"}
            </button>

            {!isSessionReady && (
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <p className="text-[9px] text-center text-amber-700 font-bold leading-relaxed">
                  Jika tetap loading, harap muat ulang halaman atau pastikan link di email Anda belum kedaluwarsa.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              &copy; 2026 SYSTIK Database System
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}