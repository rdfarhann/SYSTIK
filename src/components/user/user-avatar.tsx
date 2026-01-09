"use client" 

import { useState } from "react"
import Image from "next/image" //

interface UserAvatarProps {
  src?: string | null
  fallback: string
  unoptimized?: boolean;
}

export default function UserAvatar({ src, fallback, unoptimized = false }: UserAvatarProps) {
  const [error, setError] = useState(false)

  return (
    <div className="relative h-8 w-8 rounded-full bg-primary overflow-hidden flex items-center justify-center text-[12px] text-white font-black shadow-sm ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all">
      {src && !error ? (
        <Image
          src={src}
          alt="Profile"
          fill 
          unoptimized={unoptimized} 
          className="object-cover" 
          quality={100} 
          onError={() => setError(true)}
          priority 
        />
      ) : (
        <span className="tracking-tighter">{fallback}</span>
      )}
    </div>
  )
}