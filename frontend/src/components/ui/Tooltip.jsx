import React, { useState } from 'react'
import { cn } from '../../lib/utils'

export function Tooltip({ children, content, className }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative flex items-center justify-center w-max"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn("absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-100 dark:bg-slate-700", className)}>
          {content}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[4px] border-transparent border-b-slate-800 dark:border-b-slate-700" />
        </div>
      )}
    </div>
  )
}
