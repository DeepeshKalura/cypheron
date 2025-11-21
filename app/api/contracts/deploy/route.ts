import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, smartContracts } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user already has a contract
    const existingContract = await db
      .select()
      .from(smartContracts)
      .where(eq(smartContracts.userId, user[0].id))
      .limit(1)

    if (existingContract.length > 0 && existingContract[0].status === "DEPLOYED") {
      return NextResponse.json({
        success: true,
        contractAddress: existingContract[0].contractAddress,
        message: "User already has a deployed contract",
      })
    }

    // Generate contract address (mock - in real scenario, deploy actual Move contract)
    const contractAddress = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(
      "",
    )}`

    const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    // Store contract in database
    const contract = await db
      .insert(smartContracts)
      .values({
        userId: user[0].id,
        contractAddress,
        contractName: `CryptoVault_${user[0].name.replace(/\s+/g, "_")}`,
        contractType: "STANDARD",
        status: "DEPLOYED",
        txHash: mockTxHash,
        deploymentMetadata: {
          network: process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet",
          deployedAt: new Date().toISOString(),
          version: "1.0",
        },
      })
      .returning()

    return NextResponse.json({
      success: true,
      contractAddress,
      txHash: mockTxHash,
      contract: contract[0],
    })
  } catch (error) {
    console.error("Contract deployment error:", error)
    return NextResponse.json({ error: "Failed to deploy contract" }, { status: 500 })
  }
}
