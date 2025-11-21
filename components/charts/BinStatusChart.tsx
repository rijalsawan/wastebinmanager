"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BinStatusChartProps {
  data: {
    active: number
    critical: number
    empty: number
  }
}

const COLORS = {
  active: "#22c55e",    // green
  critical: "#ef4444",  // red
  empty: "#94a3b8",     // slate
}

const LABELS = {
  active: "Active Bins",
  critical: "Critical Bins",
  empty: "Empty Bins",
}

export function BinStatusChart({ data }: BinStatusChartProps) {
  const chartData = [
    { name: LABELS.active, value: data.active, color: COLORS.active },
    { name: LABELS.critical, value: data.critical, color: COLORS.critical },
    { name: LABELS.empty, value: data.empty, color: COLORS.empty },
  ].filter(item => item.value > 0)

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <style jsx>{`
        :global(.recharts-tooltip-cursor) {
          fill: none !important;
          display: none !important;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            {Object.entries(COLORS).map(([key, color]) => (
              <linearGradient key={key} id={`gradientPie${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradientPie${Object.keys(COLORS).find(k => COLORS[k as keyof typeof COLORS] === entry.color)})`}
                stroke="white"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            formatter={(value: number) => [value, 'Bins']}
            cursor={false}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

