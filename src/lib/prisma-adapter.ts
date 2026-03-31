// src/lib/prisma-adapter.ts
import { PrismaClient } from "@prisma/client"
import { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters"

export function PrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, "id">) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          emailVerified: data.emailVerified,
          image: data.image,
        },
      })
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as AdapterUser
    },

    getUser: async (id: string) => {
      const user = await prisma.user.findUnique({
        where: { id },
      })
      if (!user) return null
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as AdapterUser
    },

    getUserByEmail: async (email: string) => {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) return null
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as AdapterUser
    },

    getUserByAccount: async (providerAccount: { provider: string; providerAccountId: string }) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: providerAccount.provider,
            providerAccountId: providerAccount.providerAccountId,
          },
        },
        include: { user: true },
      })
      if (!account?.user) return null
      const user = account.user
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as AdapterUser
    },

    updateUser: async (data: Partial<AdapterUser> & { id: string }) => {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
        },
      })
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as AdapterUser
    },

    deleteUser: async (id: string) => {
      await prisma.user.delete({
        where: { id },
      })
    },

    linkAccount: async (data: AdapterAccount) => {
      await prisma.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state,
        },
      })
    },

    unlinkAccount: async (providerAccount: { provider: string; providerAccountId: string }) => {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider: providerAccount.provider,
            providerAccountId: providerAccount.providerAccountId,
          },
        },
      })
    },

    createSession: async (data: { sessionToken: string; userId: string; expires: Date }) => {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          sessionToken: data.sessionToken,
          expires: data.expires,
        },
      })
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      }
    },

    getSessionAndUser: async (sessionToken: string) => {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!session?.user) return null
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.name,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
        } as AdapterUser,
      }
    },

    updateSession: async (data: { sessionToken: string; expires: Date }) => {
      const session = await prisma.session.update({
        where: { sessionToken: data.sessionToken },
        data: {
          expires: data.expires,
        },
      })
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      }
    },

    deleteSession: async (sessionToken: string) => {
      await prisma.session.delete({
        where: { sessionToken },
      })
    },
  }
}