"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Globe, TrendingUp } from "lucide-react"

export function SecurityEventsOverview() {
  const securityStats = [
    {
      title: "Total Alerts",
      value: "1,247",
      change: "+89 today",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "High Severity",
      value: "23",
      change: "Requires attention",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Affected IPs",
      value: "156",
      change: "+12 new IPs",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Threat Score",
      value: "7.2",
      change: "Elevated risk",
      icon: TrendingUp,
      color: "text-otids-primary",
      bgColor: "bg-otids-primary-light",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {securityStats.map((stat, index) => (
        <Card key={index} className="shadow-otids">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-otids-secondary">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-otids-primary">{stat.value}</div>
            <p className="text-xs text-otids-secondary mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
