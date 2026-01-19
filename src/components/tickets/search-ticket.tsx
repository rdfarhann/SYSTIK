"use client"

import { Search, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition, useState } from "react"

export default function TicketSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  

  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (value: string) => {
    setQuery(value) 

    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="relative w-full max-w-sm group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className={`h-4 w-4 transition-colors ${
          isPending ? 'text-primary animate-pulse' : 'text-slate-400 group-focus-within:text-primary'
        }`} />
      </div>
      <input
        type="text"
        value={query} 
        placeholder="Search title, ID, or description..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
      />
      {query && (
        <button 
          onClick={() => handleSearch("")} 
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}