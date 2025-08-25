"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const topTalkerData = [
  { ip: "192.168.1.100", packets: 45000 },
  { ip: "10.0.0.15", packets: 38000 },
  { ip: "172.16.0.5", packets: 32000 },
  { ip: "192.168.1.50", packets: 28000 },
  { ip: "10.0.0.8", packets: 22000 },
]

const protocolData = [
  { protocol: "TCP", usage: 65 },
  { protocol: "TLS", usage: 45 },
  { protocol: "UDP", usage: 35 },
  { protocol: "HTTP", usage: 28 },
  { protocol: "ICMP", usage: 15 },
]

const portData = [
  { port: "443", connections: 1250 },
  { port: "80", connections: 980 },
  { port: "22", connections: 750 },
  { port: "21", connections: 420 },
  { port: "25", connections: 380 },
]

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Top Talker IPs</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topTalkerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="ip" tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="packets" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Most Used Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={protocolData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="protocol" tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="usage" fill="#3498DB" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Most Used Ports</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={portData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="port" tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6C6C6C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="connections" fill="#2ECC71" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
