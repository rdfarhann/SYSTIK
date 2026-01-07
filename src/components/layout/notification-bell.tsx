"use client"
import { Bell, CheckCircle2, AlertCircle, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Data Dummy Notifikasi
const notifications = [
  { id: 1, title: "Tiket Baru", message: "T-2401 telah dibuat oleh Budi Santoso", type: "info", time: "2 menit yang lalu", isRead: false },
  { id: 2, title: "Update Status", message: "Tiket T-2399 berubah menjadi In Progress", type: "success", time: "1 jam yang lalu", isRead: false },
]

export default function NotificationBell() {
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-lg p-2 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all outline-none">
          <Bell className="h-6 w-6 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-slate-200">
        <DropdownMenuLabel className="p-4 flex justify-between items-center">
          <span className="font-bold">Notifikasi</span>
          <span className="text-[10px] bg-emerald-100 text-primary px-2 py-0.5 rounded-full uppercase font-black">
            {unreadCount} Baru
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        
        <ScrollArea className="h-[350px]">
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="p-4 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0 items-start gap-3">
              <div className="mt-1">
                {n.type === 'info' ? <Info className="h-4 w-4 text-blue-500" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                <p className={`text-sm leading-none font-bold ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {n.time}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        
        <DropdownMenuSeparator className="m-0" />
        <button className="w-full py-3 text-center text-xs font-bold text-emerald-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
          Lihat Semua Notifikasi
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}