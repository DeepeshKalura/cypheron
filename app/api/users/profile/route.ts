import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, bio, role } = await request.json()

    const user = await db
      .update(users)
      .set({
        name,
        bio,
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email))
      .returning()

    return NextResponse.json({
      success: true,
      user: user[0],
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    return NextResponse.json({ user: user[0] })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
