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
        // Show specific error message from API
        const errorMessage = data.error || data.message || `Failed to ${editingRequest ? 'update' : 'create'} request`
        throw new Error(errorMessage)
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(218,220,224)]">
          <h2 className="text-xl font-normal text-[rgb(32,33,36)]">
            {editingRequest ? 'Edit request' : 'Create request'}
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

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-2">
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
                    className={`p-4 rounded-lg border transition-colors text-left ${
                      formData.type === type.value
                        ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)] border-[rgb(26,115,232)]"
                        : "bg-white text-[rgb(60,64,67)] border-[rgb(218,220,224)] hover:bg-[rgb(248,249,250)]"
                    }`}
                  >
                    <TypeIcon className="w-5 h-5 mb-2" />
                    <div className="font-medium text-sm mb-1">{type.label}</div>
                    <div className="text-xs opacity-70">
                      {type.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bin Selection */}
          <div>
            <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
              Select Bin (Optional)
            </label>
            <select
              value={formData.binId}
              onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
              className="w-full px-3 py-2 border border-[rgb(218,220,224)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20 focus:border-[rgb(26,115,232)] transition-all bg-white text-sm"
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
            <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITY_LEVELS.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    formData.priority === priority.value
                      ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)] border-[rgb(26,115,232)]"
                      : "bg-white text-[rgb(60,64,67)] border-[rgb(218,220,224)] hover:bg-[rgb(248,249,250)]"
                  }`}
                >
                  {priority.label.replace(" Priority", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[rgb(60,64,67)] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide details about your request..."
              rows={4}
              className="w-full px-3 py-2 border border-[rgb(218,220,224)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20 focus:border-[rgb(26,115,232)] transition-all resize-none text-sm"
            />
            <p className="mt-1 text-xs text-[rgb(95,99,104)]">
              {formData.description.length} / 500 characters
            </p>
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
              {loading ? 'Saving...' : (editingRequest ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
