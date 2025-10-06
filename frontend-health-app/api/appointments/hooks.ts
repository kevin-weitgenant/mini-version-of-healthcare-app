import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAppointments, createAppointment, type CreateAppointmentRequest } from "./apiClient"

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
        return false
      }
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    staleTime: 0, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // Invalidate and refetch appointments data
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.refetchQueries({ queryKey: ["appointments"] })
      
      // Invalidate treatment plans data since booking auto-generates a treatment plan
      queryClient.invalidateQueries({ queryKey: ["treatment-plans"] })
      queryClient.refetchQueries({ queryKey: ["treatment-plans"] })
      
      // Invalidate specific treatment plan queries (pattern-based for any appointment ID)
      queryClient.invalidateQueries({ queryKey: ["treatment-plan"] })
    },
  })
}

