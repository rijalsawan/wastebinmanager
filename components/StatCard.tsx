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
    blue: "bg-[rgb(232,240,254)] text-[rgb(26,115,232)]",
    green: "bg-[rgb(206,234,214)] text-[rgb(52,168,83)]",
    amber: "bg-[rgb(254,239,195)] text-[rgb(251,188,4)]",
    red: "bg-[rgb(250,210,207)] text-[rgb(234,67,53)]",
    purple: "bg-[rgb(243,232,253)] text-[rgb(161,66,244)]",
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[rgb(95,99,104)]">{title}</p>
          <p className="text-3xl font-normal text-[rgb(32,33,36)] mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-[rgb(52,168,83)]" : "text-[rgb(234,67,53)]"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-[rgb(95,99,104)] ml-2">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}
