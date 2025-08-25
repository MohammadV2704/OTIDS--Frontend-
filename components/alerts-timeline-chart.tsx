"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const timelineData = [
  { time: "00:00", high: 2, medium: 8, low: 15, info: 25 },
  { time: "04:00", high: 1, medium: 12, low: 18, info: 30 },
  { time: "08:00", high: 5, medium: 15, low: 22, info: 35 },
  { time: "12:00", high: 8, medium: 20, low: 25, info: 40 },
  { time: "16:00", high: 6, medium: 18, low: 28, info: 38 },
  { time: "20:00", high: 3, medium: 14, low: 20, info: 32 },
]

const severityTrendData = [
  { day: "Mon", alerts: 145 },
  { day: "Tue", alerts: 167 },
  { day: "Wed", alerts: 189 },
  { day: "Thu", alerts: 156 },
  { day: "Fri", alerts: 178 },
  { day: "Sat", alerts: 134 },
  { day: "Sun", alerts: 123 },
]

export function AlertsTimelineChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Alerts Timeline (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="time" stroke="#6C6C6C" />
              <YAxis stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="high" stroke="#DC2626" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#EA580C" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#D97706" strokeWidth={2} />
              <Line type="monotone" dataKey="info" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Weekly Alert Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={severityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="day" stroke="#6C6C6C" />
              <YAxis stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="alerts" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
