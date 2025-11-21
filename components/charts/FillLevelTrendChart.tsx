"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FillLevelTrendChartProps {
  data: Array<{
    time: string
    level: number
  }>
}

export function FillLevelTrendChart({ data }: FillLevelTrendChartProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <style jsx>{`
        :global(.recharts-tooltip-cursor) {
          fill: none !important;
          display: none !important;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Fill Level']}
            cursor={{ stroke: 'none', fill: 'none' }}
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="level"
            stroke="url(#trendGradient)"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

