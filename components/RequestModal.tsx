"use client"

import { useState, useEffect } from "react"
import { X, Package, AlertTriangle, Wrench, Trash2, Flag } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

interface Bin {
  id: string
  binId: string
  category: string
  location: string
}

interface Request {
  id: string
  type: string
  description: string
  priority: string
  binId?: string | null
  bin?: {
    binId: string
    location: string
    category: string
  }
}

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  editingRequest?: Request | null
}

const REQUEST_TYPES = [
  {
    value: "COLLECTION",
    label: "Collection Request",
    icon: Trash2,
    color: "from-blue-500 to-blue-600",
    description: "Schedule a waste collection",
  },
  {
    value: "MAINTENANCE",
    label: "Maintenance",
    icon: Wrench,
    color: "from-purple-500 to-purple-600",
    description: "Report maintenance needed",
  },
  {
    value: "REPAIR",
    label: "Repair",
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    description: "Report damage or malfunction",
  },
  {
    value: "COMPLAINT",
    label: "Complaint",
    icon: Flag,
    color: "from-red-500 to-red-600",
    description: "File a complaint",
  },
]

const PRIORITY_LEVELS = [
  { value: "LOW", label: "Low Priority", color: "from-gray-500 to-gray-600" },
  { value: "MEDIUM", label: "Medium Priority", color: "from-amber-500 to-amber-600" },
  { value: "HIGH", label: "High Priority", color: "from-red-500 to-red-600" },
]

export function RequestModal({ isOpen, onClose, onSubmit, editingRequest }: RequestModalProps) {
  const [formData, setFormData] = useState({
    type: "COLLECTION",
    description: "",
    priority: "MEDIUM",
    binId: "",
  })
  const [bins, setBins] = useState<Bin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetchBins()
      
      // Pre-populate form if editing
      if (editingRequest) {
        setFormData({
          type: editingRequest.type,
          description: editingRequest.description,
          priority: editingRequest.priority || "MEDIUM",
          binId: editingRequest.binId || "",
        })
      } else {
        setFormData({
          type: "COLLECTION",
          description: "",
          priority: "MEDIUM",
          binId: "",
        })
      }
      setError("")
    }
  }, [isOpen, editingRequest])

  const fetchBins = async () => {
    try {
      const response = await fetch("/api/bins")
      if (response.ok) {
        const data = await response.json()
        setBins(data)
      }
    } catch (error) {
      console.error("Failed to fetch bins:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = editingRequest 
        ? `/api/requests/${editingRequest.id}`
        : "/api/requests"
      
      const method = editingRequest ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${editingRequest ? 'update' : 'create'} request`)
      }

      onSubmit()
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedType = REQUEST_TYPES.find((t) => t.value === formData.type)
  const SelectedIcon = selectedType?.icon || Package

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div
          className={`relative bg-linear-to-r ${selectedType?.color} p-6 text-white overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <SelectedIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {editingRequest ? 'Edit Request' : 'Create Request'}
                </h2>
                <p className="text-white/90 text-sm">
                  {editingRequest ? 'Update service request details' : 'Submit a new service request'}
                </p>
              </div>
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

          {/* Request Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Request Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {REQUEST_TYPES.map((type) => {
                const TypeIcon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.type === type.value
                        ? `border-transparent bg-linear-to-br ${type.color} text-white shadow-lg scale-105`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <TypeIcon
                      className={`w-6 h-6 mb-2 ${
                        formData.type === type.value ? "text-white" : "text-gray-400"
                      }`}
                    />
                    <div className="font-semibold text-sm mb-1">{type.label}</div>
                    <div
                      className={`text-xs ${
                        formData.type === type.value ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {type.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bin Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Bin (Optional)
            </label>
            <select
              value={formData.binId}
              onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm font-medium"
            >
              <option value="">No specific bin</option>
              {bins.map((bin) => (
                <option key={bin.id} value={bin.id}>
                  {bin.binId} - {bin.location} ({bin.category})
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITY_LEVELS.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    formData.priority === priority.value
                      ? `border-transparent bg-linear-to-br ${priority.color} text-white shadow-lg scale-105`
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="font-semibold text-sm">{priority.label.replace(" Priority", "")}</div>
                  {formData.priority === priority.value && (
                    <div className="mt-1.5 mx-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide details about your request..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              {formData.description.length} / 500 characters
            </p>
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
                  {editingRequest ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editingRequest ? 'Update Request' : 'Create Request'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
