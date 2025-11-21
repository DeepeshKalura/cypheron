import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, authAccounts } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user with wallet address
    await db.update(users).set({ walletAddress }).where(eq(users.id, user[0].id))

    // Create auth account for wallet
    await db
      .insert(authAccounts)
      .values({
        userId: user[0].id,
        provider: "WALLET_SUI",
        providerAccountId: walletAddress,
        email: session.user.email,
        name: session.user.name,
      })
      .onConflictDoNothing()

    return NextResponse.json({
      success: true,
      walletAddress,
    })
  } catch (error) {
    console.error("Wallet link error:", error)
    return NextResponse.json({ error: "Failed to link wallet" }, { status: 500 })
  }
}
