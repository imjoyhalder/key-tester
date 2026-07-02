import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Shared default so on-demand revalidation works out of the box in development.
// Set REVALIDATE_SECRET in both apps for production.
const REVALIDATE_SECRET = process.env["REVALIDATE_SECRET"] ?? "keytester-revalidate"

// Called by the API after an ad is created / updated / deleted so the public
// home page reflects the change immediately instead of waiting out the ISR
// revalidation window.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 })
  }

  revalidatePath("/")
  return NextResponse.json({ revalidated: true })
}
