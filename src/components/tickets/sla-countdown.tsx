"use client"
import { useState, useEffect } from "react";
import { Timer, AlertCircle, CheckCircle2 } from "lucide-react";

export function SLACountdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ 
    hours: "00", minutes: "00", seconds: "00", isOverdue: false 
  });
  const target = new Date(deadline);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        setTimeLeft(prev => ({ ...prev, isOverdue: true }));
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isOverdue: false
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.isOverdue) {
    return (
      <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.1em]">SLA Status</p>
          <p className="text-sm font-bold text-red-700">Resolution Time Breached</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/[0.02]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            <Timer className="h-4 w-4 text-slate-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Resolution Target
          </span>
        </div>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold text-slate-800 tracking-tight">
          {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Remaining</span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium">
          Deadline: {target.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
          <CheckCircle2 className="h-3 w-3" />
          ON TRACK
        </div>
      </div>
    </div>
  );
}