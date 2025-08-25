"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, TrendingUp, CheckCircle } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Active Threats",
      value: "12",
      change: "+3 from yesterday",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Network Devices",
      value: "847",
      change: "+5 new devices",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Security Score",
      value: "87%",
      change: "+2% improvement",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Resolved Today",
      value: "24",
      change: "8 critical resolved",
      icon: CheckCircle,
      color: "text-otids-primary",
      bgColor: "bg-otids-primary-light",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
