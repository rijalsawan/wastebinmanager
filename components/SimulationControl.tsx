"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { Play, Pause, RotateCcw, Zap, Activity } from "lucide-react"
import { useSimulation } from "@/hooks/useSimulation"

interface SimulationStats {
  totalBins: number
  lowPriority: number
  mediumPriority: number
  highPriority: number
  averageFillLevel: number
}

export function SimulationControl() {
  const { isRunning, lastUpdate, startSimulation, stopSimulation } = useSimulation()
  const [stats, setStats] = useState<SimulationStats | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Fetch initial stats
  useEffect(() => {
    fetchStats()
  }, [])

  // Refresh stats when lastUpdate changes
  useEffect(() => {
    if (lastUpdate) {
      fetchStats()
    }
  }, [lastUpdate])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/simulation")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const runManualUpdate = async () => {
    try {
      const response = await fetch("/api/simulation", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        
        // Add new logs (keep last 10)
        if (data.updates && data.updates.length > 0) {
          setLogs((prev) => [...data.updates, ...prev].slice(0, 10))
        }
      }
    } catch (error) {
      console.error("Error running simulation:", error)
    }
  }

  const resetSimulation = async () => {
    stopSimulation()
    setLogs([])
    await fetchStats()
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>IoT Sensor Simulation</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Simulates realistic waste bin fill patterns
                </p>
              </div>
            </div>
            <Badge variant={isRunning ? "success" : "default"}>
              {isRunning ? (
                <>
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Running
                </>
              ) : (
                "Stopped"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Control Buttons */}
          <div className="flex space-x-3">
            {!isRunning ? (
              <Button onClick={startSimulation} className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            ) : (
              <Button onClick={stopSimulation} variant="destructive" className="flex items-center">
                <Pause className="w-4 h-4 mr-2" />
                Stop Simulation
              </Button>
            )}
            <Button onClick={runManualUpdate} variant="outline" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Run Once
            </Button>
            <Button onClick={resetSimulation} variant="outline" className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Bins</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalBins}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Low Priority</p>
                <p className="text-2xl font-bold text-green-600">{stats.lowPriority}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Medium Priority</p>
                <p className="text-2xl font-bold text-amber-600">{stats.mediumPriority}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Avg Fill Level</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.averageFillLevel.toFixed(0)}%
                </p>
              </div>
            </div>
          )}

          {/* Last Update */}
          {lastUpdate && (
            <p className="text-xs text-slate-400 pt-2 border-t">
              Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Activity Log */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.includes("EMPTIED")
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
