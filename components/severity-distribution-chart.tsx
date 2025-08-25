"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const severityData = [
  { severity: "Critical", count: 18, color: "#DC2626" },
  { severity: "High", count: 45, color: "#EA580C" },
  { severity: "Medium", count: 89, color: "#D97706" },
  { severity: "Low", count: 95, color: "#65A30D" },
]

const trendData = [
  { month: "Jan", critical: 22, high: 48, medium: 85, low: 92 },
  { month: "Feb", critical: 20, high: 46, medium: 87, low: 94 },
  { month: "Mar", critical: 18, high: 45, medium: 89, low: 95 },
]

export function SeverityDistributionChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ severity, count }) => `${severity}: ${count}`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Vulnerability Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#6C6C6C" />
              <YAxis stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="critical" stackId="a" fill="#DC2626" />
              <Bar dataKey="high" stackId="a" fill="#EA580C" />
              <Bar dataKey="medium" stackId="a" fill="#D97706" />
              <Bar dataKey="low" stackId="a" fill="#65A30D" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
