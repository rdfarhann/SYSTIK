"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Send, User as UserIcon, Loader2 } from "lucide-react"

// Definisikan struktur profil user
interface Profile {
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

// Definisikan struktur komentar
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
  const scrollRef = useRef<HTMLDivElement>(null) // Untuk auto-scroll
  const supabase = createClient()

  // --- LOGIKA REALTIME ---
  useEffect(() => {
    const channel = supabase
      .channel(`ticket-chat-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_comments',
          filter: `ticket_id=eq.${ticketId}`,
        },
        async (payload) => {
          // Ambil profil pengirim untuk pesan yang baru masuk (Realtime)
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, role")
            .eq("id", payload.new.user_id)
            .single();

          const newComment: Comment = {
            id: payload.new.id,
            message: payload.new.message,
            user_id: payload.new.user_id,
            created_at: payload.new.created_at,
            profiles: profileData || { full_name: "User", avatar_url: null, role: "USER" }
          };

          setComments((prev) => {
            // Validasi agar tidak terjadi duplikasi pesan di UI pengirim
            if (prev.find(c => c.id === newComment.id)) return prev;
            return [...prev, newComment];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, supabase]);

  // --- AUTO SCROLL KE BAWAH ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      // Kita cukup insert ke database saja. 
      // Listener Realtime di atas yang akan bertugas menambahkan pesan ke daftar 'comments'.
      const { error: insertError } = await supabase
        .from("ticket_comments")
        .insert([
          { 
            ticket_id: ticketId, 
            user_id: currentUserId, 
            message: newMessage.trim() 
          }
        ]);

      if (insertError) throw new Error(insertError.message);
      setNewMessage("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengirim pesan";
      console.error("Detail Error:", errorMessage);
      alert(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 font-bold text-slate-800">
        <div className="bg-primary/10 p-1.5 rounded-lg">
          <Send className="h-4 w-4 text-primary" />
        </div>
        Discussion
      </div>

      <div 
        ref={scrollRef}
        className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
      >
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No conversation yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`flex gap-3 ${comment.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-slate-400" />
                )}
              </div>

              <div className={`flex flex-col max-w-[80%] ${comment.user_id === currentUserId ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {comment.profiles?.full_name || "Unknown User"}
                  </span>
                  
                  {/* Badge Role */}
                  {comment.profiles?.role && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border ${
                      comment.profiles.role.toUpperCase() === 'ADMIN' 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {comment.profiles.role.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  comment.user_id === currentUserId 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'
                }`}>
                  {comment.message}
                </div>
                <time className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                  {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-4 pt-4 border-t border-slate-100">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a reply..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <Button 
          type="submit" 
          disabled={isSending || !newMessage.trim()}
          size="sm" 
          className="absolute right-1.5 top-[21px] h-9 w-9 rounded-xl shadow-md"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}