import "dotenv/config"
import { z } from "zod"

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:4000"),
  WEB_URL: z.string().url().default("http://localhost:3000"),

  // Shared secret for triggering on-demand revalidation of the web app after
  // ad changes. Must match REVALIDATE_SECRET on the web side.
  REVALIDATE_SECRET: z.string().default("keytester-revalidate"),

  // Cloudinary (all three required together when uploads are needed)
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌  Invalid environment variables:\n")
  const errors = parsed.error.flatten().fieldErrors
  for (const [key, messages] of Object.entries(errors)) {
    console.error(`  ${key}: ${messages?.join(", ")}`)
  }
  console.error("\nFix the above issues in your .env file and restart.\n")
  process.exit(1)
}

export const env = parsed.data
