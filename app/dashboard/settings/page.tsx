import { auth } from "@/auth"
import { Card } from "@/components/ui/Card"
import { Shield, User, Bell, Globe, Moon } from "lucide-react"
import { SimulationControl } from "@/components/SimulationControl"

export default async function SettingsPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[rgb(218,220,224)] pb-6">
        <h1 className="text-2xl font-normal text-[rgb(32,33,36)]">Settings</h1>
        <p className="text-[rgb(95,99,104)] mt-1 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-[rgb(32,33,36)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[rgb(26,115,232)]" />
            Admin Controls
          </h2>
          <Card className="p-0 overflow-hidden border border-[rgb(218,220,224)] shadow-none">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base font-medium text-[rgb(32,33,36)]">IoT Simulation</h3>
                <p className="text-sm text-[rgb(95,99,104)] mt-1">
                  Control the waste bin sensor simulation. This affects live data on the dashboard.
                </p>
              </div>
              <SimulationControl />
            </div>
          </Card>
        </section>
      )}

      {/* Account Settings (Placeholder) */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[rgb(32,33,36)] flex items-center gap-2">
          <User className="w-5 h-5 text-[rgb(95,99,104)]" />
          Account
        </h2>
        <Card className="divide-y divide-[rgb(218,220,224)] border border-[rgb(218,220,224)] shadow-none p-0">
          <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-[rgb(248,249,250)] transition-colors cursor-pointer">
            <div>
              <h3 className="text-sm font-medium text-[rgb(32,33,36)]">Profile information</h3>
              <p className="text-sm text-[rgb(95,99,104)] mt-1">Change your name and personal details</p>
            </div>
            <div className="text-[rgb(26,115,232)] text-sm font-medium">Edit</div>
          </div>
          <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-[rgb(248,249,250)] transition-colors cursor-pointer">
            <div>
              <h3 className="text-sm font-medium text-[rgb(32,33,36)]">Password</h3>
              <p className="text-sm text-[rgb(95,99,104)] mt-1">Change your password</p>
            </div>
            <div className="text-[rgb(26,115,232)] text-sm font-medium">Change</div>
          </div>
        </Card>
      </section>

      {/* Preferences (Placeholder) */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[rgb(32,33,36)] flex items-center gap-2">
          <Globe className="w-5 h-5 text-[rgb(95,99,104)]" />
          Preferences
        </h2>
        <Card className="divide-y divide-[rgb(218,220,224)] border border-[rgb(218,220,224)] shadow-none p-0">
          <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-[rgb(248,249,250)] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[rgb(95,99,104)]" />
              <div>
                <h3 className="text-sm font-medium text-[rgb(32,33,36)]">Notifications</h3>
                <p className="text-sm text-[rgb(95,99,104)] mt-1">Manage email and push notifications</p>
              </div>
            </div>
            <div className="text-[rgb(26,115,232)] text-sm font-medium">Manage</div>
          </div>
          <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-[rgb(248,249,250)] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[rgb(95,99,104)]" />
              <div>
                <h3 className="text-sm font-medium text-[rgb(32,33,36)]">Appearance</h3>
                <p className="text-sm text-[rgb(95,99,104)] mt-1">Customize the look and feel</p>
              </div>
            </div>
            <div className="text-[rgb(26,115,232)] text-sm font-medium">Customize</div>
          </div>
        </Card>
      </section>
    </div>
  )
}
