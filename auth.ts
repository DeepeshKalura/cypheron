import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/lib/schema"
import { eq } from "drizzle-orm"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.log("[Auth] Sign in denied: No email provided")
          return false
        }

        console.log("[Auth] Sign in attempt:", {
          email: user.email,
          provider: account?.provider,
          name: user.name
        })

        // Check if user exists
        const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, user.email)).limit(1)

        if (existingUser.length === 0) {
          console.log("[Auth] New user detected, creating user record for:", user.email)

          // Create new user
          const newUser = await db
            .insert(schema.users)
            .values({
              email: user.email,
              name: user.name || "User",
              avatarUrl: user.image || undefined,
            })
            .returning()

          console.log("[Auth] User created with ID:", newUser[0].id)

          // Create auth account
          if (account) {
            await db.insert(schema.authAccounts).values({
              userId: newUser[0].id,
              provider: account.provider.toUpperCase(),
              providerAccountId: account.providerAccountId,
              email: user.email,
              name: user.name,
            })
            console.log("[Auth] Auth account created for provider:", account.provider)
          }
        } else {
          console.log("[Auth] Existing user found:", user.email)

          // Update existing auth account or create new one
          if (account) {
            const existingAuth = await db
              .select()
              .from(schema.authAccounts)
              .where(eq(schema.authAccounts.userId, existingUser[0].id))
              .limit(1)

            if (existingAuth.length === 0) {
              await db.insert(schema.authAccounts).values({
                userId: existingUser[0].id,
                provider: account.provider.toUpperCase(),
                providerAccountId: account.providerAccountId,
                email: user.email,
                name: user.name,
              })
              console.log("[Auth] New auth account created for existing user")
            } else {
              console.log("[Auth] Auth account already exists")
            }
          }
        }

        console.log("[Auth] Sign in successful for:", user.email)
        return true
      } catch (error) {
        console.error("[Auth] Sign in failed:", error)
        console.error("[Auth] Error details:", {
          email: user.email,
          provider: account?.provider,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        })
        // Return false to deny access on DB errors
        return false
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          console.log("[Auth] JWT callback - looking up user:", user.email)
          const dbUser = await db.select().from(schema.users).where(eq(schema.users.email, user.email!)).limit(1)

          if (dbUser.length > 0) {
            token.id = dbUser[0].id
            token.role = dbUser[0].role
            token.walletAddress = dbUser[0].walletAddress
            console.log("[Auth] JWT token updated with user data:", {
              id: dbUser[0].id,
              role: dbUser[0].role,
              hasWallet: !!dbUser[0].walletAddress
            })
          } else {
            console.warn("[Auth] User not found in database during JWT callback:", user.email)
          }
        }
        return token
      } catch (error) {
        console.error("[Auth] JWT callback failed:", error)
        console.error("[Auth] JWT error details:", {
          email: user?.email,
          message: error instanceof Error ? error.message : "Unknown error",
        })
        // Return token as-is on error to prevent auth breaking
        return token
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.walletAddress = token.walletAddress as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})
