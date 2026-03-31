// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive.file",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { groups: true }
        })
        session.user.role = dbUser?.role || "COLLABORATOR"
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              googleId: account.providerAccountId,
              avatar: user.image,
              role: "COLLABORATOR",
              active: true,
            }
          })
        } else if (!existingUser.googleId) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { googleId: account.providerAccountId }
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}