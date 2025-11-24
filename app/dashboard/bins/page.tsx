import { auth } from "@/auth"
import { BinsList } from "@/components/BinsList"
import { redirect } from "next/navigation"

export default async function BinsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[rgb(218,220,224)] shadow-sm">
        <div>
          <h1 className="text-2xl font-medium text-[rgb(32,33,36)]">Waste Bins</h1>
          <p className="text-[rgb(95,99,104)] mt-1 text-sm">
            Monitor and manage all waste collection bins across the city
          </p>
        </div>
      </div>

      <BinsList userRole={session?.user?.role} />
    </div>
  )
}
