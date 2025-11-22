import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/lib/schema"
import { eq } from "drizzle-orm"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      // Check if user exists
      const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, user.email)).limit(1)

      if (existingUser.length === 0) {
        // Create new user
        const newUser = await db
          .insert(schema.users)
          .values({
            email: user.email,
            name: user.name || "User",
            avatarUrl: user.image || undefined,
          })
          .returning()

        // Create auth account
        if (account) {
          await db.insert(schema.authAccounts).values({
            userId: newUser[0].id,
            provider: account.provider.toUpperCase(),
            providerAccountId: account.providerAccountId,
            email: user.email,
            name: user.name,
          })
        }
      } else {
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
          }
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.select().from(schema.users).where(eq(schema.users.email, user.email!)).limit(1)

        if (dbUser.length > 0) {
          token.id = dbUser[0].id
          token.role = dbUser[0].role
          token.walletAddress = dbUser[0].walletAddress
        }
      }
      return token
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
