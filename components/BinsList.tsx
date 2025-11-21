"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Filter,
  Trash2,
  MapPin,
  Calendar,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash,
  Eye,
} from "lucide-react"
import { BinModal } from "./BinModal"
import { Card } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { formatDistanceToNow } from "date-fns"

interface Bin {
  id: string
  binId: string
  category: string
  location: string
  latitude?: number
  longitude?: number
  capacity: number
  currentLevel: number
  status: "LOW" | "MEDIUM" | "HIGH"
  lastEmptied: string
  createdAt: string
  updatedAt: string
}

const WASTE_CATEGORIES = {
  PLASTIC: { color: "bg-blue-500", gradient: "from-blue-500 to-blue-600", text: "text-blue-700", bg: "bg-blue-50" },
  PAPER: { color: "bg-purple-500", gradient: "from-purple-500 to-purple-600", text: "text-purple-700", bg: "bg-purple-50" },
  METAL: { color: "bg-gray-500", gradient: "from-gray-500 to-gray-600", text: "text-gray-700", bg: "bg-gray-50" },
  ORGANIC: { color: "bg-green-500", gradient: "from-green-500 to-green-600", text: "text-green-700", bg: "bg-green-50" },
  GLASS: { color: "bg-cyan-500", gradient: "from-cyan-500 to-cyan-600", text: "text-cyan-700", bg: "bg-cyan-50" },
  EWASTE: { color: "bg-orange-500", gradient: "from-orange-500 to-orange-600", text: "text-orange-700", bg: "bg-orange-50" },
}

interface BinsListProps {
  userRole?: string
}

export function BinsList({ userRole }: BinsListProps) {
  const router = useRouter()
  const [bins, setBins] = useState<Bin[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBin, setEditingBin] = useState<Bin | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isAdmin = userRole === "ADMIN"

  useEffect(() => {
    fetchBins()
    const interval = setInterval(fetchBins, 10000)
    return () => clearInterval(interval)
  }, [filterCategory, filterStatus])

  const fetchBins = async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategory) params.append("category", filterCategory)
      if (filterStatus) params.append("status", filterStatus)

      const response = await fetch(`/api/bins?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBins(data)
      }
    } catch (error) {
      console.error("Failed to fetch bins:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBin(null)
    setIsModalOpen(true)
  }

  const handleEdit = (bin: Bin) => {
    setEditingBin(bin)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const handleDelete = async (bin: Bin) => {
    if (!confirm(`Are you sure you want to delete ${bin.binId}?`)) return

    try {
      const response = await fetch(`/api/bins/${bin.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchBins()
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete bin:", error)
    }
    setActiveDropdown(null)
  }

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      LOW: { variant: "success" as const, label: "Low" },
      MEDIUM: { variant: "warning" as const, label: "Medium" },
      HIGH: { variant: "error" as const, label: "High" },
    }
    const config = variants[status as keyof typeof variants] || variants.LOW
    return <Badge variant={config.variant} dot pulse={status === "HIGH"}>{config.label}</Badge>
  }

  const getLevelColor = (level: number) => {
    if (level <= 50) return "from-green-500 to-green-600"
    if (level <= 80) return "from-amber-500 to-amber-600"
    return "from-red-500 to-red-600"
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
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
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input
            type="text"
            placeholder="Search bins by ID or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="w-full lg:max-w-md"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
          >
            <option value="">All Categories</option>
            {Object.keys(WASTE_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
          >
            <option value="">All Status</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {isAdmin && (
            <Button onClick={handleCreate} className="whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Bin</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bins Grid */}
      {filteredBins.length === 0 ? (
        <Card className="p-16 text-center" gradient>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bins found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterCategory || filterStatus
                  ? "Try adjusting your filters"
                  : isAdmin 
                    ? "Get started by creating your first bin"
                    : "No bins available at the moment"}
              </p>
              {isAdmin && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4" />
                  Create Bin
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredBins.map((bin, index) => {
            const category = WASTE_CATEGORIES[bin.category as keyof typeof WASTE_CATEGORIES]
            
            return (
              <Card
                key={bin.id}
                hover
                gradient
                className="group relative overflow-hidden animate-slide-in-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Category Color Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${category.gradient}`}></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{bin.binId}</h3>
                        {getStatusBadge(bin.status)}
                      </div>
                      <Badge variant="info" size="sm">
                        {bin.category}
                      </Badge>
                    </div>

                    {/* Dropdown Menu - Admin Only */}
                    {isAdmin && (
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === bin.id ? null : bin.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {activeDropdown === bin.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-slide-in-bottom">
                              <button
                                onClick={() => handleEdit(bin)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Bin
                              </button>
                              <button
                                onClick={() => handleDelete(bin)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                                Delete Bin
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fill Level Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Fill Level</span>
                      <span className="text-lg font-bold text-gray-900">
                        {bin.currentLevel.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-linear-to-r ${getLevelColor(bin.currentLevel)} transition-all duration-500 rounded-full shadow-lg`}
                        style={{ width: `${Math.min(bin.currentLevel, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    <span className="line-clamp-2">{bin.location}</span>
                  </div>

                  {/* Last Emptied */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Last emptied{" "}
                      {formatDistanceToNow(new Date(bin.lastEmptied), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <BinModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBin(null)
        }}
        onSubmit={async (data) => {
          try {
            const url = editingBin ? `/api/bins/${editingBin.id}` : "/api/bins"
            const method = editingBin ? "PATCH" : "POST"

            const response = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || "Failed to save bin")
            }

            await fetchBins()
            router.refresh()
          } catch (error: any) {
            throw error
          }
        }}
        bin={editingBin || undefined}
      />
    </div>
  )
}
