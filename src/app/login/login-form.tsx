"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login gagal")
        setLoading(false)
        return
      }

      // ✅ LOGIN BERHASIL
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Image
              src="/systik.svg"
              alt="systik logo"
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
            <FieldGroup>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Loading..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>

            <footer className="py-4 px-4 text-center text-sm text-black font-normal">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.pupuk-kujang.co.id/"
                className="underline font-semibold hover:text-primary"
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
