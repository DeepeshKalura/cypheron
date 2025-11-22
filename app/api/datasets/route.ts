import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { datasets } from "@/lib/schema"
import { desc, eq, gte, lte, and } from "drizzle-orm"


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sellerId = searchParams.get("sellerId")

    const conditions = []

    if (category && category !== "All") {
      conditions.push(eq(datasets.category, category))
    }


    if (minPrice) {
      conditions.push(gte(datasets.price, minPrice))
    }

    if (maxPrice) {
      conditions.push(lte(datasets.price, maxPrice))
    }
    if (sellerId) {
      conditions.push(eq(datasets.sellerId, sellerId))
    }

    const results = await db
      .select()
      .from(datasets)
      .where(and(...conditions))
      .orderBy(desc(datasets.createdAt))


    return NextResponse.json({ datasets: results, count: results.length })
  } catch (error) {
    console.error("Fetch datasets error:", error)
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.category || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new dataset (mock)
    const newDataset = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      verified: false,
      encrypted: true,
      zkProofStatus: "pending",
    }

    return NextResponse.json({ data: newDataset }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 })
  }
}
