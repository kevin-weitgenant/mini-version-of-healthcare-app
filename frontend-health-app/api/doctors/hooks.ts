import { useQuery } from "@tanstack/react-query"
import { fetchDoctors } from "./apiClient"

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  })
}

