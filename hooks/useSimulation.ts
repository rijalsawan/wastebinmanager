"use client"

import { useEffect, useRef, useState } from "react"

// Singleton state to persist across component mounts
let globalIsRunning = false
let globalInterval: NodeJS.Timeout | null = null

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(globalIsRunning)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const runSimulation = async () => {
    try {
      const response = await fetch("/api/simulation", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setLastUpdate(new Date(data.timestamp))
        
        // Log to console for debugging
        if (data.updates && data.updates.length > 0) {
          console.log("🔄 Simulation update:", data.updates.slice(0, 3))
        }
      }
    } catch (error) {
      console.error("Error running simulation:", error)
    }
  }

  const startSimulation = () => {
    if (globalIsRunning) return

    globalIsRunning = true
    setIsRunning(true)
    
    runSimulation() // Run immediately
    
    // Clear any existing interval
    if (globalInterval) {
      clearInterval(globalInterval)
    }

    // Run every 15 seconds for dramatic demo effect
    globalInterval = setInterval(() => {
      runSimulation()
    }, 15000)

    intervalRef.current = globalInterval
  }

  const stopSimulation = () => {
    globalIsRunning = false
    setIsRunning(false)
    
    if (globalInterval) {
      clearInterval(globalInterval)
      globalInterval = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Sync with global state when component mounts
  useEffect(() => {
    setIsRunning(globalIsRunning)
    intervalRef.current = globalInterval
  }, [])

  // Cleanup on unmount (but keep global interval running)
  useEffect(() => {
    return () => {
      // Don't clear the global interval on unmount
      // This keeps simulation running across page navigation
      intervalRef.current = null
    }
  }, [])

  return {
    isRunning,
    lastUpdate,
    startSimulation,
    stopSimulation,
    runSimulation,
  }
}
