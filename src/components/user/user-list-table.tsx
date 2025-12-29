"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MoreHorizontal, ShieldCheck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const users = [
  { id: "K-0112", name: "Raden Muhamad Farhan", email: "farhan@company.com", dept: "Administrator", role: "Super Admin" },
  { id: "K-0231", name: "Budi Santoso", email: "budi.s@company.com", dept: "Finance", role: "Agent" },
  { id: "K-0245", name: "Siti Aminah", email: "siti.a@company.com", dept: "HRD", role: "User" },
]

export default function UserListTable() {
  return (
    <Card className="rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[100px] font-bold">ID</TableHead>
            <TableHead className="font-bold">USER INFO</TableHead>
            <TableHead className="font-bold">DEPARTMENT</TableHead>
            <TableHead className="text-center font-bold">ROLE</TableHead>
            <TableHead className="text-right font-bold">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-mono font-bold text-primary">{u.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{u.name}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" /> {u.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-xs font-semibold uppercase text-slate-600">{u.dept}</TableCell>
              <TableCell className="text-center">
                <Badge variant={u.role === "Super Admin" ? "default" : "secondary"} className="text-[9px] font-bold text-background uppercase">
                  {u.role === "Super Admin" && <ShieldCheck className="h-3 w-3 mr-1" />}
                  {u.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}