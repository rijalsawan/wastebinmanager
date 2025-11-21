import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET /api/bins - List all bins with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}

    if (category && category !== "ALL") {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { binId: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    const bins = await prisma.bin.findMany({
      where,
      orderBy: { currentLevel: "desc" },
    })

    return NextResponse.json(bins)
  } catch (error) {
    console.error("GET /api/bins error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/bins - Create a new bin (Admin only)
const createBinSchema = z.object({
  binId: z.string().min(1, "Bin ID is required"),
  category: z.enum(["PLASTIC", "PAPER", "METAL", "ORGANIC", "GLASS", "EWASTE"]),
  location: z.string().min(1, "Location is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().positive().default(100),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createBinSchema.parse(body)

    // Check if bin ID already exists
    const existingBin = await prisma.bin.findUnique({
      where: { binId: validatedData.binId },
    })

    if (existingBin) {
      return NextResponse.json(
        { error: "Bin with this ID already exists" },
        { status: 400 }
      )
    }

    const bin = await prisma.bin.create({
      data: {
        ...validatedData,
        currentLevel: 0,
        status: "LOW",
      },
    })

    return NextResponse.json(bin, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("POST /api/bins error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
