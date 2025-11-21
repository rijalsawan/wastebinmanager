import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { RequestsList } from "@/components/RequestsList"

export default async function RequestsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests</h1>
        <p className="text-gray-600">
          {session.user.role === "ADMIN"
            ? "Manage all service requests"
            : "View and submit service requests"}
        </p>
      </div>

      <RequestsList />
    </div>
  )
}
