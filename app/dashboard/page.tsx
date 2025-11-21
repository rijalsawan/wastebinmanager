import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Redirect to reports page (new default)
  redirect("/dashboard/reports")
}
