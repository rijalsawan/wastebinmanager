"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WasteCollectionChartProps {
  data: Array<{
    date: string
    daily: number
    weekly: number
  }>
}

export function WasteCollectionChart({ data }: WasteCollectionChartProps) {
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
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickFormatter={(value) => `${value}L`}
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
            cursor={{ stroke: 'none', fill: 'none' }}
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="daily"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorDaily)"
            name="Daily Collection"
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          <Area
            type="monotone"
            dataKey="weekly"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorWeekly)"
            name="Weekly Average"
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
