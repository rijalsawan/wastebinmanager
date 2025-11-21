// Waste category definitions with colors and icons
export const WASTE_CATEGORIES = {
  PLASTIC: {
    name: 'Plastic',
    color: '#3b82f6', // blue-500
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    lightBg: 'bg-blue-50',
    icon: '♻️',
  },
  PAPER: {
    name: 'Paper',
    color: '#8b5cf6', // violet-500
    bgColor: 'bg-violet-500',
    textColor: 'text-violet-600',
    lightBg: 'bg-violet-50',
    icon: '📄',
  },
  METAL: {
    name: 'Metal',
    color: '#6b7280', // gray-500
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-600',
    lightBg: 'bg-gray-50',
    icon: '🔩',
  },
  ORGANIC: {
    name: 'Organic',
    color: '#22c55e', // green-500
    bgColor: 'bg-green-500',
    textColor: 'text-green-600',
    lightBg: 'bg-green-50',
    icon: '🌿',
  },
  GLASS: {
    name: 'Glass',
    color: '#06b6d4', // cyan-500
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    lightBg: 'bg-cyan-50',
    icon: '🫙',
  },
  EWASTE: {
    name: 'E-Waste',
    color: '#f97316', // orange-500
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600',
    lightBg: 'bg-orange-50',
    icon: '⚡',
  },
} as const

export type CategoryKey = keyof typeof WASTE_CATEGORIES

// Bin status thresholds and colors
export const BIN_STATUS_CONFIG = {
  LOW: {
    name: 'Low',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    threshold: [0, 50],
  },
  MEDIUM: {
    name: 'Medium',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-500',
    threshold: [51, 80],
  },
  HIGH: {
    name: 'High',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    threshold: [81, 100],
  },
} as const

// Request type labels
export const REQUEST_TYPES = {
  MANUAL_PICKUP: 'Manual Pickup',
  MAINTENANCE: 'Bin Maintenance',
  HAZARDOUS_WASTE: 'Hazardous Waste Alert',
} as const

// Request status labels and colors
export const REQUEST_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
} as const

// Priority labels and colors
export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  NORMAL: {
    label: 'Normal',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  URGENT: {
    label: 'Urgent',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
} as const

// Auto-refresh interval (in milliseconds)
export const REFRESH_INTERVAL = 10000 // 10 seconds

// Sensor simulation interval
export const SENSOR_UPDATE_INTERVAL = 30000 // 30 seconds

// Alert threshold for bin fill level
export const ALERT_THRESHOLD = 80 // 80%
