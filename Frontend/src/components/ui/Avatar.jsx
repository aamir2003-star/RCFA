import React from 'react'
import { cn } from '../../lib/utils'

export function Avatar({ src, alt, fallback, className }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-slate-100", className)}>
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
          {fallback}
        </div>
      )}
    </div>
  )
}
