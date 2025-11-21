import { auth } from "@/auth"
import { db } from "@/lib/db"
import { datasets, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!user.length || user[0].role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const allDatasets = await db.select().from(datasets)

    return NextResponse.json({
      datasets: allDatasets,
      total: allDatasets.length,
      fraudulent: allDatasets.filter((d) => d.isFraudulent).length,
    })
  } catch (error) {
    console.error("Failed to fetch datasets:", error)
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 })
  }
}
