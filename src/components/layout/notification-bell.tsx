"use client"

import { useEffect, useState, useCallback } from "react"
import { Bell, Info, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Interface sesuai skema image_4a81ab.png
interface NotificationItem {
  id: string
  user_id: string
  ticket_id: number | null
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const markAllAsRead = useCallback(async () => {
    // Update state lokal
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    
    // Update ke database agar permanen
    if (userId) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
    }
  }, [userId, supabase])

  useEffect(() => {
    const initSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setUserRole(profile?.role || 'user')
      }
    }
    initSession()
  }, [supabase])

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!userId) return
      
      // Query otomatis terfilter oleh RLS
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setNotifications(data as NotificationItem[])
    }

    fetchNotifs()

    // Realtime Listener
    const channel = supabase
      .channel('notif-channel')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        },
        (payload) => {
          const newNotif = payload.new as NotificationItem
          // Logika filter di sisi client (Admin dapat semua, User hanya miliknya)
          if (userRole === 'admin' || newNotif.user_id === userId) {
            setNotifications(prev => [newNotif, ...prev])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, userRole, supabase])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) markAllAsRead() }}>
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

      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-slate-200 rounded-2xl overflow-hidden">
        <DropdownMenuLabel className="p-4 flex justify-between items-center bg-white">
          <span className="font-bold text-sm uppercase">Notifikasi</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase font-black">
            {unreadCount} Baru
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        
        <ScrollArea className="h-[350px]">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="p-4 items-start gap-3 border-b border-slate-50 last:border-0">
                <div className="mt-1">
                  <Info className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className={`text-[11px] font-black uppercase ${n.is_read ? 'text-slate-400' : 'text-slate-900'}`}>
                    {n.title}
                  </p>
                  <p className={`text-xs font-medium leading-relaxed ${n.is_read ? 'text-slate-400' : 'text-slate-500'}`}>
                    {n.message}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    {new Date(n.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 text-[10px] font-black uppercase italic">
              Kosong
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}