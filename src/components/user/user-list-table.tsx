"use client"

import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string;
  full_name: string;
  extension: string;
  email: string;
  department: string;
  role: string;
}

export default function UserListTable({ users }: { users: User[] }) {
  
  const handleEdit = (id: string) => {
    console.log("Edit user:", id)
    // Tambahkan logika navigasi atau buka modal di sini
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      console.log("Delete user:", id)
      // Tambahkan logika delete API di sini
    }
  }

  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="w-[100px] font-bold">ID</TableHead>
          <TableHead className="font-bold">USER INFO</TableHead>
          <TableHead className="font-bold text-center">DEPARTMENT</TableHead>
          <TableHead className="font-bold text-center">ROLE</TableHead>
          <TableHead className="text-right font-bold">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-slate-100 transition-colors">
            <TableCell className="font-medium text-primary">{user.extension}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-bold text-sm uppercase">{user.full_name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <span className="text-xs font-semibold uppercase">{user.department}</span>
            </TableCell>
            <TableCell className="text-center">
              <Badge 
                variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}
                className={`text-[10px] ${user.role === 'ADMIN' ? 'bg-red-600' : 'bg-primary'} text-background`}
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 bg-background hover:bg-primary">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 text-foreground">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEdit(user.id)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                    <span className="text-foreground">Edit User</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(user.id)} 
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    <span>Delete User</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}