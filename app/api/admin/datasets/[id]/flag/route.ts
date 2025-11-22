import { auth } from "@/auth"
import { db } from "@/lib/db"
import { datasets, users, auditLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!admin.length || admin[0].role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { reason } = await request.json()

    const updated = await db
      .update(datasets)
      .set({
        isFraudulent: true,
        fraudReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(datasets.id, id))
      .returning()

    // Log audit action
    await db.insert(auditLogs).values({
      adminId: admin[0].id,
      action: "FLAG_FRAUDULENT",
      entityType: "DATASET",
      entityId: id,
      reason,
    })

    return NextResponse.json({ success: true, dataset: updated[0] })
  } catch (error) {
    console.error("Flag error:", error)
    return NextResponse.json({ error: "Failed to flag dataset" }, { status: 500 })
  }
}
