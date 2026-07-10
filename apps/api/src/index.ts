import "./env.js"
import { env } from "./env.js"
import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth.js"
import { corsMiddleware } from "./middleware/cors.middleware.js"
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js"
import { indexRouter } from "./index.route.js"

const app = express()

app.set("trust proxy", 1)
app.use(corsMiddleware)
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

app.all("/api/auth/*splat", toNodeHandler(auth))
app.use("/api", indexRouter)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// Vercel invokes the exported `app` directly per-request (see api/index.ts) —
// it never runs this file's own server, so app.listen() would just bind an
// unused port on every cold start. Skip it there.
if (!process.env["VERCEL"]) {
  app.listen(env.PORT, () => {
    console.log(`API server running on http://localhost:${env.PORT}`)
  })
}

export { app }
export default app
