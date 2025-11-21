"use client"

import { useState, useEffect, Fragment } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { X, MapPin, Tag, Box, Ruler } from "lucide-react"

interface BinModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BinFormData) => Promise<void>
  bin?: BinFormData & { id?: string }
}

export interface BinFormData {
  binId: string
  category: string
  location: string
  latitude?: number
  longitude?: number
  capacity: number
}

const WASTE_CATEGORIES = [
  { value: "PLASTIC", label: "Plastic", color: "from-blue-500 to-blue-600" },
  { value: "PAPER", label: "Paper", color: "from-purple-500 to-purple-600" },
  { value: "METAL", label: "Metal", color: "from-gray-500 to-gray-600" },
  { value: "ORGANIC", label: "Organic", color: "from-green-500 to-green-600" },
  { value: "GLASS", label: "Glass", color: "from-cyan-500 to-cyan-600" },
  { value: "EWASTE", label: "E-Waste", color: "from-orange-500 to-orange-600" },
]

export function BinModal({ isOpen, onClose, onSubmit, bin }: BinModalProps) {
  const [formData, setFormData] = useState<BinFormData>({
    binId: "",
    category: "PLASTIC",
    location: "",
    latitude: undefined,
    longitude: undefined,
    capacity: 100,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (bin) {
      setFormData({
        binId: bin.binId || "",
        category: bin.category || "PLASTIC",
        location: bin.location || "",
        latitude: bin.latitude,
        longitude: bin.longitude,
        capacity: bin.capacity || 100,
      })
    } else {
      setFormData({
        binId: "",
        category: "PLASTIC",
        location: "",
        latitude: undefined,
        longitude: undefined,
        capacity: 100,
      })
    }
  }, [bin, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await onSubmit(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = WASTE_CATEGORIES.find((c) => c.value === formData.category)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className={`relative bg-linear-to-r ${selectedCategory?.color} p-6 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {bin ? "Edit Bin" : "Create New Bin"}
              </h2>
              <p className="text-white/90 text-sm">
                {bin ? "Update bin information" : "Add a new waste bin to your system"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-3 animate-slide-in-bottom">
              <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bin ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bin ID <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                required
                value={formData.binId}
                onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
                placeholder="BIN-001"
                disabled={!!bin}
                icon={<Tag className="w-4 h-4" />}
              />
              {bin && (
                <p className="mt-1.5 text-xs text-gray-500">Bin ID cannot be changed after creation</p>
              )}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Waste Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WASTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.category === cat.value
                        ? `border-transparent bg-linear-to-br ${cat.color} text-white shadow-lg scale-105`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="font-semibold text-sm">{cat.label}</div>
                    {formData.category === cat.value && (
                      <div className="mt-1 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="123 Main Street, City"
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <Input
                type="number"
                step="any"
                value={formData.latitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="40.7128"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <Input
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="-74.0060"
              />
            </div>

            {/* Capacity */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity (Liters) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) || 100 })
                }
                placeholder="100"
                icon={<Box className="w-4 h-4" />}
              />
              <div className="mt-3 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${selectedCategory?.color} transition-all duration-300`}
                    style={{ width: `${Math.min((formData.capacity / 500) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600">{formData.capacity}L</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {bin ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <>{bin ? "Update Bin" : "Create Bin"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
