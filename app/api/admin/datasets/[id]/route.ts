import { auth } from "@/auth"
import { db } from "@/lib/db"
import { datasets, users, auditLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const admin = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!admin.length || admin[0].role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Delete dataset and return the deleted record
    const deleted = await db.delete(datasets).where(eq(datasets.id, id)).returning()

    if (!deleted.length) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    // Log audit action
    await db.insert(auditLogs).values({
      adminId: admin[0].id,
      action: "DELETE_DATASET",
      entityType: "DATASET",
      entityId: id,
      reason: "Admin deletion",
      changes: {
        deletedDataset: {
          title: deleted[0].title,
          sellerId: deleted[0].sellerId,
          isFraudulent: deleted[0].isFraudulent,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Dataset deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete dataset" }, { status: 500 })
  }
}
