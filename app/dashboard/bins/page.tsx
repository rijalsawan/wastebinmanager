import { auth } from "@/auth"
import { BinsList } from "@/components/BinsList"
import { redirect } from "next/navigation"

export default async function BinsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Waste Bins</h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage all waste collection bins
          </p>
        </div>
      </div>

      <BinsList userRole={session?.user?.role} />
    </div>
  )
}
