import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/lib/db"
import { compare } from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Attempting to authorize user:", credentials?.username)

          if (!credentials?.username || !credentials.password) {
            console.log("Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          })

          console.log("User found:", user ? "Yes" : "No")

          if (!user) {
            console.log("User not found in database")
            return null
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          )
          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          return {
            id: user.id,
            username: user.username,
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})

// ✅ API handlers
export const GET = handlers.GET
export const POST = handlers.POST
