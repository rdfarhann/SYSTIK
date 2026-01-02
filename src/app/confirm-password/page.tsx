"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ConfirmPasswordPage() {
  const [password, setPassword] = useState("")
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Cek apakah sesi sudah ada
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsSessionReady(true)
        return
      }

      // 2. JALUR PAKSA: Ambil token langsung dari URL Hash (#)
      const hash = window.location.hash
      if (hash && hash.includes("access_token")) {
        // Ambil access_token dan refresh_token dari URL
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

      // 3. Listener sebagai pengaman terakhir
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) setIsSessionReady(true)
      })

      return () => subscription.unsubscribe()
    }

    handleAuth()
  }, [supabase])

  const handleUpdatePassword = async () => {
    if (!isSessionReady || password.length < 6) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    
    if (error) {
      alert("Gagal update: " + error.message)
      setLoading(false)
    } else {
      alert("Password berhasil diatur! Anda akan dialihkan.")
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto border rounded-xl mt-20 shadow-lg bg-white">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#00843D]">Set Password SYSTIK</h1>
        <p className="text-sm text-slate-500">Silakan masukkan password baru Anda.</p>
      </div>
      
      <input 
        type="password" 
        placeholder="Minimal 6 karakter" 
        className="border p-2 rounded-lg outline-[#00843D]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      
      <button 
        onClick={handleUpdatePassword}
        disabled={!isSessionReady || loading || password.length < 6}
        className="bg-[#00843D] hover:bg-[#006830] text-white p-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {!isSessionReady ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Menghubungkan...
          </>
        ) : loading ? "Memproses..." : "Konfirmasi Password"}
      </button>

      {!isSessionReady && (
        <p className="text-[10px] text-center text-red-500 animate-pulse">
          Jika tetap loading, pastikan link di email Anda masih valid.
        </p>
      )}
    </div>
  )
}