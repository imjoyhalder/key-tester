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
  // better-auth's built-in default for /sign-in* is 3 requests per 10s —
  // easy to trip from normal use (a mistyped password, a double-click) and
  // its 429 response confuses the client SDK into throwing instead of
  // showing an error. Loosen it for sign-in specifically.
  rateLimit: {
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
    },
  },
})

export type Auth = typeof auth
