"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr" 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  
  // Inisialisasi Supabase Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Ganti sementara agar Anda tahu error aslinya apa
        setError(authError.message) 
        setLoading(false)
        return
    }

      if (data.user) {
        router.refresh()
        
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 500)
      }
    } catch (err) {
      setError("An unexpected server error occurred")
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Image
              src="/systik.svg"
              alt="SYSTIK logo"
              width={250}
              height={250}
              priority
            />
          </div>
          <CardTitle className="text-xl">Welcome back to SYSTIK</CardTitle>
          <CardDescription>
            Login with your Employee Account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="flex flex-col gap-2">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200 animate-in fade-in zoom-in duration-200">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </FieldGroup>

            <footer className="mt-6 text-center text-xs text-muted-foreground font-normal">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.pupuk-kujang.co.id/"
                className="underline font-semibold hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                PT Pupuk Kujang Cikampek
              </a>
              . All rights reserved.
            </footer>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}