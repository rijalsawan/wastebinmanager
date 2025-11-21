import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gradient?: boolean
  glow?: boolean
}

export function Card({ className, hover = false, gradient = false, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm transition-all duration-300 relative overflow-hidden",
        hover && "hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1 cursor-pointer",
        gradient && "bg-linear-to-br from-white via-white to-gray-50/30",
        glow && "before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-linear-to-br before:from-blue-200 before:via-purple-200 before:to-pink-200 before:-z-10 before:blur-sm before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        "border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-600", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"
