"use client"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string;
  full_name: string;
  extension: string;
  email: string;
  department: string;
  role: string;
}

export default function UserListTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="w-[100px] font-bold">ID</TableHead>
          <TableHead className="font-bold">USER INFO</TableHead>
          <TableHead className="font-bold text-center">DEPARTMENT</TableHead>
          <TableHead className="font-bold text-center">ROLE</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}