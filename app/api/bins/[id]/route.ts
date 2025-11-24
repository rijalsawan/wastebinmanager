import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET /api/bins/:id - Get a single bin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const bin = await prisma.bin.findUnique({
      where: { id },
      include: {
        requests: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })

    if (!bin) {
      return NextResponse.json({ error: "Bin not found" }, { status: 404 })
    }

    return NextResponse.json(bin)
  } catch (error) {
    console.error("GET /api/bins/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/bins/:id - Update a bin (Admin only)
const updateBinSchema = z.object({
  binId: z.string().optional(),
  category: z.enum(["PLASTIC", "PAPER", "METAL", "ORGANIC", "GLASS", "EWASTE"]).optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().positive().optional(),
  currentLevel: z.number().min(0).max(100).optional(),
  status: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateBinSchema.parse(body)

    // Check if bin exists
    const existingBin = await prisma.bin.findUnique({
      where: { id },
    })

    if (!existingBin) {
      return NextResponse.json({ error: "Bin not found" }, { status: 404 })
    }

    // Check if user is admin or owner
    if (session.user.role !== "ADMIN" && existingBin.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // If updating binId, check for duplicates
    if (validatedData.binId && validatedData.binId !== existingBin.binId) {
      const duplicate = await prisma.bin.findUnique({
        where: { binId: validatedData.binId },
      })
      if (duplicate) {
        return NextResponse.json(
          { error: "Bin ID already exists" },
          { status: 400 }
        )
      }
    }

    // Auto-update status based on currentLevel if provided
    let status = validatedData.status
    if (validatedData.currentLevel !== undefined && !status) {
      if (validatedData.currentLevel <= 50) {
        status = "LOW"
      } else if (validatedData.currentLevel <= 80) {
        status = "MEDIUM"
      } else {
        status = "HIGH"
      }
    }

    const bin = await prisma.bin.update({
      where: { id },
      data: {
        ...validatedData,
        ...(status && { status }),
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

    console.error("PUT /api/bins/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/bins/:id - Delete a bin (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if bin exists
    const bin = await prisma.bin.findUnique({
      where: { id },
    })

    if (!bin) {
      return NextResponse.json({ error: "Bin not found" }, { status: 404 })
    }

    // Check if user is admin or owner
    if (session.user.role !== "ADMIN" && bin.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.bin.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Bin deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/bins/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
