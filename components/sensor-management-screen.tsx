"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Eye, Settings, Trash2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SensorManagementScreenProps {
  onBack: () => void
  onSensorClick: (sensor: any) => void
}

export function SensorManagementScreen({ onBack, onSensorClick }: SensorManagementScreenProps) {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [deployForm, setDeployForm] = useState({
    interface: "",
    agentName: "",
    ipAddress: "",
  })

  const sensors = [
    {
      id: 1,
      agentName: "mohammad",
      hostName: "SENSOR-01",
      machineType: "Linux Server",
      processor: "Intel Xeon E5-2680",
      freeDisk: 245,
      ipAddress: "172.18.6.130",
      status: "offline",
    },
    {
      id: 2,
      agentName: "sensor-web-01",
      hostName: "WEB-SERVER-01",
      machineType: "Ubuntu 20.04",
      processor: "AMD Ryzen 7 3700X",
      freeDisk: 512,
      ipAddress: "192.168.1.45",
      status: "online",
    },
    {
      id: 3,
      agentName: "sensor-db-01",
      hostName: "DATABASE-01",
      machineType: "CentOS 8",
      processor: "Intel Core i7-9700K",
      freeDisk: 128,
      ipAddress: "10.0.0.15",
      status: "online",
    },
    {
      id: 4,
      agentName: "sensor-api-01",
      hostName: "API-SERVER-01",
      machineType: "Windows Server 2019",
      processor: "Intel Xeon Silver 4214",
      freeDisk: 320,
      ipAddress: "172.16.0.100",
      status: "warning",
    },
  ]

  const sensorCounts = {
    online: sensors.filter((s) => s.status === "online").length,
    offline: sensors.filter((s) => s.status === "offline").length,
    warning: sensors.filter((s) => s.status === "warning").length,
    total: sensors.length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "offline":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Offline</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleDeploySubmit = () => {
    // Handle deployment logic here
    console.log("Deploying sensor:", deployForm)
    setIsDeployModalOpen(false)
    setDeployForm({ interface: "", agentName: "", ipAddress: "" })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-otids-primary">Sensor Management</h1>
            <p className="text-otids-secondary">Monitor and manage deployed sensors across your network</p>
          </div>
        </div>
        <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-otids-primary hover:bg-otids-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Deploy Sensor Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Deploy Sensor Endpoint</DialogTitle>
              <DialogDescription>Configure and deploy a new sensor agent to monitor network traffic.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interface" className="text-right">
                  Interface
                </Label>
                <Select
                  value={deployForm.interface}
                  onValueChange={(value) => setDeployForm({ ...deployForm, interface: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select network interface" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth0">eth0 - Primary Network</SelectItem>
                    <SelectItem value="eth1">eth1 - Secondary Network</SelectItem>
                    <SelectItem value="wlan0">wlan0 - Wireless Interface</SelectItem>
                    <SelectItem value="lo">lo - Loopback Interface</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agentName" className="text-right">
                  Agent Name
                </Label>
                <Input
                  id="agentName"
                  value={deployForm.agentName}
                  onChange={(e) => setDeployForm({ ...deployForm, agentName: e.target.value })}
                  placeholder="sensor-web-02"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ipAddress" className="text-right">
                  IP Address
                </Label>
                <Input
                  id="ipAddress"
                  value={deployForm.ipAddress}
                  onChange={(e) => setDeployForm({ ...deployForm, ipAddress: e.target.value })}
                  placeholder="192.168.1.100"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleDeploySubmit} className="bg-otids-primary hover:bg-otids-primary/90">
                Deploy Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 fill-current text-green-600" />
              <div>
                <p className="text-sm text-otids-secondary">Online</p>
                <p className="text-2xl font-bold text-green-600">{sensorCounts.online}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 fill-current text-red-600" />
              <div>
                <p className="text-sm text-otids-secondary">Offline</p>
                <p className="text-2xl font-bold text-red-600">{sensorCounts.offline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 fill-current text-yellow-600" />
              <div>
                <p className="text-sm text-otids-secondary">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{sensorCounts.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div>
              <p className="text-sm text-otids-secondary">Total</p>
              <p className="text-2xl font-bold text-otids-primary">{sensorCounts.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensors Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Sensors</CardTitle>
          <CardDescription>Monitor the status and performance of deployed sensor agents</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Machine Type</TableHead>
                <TableHead>Processor</TableHead>
                <TableHead>Free Disk (GB)</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="font-medium">
                    <button onClick={() => onSensorClick(sensor)} className="text-otids-primary hover:underline">
                      {sensor.agentName}
                    </button>
                  </TableCell>
                  <TableCell>{sensor.hostName}</TableCell>
                  <TableCell>{sensor.machineType}</TableCell>
                  <TableCell>{sensor.processor}</TableCell>
                  <TableCell>{sensor.freeDisk} GB</TableCell>
                  <TableCell className="font-mono">{sensor.ipAddress}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Circle className={`h-2 w-2 fill-current ${getStatusColor(sensor.status)}`} />
                      {getStatusBadge(sensor.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onSensorClick(sensor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
