import React from "react"
import { cn } from "../../lib/utils"

const textVariants = {
  default: "bg-primary text-white shadow-lg shadow-primary/10 hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
  outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
  ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 text-slate-700 dark:text-slate-300",
  link: "text-primary underline-offset-4 hover:underline",
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50",
        {
          "h-12 px-4 py-3": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "p-2": size === "icon",
        },
        textVariants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
