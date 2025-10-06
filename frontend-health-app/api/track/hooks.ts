import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchHealthTracking, createHealthTracking, type CreateHealthTrackingRequest } from "./apiClient"

export function useHealthTracking() {
  return useQuery({
    queryKey: ["healthTracking"],
    queryFn: fetchHealthTracking,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
        return false
      }
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  })
}

export function useCreateHealthTracking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createHealthTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healthTracking"] })
    },
  })
}

