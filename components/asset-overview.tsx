"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, AlertTriangle, Plus, TrendingUp } from "lucide-react"

export function AssetOverview() {
  const overviewStats = [
    {
      title: "Total Assets",
      value: "1,247",
      change: "+23 this week",
      icon: Server,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Vulnerable Devices",
      value: "89",
      change: "-12 from last week",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Newly Discovered",
      value: "15",
      change: "Past 24 hours",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Risk Trend",
      value: "Medium",
      change: "Improving overall",
      icon: TrendingUp,
      color: "text-otids-primary",
      bgColor: "bg-otids-primary-light",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {overviewStats.map((stat, index) => (
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
