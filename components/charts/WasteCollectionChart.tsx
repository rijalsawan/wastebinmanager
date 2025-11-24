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
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a142f4" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#a142f4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#9aa0a6"
            tick={{ fill: '#5f6368', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}L`}
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
          />
          <Area
            type="monotone"
            dataKey="daily"
            stroke="#1a73e8"
            strokeWidth={2}
            fill="url(#colorDaily)"
            name="Daily Collection"
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="weekly"
            stroke="#a142f4"
            strokeWidth={2}
            fill="url(#colorWeekly)"
            name="Weekly Average"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
