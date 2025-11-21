import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET /api/requests - Get all requests (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const priority = searchParams.get("priority")

    // Build where clause
    const where: any = {}
    
    // Regular users can only see their own requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
    }

    if (status) where.status = status
    if (type) where.type = type
    if (priority) where.priority = priority

    const requests = await prisma.request.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        bin: {
          select: {
            binId: true,
            category: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("GET /api/requests error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/requests - Create a new request
const createRequestSchema = z.object({
  type: z.enum(["MANUAL_PICKUP", "MAINTENANCE", "HAZARDOUS_WASTE"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["NORMAL", "HIGH", "URGENT"]),
  binId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createRequestSchema.parse(body)

    // If binId is provided, verify it exists
    if (validatedData.binId) {
      const bin = await prisma.bin.findUnique({
        where: { id: validatedData.binId },
      })

      if (!bin) {
        return NextResponse.json(
          { error: "Bin not found" },
          { status: 404 }
        )
      }
    }

    const newRequest = await prisma.request.create({
      data: {
        ...validatedData,
        userId: session.user.id!,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        bin: {
          select: {
            binId: true,
            category: true,
            location: true,
          },
        },
      },
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("POST /api/requests error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
