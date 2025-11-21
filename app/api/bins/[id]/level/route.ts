import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// PATCH /api/bins/:id/level - Update bin fill level (IoT Simulation)
const updateLevelSchema = z.object({
  currentLevel: z.number().min(0).max(100),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateLevelSchema.parse(body)

    // Check if bin exists
    const existingBin = await prisma.bin.findUnique({
      where: { id },
    })

    if (!existingBin) {
      return NextResponse.json({ error: "Bin not found" }, { status: 404 })
    }

    // Auto-update status based on level
    let status: "LOW" | "MEDIUM" | "HIGH"
    if (validatedData.currentLevel <= 50) {
      status = "LOW"
    } else if (validatedData.currentLevel <= 80) {
      status = "MEDIUM"
    } else {
      status = "HIGH"
    }

    const bin = await prisma.bin.update({
      where: { id },
      data: {
        currentLevel: validatedData.currentLevel,
        status,
      },
    })

    return NextResponse.json(bin)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("PATCH /api/bins/:id/level error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
