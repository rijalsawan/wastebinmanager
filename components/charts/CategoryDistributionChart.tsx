"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { WASTE_CATEGORIES } from "@/lib/constants"

interface CategoryData {
  category: string
  count: number
  avgFillLevel: number
  totalCapacity: number
  currentTotal: number
}

interface CategoryDistributionChartProps {
  data: CategoryData[]
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: WASTE_CATEGORIES[item.category as keyof typeof WASTE_CATEGORIES].name,
    value: item.count,
    fillLevel: item.avgFillLevel.toFixed(1),
    color: WASTE_CATEGORIES[item.category as keyof typeof WASTE_CATEGORIES].color,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].name}</p>
          <p className="text-sm text-slate-600">
            Bins: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-slate-600">
            Avg Fill: <span className="font-medium">{payload[0].payload.fillLevel}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.every((item) => item.value === 0)) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => 
            `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
