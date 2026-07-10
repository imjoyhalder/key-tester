"use client"

import { createAuthClient } from "better-auth/react"

// No baseURL — better-auth falls back to `window.location.origin` +
// /api/auth, which next.config.mjs's rewrites() proxies to the API. Passing
// a bare relative path here throws (it requires a full protocol+host), and
// passing the cross-origin API URL directly would defeat the point of the
// proxy: the session cookie needs to land on this app's own domain, not
// the API's (see next.config.mjs for why that matters).
export const authClient = createAuthClient({})

export const { signIn, signOut, signUp, useSession } = authClient
