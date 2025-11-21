"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface CategoryBarChartProps {
  data: Array<{
    category: string
    value: number
  }>
}

const COLORS: Record<string, string> = {
  PLASTIC: "#3b82f6",    // blue
  PAPER: "#8b5cf6",      // violet
  METAL: "#64748b",      // slate
  ORGANIC: "#22c55e",    // green
  GLASS: "#06b6d4",      // cyan
  EWASTE: "#ef4444",     // red
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '300px'
    }}>
      <style jsx>{`
        :global(.recharts-tooltip-cursor) {
          fill: none !important;
          display: none !important;
        }
        :global(.recharts-active-shape) {
          display: none !important;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barSize={50}
        >
          <defs>
            {Object.entries(COLORS).map(([key, color]) => (
              <linearGradient key={key} id={`gradient${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.4}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="category" 
            stroke="#6b7280"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#1f2937' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Fill Level']}
            cursor={{ fill: 'none', stroke: 'none' }}
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive={false}
          />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            minPointSize={5}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient${entry.category})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
