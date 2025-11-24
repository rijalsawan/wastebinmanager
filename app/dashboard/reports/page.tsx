import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart3, TrendingUp, Clock, Recycle, Calendar, Droplet } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { WasteCollectionChart } from "@/components/charts/WasteCollectionChart"
import { CategoryBarChart } from "@/components/charts/CategoryBarChart"
import { PeakHoursChart } from "@/components/charts/PeakHoursChart"
import { WASTE_CATEGORIES } from "@/lib/constants"
import { startOfWeek, format, subDays } from "date-fns"

async function getReportsData() {
  const bins = await prisma.bin.findMany({
    orderBy: { currentLevel: "desc" },
  })

  // Generate daily/weekly waste collection data (last 7 days)
  const collectionData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'MMM dd'),
      daily: Math.floor(Math.random() * 500) + 200, // Simulated data
      weekly: Math.floor(Math.random() * 400) + 250, // Simulated weekly average
    }
  })

  // Calculate category fill levels (most filled categories)
  const categoryData = Object.keys(WASTE_CATEGORIES).map((category) => {
    const categoryBins = bins.filter((bin: any) => bin.category === category)
    const totalLevel = categoryBins.reduce((sum: number, bin: any) => sum + bin.currentLevel, 0)
    const avgLevel = categoryBins.length > 0 ? totalLevel / categoryBins.length : 0

    return {
      category,
      value: Number(avgLevel.toFixed(1)), // Ensure it's a number
      count: categoryBins.length,
    }
  }) // Keep all categories in original order

  // Generate peak hours data (24 hours)
  const peakHoursData = Array.from({ length: 24 }, (_, i) => {
    let activity = 0
    // Simulate peak hours: 8-10 AM and 6-8 PM
    if ((i >= 8 && i <= 10) || (i >= 18 && i <= 20)) {
      activity = Math.floor(Math.random() * 30) + 40
    } else if (i >= 6 && i <= 22) {
      activity = Math.floor(Math.random() * 20) + 15
    } else {
      activity = Math.floor(Math.random() * 10) + 2
    }
    
    return {
      hour: i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`,
      activity,
    }
  })

  // Calculate overall stats
  const totalBins = bins.length
  const totalFillLevel = bins.reduce((sum: number, bin: any) => sum + bin.currentLevel, 0)
  const avgFillLevel = totalBins > 0 ? totalFillLevel / totalBins : 0
  const criticalBins = bins.filter((b: any) => b.currentLevel > 80).length
  const todayCollection = collectionData[collectionData.length - 1]?.daily || 0
  const weeklyAvg = collectionData.reduce((sum, day) => sum + day.weekly, 0) / collectionData.length

  return {
    collectionData,
    categoryData,
    peakHoursData,
    totalBins,
    avgFillLevel: avgFillLevel.toFixed(1),
    criticalBins,
    todayCollection,
    weeklyAvg: weeklyAvg.toFixed(0),
  }
}

export default async function ReportsPage() {
  const session = await auth()
  const data = await getReportsData()

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[rgb(218,220,224)] shadow-sm">
        <div>
          <h1 className="text-2xl font-medium text-[rgb(32,33,36)]">Reports & Analytics</h1>
          <p className="text-[rgb(95,99,104)] mt-1 text-sm">
            Comprehensive overview of waste management performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[rgb(95,99,104)] bg-[rgb(248,249,250)] px-4 py-2 rounded-full border border-[rgb(218,220,224)]">
          <Calendar className="w-4 h-4" />
          <span>Last 7 Days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Collection"
          value={`${data.todayCollection}L`}
          icon={Droplet}
          color="blue"
        />
        <StatCard
          title="Average Fill Level"
          value={`${data.avgFillLevel}%`}
          icon={BarChart3}
          color="green"
        />
        <StatCard
          title="Critical Bins"
          value={data.criticalBins}
          icon={TrendingUp}
          color="red"
        />
        <StatCard
          title="Weekly Average"
          value={`${data.weeklyAvg}L`}
          icon={Recycle}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[rgb(32,33,36)]">Collection Trends</h3>
            <p className="text-sm text-[rgb(95,99,104)]">Daily waste collection volume</p>
          </div>
          <div className="h-[300px] w-full">
            <WasteCollectionChart data={data.collectionData} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[rgb(32,33,36)]">Category Distribution</h3>
            <p className="text-sm text-[rgb(95,99,104)]">Average fill levels by category</p>
          </div>
          <div className="h-[300px] w-full">
            <CategoryBarChart data={data.categoryData} />
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[rgb(32,33,36)]">Peak Activity Hours</h3>
            <p className="text-sm text-[rgb(95,99,104)]">Bin usage frequency throughout the day</p>
          </div>
          <div className="h-[300px] w-full">
            <PeakHoursChart data={data.peakHoursData} />
          </div>
        </Card>
      </div>
    </div>
  )
}
