import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { calculateFillIncrement, shouldAutoEmpty, formatSimulationLog } from "@/lib/iot-simulator"

const prisma = new PrismaClient()

/**
 * POST /api/simulation - Run one iteration of the IoT simulation
 * Updates all bins with realistic fill patterns
 */
export async function POST(request: NextRequest) {
  try {
    const bins = await prisma.bin.findMany()
    const updates: string[] = []

    for (const bin of bins) {
      let newLevel = bin.currentLevel
      let wasEmptied = false

      // Check if bin should be auto-emptied
      if (shouldAutoEmpty(bin.currentLevel, bin.category as any, bin.lastEmptied)) {
        newLevel = 0
        wasEmptied = true
        
        await prisma.bin.update({
          where: { id: bin.id },
          data: {
            currentLevel: 0,
            status: "LOW",
            lastEmptied: new Date(),
          },
        })
      } else {
        // Calculate fill increment (30 seconds = 0.5 minutes)
        const increment = calculateFillIncrement(
          bin.category as any,
          bin.currentLevel,
          30 // 30 seconds for demo mode
        )

        newLevel = Math.min(100, bin.currentLevel + increment)

        // Only update if there's a meaningful change (>0.01%)
        if (Math.abs(newLevel - bin.currentLevel) > 0.01) {
          // Determine new status
          const status = newLevel <= 50 ? "LOW" : newLevel <= 80 ? "MEDIUM" : "HIGH"

          await prisma.bin.update({
            where: { id: bin.id },
            data: {
              currentLevel: newLevel,
              status,
            },
          })
        }
      }

      // Log the update
      const logMessage = formatSimulationLog(
        bin.binId,
        bin.currentLevel,
        newLevel,
        bin.category as any,
        wasEmptied
      )
      updates.push(logMessage)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      binsUpdated: bins.length,
      updates,
      stats: {
        totalBins: bins.length,
        lowPriority: bins.filter(b => b.status === "LOW").length,
        mediumPriority: bins.filter(b => b.status === "MEDIUM").length,
        highPriority: bins.filter(b => b.status === "HIGH").length,
        averageFillLevel: bins.reduce((sum, b) => sum + b.currentLevel, 0) / bins.length,
      },
    })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json(
      { error: "Failed to run simulation" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/simulation - Get simulation status
 */
export async function GET() {
  try {
    const bins = await prisma.bin.findMany({
      select: {
        binId: true,
        category: true,
        currentLevel: true,
        status: true,
        lastEmptied: true,
      },
      orderBy: {
        currentLevel: "desc",
      },
    })

    const stats = {
      totalBins: bins.length,
      lowPriority: bins.filter(b => b.status === "LOW").length,
      mediumPriority: bins.filter(b => b.status === "MEDIUM").length,
      highPriority: bins.filter(b => b.status === "HIGH").length,
      averageFillLevel: bins.reduce((sum, b) => sum + b.currentLevel, 0) / bins.length,
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats,
      bins,
    })
  } catch (error) {
    console.error("Error getting simulation status:", error)
    return NextResponse.json(
      { error: "Failed to get simulation status" },
      { status: 500 }
    )
  }
}
