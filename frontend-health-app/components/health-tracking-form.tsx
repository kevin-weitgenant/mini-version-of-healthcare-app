"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useCreateHealthTracking } from "@/api/track/hooks"

const painEmojis = ["😊", "🙂", "😐", "😕", "😟", "😢", "😭", "😰", "😱", "🤕"]
const energyEmojis = ["😴", "🥱", "😑", "😐", "🙂", "😊", "😄", "😃", "🤗", "⚡"]

export function HealthTrackingForm() {
  const [painLevel, setPainLevel] = useState([5])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [notes, setNotes] = useState("")

  const createHealthTracking = useCreateHealthTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createHealthTracking.mutateAsync({
        painLevel: painLevel[0],
        energyLevel: energyLevel[0],
        notes: notes.trim() || undefined,
      })

      // Reset form on success
      setPainLevel([5])
      setEnergyLevel([5])
      setNotes("")
    } catch (error) {
      console.error("Failed to save health tracking entry:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Today's Health</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {createHealthTracking.isError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              Failed to save entry. Please try again.
            </div>
          )}
          {createHealthTracking.isSuccess && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              Entry saved successfully!
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Pain Level</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{painEmojis[painLevel[0] - 1]}</span>
                <span className="text-sm font-medium">{painLevel[0]}/10</span>
              </div>
            </div>
            <Slider value={painLevel} onValueChange={setPainLevel} min={1} max={10} step={1} className="w-full" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Energy Level</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{energyEmojis[energyLevel[0] - 1]}</span>
                <span className="text-sm font-medium">{energyLevel[0]}/10</span>
              </div>
            </div>
            <Slider value={energyLevel} onValueChange={setEnergyLevel} min={1} max={10} step={1} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling today? Any symptoms or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createHealthTracking.isPending}>
            {createHealthTracking.isPending ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
