import { auth } from "@/auth"
import { db } from "@/lib/db"
import { transactions, datasets, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { datasetId } = await request.json()

    // Get buyer
    const buyer = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!buyer.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get dataset
    const dataset = await db.select().from(datasets).where(eq(datasets.id, datasetId)).limit(1)

    if (!dataset.length) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    // Create transaction
    const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    const transaction = await db
      .insert(transactions)
      .values({
        buyerId: buyer[0].id,
        sellerId: dataset[0].sellerId,
        datasetId: dataset[0].id,
        amount: dataset[0].price,
        txHash: mockTxHash,
        status: "COMPLETED",
        decryptionKey: `key_${Date.now()}`,
      })
      .returning()

    // Update dataset stats
    await db
      .update(datasets)
      .set({
        purchaseCount: (dataset[0].purchaseCount || 0) + 1,
      })
      .where(eq(datasets.id, datasetId))

    return NextResponse.json({
      success: true,
      transaction: transaction[0],
    })
  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 })
  }
}
