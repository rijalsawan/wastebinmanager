import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Users, Trash2, FileText, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { SimulationControl } from "@/components/SimulationControl"
import { BinSimulationViewer } from "@/components/BinSimulationViewer"

async function getAdminStats() {
  const [totalUsers, totalBins, totalRequests, recentRequests] = await Promise.all([
    prisma.user.count(),
    prisma.bin.count(),
    prisma.request.count(),
    prisma.request.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        bin: true,
      },
    }),
  ])

  const pendingRequests = await prisma.request.count({
    where: { status: "PENDING" },
  })

  return {
    totalUsers,
    totalBins,
    totalRequests,
    pendingRequests,
    recentRequests,
  }
}

export default async function AdminDashboardPage() {
  const session = await auth()

  // Check if user is admin
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage your waste management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Bins"
          value={stats.totalBins}
          icon={Trash2}
          color="green"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* IoT Simulation Control */}
      <SimulationControl />

      {/* Live Bin Fill Levels */}
      <BinSimulationViewer />

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No requests yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Bin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRequests.map((request: any) => (
                      <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {request.type.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {request.user.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {request.bin?.binId || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              request.priority === "URGENT"
                                ? "error"
                                : request.priority === "HIGH"
                                ? "warning"
                                : "default"
                            }
                          >
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              request.status === "COMPLETED"
                                ? "success"
                                : request.status === "IN_PROGRESS"
                                ? "info"
                                : "warning"
                            }
                          >
                            {request.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Trash2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manage Bins</h3>
              <p className="text-sm text-slate-600">Add, edit, or remove bins</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manage Users</h3>
              <p className="text-sm text-slate-600">View and manage user accounts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">View Reports</h3>
              <p className="text-sm text-slate-600">Analytics and insights</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
