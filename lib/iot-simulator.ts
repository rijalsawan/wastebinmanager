/**
 * IoT Sensor Simulator
 * Simulates realistic waste bin fill patterns based on:
 * - Time of day (morning/evening peaks)
 * - Day of week (weekday vs weekend)
 * - Waste category (different fill rates)
 * - Location patterns
 */

type Category = "PLASTIC" | "PAPER" | "METAL" | "ORGANIC" | "GLASS" | "EWASTE"

interface BinUpdatePattern {
  baseRate: number // Base fill rate per hour (%)
  peakHours: number[] // Hours when this category peaks (0-23)
  peakMultiplier: number // Multiplier during peak hours
  weekendMultiplier: number // Multiplier on weekends
}

// Realistic fill patterns for each waste category
// NOTE: Rates are MUCH higher for demo purposes to show dramatic changes
const CATEGORY_PATTERNS: Record<Category, BinUpdatePattern> = {
  PLASTIC: {
    baseRate: 15, // 15% per hour (fast demo mode)
    peakHours: [12, 13, 18, 19], // Lunch and dinner times
    peakMultiplier: 2.5,
    weekendMultiplier: 1.2,
  },
  PAPER: {
    baseRate: 12,
    peakHours: [9, 10, 14, 15], // Office hours
    peakMultiplier: 2.0,
    weekendMultiplier: 0.6, // Less paper on weekends
  },
  METAL: {
    baseRate: 10,
    peakHours: [12, 13, 18, 19],
    peakMultiplier: 1.8,
    weekendMultiplier: 1.3,
  },
  ORGANIC: {
    baseRate: 20, // Fastest filling (food waste)
    peakHours: [7, 8, 12, 13, 18, 19, 20], // Breakfast, lunch, dinner
    peakMultiplier: 3.0,
    weekendMultiplier: 1.4, // More cooking on weekends
  },
  GLASS: {
    baseRate: 8,
    peakHours: [17, 18, 19, 20, 21], // Evening/night
    peakMultiplier: 2.2,
    weekendMultiplier: 1.8, // More glass on weekends (parties, etc.)
  },
  EWASTE: {
    baseRate: 6, // Slowest filling but still visible
    peakHours: [10, 11, 15, 16], // Office hours
    peakMultiplier: 1.5,
    weekendMultiplier: 0.8,
  },
}

/**
 * Calculate the fill increment for a bin based on current conditions
 * NOTE: Using 30-second intervals in demo mode for visible changes
 */
export function calculateFillIncrement(
  category: Category,
  currentLevel: number,
  intervalSeconds: number = 30 // Changed to seconds for demo
): number {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const pattern = CATEGORY_PATTERNS[category]
  
  // Base increment (adjusted for 30-second intervals)
  // baseRate is per hour, so divide by 120 for 30-second intervals
  let increment = (pattern.baseRate / 120) * intervalSeconds

  // Apply peak hour multiplier
  if (pattern.peakHours.includes(hour)) {
    increment *= pattern.peakMultiplier
  }

  // Apply weekend multiplier
  if (isWeekend) {
    increment *= pattern.weekendMultiplier
  }

  // Add some randomness (±30% for more variation)
  const randomFactor = 0.7 + Math.random() * 0.6
  increment *= randomFactor

  // Slow down as bin gets fuller (resistance effect)
  if (currentLevel > 80) {
    increment *= 0.7
  } else if (currentLevel > 90) {
    increment *= 0.4
  }

  // Don't overflow beyond 100%
  if (currentLevel + increment > 100) {
    increment = 100 - currentLevel
  }

  return Math.max(0, increment)
}

/**
 * Determine if a bin should be auto-emptied based on patterns
 * (Simulates collection trucks emptying high-priority bins)
 * NOTE: More aggressive auto-emptying for demo purposes
 */
export function shouldAutoEmpty(
  currentLevel: number,
  category: Category,
  lastEmptied: Date
): boolean {
  const minutesSinceEmpty = (Date.now() - lastEmptied.getTime()) / (1000 * 60)
  
  // High priority bins that have been full for 5+ minutes (demo mode)
  if (currentLevel >= 95 && minutesSinceEmpty >= 5) {
    return Math.random() > 0.5 // 50% chance
  }

  // Medium priority bins that have been full for 10+ minutes
  if (currentLevel >= 85 && minutesSinceEmpty >= 10) {
    return Math.random() > 0.7 // 30% chance
  }

  return false
}

/**
 * Get the next simulation interval (in milliseconds)
 * DEMO MODE: Fast updates to show dramatic changes
 */
export function getSimulationInterval(): number {
  // Fast demo mode - update every 15 seconds for dramatic effect
  return 15000 // 15 seconds
}

/**
 * Format simulation status for logging
 */
export function formatSimulationLog(
  binId: string,
  oldLevel: number,
  newLevel: number,
  category: Category,
  wasEmptied: boolean
): string {
  if (wasEmptied) {
    return `🚛 ${binId} (${category}) EMPTIED: ${oldLevel.toFixed(1)}% → 0%`
  }
  
  const change = newLevel - oldLevel
  const arrow = change > 0 ? '↑' : '='
  
  return `📊 ${binId} (${category}) ${arrow} ${oldLevel.toFixed(1)}% → ${newLevel.toFixed(1)}% (+${change.toFixed(1)}%)`
}
