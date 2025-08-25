"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Globe, Layers, BarChart3 } from "lucide-react"

export function NetworkMetrics() {
  const metrics = [
    {
      title: "Total Packets",
      value: "2,847,392",
      change: "+12,450 in last hour",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Unique IPs",
      value: "1,247",
      change: "+23 new IPs today",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Protocols",
      value: "15",
      change: "Active protocols",
      icon: Layers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Packet Size",
      value: "1,024 bytes",
      change: "Standard MTU",
      icon: BarChart3,
      color: "text-otids-primary",
      bgColor: "bg-otids-primary-light",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="shadow-otids">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-otids-secondary">{metric.title}</CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-otids-primary">{metric.value}</div>
            <p className="text-xs text-otids-secondary mt-1">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
