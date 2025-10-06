"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUser } from "@/api/auth/hooks"

export function DashboardHeader() {
  const { data: userData, isFetching } = useCurrentUser()
  const user = userData

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const trimmed = name.trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() : "U"
  }

  const displayName = user?.name || "User"

  return (
    <header className="border-b bg-card">
      <div className="flex items-center p-4 lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-3 ml-auto">
          <Avatar>
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
        </div>
      </div>
    </header>
  )
}
