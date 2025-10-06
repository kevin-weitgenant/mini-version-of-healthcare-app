"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useHealthTracking } from "@/api/track/hooks"
import { format } from "date-fns"

export function HealthTrackingHistory() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { data: entries, isLoading, isError } = useHealthTracking()

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading history...
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8 text-destructive">
            Failed to load history. Please try again.
          </div>
        )}
        
        {!isLoading && !isError && entries && entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tracking entries yet. Start logging your health above!
          </div>
        )}
        
        {!isLoading && !isError && entries && entries.length > 0 && entries.map((entry) => (
          <div key={entry.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{format(new Date(entry.createdAt), "MMM d, yyyy")}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Pain: {entry.painLevel}/10
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Energy: {entry.energyLevel}/10
                    </Badge>
                  </div>
                </div>
                {expandedId === entry.id && entry.notes && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{entry.notes}</p>
                )}
              </div>
              {entry.notes && (
                <Button variant="ghost" size="sm" onClick={() => toggleExpand(entry.id)}>
                  {expandedId === entry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
