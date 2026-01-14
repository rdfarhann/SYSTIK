"use client"

import { useEffect, useState, useCallback } from "react"
import { Bell, Info, Check, Loader2 } from "lucide-react" 
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
import { Button } from "@/components/ui/button" 

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
  const [isUpdating, setIsUpdating] = useState(false) 
  const supabase = createClient()

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0 || isUpdating) return

    setIsUpdating(true)

    if (userId) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (!error) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      }
    }
    setIsUpdating(false)
  }, [userId, supabase, notifications, isUpdating])

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
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false) 
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setNotifications(data as NotificationItem[])
    }

    fetchNotifs()

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
          if (newNotif.user_id === userId) {
            setNotifications(prev => [newNotif, ...prev])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase])

  const activeNotifs = notifications.filter(n => !n.is_read)
  const unreadCount = activeNotifs.length

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

      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-white">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-xs uppercase text-slate-900 tracking-tight">Notification</span>
            <span className="text-[10px] font-bold text-primary uppercase">
              {unreadCount} New
            </span>
          </div>

          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation(); 
                markAllAsRead();
              }}
              disabled={isUpdating}
              className="h-7 px-2 text-[10px] font-black text-primary hover:bg-primary transition-all gap-1.5"
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Mark All as Read
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator className="m-0" />
        
        <ScrollArea className="h-[350px]">
          {activeNotifs.length > 0 ? (
            activeNotifs.map((n) => (
              <div key={n.id} className="p-4 flex items-start gap-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="mt-1 shrink-0">
                  <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center">
                    <Info className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-[11px] font-black uppercase text-slate-900 truncate">
                    {n.title}
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed text-slate-500 break-words">
                    {n.message}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                    {new Date(n.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
              <Bell className="h-8 w-8 opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">
                Empty
              </span>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
