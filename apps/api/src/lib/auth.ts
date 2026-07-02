import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"
import { prisma } from "./prisma.js"
import { env } from "../env.js"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    admin({ defaultRole: "user", adminRole: "admin" }),
  ],
  trustedOrigins: [env.WEB_URL],
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
})

export type Auth = typeof auth
