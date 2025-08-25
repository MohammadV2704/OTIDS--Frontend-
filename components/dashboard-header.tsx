"use client"

import { Shield, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserDropdownMenu } from "@/components/user-dropdown-menu"

interface DashboardHeaderProps {
  user: string
  onLogout: () => void
  onSystemInformation: () => void
  onSensorManagement: () => void
}

export function DashboardHeader({ user, onLogout, onSystemInformation, onSensorManagement }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-otids shadow-sm h-16 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-4 h-full">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-otids-primary p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-otids-primary">OTIDS</h1>
              <p className="text-sm text-otids-secondary">Network Security Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-otids-secondary">
            Status: Active
          </Badge>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-otids-secondary">Welcome, {user}</span>
            <UserDropdownMenu
              user={user}
              onLogout={onLogout}
              onSystemInformation={onSystemInformation}
              onSensorManagement={onSensorManagement}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
