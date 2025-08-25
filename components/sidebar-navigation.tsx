"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  HardDrive,
  Network,
  Globe,
  Shield,
  AlertTriangle,
  Calendar,
  FileText,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface SidebarNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "assets", label: "Asset", icon: HardDrive },
  { id: "network", label: "Network Communication", icon: Network },
  { id: "network-map", label: "Network Map", icon: Globe },
  { id: "vulnerabilities", label: "Vulnerability", icon: Shield },
  {
    id: "security-events",
    label: "Security Events",
    icon: AlertTriangle,
    children: [
      { id: "events", label: "Event", icon: Calendar },
      { id: "incidents", label: "Incident", icon: FileText },
    ],
  },
]

export function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["security-events"])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 flex-shrink-0",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "border-b border-gray-200 flex items-center h-16 flex-shrink-0",
          isCollapsed ? "px-3 justify-center" : "px-4",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",
            isCollapsed ? "w-10 h-10" : "w-10 h-10 mr-3",
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
        {!isCollapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">OTIDS Menu</h2>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1 overflow-y-auto", isCollapsed ? "px-2 py-4" : "px-4 py-4")}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.id)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.id)
                  } else {
                    onTabChange(item.id)
                  }
                }}
                className={cn(
                  "w-full flex items-center rounded-lg transition-colors group",
                  isCollapsed ? "justify-center p-3 h-12" : "gap-3 px-3 py-2.5 text-left min-h-[44px]",
                  activeTab === item.id ? "bg-otids-primary text-white" : "text-gray-700 hover:bg-gray-100",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 leading-tight">{item.label}</span>
                    {hasChildren && (
                      <div className="flex-shrink-0 ml-auto">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Show child items when collapsed if parent is active or child is active */}
              {hasChildren &&
                (isExpanded ||
                  (isCollapsed &&
                    (activeTab === "events" ||
                      activeTab === "incidents" ||
                      item.children?.some((child) => child.id === activeTab)))) && (
                  <div
                    className={cn(isCollapsed ? "space-y-1 mt-1" : "ml-6 mt-1 space-y-1 border-l border-gray-200 pl-4")}
                  >
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon
                      return (
                        <button
                          key={child.id}
                          onClick={() => onTabChange(child.id)}
                          className={cn(
                            "w-full flex items-center rounded-lg transition-colors",
                            isCollapsed ? "justify-center p-2 h-10" : "gap-3 px-3 py-2 text-left min-h-[40px]",
                            activeTab === child.id ? "bg-otids-primary text-white" : "text-gray-600 hover:bg-gray-100",
                          )}
                          title={isCollapsed ? child.label : undefined}
                        >
                          <ChildIcon className={cn("flex-shrink-0", isCollapsed ? "h-4 w-4" : "h-4 w-4")} />
                          {!isCollapsed && <span className="text-sm leading-tight">{child.label}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
