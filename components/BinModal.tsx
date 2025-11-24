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

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(218,220,224)]">
          <h2 className="text-xl font-normal text-[rgb(32,33,36)]">
            {bin ? "Edit bin" : "Create new bin"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(241,243,244)] rounded-full transition-colors text-[rgb(95,99,104)]"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bin ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
                Bin ID <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                required
                value={formData.binId}
                onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
                placeholder="BIN-001"
                disabled={!!bin}
                className="rounded-md border-[rgb(218,220,224)] focus:border-[rgb(26,115,232)] focus:ring-[rgb(26,115,232)]"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-2">
                Waste Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WASTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.category === cat.value
                        ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)] border-[rgb(26,115,232)]"
                        : "bg-white text-[rgb(60,64,67)] border-[rgb(218,220,224)] hover:bg-[rgb(248,249,250)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="123 Main Street, City"
                className="rounded-md border-[rgb(218,220,224)] focus:border-[rgb(26,115,232)] focus:ring-[rgb(26,115,232)]"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
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
                className="rounded-md border-[rgb(218,220,224)] focus:border-[rgb(26,115,232)] focus:ring-[rgb(26,115,232)]"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
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
                className="rounded-md border-[rgb(218,220,224)] focus:border-[rgb(26,115,232)] focus:ring-[rgb(26,115,232)]"
              />
            </div>

            {/* Capacity */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
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
                className="rounded-md border-[rgb(218,220,224)] focus:border-[rgb(26,115,232)] focus:ring-[rgb(26,115,232)]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-[rgb(26,115,232)] hover:bg-[rgb(232,240,254)] hover:text-[rgb(26,115,232)] font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[rgb(26,115,232)] hover:bg-[rgb(24,90,188)] text-white font-medium px-6 rounded-md shadow-none"
            >
              {loading ? "Saving..." : (bin ? "Save" : "Create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
