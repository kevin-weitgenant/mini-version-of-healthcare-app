import { useQuery } from "@tanstack/react-query"
import {
  fetchTreatmentPlanByAppointmentId,
  fetchAllTreatmentPlans,
} from "./apiClient"
import { getAuthToken } from "../config"
import { useEffect, useState } from "react"

export function useTreatmentPlan(appointmentId: number | null) {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    // Only check for token on client side after mount
    setHasToken(!!getAuthToken())
  }, [])

  return useQuery({
    queryKey: ["treatment-plan", appointmentId],
    queryFn: () => fetchTreatmentPlanByAppointmentId(appointmentId!),
    enabled: appointmentId !== null && hasToken, // Only run if we have an appointment ID and are authenticated
    retry: (failureCount, error) => {
      // Don't retry on authentication or not found errors
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("404") ||
          error.message.includes("Unauthorized"))
      ) {
        return false
      }
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

export function useTreatmentPlans() {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    // Only check for token on client side after mount
    setHasToken(!!getAuthToken())
  }, [])

  return useQuery({
    queryKey: ["treatment-plans"],
    queryFn: fetchAllTreatmentPlans,
    enabled: hasToken, // Only run if user is authenticated
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error instanceof Error &&
        (error.message.includes("401") || error.message.includes("Unauthorized"))
      ) {
        return false
      }
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

