import { Bin, Category, BinStatus, User, Role, Request, RequestType, RequestStatus, Priority } from '@prisma/client'

// Export Prisma types
export type { 
  Bin, 
  Category, 
  BinStatus, 
  User, 
  Role, 
  Request, 
  RequestType, 
  RequestStatus,
  Priority 
}

// Extended types with relations
export type BinWithRequests = Bin & {
  requests: Request[]
}

export type RequestWithRelations = Request & {
  user: User
  bin: Bin | null
}

// Form types
export type CreateBinInput = {
  binId: string
  category: Category
  location: string
  latitude?: number
  longitude?: number
  capacity?: number
}

export type UpdateBinInput = Partial<CreateBinInput> & {
  currentLevel?: number
  status?: BinStatus
}

export type CreateRequestInput = {
  type: RequestType
  description?: string
  priority?: Priority
  binId?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type SignupInput = {
  email: string
  password: string
  name: string
  role?: Role
}

// Analytics types
export type CategoryData = {
  category: Category
  amount: number
  percentage: number
}

export type PeakHourData = {
  hour: number
  amount: number
}

export type DashboardStats = {
  totalBins: number
  activeBins: number
  criticalBins: number
  totalWasteCollected: number
  avgFillLevel: number
}

export type ReportData = {
  date: Date
  wasteCollected: number
  categoryBreakdown: CategoryData[]
  peakHours: PeakHourData[]
}
