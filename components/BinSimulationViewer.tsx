"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Trash2, TrendingUp, TrendingDown, Minus, Droplet } from "lucide-react"
import { useSimulation } from "@/hooks/useSimulation"

interface Bin {
  id: string
  binId: string
  location: string
  category: string
  fillLevel: number
  capacity: number
  status: string
  lastEmptied: string
  priority: "LOW" | "MEDIUM" | "HIGH"
}

const CATEGORY_COLORS = {
  GENERAL: { bg: "from-gray-400 to-gray-600", text: "text-gray-600", light: "bg-gray-50" },
  RECYCLING: { bg: "from-green-400 to-green-600", text: "text-green-600", light: "bg-green-50" },
  ORGANIC: { bg: "from-amber-400 to-amber-600", text: "text-amber-600", light: "bg-amber-50" },
  HAZARDOUS: { bg: "from-red-400 to-red-600", text: "text-red-600", light: "bg-red-50" },
}

const PRIORITY_CONFIG = {
  LOW: { variant: "default" as const, color: "text-green-600" },
  MEDIUM: { variant: "warning" as const, color: "text-amber-600" },
  HIGH: { variant: "error" as const, color: "text-red-600" },
}

export function BinSimulationViewer() {
  const { lastUpdate } = useSimulation()
  const [bins, setBins] = useState<Bin[]>([])
  const [previousFillLevels, setPreviousFillLevels] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchBins()
    const interval = setInterval(fetchBins, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [lastUpdate])

  const fetchBins = async () => {
    try {
      const response = await fetch("/api/bins")
      if (response.ok) {
        const data = await response.json()
        
        // Store previous fill levels before updating
        const prevLevels: Record<string, number> = {}
        bins.forEach(bin => {
          prevLevels[bin.id] = bin.fillLevel
        })
        setPreviousFillLevels(prevLevels)
        
        setBins(data)
      }
    } catch (error) {
      console.error("Error fetching bins:", error)
    }
  }

  const getTrendIcon = (binId: string, currentLevel: number) => {
    const prevLevel = previousFillLevels[binId]
    if (prevLevel === undefined) return <Minus className="w-4 h-4" />
    
    if (currentLevel > prevLevel) {
      return <TrendingUp className="w-4 h-4 text-red-500" />
    } else if (currentLevel < prevLevel) {
      return <TrendingDown className="w-4 h-4 text-green-500" />
    }
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getFillLevelColor = (fillLevel: number) => {
    if (fillLevel >= 80) return "bg-red-500"
    if (fillLevel >= 60) return "bg-amber-500"
    if (fillLevel >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            Live Bin Fill Levels
          </CardTitle>
          <Badge variant="info" size="sm">
            {bins.length} Bins
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Real-time visualization of bin capacity updates
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bins.map((bin, index) => {
            const categoryColor = CATEGORY_COLORS[bin.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.GENERAL
            const priorityConfig = PRIORITY_CONFIG[bin.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW
            const fillPercentage = (bin.fillLevel / bin.capacity) * 100
            
            return (
              <Card
                key={bin.id}
                hover
                className="group relative overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Category Color Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${categoryColor.bg}`}></div>
                
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {bin.binId}
                        </h4>
                        {getTrendIcon(bin.id, bin.fillLevel)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{bin.location}</p>
                    </div>
                    
                    <div className={`p-2 rounded-lg ${categoryColor.light} shrink-0`}>
                      <Trash2 className={`w-4 h-4 ${categoryColor.text}`} />
                    </div>
                  </div>

                  {/* Fill Level Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-700">Fill Level</span>
                      <span className={`text-sm font-bold ${priorityConfig.color}`}>
                        {fillPercentage.toFixed(2)}%
                      </span>
                    </div>
                    
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${getFillLevelColor(fillPercentage)} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{bin.fillLevel.toFixed(2)}L</span>
                      <span>{bin.capacity}L</span>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Badge variant={bin.status === "ACTIVE" ? "success" : "default"} size="sm">
                      {bin.status}
                    </Badge>
                    <Badge variant={priorityConfig.variant} size="sm" pulse={bin.priority === "HIGH"}>
                      {bin.priority}
                    </Badge>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
              </Card>
            )
          })}
        </div>

        {bins.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No bins found. Start the simulation to see live updates.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
