"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2 } from "lucide-react"
import { useDoctors } from "@/api/doctors/hooks"
import type { Doctor } from "@/api/doctors/apiClient"

interface DoctorSelectionProps {
  onSelectDoctor: (doctor: Doctor) => void
}

export function DoctorSelection({ onSelectDoctor }: DoctorSelectionProps) {
  const { data: doctors = [], isLoading: loading, error } = useDoctors()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>{error instanceof Error ? error.message : "Failed to load doctors"}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback>{doctor.name.split(" ")[1][0]}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h3 className="font-semibold">{doctor.name}</h3>
                <Badge variant="secondary">{doctor.specialty}</Badge>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{doctor.rating}</span>
              </div>

              <Button onClick={() => onSelectDoctor(doctor)} className="w-full">
                Select Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
