import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { RequestsList } from "@/components/RequestsList"

export default async function RequestsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[rgb(218,220,224)] shadow-sm">
        <div>
          <h1 className="text-2xl font-medium text-[rgb(32,33,36)]">Requests</h1>
          <p className="text-[rgb(95,99,104)] mt-1 text-sm">
            {session.user.role === "ADMIN"
              ? "Manage and track all service requests"
              : "Submit and track your service requests"}
          </p>
        </div>
      </div>

      <RequestsList />
    </div>
  )
}
