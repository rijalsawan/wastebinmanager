import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "success" | "premium"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] shadow-sm hover:shadow-lg relative overflow-hidden group"
    
    const variants = {
      default: "bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 text-white hover:from-blue-700 hover:via-blue-700 hover:to-blue-600 focus:ring-blue-500/30 shadow-blue-200/50",
      outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-blue-500/20 shadow-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 shadow-none focus:ring-gray-200",
      destructive: "bg-gradient-to-r from-red-600 via-red-600 to-red-500 text-white hover:from-red-700 hover:via-red-700 hover:to-red-600 focus:ring-red-500/30 shadow-red-200/50",
      success: "bg-gradient-to-r from-green-600 via-green-600 to-green-500 text-white hover:from-green-700 hover:via-green-700 hover:to-green-600 focus:ring-green-500/30 shadow-green-200/50",
      premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:ring-purple-500/30 shadow-purple-300/50 animate-gradient bg-[length:200%_auto]",
    }
    
    const sizes = {
      sm: "text-sm px-4 py-2 h-9",
      md: "text-base px-6 py-2.5 h-11",
      lg: "text-lg px-8 py-3.5 h-14",
      icon: "h-10 w-10 p-0",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
