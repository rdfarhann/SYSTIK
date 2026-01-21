"use client"
import { Clock, XCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface SLAStatusBadgeProps {
  deadline: string;
  status: string;
  slaStatus: "PENDING" | "ACHIEVED" | "BREACHED" | null;
}

export function SLAStatusBadge({ deadline, status, slaStatus }: SLAStatusBadgeProps) {
  const isOverdue = new Date() > new Date(deadline);

  const isFinalStatus = status === "CLOSED" || status === "CANCELED";

  if (isFinalStatus) {
    if (status === "CANCELED") {
      return (
        <div className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-1">
          <XCircle size={10} /> SLA STOPPED
        </div>
      );
    }

    const isAchieved = slaStatus === "ACHIEVED";
    return (
      <div className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${
        isAchieved 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-red-50 text-red-700 border-red-200"
      }`}>
        {isAchieved ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
        {isAchieved ? "SLA ACHIEVED" : "SLA BREACHED"}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold shadow-sm ${
      isOverdue 
        ? "bg-red-500 text-white animate-pulse" 
        : "bg-blue-50 text-blue-600 border border-blue-100"
    }`}>
      <Clock size={10} />
      {isOverdue ? "OVERDUE" : "ON TRACK"}
    </div>
  );
}