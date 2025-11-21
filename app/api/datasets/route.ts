import { type NextRequest, NextResponse } from "next/server"

// Mock database of datasets
const datasets = [
  {
    id: "1",
    title: "Real-Time Stock Market Data",
    description: "Live stock prices, volumes, and technical indicators",
    category: "Financial",
    price: 499,
    seller: "0xabc123...",
    verified: true,
    encrypted: true,
    zkProofStatus: "verified",
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let filtered = [...datasets]

    if (category && category !== "All") {
      filtered = filtered.filter((d) => d.category === category)
    }

    if (minPrice) {
      filtered = filtered.filter((d) => d.price >= Number.parseInt(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter((d) => d.price <= Number.parseInt(maxPrice))
    }

    return NextResponse.json({ data: filtered, count: filtered.length })
  } catch (error) {
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
