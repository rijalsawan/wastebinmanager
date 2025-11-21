import { LucideIcon } from "lucide-react"
import { Card } from "./ui/Card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "amber" | "red" | "purple"
}

export function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-slate-500 ml-2">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("p-4 rounded-xl", colorClasses[color])}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </Card>
  )
}
