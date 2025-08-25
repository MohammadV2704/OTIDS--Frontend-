"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "assets", label: "Assets" },
  { id: "network", label: "Network Communication" },
  { id: "network-map", label: "Network Map" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
  { id: "security-events", label: "Security Events" },
  { id: "incidents", label: "Incidents" },
]

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="bg-white border-b border-otids shadow-sm">
      <div className="px-6">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent hover:border-otids-primary hover:text-otids-primary",
                activeTab === tab.id && "border-otids-primary text-otids-primary bg-otids-primary-light/20",
              )}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
