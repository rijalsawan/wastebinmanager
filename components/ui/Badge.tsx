import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple" | "pink"
  size?: "sm" | "md" | "lg"
  dot?: boolean
  pulse?: boolean
}

export function Badge({ 
  className, 
  variant = "default", 
  size = "md", 
  dot = false,
  pulse = false,
  children,
  ...props 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-linear-to-r from-blue-50 via-blue-50 to-blue-100 text-blue-700 border-blue-200/50",
    success: "bg-linear-to-r from-green-50 via-green-50 to-green-100 text-green-700 border-green-200/50",
    warning: "bg-linear-to-r from-amber-50 via-amber-50 to-amber-100 text-amber-700 border-amber-200/50",
    error: "bg-linear-to-r from-red-50 via-red-50 to-red-100 text-red-700 border-red-200/50",
    info: "bg-linear-to-r from-cyan-50 via-cyan-50 to-cyan-100 text-cyan-700 border-cyan-200/50",
    purple: "bg-linear-to-r from-purple-50 via-purple-50 to-purple-100 text-purple-700 border-purple-200/50",
    pink: "bg-linear-to-r from-pink-50 via-pink-50 to-pink-100 text-pink-700 border-pink-200/50",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  }

  const dotColors = {
    default: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-amber-600",
    error: "bg-red-600",
    info: "bg-cyan-600",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold shadow-sm border transition-all duration-200 whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span 
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            pulse && "animate-pulse",
            dotColors[variant]
          )} 
        />
      )}
      {children}
    </span>
  )
}
