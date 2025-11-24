"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PeakHoursChartProps {
  data: Array<{
    hour: string
    activity: number
  }>
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" vertical={false} />
          <XAxis 
            dataKey="hour" 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
            interval={3}
          />
          <YAxis 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
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
            cursor={{ stroke: '#dadce0', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(value: number) => [value, 'Waste Events']}
          />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#1a73e8"
            strokeWidth={3}
            dot={{ fill: '#1a73e8', strokeWidth: 2, r: 3, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
