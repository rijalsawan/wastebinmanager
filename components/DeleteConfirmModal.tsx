"use client"

import { X, AlertTriangle } from "lucide-react"
import { Button } from "./ui/Button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  loading?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(218,220,224)]">
          <h2 className="text-xl font-normal text-[rgb(32,33,36)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(241,243,244)] rounded-full transition-colors text-[rgb(95,99,104)]"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[rgb(217,48,37)]" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[rgb(60,64,67)] mb-2">{message}</p>
              {itemName && (
                <div className="mt-3 p-3 bg-[rgb(248,249,250)] rounded-md">
                  <p className="text-sm font-medium text-[rgb(32,33,36)]">{itemName}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-[rgb(248,249,250)] border-t border-[rgb(218,220,224)]">
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
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-[rgb(217,48,37)] hover:bg-[rgb(197,34,31)] text-white font-medium px-6 rounded-md shadow-none"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
