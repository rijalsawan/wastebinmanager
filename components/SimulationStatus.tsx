"use client"

import { Badge } from "./ui/Badge"
import { Activity, Zap } from "lucide-react"
import { useSimulation } from "@/hooks/useSimulation"

export function SimulationStatus() {
  const { isRunning, lastUpdate } = useSimulation()

  if (!isRunning && !lastUpdate) return null

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
      {isRunning ? (
        <>
          <Activity className="w-4 h-4 text-green-600 animate-pulse" />
          <span className="text-xs font-medium text-slate-700">
            IoT Simulation Active
          </span>
          <Badge variant="success" className="text-xs">
            Live
          </Badge>
        </>
      ) : (
        <>
          <Zap className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">
            Simulation Paused
          </span>
        </>
      )}
      {lastUpdate && (
        <span className="text-xs text-slate-400">
          • Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
