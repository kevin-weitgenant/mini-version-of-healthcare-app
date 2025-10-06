"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/api/config"

export function useRequireAuth(redirectTo: string = "/"): boolean {
  const router = useRouter()
  const [hasToken, setHasToken] = useState<boolean>(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace(redirectTo)
      return
    }
    setHasToken(true)
  }, [router, redirectTo])

  return hasToken
}


