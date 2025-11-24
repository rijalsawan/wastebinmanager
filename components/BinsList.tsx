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
import { DeleteConfirmModal } from "./DeleteConfirmModal"
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
  PLASTIC: { color: "bg-[#1a73e8]", text: "text-[#1a73e8]", bg: "bg-[#e8f0fe]" },
  PAPER: { color: "bg-[#a142f4]", text: "text-[#a142f4]", bg: "bg-[#f3e8fd]" },
  METAL: { color: "bg-[#5f6368]", text: "text-[#5f6368]", bg: "bg-[#f1f3f4]" },
  ORGANIC: { color: "bg-[#34a853]", text: "text-[#34a853]", bg: "bg-[#e6f4ea]" },
  GLASS: { color: "bg-[#24c1e0]", text: "text-[#24c1e0]", bg: "bg-[#e0f7fa]" },
  EWASTE: { color: "bg-[#ea4335]", text: "text-[#ea4335]", bg: "bg-[#fce8e6]" },
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [binToDelete, setBinToDelete] = useState<Bin | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
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

  const handleDelete = (bin: Bin) => {
    setBinToDelete(bin)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = async () => {
    if (!binToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/bins/${binToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to delete bin")
        return
      }

      await fetchBins()
      setDeleteModalOpen(false)
      setBinToDelete(null)
    } catch (error) {
      console.error("Failed to delete bin:", error)
      alert("Failed to delete bin")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const url = editingBin ? `/api/bins/${editingBin.id}` : "/api/bins"
      const method = editingBin ? "PUT" : "POST"

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
      setIsModalOpen(false)
    } catch (error: any) {
      console.error("Failed to save bin:", error)
      throw error
    }
  }

  const filteredBins = bins.filter(bin => 
    bin.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-[rgb(218,220,224)] shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(95,99,104)]" />
          <input
            type="text"
            placeholder="Search bins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[rgb(218,220,224)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20 focus:border-[rgb(26,115,232)] transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[rgb(218,220,224)] text-sm text-[rgb(60,64,67)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20"
          >
            <option value="">All Categories</option>
            {Object.keys(WASTE_CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[rgb(218,220,224)] text-sm text-[rgb(60,64,67)] focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20"
          >
            <option value="">All Status</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <Button onClick={handleCreate} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Bin
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBins.map((bin) => {
          const categoryStyle = WASTE_CATEGORIES[bin.category as keyof typeof WASTE_CATEGORIES]
          
          return (
            <Card key={bin.id} hover className="group relative overflow-visible">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryStyle.bg}`}>
                      <Trash2 className={`w-5 h-5 ${categoryStyle.text}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-[rgb(32,33,36)]">{bin.binId}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text}`}>
                        {bin.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === bin.id ? null : bin.id)}
                      className="p-1.5 hover:bg-[rgb(241,243,244)] rounded-full transition-colors text-[rgb(95,99,104)]"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {activeDropdown === bin.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-[rgb(218,220,224)] py-1 z-10 animate-scale-in">
                        <button
                          onClick={() => handleEdit(bin)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(241,243,244)] flex items-center gap-2 text-[rgb(60,64,67)]"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bin)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(252,232,230)] flex items-center gap-2 text-[rgb(217,48,37)]"
                        >
                          <Trash className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-[rgb(95,99,104)]">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{bin.location}</span>
                </div>

                {/* Fill Level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[rgb(95,99,104)]">Fill Level</span>
                    <span className={
                      bin.currentLevel > 80 ? "text-[rgb(217,48,37)]" : 
                      bin.currentLevel > 50 ? "text-[rgb(249,171,0)]" : 
                      "text-[rgb(24,128,56)]"
                    }>{bin.currentLevel.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-[rgb(241,243,244)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        bin.currentLevel > 80 ? "bg-[rgb(234,67,53)]" : 
                        bin.currentLevel > 50 ? "bg-[rgb(251,188,4)]" : 
                        "bg-[rgb(52,168,83)]"
                      }`}
                      style={{ width: `${bin.currentLevel}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[rgb(241,243,244)] flex items-center justify-between text-xs text-[rgb(95,99,104)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(bin.lastEmptied), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{bin.capacity}L</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredBins.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[rgb(241,243,244)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[rgb(154,160,166)]" />
          </div>
          <h3 className="text-lg font-medium text-[rgb(32,33,36)]">No bins found</h3>
          <p className="text-[rgb(95,99,104)]">Try adjusting your search or filters</p>
        </div>
      )}

      <BinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        bin={editingBin || undefined}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setBinToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Delete bin"
        message="Are you sure you want to delete this bin? This action cannot be undone."
        itemName={binToDelete ? `${binToDelete.binId} - ${binToDelete.location}` : undefined}
        loading={deleteLoading}
      />
    </div>
  )
}
