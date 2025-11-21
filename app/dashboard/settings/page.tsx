import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react"
import { SimulationControl } from "@/components/SimulationControl"

export default async function SettingsPage() {
  const session = await auth()

  // Check if user is admin - only admins can access simulation controls
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your account and application preferences
        </p>
      </div>

      {/* Admin Simulation Controls */}
      {isAdmin && (
        <>
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Admin Controls</h3>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              IoT sensor simulation controls - View live bin updates in the Dashboard
            </p>
          </div>

          {/* IoT Simulation Control */}
          <SimulationControl />
        </>
      )}

      
    </div>
  )
}
