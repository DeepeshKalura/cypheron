import { auth } from "@/auth"
import { db } from "@/lib/db"
import { datasets, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import CryptoJS from "crypto-js"
import { uploadToStorage } from "@/lib/storage"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      console.log("[Upload Debug] No session email found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    console.log("[Upload Debug] User found:", user[0]?.email, "Role:", user[0]?.role)

    if (!user.length || user[0].role === "BUYER") {
      console.log("[Upload Debug] Permission denied. User role is:", user[0]?.role)
      return NextResponse.json({ error: "Sellers only" }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const file = formData.get("file") as File

    console.log("[Upload Debug] Form Data:", { title, category, price, fileSize: file?.size })

    if (!title || !price || !file) {
      console.log("[Upload Debug] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock encryption - hash file content
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileHash = CryptoJS.SHA256(buffer.toString()).toString()
    console.log("[Upload Debug] File hashed:", fileHash)

    console.log("[Upload Debug] Uploading to Storage Layer...")
    // We use the hash as the filename to ensure uniqueness (Content Addressing)
    const blobId = await uploadToStorage(file, `${fileHash}.enc`)
    console.log("[Upload Debug] Storage successful. Blob ID:", blobId)

    // Mock ZK proof
    const zkProofHash = CryptoJS.SHA256(fileHash + Date.now()).toString()
    console.log("[Upload Debug] Attempting DB Insert...")

    // Store dataset
    const newDataset = await db
      .insert(datasets)
      .values({
        sellerId: user[0].id,
        title,
        description,
        fileHash: blobId,
        fileSize: file.size,
        price,
        zkProofHash,
        category,
        tags: [],
        isFraudulent: false,
        status: "active",
      })
      .returning()

    console.log("[Upload Debug] DB Insert Success:", newDataset[0].id)

    return NextResponse.json({
      success: true,
      dataset: newDataset[0],
    })
  } catch (error: any) {
    console.error("[Upload Debug] CRITICAL ERROR:", error)

    if (error.code === '23505') {
      return NextResponse.json(
        { error: "You already have a dataset with this title." },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: `Upload failed: ${(error as Error).message}` }, { status: 500 })
  }
}
