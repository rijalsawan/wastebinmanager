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
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour" 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            formatter={(value: number) => [value, 'Waste Events']}
            cursor={{ stroke: 'none', fill: 'none' }}
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
