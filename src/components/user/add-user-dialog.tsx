"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Logika pendaftaran user (Supabase Auth/API) di sini
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2 rounded-xl shadow-lg">
          <UserPlus className="h-4 w-4" />
          ADD NEW ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-black uppercase tracking-tight">Create New User</DialogTitle>
          <DialogDescription>
            Isi data karyawan untuk memberikan akses ke dalam sistem SYSTIK.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="E.g. John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="id">Employee ID</Label>
            <Input id="id" placeholder="K-001" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="name@pupuk-kujang.co.id" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept">Department</Label>
            <Input id="dept" placeholder="Finance / HR / IT" required />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full font-bold">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "REGISTER ACCOUNT"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}