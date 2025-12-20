"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useState } from "react"
import { useRouter } from "next/navigation"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      setError("Password tidak sama")
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.replace("/login")
    }
  }

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="password"
        placeholder="Password baru"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Konfirmasi password"
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Update Password</button>
    </form>
  )
}
    