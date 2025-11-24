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
import { DeleteConfirmModal } from "./DeleteConfirmModal"
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
    color: "text-[#f9ab00]",
    bg: "bg-[#fef7e0]",
  },
  IN_PROGRESS: {
    variant: "info" as const,
    icon: AlertCircle,
    label: "In Progress",
    color: "text-[#1a73e8]",
    bg: "bg-[#e8f0fe]",
  },
  COMPLETED: {
    variant: "success" as const,
    icon: CheckCircle2,
    label: "Completed",
    color: "text-[#34a853]",
    bg: "bg-[#e6f4ea]",
  },
  CANCELLED: {
    variant: "error" as const,
    icon: XCircle,
    label: "Cancelled",
    color: "text-[#ea4335]",
    bg: "bg-[#fce8e6]",
  },
}

const PRIORITY_CONFIG = {
  LOW: { variant: "default" as const, label: "Low", pulse: false, color: "text-[#5f6368]", bg: "bg-[#f1f3f4]" },
  MEDIUM: { variant: "warning" as const, label: "Medium", pulse: false, color: "text-[#f9ab00]", bg: "bg-[#fef7e0]" },
  HIGH: { variant: "error" as const, label: "High", pulse: true, color: "text-[#ea4335]", bg: "bg-[#fce8e6]" },
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  const isAdmin = session?.user?.role === "ADMIN"
  const userId = session?.user?.id

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

  const handleDelete = (request: Request) => {
    setRequestToDelete(request)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = async () => {
    if (!requestToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/requests/${requestToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to delete request")
        return
      }

      toast.success("Request deleted successfully")
      await fetchRequests()
      setDeleteModalOpen(false)
      setRequestToDelete(null)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete:", error)
      toast.error("Failed to delete request")
    } finally {
      setDeleteLoading(false)
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
            <div className="h-6 bg-[rgb(241,243,244)] rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-[rgb(241,243,244)] rounded w-full mb-2"></div>
            <div className="h-4 bg-[rgb(241,243,244)] rounded w-4/5"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-lg border border-[rgb(218,220,224)] shadow-sm">
          <div className="flex-1 w-full lg:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(95,99,104)]" />
            <input
              type="text"
              placeholder="Search by type, description, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:max-w-md pl-10 pr-4 py-2 rounded-lg border border-[rgb(218,220,224)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20 focus:border-[rgb(26,115,232)] transition-all text-sm"
            />
          </div>

          <Button onClick={() => {
            setEditingRequest(null)
            setIsModalOpen(true)
          }} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-[rgb(95,99,104)]">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[rgb(218,220,224)] text-sm text-[rgb(60,64,67)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20"
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
            className="px-3 py-2 rounded-lg border border-[rgb(218,220,224)] text-sm text-[rgb(60,64,67)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20"
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
            className="px-3 py-2 rounded-lg border border-[rgb(218,220,224)] text-sm text-[rgb(60,64,67)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20"
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
              className="text-xs text-[rgb(26,115,232)] hover:bg-[rgb(232,240,254)]"
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
              <div key={status} className="p-4 bg-white rounded-lg border border-[rgb(218,220,224)] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${config.bg}`}>
                    <config.icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-medium text-[rgb(32,33,36)]">{count}</p>
                    <p className="text-xs text-[rgb(95,99,104)]">{config.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredRequests.map((request) => {
          const status = STATUS_CONFIG[request.status]
          const priority = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG]
          const isOwner = userId === request.userId
          const canModify = isAdmin || isOwner

          return (
            <Card key={request.id} hover className="group relative overflow-visible">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.bg}`}>
                      <status.icon className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[rgb(32,33,36)]">
                          {request.type.charAt(0) + request.type.slice(1).toLowerCase()}
                        </h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
                          {priority.label}
                        </span>
                      </div>
                      <p className="text-xs text-[rgb(95,99,104)]">ID: {request.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === request.id ? null : request.id)}
                      className="p-1.5 hover:bg-[rgb(241,243,244)] rounded-full transition-colors text-[rgb(95,99,104)]"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {activeDropdown === request.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[rgb(218,220,224)] py-1 z-10 animate-scale-in">
                        {isAdmin && request.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(232,240,254)] flex items-center gap-2 text-[rgb(26,115,232)]"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                        )}
                        {canModify && (
                          <button
                            onClick={() => handleEdit(request)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(241,243,244)] flex items-center gap-2 text-[rgb(60,64,67)]"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                        )}
                        {canModify && request.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "CANCELLED")}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(252,232,230)] flex items-center gap-2 text-[rgb(217,48,37)]"
                          >
                            <Ban className="w-3 h-3" /> Cancel
                          </button>
                        )}
                        {canModify && (
                          <button
                            onClick={() => handleDelete(request)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(252,232,230)] flex items-center gap-2 text-[rgb(217,48,37)]"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[rgb(60,64,67)] line-clamp-2 min-h-10">
                  {request.description}
                </p>

                {/* Details */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[rgb(95,99,104)]">
                    <User className="w-3 h-3" />
                    <span>{request.user.name}</span>
                  </div>
                  {request.bin && (
                    <div className="flex items-center gap-2 text-xs text-[rgb(95,99,104)]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{request.bin.location}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[rgb(241,243,244)] flex items-center justify-between text-xs text-[rgb(95,99,104)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full ${status.bg} ${status.color} font-medium`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[rgb(241,243,244)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[rgb(154,160,166)]" />
          </div>
          <h3 className="text-lg font-medium text-[rgb(32,33,36)]">No requests found</h3>
          <p className="text-[rgb(95,99,104)]">Try adjusting your search or filters</p>
        </div>
      )}

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={fetchRequests}
        editingRequest={editingRequest}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setRequestToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Delete request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        itemName={requestToDelete ? `${requestToDelete.type} - ${requestToDelete.description.substring(0, 50)}...` : undefined}
        loading={deleteLoading}
      />
    </div>
  )
}
