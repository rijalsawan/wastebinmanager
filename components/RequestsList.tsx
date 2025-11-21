"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Calendar,
  User,
  MapPin,
  MoreVertical,
  Edit,
  Check,
  Ban,
  Filter,
} from "lucide-react"
import { RequestModal } from "./RequestModal"
import { Card } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Request {
  id: string
  type: string
  priority: string
  description: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  userId: string
  binId?: string
  createdAt: string
  updatedAt: string
  bin?: {
    binId: string
    location: string
    category: string
  }
  user: {
    name: string
    email: string
  }
}

const STATUS_CONFIG = {
  PENDING: {
    variant: "warning" as const,
    icon: Clock,
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  IN_PROGRESS: {
    variant: "info" as const,
    icon: AlertCircle,
    label: "In Progress",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  COMPLETED: {
    variant: "success" as const,
    icon: CheckCircle2,
    label: "Completed",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  CANCELLED: {
    variant: "error" as const,
    icon: XCircle,
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
  },
}

const PRIORITY_CONFIG = {
  LOW: { variant: "default" as const, label: "Low", pulse: false },
  MEDIUM: { variant: "warning" as const, label: "Medium", pulse: false },
  HIGH: { variant: "error" as const, label: "High", pulse: true },
}

export function RequestsList() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterType, setFilterType] = useState<string>("")
  const [filterPriority, setFilterPriority] = useState<string>("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [filterStatus, filterType, filterPriority])

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append("status", filterStatus)
      if (filterType) params.append("type", filterType)
      if (filterPriority) params.append("priority", filterPriority)

      const response = await fetch(`/api/requests?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Request ${newStatus.toLowerCase()}`)
        fetchRequests()
        router.refresh()
      } else {
        toast.error("Failed to update request")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update request")
    }
  }

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Request deleted successfully")
        fetchRequests()
        router.refresh()
      } else {
        toast.error("Failed to delete request")
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      toast.error("Failed to delete request")
    }
  }

  const handleEdit = (request: Request) => {
    setEditingRequest(request)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const handleApprove = async (requestId: string) => {
    await handleStatusUpdate(requestId, "IN_PROGRESS")
    setActiveDropdown(null)
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search by type, description, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="w-full lg:max-w-md"
            />
          </div>

          <Button onClick={() => {
            setEditingRequest(null)
            setIsModalOpen(true)
          }} className="whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
          >
            <option value="">All Types</option>
            <option value="COLLECTION">Collection</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="REPAIR">Repair</option>
            <option value="COMPLAINT">Complaint</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          {(filterStatus || filterType || filterPriority) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFilterStatus("")
                setFilterType("")
                setFilterPriority("")
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = requests.filter(r => r.status === status).length
            return (
              <div key={status} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <config.icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{config.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <Card className="p-16 text-center" gradient>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-200 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus || filterType
                  ? "Try adjusting your filters"
                  : "Get started by creating your first request"}
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Request
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRequests.map((request, index) => {
            const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.PENDING
            const StatusIcon = statusConfig.icon
            const priorityConfig = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW
            const isAdmin = session?.user?.role === "ADMIN"
            const isOwner = session?.user?.id === request.userId
            const canManage = isAdmin || isOwner // Can edit/delete if admin or owner
            const isDropdownOpen = activeDropdown === request.id

            return (
              <Card
                key={request.id}
                hover
                gradient
                className="group relative overflow-hidden animate-slide-in-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status Color Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${statusConfig.bg}`}></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusConfig.variant} size="sm" dot>
                          {statusConfig.label}
                        </Badge>
                        <Badge
                          variant={priorityConfig.variant}
                          size="sm"
                          pulse={priorityConfig.pulse}
                        >
                          {priorityConfig.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{request.type}</h3>
                    </div>

                    {/* Admin/Owner Dropdown Menu */}
                    {canManage ? (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : request.id)}
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>

                        {isDropdownOpen && (
                          <>
                            {/* Backdrop */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveDropdown(null)}
                            />
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                              {isAdmin && request.status === 'PENDING' && (
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-green-600 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                  Approve & Start
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleEdit(request)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-blue-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Request
                              </button>

                              {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-orange-600 transition-colors"
                                >
                                  <Ban className="w-4 h-4" />
                                  Cancel Request
                                </button>
                              )}

                              <div className="h-px bg-gray-100 my-1" />

                              <button
                                onClick={() => handleDelete(request.id)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Request
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className={`p-3 rounded-xl ${statusConfig.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>

                  {/* Bin Info */}
                  {request.bin && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{request.bin.binId}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {request.bin.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User & Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{request.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Non-admin Quick Actions */}
                  {!canManage && request.status !== "COMPLETED" && request.status !== "CANCELLED" && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      {request.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(request.id, "IN_PROGRESS")}
                          className="flex-1 text-xs"
                        >
                          <Clock className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                      {request.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusUpdate(request.id, "COMPLETED")}
                          className="flex-1 text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRequest(null)
        }}
        onSubmit={() => {
          fetchRequests()
          router.refresh()
          setEditingRequest(null)
        }}
        editingRequest={editingRequest}
      />
    </div>
  )
}
