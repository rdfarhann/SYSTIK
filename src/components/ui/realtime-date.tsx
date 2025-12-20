"use client"

import { useEffect, useState } from "react"

export default function RealtimeDate() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date())
    }, 1000) // update tiap detik

    return () => clearInterval(interval)
  }, [])

  return (
    <span>
      {date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </span>
  )
}
