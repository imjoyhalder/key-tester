"use client"

import { createAuthClient } from "better-auth/react"

// Relative, same-origin path — proxied to the API by next.config.mjs's
// rewrites() so the session cookie lands on this app's own domain instead
// of the API's (see next.config.mjs for why that matters).
export const authClient = createAuthClient({
  baseURL: "/api/auth",
})

export const { signIn, signOut, signUp, useSession } = authClient
