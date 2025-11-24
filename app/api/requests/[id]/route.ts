import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET /api/requests/:id - Get a single request
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

    const requestData = await prisma.request.findUnique({
      where: { id },
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
            currentLevel: true,
          },
        },
      },
    })

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Regular users can only view their own requests
    if (session.user.role !== "ADMIN" && requestData.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(requestData)
  } catch (error) {
    console.error("GET /api/requests/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/requests/:id - Update request status (Admin only)
const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  adminNotes: z.string().optional(),
})

const updateRequestSchema = z.object({
  type: z.enum(["COLLECTION", "MAINTENANCE", "REPAIR", "COMPLAINT"]).optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  binId: z.string().nullable().optional(),
})

// PUT /api/requests/:id - Update request details (Admin or owner)
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
    const validatedData = updateRequestSchema.parse(body)

    // Check if request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Only admin or request owner can update
    if (session.user.role !== "ADMIN" && existingRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Prepare update data with proper typing
    const updateData: any = {}
    if (validatedData.type) updateData.type = validatedData.type
    if (validatedData.description) updateData.description = validatedData.description
    if (validatedData.priority) updateData.priority = validatedData.priority
    if (validatedData.binId !== undefined) updateData.binId = validatedData.binId

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors with specific field messages
      const fieldErrors = error.issues.map(issue => {
        const field = issue.path.join('.')
        return `${field}: ${issue.message}`
      })
      
      return NextResponse.json(
        { 
          error: fieldErrors.join(', '),
          details: error.issues 
        },
        { status: 400 }
      )
    }

    console.error("PUT /api/requests/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can update request status
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // Check if request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json(updatedRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors with specific field messages
      const fieldErrors = error.issues.map(issue => {
        const field = issue.path.join('.')
        return `${field}: ${issue.message}`
      })
      
      return NextResponse.json(
        { 
          error: fieldErrors.join(', '),
          details: error.issues 
        },
        { status: 400 }
      )
    }

    console.error("PATCH /api/requests/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/requests/:id - Delete a request (Admin or request owner)
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

    const requestData = await prisma.request.findUnique({
      where: { id },
    })

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Only admin or request owner can delete
    if (session.user.role !== "ADMIN" && requestData.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.request.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Request deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/requests/:id error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
