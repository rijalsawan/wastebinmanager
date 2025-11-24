"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface CategoryBarChartProps {
  data: Array<{
    category: string
    value: number
  }>
}

const COLORS: Record<string, string> = {
  PLASTIC: "#1a73e8",    // Google Blue
  PAPER: "#a142f4",      // Purple
  METAL: "#5f6368",      // Google Gray
  ORGANIC: "#34a853",    // Google Green
  GLASS: "#24c1e0",      // Cyan
  EWASTE: "#ea4335",     // Google Red
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" vertical={false} />
          <XAxis 
            dataKey="category" 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
            labelStyle={{ fontSize: '12px', color: '#5f6368', marginBottom: '8px' }}
            cursor={{ fill: '#f1f3f4', opacity: 0.5 }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Fill Level']}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category] || "#1a73e8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
