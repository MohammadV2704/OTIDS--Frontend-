"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const sensorsData = [
  {
    id: 1,
    status: "Online",
    agentName: "SENSOR-001",
    ipAddress: "192.168.1.10",
    lastSeen: "2 minutes ago",
    location: "Production Floor",
  },
  {
    id: 2,
    status: "Online",
    agentName: "SENSOR-002",
    ipAddress: "192.168.1.11",
    lastSeen: "5 minutes ago",
    location: "Control Room",
  },
  {
    id: 3,
    status: "Warning",
    agentName: "SENSOR-003",
    ipAddress: "192.168.1.12",
    lastSeen: "15 minutes ago",
    location: "Server Room",
  },
  {
    id: 4,
    status: "Online",
    agentName: "SENSOR-004",
    ipAddress: "192.168.1.13",
    lastSeen: "1 minute ago",
    location: "Network Closet",
  },
  {
    id: 5,
    status: "Offline",
    agentName: "SENSOR-005",
    ipAddress: "192.168.1.14",
    lastSeen: "2 hours ago",
    location: "Backup Site",
  },
]

export function SensorsTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800"
      case "Warning":
        return "bg-yellow-100 text-yellow-800"
      case "Offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-otids">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-otids-primary">Connected Sensors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-otids-primary">Status</TableHead>
              <TableHead className="text-otids-primary">Agent Name</TableHead>
              <TableHead className="text-otids-primary">IP Address</TableHead>
              <TableHead className="text-otids-primary">Last Seen</TableHead>
              <TableHead className="text-otids-primary">Location</TableHead>
              <TableHead className="text-otids-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensorsData.map((sensor) => (
              <TableRow key={sensor.id} className="hover:bg-otids-secondary/20">
                <TableCell>
                  <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                </TableCell>
                <TableCell className="font-medium text-otids-primary">{sensor.agentName}</TableCell>
                <TableCell className="text-otids-secondary">{sensor.ipAddress}</TableCell>
                <TableCell className="text-otids-secondary">{sensor.lastSeen}</TableCell>
                <TableCell className="text-otids-secondary">{sensor.location}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
