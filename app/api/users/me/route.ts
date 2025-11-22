import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

        if (!user.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ user: user[0] })
    } catch (error) {
        console.error("Get user error:", error)
        return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
    }
}
