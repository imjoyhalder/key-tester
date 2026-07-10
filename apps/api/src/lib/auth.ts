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
  // The web app and API live on different vercel.app subdomains, which
  // browsers treat as fully cross-site (vercel.app is on the public suffix
  // list, so there's no shared parent domain to use crossSubDomainCookies
  // for). The default SameSite=Lax session cookie is silently dropped on
  // that cross-site round trip — sign-in "succeeds" but the session never
  // sticks, so /admin bounces straight back to /login with no error.
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
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
