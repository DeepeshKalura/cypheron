import { auth } from "@/auth"
import { db } from "@/lib/db"
import { datasets, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import CryptoJS from "crypto-js"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!user.length || user[0].role === "BUYER") {
      return NextResponse.json({ error: "Sellers only" }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const file = formData.get("file") as File

    if (!title || !price || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock encryption - hash file content
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileHash = CryptoJS.SHA256(buffer.toString()).toString()

    // Mock ZK proof
    const zkProofHash = CryptoJS.SHA256(fileHash + Date.now()).toString()

    // Store dataset
    const newDataset = await db
      .insert(datasets)
      .values({
        sellerId: user[0].id,
        title,
        description,
        fileHash,
        fileSize: file.size,
        price,
        zkProofHash,
        category,
        tags: [],
        isFraudulent: false,
      })
      .returning()

    return NextResponse.json({
      success: true,
      dataset: newDataset[0],
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
