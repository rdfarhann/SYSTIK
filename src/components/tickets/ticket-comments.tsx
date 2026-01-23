"use client"

import React, { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  Clock,
  ChevronDown,
  Layout,
  X
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Profile {
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

interface Comment {
  id: string
  message: string
  user_id: string
  created_at: string
  profiles: Profile | null 
}

interface TicketCommentsProps {
  ticketId: number 
  initialComments: Comment[]
  currentUserId: string
}

export default function TicketComments({ ticketId, initialComments, currentUserId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newMessage, setNewMessage] = useState<string>("")
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)

  const scrollRef = useRef<HTMLDivElement>(null) 
  const supabase = createClient()

  useEffect(() => {
    const lastRead = localStorage.getItem(`ticket_last_read_${ticketId}`)
    if (!lastRead) {
      setUnreadCount(initialComments.length)
    } else {
      const newOnes = initialComments.filter(c => new Date(c.created_at) > new Date(lastRead))
      setUnreadCount(newOnes.length)
    }
  }, [ticketId, initialComments])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      localStorage.setItem(`ticket_last_read_${ticketId}`, new Date().toISOString())
    }
  }, [isOpen, ticketId])

  useEffect(() => {
    const channel = supabase
      .channel(`ticket-chat-${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_comments', filter: `ticket_id=eq.${ticketId}` },
        async (payload) => {
          const { data: profileData } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", payload.new.user_id).single();
          const newComment: Comment = {
            id: payload.new.id as string,
            message: payload.new.message as string,
            user_id: payload.new.user_id as string,
            created_at: payload.new.created_at as string,
            profiles: profileData || { full_name: "User", avatar_url: null, role: "USER" }
          };
          setComments((prev) => prev.find(c => c.id === newComment.id) ? prev : [...prev, newComment]);
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1)
          } else {
            localStorage.setItem(`ticket_last_read_${ticketId}`, new Date().toISOString())
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel) };
  }, [ticketId, supabase, isOpen]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [comments, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      const { error } = await supabase.from("ticket_comments").insert([{ ticket_id: ticketId, user_id: currentUserId, message: newMessage.trim() }]);
      if (error) throw error;
      setNewMessage("");
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Error");
    } finally { setIsSending(false); }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl shadow-xl bg-[#007a33] hover:bg-[#005c26] text-white relative transition-all active:scale-95 border border-white/10"
          >
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
            {!isOpen && unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-red-600 text-[10px] font-bold text-white border border-white shadow-lg animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent 
          side="top" 
          align="end" 
          sideOffset={12}

          className="w-[calc(100vw-32px)] sm:w-[400px] p-0 rounded-xl border border-slate-200 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.3)] overflow-hidden bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="px-5 py-4 bg-primary text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Layout className="h-4 w-4" />
              <h3 className="font-semibold text-xs uppercase tracking-[0.15em]">Ticket Discussion</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-md"
            >
              <X className="h-5 w-5 sm:hidden" />
              <ChevronDown className="h-5 w-5 hidden sm:block" />
            </Button>
          </div>
          <div 
            ref={scrollRef}
            className="h-[60vh] sm:h-[450px] overflow-y-auto p-5 space-y-6 bg-white custom-scrollbar"
          >
            {comments.map((comment) => {
              const isMe = comment.user_id === currentUserId;
              return (
                <div key={comment.id} className="flex flex-col space-y-1.5">
                  <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">
                      {comment.profiles?.full_name?.split(' ')[0] || "User"}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className={`px-4 py-3 rounded-lg text-[13px] leading-relaxed shadow-sm max-w-[85%] border ${
                    isMe 
                      ? 'bg-[#007a33] border-[#007a33] text-white self-end rounded-tr-none shadow-md' 
                      : 'bg-white border-slate-100 text-slate-700 self-start rounded-tl-none'
                  }`}>
                    {comment.message}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#007a33] outline-none shadow-sm transition-all"
              />
              <Button 
                type="submit" 
                disabled={isSending || !newMessage.trim()}
                className="h-[42px] px-4 rounded-lg bg-[#007a33] hover:bg-[#005c26] text-white flex-shrink-0 transition-all shadow-md"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}