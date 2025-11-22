import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Mock fetch single dataset
    const dataset = {
      id,
      title: "Real-Time Stock Market Data",
      description: "Live stock prices, volumes, and technical indicators for major exchanges.",
      category: "Financial",
      price: 499,
      seller: "0xabc123...",
      verified: true,
      encrypted: true,
      zkProofStatus: "verified",
      downloads: 1204,
      rating: 4.8,
      views: 2847,
    }

    return NextResponse.json({ data: dataset })
  } catch (error) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Mock update dataset
    const updatedDataset = { id, ...body }

    return NextResponse.json({ data: updatedDataset })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update dataset" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get session to verify ownership
    const { auth } = await import("@/auth")
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const { db } = await import("@/lib/db")
    const { datasets, users } = await import("@/lib/schema")
    const { eq, and } = await import("drizzle-orm")

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete dataset (only if user owns it)
    const result = await db
      .delete(datasets)
      .where(and(
        eq(datasets.id, id),
        eq(datasets.sellerId, user[0].id)
      ))
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: "Dataset not found or you don't have permission" }, { status: 404 })
    }

    return NextResponse.json({ message: "Dataset deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete dataset" }, { status: 500 })
  }
}
