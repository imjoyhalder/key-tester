// Vercel Serverless Function entry point. Vercel bundles every file under
// api/ into its own function and calls the default export as a request
// handler on each invocation — Express apps satisfy that signature directly
// (see https://vercel.com/guides/using-express-with-vercel), so no listen()
// or wrapper is needed here. vercel.json rewrites every path to this
// function; Express's own router (in src/index.ts) does the real routing.
import { app } from "../src/index.js"

export default app
