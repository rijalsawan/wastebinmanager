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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-600 mt-2">
          Comprehensive insights into waste collection and management patterns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Collection"
          value={`${data.todayCollection}L`}
          icon={Droplet}
          color="blue"
        />
        <StatCard
          title="Weekly Average"
          value={`${data.weeklyAvg}L`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Avg Fill Level"
          value={`${data.avgFillLevel}%`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Critical Bins"
          value={data.criticalBins}
          icon={BarChart3}
          color="red"
        />
      </div>

      {/* Daily/Weekly Waste Collection */}
      <Card gradient glow>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Daily & Weekly Waste Collection
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">Weekly Avg</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Track waste collection trends over the past 7 days
          </p>
        </CardHeader>
        <CardContent>
          <WasteCollectionChart data={data.collectionData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Filled Categories */}
        <Card gradient>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-green-600" />
              Most Filled Categories
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Average fill levels by waste category
            </p>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={data.categoryData} />
            
            {/* Category Legend */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {data.categoryData.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      cat.category === 'GENERAL' ? 'bg-gray-500' :
                      cat.category === 'RECYCLING' ? 'bg-green-500' :
                      cat.category === 'ORGANIC' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{cat.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Waste Generation Hours */}
        <Card gradient>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Peak Waste Generation Hours
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Hourly waste disposal activity patterns
            </p>
          </CardHeader>
          <CardContent>
            <PeakHoursChart data={data.peakHoursData} />
            
            {/* Peak Hours Summary */}
            <div className="mt-6 p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Peak Activity Times</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AM</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Morning Peak</p>
                    <p className="text-sm font-bold text-gray-900">8:00 - 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PM</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Evening Peak</p>
                    <p className="text-sm font-bold text-gray-900">6:00 - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
