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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { inviteNewUser } from "@/app/actions/invite-user" // Pastikan Server Action ini sudah diupdate kolomnya
import { toast } from "sonner"

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Modifikasi: Menggunakan extension & menambahkan role
  const [formData, setFormData] = useState({
    full_name: "",
    extension: "", // Berubah dari employee_id
    email: "",
    department: "",
    role: "USER" // Default role
  })

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await inviteNewUser(formData)

      if (result.success) {
        toast.success("Akun berhasil didaftarkan!")
        setOpen(false)
        setFormData({ 
          full_name: "", 
          extension: "", 
          email: "", 
          department: "", 
          role: "USER" 
        })
      } else {
        toast.error(`Gagal: ${result.error}`)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2 rounded-xl shadow-lg bg-[#00843D] hover:bg-[#006830] transition-all active:scale-95">
          <UserPlus className="h-4 w-4" />
          ADD NEW ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-black uppercase tracking-tight text-xl">Create New User</DialogTitle>
          <DialogDescription>
            Input data karyawan untuk akses sistem SYSTIK.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddUser} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Full Name</Label>
            <Input 
              id="name" 
              placeholder="E.g. Agus Budiono" 
              required 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="rounded-lg"
            />
          </div>

          {/* Extension / ID Number */}
          <div className="space-y-1">
            <Label htmlFor="ext" className="text-xs font-bold uppercase text-slate-500">Extension / Ext Number</Label>
            <Input 
              id="ext" 
              placeholder="E.g. PK-2110" 
              required 
              value={formData.extension}
              onChange={(e) => setFormData({...formData, extension: e.target.value})}
              className="rounded-lg"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="user@pupuk-kujang.com" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="rounded-lg"
            />
          </div>

          {/* Department & Role (Grid Layout) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="dept" className="text-xs font-bold uppercase text-slate-500">Department</Label>
              <Input 
                id="dept" 
                placeholder="IT / GA / HR" 
                required 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase text-slate-500">Access Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="AGENT">AGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full font-black bg-primary hover:bg-[#006830] h-11 rounded-xl shadow-md">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                "REGISTER & INVITE"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}