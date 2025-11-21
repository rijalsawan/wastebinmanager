import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border-2 bg-white px-4 py-3 text-sm placeholder:text-gray-400",
            "focus:outline-none focus:ring-4 transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            "hover:border-gray-300",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"
