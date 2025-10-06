"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useHealthTracking } from "@/api/track/hooks"
import { format } from "date-fns"
import { useMemo } from "react"

export function HealthTrackingChart() {
  const { data: entries, isLoading, isError } = useHealthTracking()

  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) {
      // Return empty data structure to show axis
      return []
    }
    
    // Take the most recent 7 entries and reverse them (oldest to newest for chart)
    return entries
      .slice(0, 7)
      .reverse()
      .map(entry => ({
        date: format(new Date(entry.createdAt), "MMM d"),
        pain: entry.painLevel,
        energy: entry.energyLevel,
      }))
  }, [entries])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Tracking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            Loading chart...
          </div>
        )}
        
        {isError && (
          <div className="text-center py-16 text-destructive">
            Failed to load chart data.
          </div>
        )}
        
        {!isLoading && !isError && (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} name="Pain Level" />
                <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} name="Energy Level" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Pain Level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Energy Level</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
