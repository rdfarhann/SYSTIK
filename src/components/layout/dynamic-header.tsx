"use client"

import { usePathname } from "next/navigation"

export function DynamicHeader() {
  const pathname = usePathname()
  
  const getHeaderInfo = () => {
    const segments = pathname.split("/").filter(Boolean)
    const isDetail = segments.length > 2 && !isNaN(Number(segments[segments.length - 1]))
    const ticketId = isDetail ? segments[segments.length - 1] : null

    if (pathname === "/dashboard") {
      return { title: "Systik App", subtitle: "Support System" }
    }
    if (pathname.includes("/admin/tickets")) {
      return { title: "Ticket Management", subtitle: "Admin ticket control" }
    }
    if (pathname.includes("/admin/user-management")) {
      return { title: "User Managament", subtitle: "Application user management" }
    }
    if (pathname.includes("/my-ticket")) {
      return { 
        title: isDetail ? `Ticket #${ticketId}` : "My Tickets", 
        subtitle: isDetail ? "Conversation history" : "List of your requests" 
      }
    }
    return { title: "Systik App", subtitle: "Support System" }
  }

  const { title, subtitle } = getHeaderInfo()

  return (
    <div className="flex flex-col justify-center min-w-0 py-1">
      <h1 className="text-[14px] font-extrabold text-slate-900 leading-[1.2] truncate tracking-tight">
        {title}
      </h1>
      <p className="text-[10px] font-medium text-slate-400 leading-none mt-0.5 truncate uppercase tracking-wider opacity-80">
        {subtitle}
      </p>
    </div>
  )
}