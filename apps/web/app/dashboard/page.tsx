import type { Metadata } from "next"
export const metadata: Metadata = { robots: { index: false, follow: false } }
import { redirect } from "next/navigation"

export default function DashboardPage() {
  redirect("/admin")
}
