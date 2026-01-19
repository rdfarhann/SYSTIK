"use client"

import { useEffect, useState } from "react"

export function FormattedDate({ date, format = "full" }: { date: string, format?: "full" | "short" }) {

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setHasMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])


  if (!hasMounted) {
    return <span className="invisible italic text-slate-400">...</span>
  }

  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = format === "short" 
    ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }
    : { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };

  return (
    <span suppressHydrationWarning>
      {dateObj.toLocaleString('id-ID', options)}
    </span>
  )
}