import "dotenv/config"
import { auth } from "./lib/auth.js"
import { prisma } from "./lib/prisma.js"

const EMAIL = process.env["ADMIN_EMAIL"] ?? "admin@keytester.io"
const PASSWORD = process.env["ADMIN_PASSWORD"] ?? "Admin@123456"
const NAME = process.env["ADMIN_NAME"] ?? "Admin"

const seed = async (): Promise<void> => {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } })

  if (existing) {
    if (existing.role === "admin") {
      console.log(`Admin already exists: ${EMAIL}`)
      return
    }
    await prisma.user.update({ where: { email: EMAIL }, data: { role: "admin" } })
    console.log(`Promoted existing user to admin: ${EMAIL}`)
    return
  }

  // Use Better Auth's signup to ensure password is hashed correctly
  const result = await auth.api.signUpEmail({
    body: { email: EMAIL, password: PASSWORD, name: NAME },
  })

  const userId = (result as { user?: { id: string } }).user?.id
  if (!userId) throw new Error("sign-up returned no user id")

  await prisma.user.update({ where: { id: userId }, data: { role: "admin" } })

  console.log(`Admin seeded: ${EMAIL}`)
  console.log(`Password:     ${PASSWORD}`)
}

seed()
  .catch((err: unknown) => {
    console.error("Seed failed:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
