"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Search, Filter, MoreVertical, Edit2, Trash2, ShieldCheck, Mail, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const userData = [
  { id: "U-001", name: "Raden Muhamad Farhan", email: "farhan@systik.com", dept: "Administrator", role: "Admin", status: "Active" },
  { id: "U-002", name: "Budi Santoso", email: "budi.s@finance.com", dept: "Finance", role: "User", status: "Active" },
  { id: "U-003", name: "Siti Aminah", email: "siti.a@hrd.com", dept: "HRD", role: "User", status: "Inactive" },
  { id: "U-004", name: "Agus Setiawan", email: "agus.set@ops.com", dept: "Operations", role: "Agent", status: "Active" },
];

export default function UserManagementClient() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = userData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Kelola Hak Akses Pengguna</p>
        </div>
        <Button className="bg-[#059669] hover:bg-[#047857] text-white gap-2 shadow-sm">
          <UserPlus size={16} /> Add New User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari user..." 
            className="pl-9 h-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-10 border-slate-200">
          <Filter size={16} /> Filter
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">USER INFO</TableHead>
              <TableHead className="font-bold text-slate-700">DEPT</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">ROLE</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">STATUS</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Mail size={12} /> {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-slate-400" /> {user.dept}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[9px] font-black uppercase bg-slate-50">{user.role}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-100 bg-white">
                    <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold text-slate-700 uppercase">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreVertical size={16} className="text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 p-1">
                      <DropdownMenuItem className="gap-2 text-xs font-bold py-2 cursor-pointer">
                        <Edit2 size={14} className="text-slate-500" /> EDIT
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-xs font-bold py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 size={14} /> DELETE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}