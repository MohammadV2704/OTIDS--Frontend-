"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  Settings,
  Activity,
  HardDrive,
  Network,
  Clock,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface IndividualSensorDashboardProps {
  sensor: any
  onBack: () => void
}

interface TrafficDataPoint {
  time: Date
  inbound: number
  outbound: number
}

export function IndividualSensorDashboard({ sensor, onBack }: IndividualSensorDashboardProps) {
  const inboundChartRef = useRef<HTMLDivElement>(null)
  const outboundChartRef = useRef<HTMLDivElement>(null)
  const combinedChartRef = useRef<HTMLDivElement>(null)

  const [sessionId, setSessionId] = useState("SID-2024-001-A7B9")
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([])
  const [currentCpu, setCurrentCpu] = useState(35)
  const [currentMemory, setCurrentMemory] = useState(58)
  const [currentInbound, setCurrentInbound] = useState(0)
  const [currentOutbound, setCurrentOutbound] = useState(0)
  const [yamlConfig, setYamlConfig] = useState(`# OTIDS Sensor Configuration
flow_detection:
  enabled: true
  timeout: 300
  max_flows: 10000

virustotal:
  enabled: false
  api_key: ""
  scan_threshold: 50

threat_intelligence:
  enabled: true
  feeds:
    - malware_domains
    - suspicious_ips
  update_interval: 3600

flow_alerts:
  enabled: true
  rules:
    - name: "Suspicious Traffic"
      condition: "bytes > 1000000"
      action: "alert"

exporting_alerts:
  syslog:
    enabled: true
    server: "192.168.1.10"
    port: 514
  email:
    enabled: false
    smtp_server: ""
    recipients: []`)

  // D3.js chart creation function for traffic data
  const createTrafficChart = (
    containerRef: React.RefObject<HTMLDivElement>,
    data: TrafficDataPoint[],
    dataKey: "inbound" | "outbound" | "both",
    color: string,
    label: string,
  ) => {
    if (!containerRef.current || data.length === 0) return

    const container = containerRef.current
    container.innerHTML = ""

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = container.clientWidth - margin.left - margin.right
    const height = 200 - margin.top - margin.bottom

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", (width + margin.left + margin.right).toString())
    svg.setAttribute("height", (height + margin.top + margin.bottom).toString())
    container.appendChild(svg)

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("transform", `translate(${margin.left},${margin.top})`)
    svg.appendChild(g)

    // Create scales
    const xScale = (value: Date) => {
      const domain = [data[0].time, data[data.length - 1].time]
      const range = [0, width]
      return ((value.getTime() - domain[0].getTime()) / (domain[1].getTime() - domain[0].getTime())) * range[1]
    }

    const maxValue = Math.max(...data.map((d) => Math.max(d.inbound, d.outbound)))
    const yScale = (value: number) => {
      return height - (value / maxValue) * height
    }

    // Create grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", "0")
      line.setAttribute("y1", y.toString())
      line.setAttribute("x2", width.toString())
      line.setAttribute("y2", y.toString())
      line.setAttribute("stroke", "#e5e7eb")
      line.setAttribute("stroke-dasharray", "3,3")
      g.appendChild(line)
    }

    // Create gradient for area fill
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    gradient.setAttribute("id", `gradient-${label}`)
    gradient.setAttribute("x1", "0%")
    gradient.setAttribute("y1", "0%")
    gradient.setAttribute("x2", "0%")
    gradient.setAttribute("y2", "100%")

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop1.setAttribute("offset", "0%")
    stop1.setAttribute("stop-color", color)
    stop1.setAttribute("stop-opacity", "0.4")

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop2.setAttribute("offset", "100%")
    stop2.setAttribute("stop-color", color)
    stop2.setAttribute("stop-opacity", "0.1")

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    if (dataKey === "both") {
      // Draw both inbound and outbound
      const colors = ["#10b981", "#3b82f6"]
      const keys = ["inbound", "outbound"] as const

      keys.forEach((key, index) => {
        let pathData = ""
        let areaData = ""

        data.forEach((point, i) => {
          const x = xScale(point.time)
          const y = yScale(point[key])

          if (i === 0) {
            pathData += `M ${x} ${y}`
            areaData += `M ${x} ${height} L ${x} ${y}`
          } else {
            pathData += ` L ${x} ${y}`
            areaData += ` L ${x} ${y}`
          }
        })

        areaData += ` L ${xScale(data[data.length - 1].time)} ${height} Z`

        // Create area
        const area = document.createElementNS("http://www.w3.org/2000/svg", "path")
        area.setAttribute("d", areaData)
        area.setAttribute("fill", colors[index])
        area.setAttribute("fill-opacity", "0.2")
        g.appendChild(area)

        // Create line
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute("d", pathData)
        path.setAttribute("stroke", colors[index])
        path.setAttribute("stroke-width", "2")
        path.setAttribute("fill", "none")
        g.appendChild(path)
      })
    } else {
      // Draw single line
      let pathData = ""
      let areaData = ""

      data.forEach((point, index) => {
        const x = xScale(point.time)
        const y = yScale(point[dataKey])

        if (index === 0) {
          pathData += `M ${x} ${y}`
          areaData += `M ${x} ${height} L ${x} ${y}`
        } else {
          pathData += ` L ${x} ${y}`
          areaData += ` L ${x} ${y}`
        }
      })

      areaData += ` L ${xScale(data[data.length - 1].time)} ${height} Z`

      // Create area
      const area = document.createElementNS("http://www.w3.org/2000/svg", "path")
      area.setAttribute("d", areaData)
      area.setAttribute("fill", `url(#gradient-${label})`)
      g.appendChild(area)

      // Create line
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", pathData)
      path.setAttribute("stroke", color)
      path.setAttribute("stroke-width", "3")
      path.setAttribute("fill", "none")
      g.appendChild(path)

      // Create data points
      data.forEach((point) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("cx", xScale(point.time).toString())
        circle.setAttribute("cy", yScale(point[dataKey]).toString())
        circle.setAttribute("r", "4")
        circle.setAttribute("fill", color)
        circle.setAttribute("stroke", "#ffffff")
        circle.setAttribute("stroke-width", "2")

        // Add hover effect
        circle.addEventListener("mouseenter", () => {
          circle.setAttribute("r", "6")
          const tooltip = document.createElement("div")
          tooltip.className = "absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
          tooltip.textContent = `${point[dataKey]} Mbps at ${point.time.toLocaleTimeString()}`
          tooltip.style.left = `${xScale(point.time) + margin.left}px`
          tooltip.style.top = `${yScale(point[dataKey]) + margin.top - 30}px`
          container.appendChild(tooltip)
        })

        circle.addEventListener("mouseleave", () => {
          circle.setAttribute("r", "4")
          const tooltip = container.querySelector(".absolute")
          if (tooltip) tooltip.remove()
        })

        g.appendChild(circle)
      })
    }

    // Create axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    xAxis.setAttribute("x1", "0")
    xAxis.setAttribute("y1", height.toString())
    xAxis.setAttribute("x2", width.toString())
    xAxis.setAttribute("y2", height.toString())
    xAxis.setAttribute("stroke", "#374151")
    g.appendChild(xAxis)

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    yAxis.setAttribute("x1", "0")
    yAxis.setAttribute("y1", "0")
    yAxis.setAttribute("x2", "0")
    yAxis.setAttribute("y2", height.toString())
    yAxis.setAttribute("stroke", "#374151")
    g.appendChild(yAxis)

    // Add Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i)
      const y = (height / 5) * i
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", "-10")
      text.setAttribute("y", (y + 5).toString())
      text.setAttribute("text-anchor", "end")
      text.setAttribute("font-size", "12")
      text.setAttribute("fill", "#6b7280")
      text.textContent = `${Math.round(value)}`
      g.appendChild(text)
    }

    // Add X-axis labels (time)
    const timeLabels = [0, Math.floor(data.length / 2), data.length - 1]
    timeLabels.forEach((index) => {
      if (data[index]) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttribute("x", xScale(data[index].time).toString())
        text.setAttribute("y", (height + 20).toString())
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("font-size", "10")
        text.setAttribute("fill", "#6b7280")
        text.textContent = data[index].time.toLocaleTimeString()
        g.appendChild(text)
      }
    })
  }

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      // Generate session ID rotation
      if (Math.random() < 0.1) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const newId =
          "SID-2024-001-" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        setSessionId(newId)
      }

      // Generate realistic traffic data with some correlation
      const baseInbound = 50 + Math.sin(Date.now() / 10000) * 30
      const baseOutbound = 35 + Math.cos(Date.now() / 8000) * 25

      const inbound = Math.max(0, baseInbound + (Math.random() - 0.5) * 20)
      const outbound = Math.max(0, baseOutbound + (Math.random() - 0.5) * 15)

      setCurrentInbound(Math.round(inbound))
      setCurrentOutbound(Math.round(outbound))

      setTrafficData((prev) => [...prev.slice(-19), { time: now, inbound, outbound }])

      // Update CPU/Memory
      setCurrentCpu(Math.floor(Math.random() * 40) + 20)
      setCurrentMemory(Math.floor(Math.random() * 30) + 40)
    }, 2000)

    // Initialize data
    const initialTime = new Date()
    const initialData = Array.from({ length: 15 }, (_, i) => {
      const time = new Date(initialTime.getTime() - (14 - i) * 2000)
      const baseInbound = 50 + Math.sin(time.getTime() / 10000) * 30
      const baseOutbound = 35 + Math.cos(time.getTime() / 8000) * 25

      return {
        time,
        inbound: Math.max(0, baseInbound + (Math.random() - 0.5) * 20),
        outbound: Math.max(0, baseOutbound + (Math.random() - 0.5) * 15),
      }
    })
    setTrafficData(initialData)

    return () => clearInterval(interval)
  }, [])

  // Update D3 charts when data changes
  useEffect(() => {
    createTrafficChart(inboundChartRef, trafficData, "inbound", "#10b981", "inbound")
  }, [trafficData])

  useEffect(() => {
    createTrafficChart(outboundChartRef, trafficData, "outbound", "#3b82f6", "outbound")
  }, [trafficData])

  useEffect(() => {
    createTrafficChart(combinedChartRef, trafficData, "both", "#10b981", "combined")
  }, [trafficData])

  const processes = [
    { pid: 1234, name: "otids-sensor", username: "root", status: "Running", threads: 8 },
    { pid: 1235, name: "network-monitor", username: "otids", status: "Running", threads: 4 },
    { pid: 1236, name: "flow-analyzer", username: "otids", status: "Running", threads: 12 },
    { pid: 1237, name: "threat-detector", username: "otids", status: "Sleeping", threads: 2 },
    { pid: 1238, name: "pcap-writer", username: "otids", status: "Running", threads: 6 },
  ]

  const pcapFiles = [
    { name: "traffic_2024-01-15_14-30.pcap", size: "245 MB", time: "2024-01-15 14:30:25", uploadedBy: "system", id: 1 },
    {
      name: "suspicious_2024-01-15_13-15.pcap",
      size: "89 MB",
      time: "2024-01-15 13:15:10",
      uploadedBy: "admin",
      id: 2,
    },
    {
      name: "baseline_2024-01-15_12-00.pcap",
      size: "512 MB",
      time: "2024-01-15 12:00:00",
      uploadedBy: "system",
      id: 3,
    },
  ]

  const interfaces = [
    { name: "lo", ip: "192.168.1.163", status: "ACTIVE" },
    { name: "eth0", ip: "192.168.1.100", status: "ACTIVE" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sensors</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-otids-primary">Sensor Dashboard - {sensor.agentName}</h1>
            <div className="flex items-center space-x-4 text-sm text-otids-secondary">
              <span>
                Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
              </span>
              <span>
                IP Address: <code className="bg-gray-100 px-2 py-1 rounded">{sensor.ipAddress}</code>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Sensor Dashboard</TabsTrigger>
          <TabsTrigger value="system">System Information</TabsTrigger>
          <TabsTrigger value="config">Configuration Files</TabsTrigger>
        </TabsList>

        {/* Tab 1: Sensor Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Traffic Monitoring with D3.js Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Inbound Traffic</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{currentInbound}</div>
                    <div className="text-sm text-otids-secondary">Mbps</div>
                  </div>
                </CardTitle>
                <CardDescription>Real-time inbound network traffic monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={inboundChartRef} className="h-48 relative" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>Outbound Traffic</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{currentOutbound}</div>
                    <div className="text-sm text-otids-secondary">Mbps</div>
                  </div>
                </CardTitle>
                <CardDescription>Real-time outbound network traffic monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={outboundChartRef} className="h-48 relative" />
              </CardContent>
            </Card>
          </div>

          {/* Combined Traffic Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-otids-primary" />
                <span>Combined Traffic Overview</span>
              </CardTitle>
              <CardDescription>Real-time combined inbound and outbound traffic analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-otids-secondary">Inbound: {currentInbound} Mbps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-otids-secondary">Outbound: {currentOutbound} Mbps</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-otids-primary">{currentInbound + currentOutbound} Mbps</div>
                  <div className="text-sm text-otids-secondary">Total Traffic</div>
                </div>
              </div>
              <div ref={combinedChartRef} className="h-64 relative" />
            </CardContent>
          </Card>

          {/* Interface Switch Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Network Interfaces</CardTitle>
              <CardDescription>Active network interface monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interfaces.map((iface) => (
                  <div key={iface.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{iface.name} Interface</h4>
                        <p className="text-sm text-otids-secondary">IP Address: {iface.ip}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">{iface.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Process Monitor */}
          <Card>
            <CardHeader>
              <CardTitle>Live Process Monitor</CardTitle>
              <CardDescription>Real-time system process monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PID</TableHead>
                    <TableHead>Process Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Threads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((process) => (
                    <TableRow key={process.pid}>
                      <TableCell className="font-mono">{process.pid}</TableCell>
                      <TableCell className="font-medium">{process.name}</TableCell>
                      <TableCell>{process.username}</TableCell>
                      <TableCell>
                        <Badge variant={process.status === "Running" ? "default" : "secondary"}>{process.status}</Badge>
                      </TableCell>
                      <TableCell>{process.threads}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* PCAP File Manager */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>PCAP File Manager</CardTitle>
                  <CardDescription>Manage captured network traffic files</CardDescription>
                </div>
                <Button className="bg-otids-primary hover:bg-otids-primary/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PCAP
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pcapFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.time}</TableCell>
                      <TableCell>{file.uploadedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
        </TabsContent>

        {/* Tab 2: System Information */}
        <TabsContent value="system" className="space-y-6">
          {/* CPU & Memory Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-otids-primary" />
                  <span>CPU Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-otids-secondary">Current Usage</span>
                  <span className="text-2xl font-bold text-otids-primary">{currentCpu}%</span>
                </div>
                <Progress value={currentCpu} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-otids-primary" />
                  <span>Memory Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-otids-secondary">Current Usage</span>
                  <span className="text-2xl font-bold text-otids-primary">{currentMemory}%</span>
                </div>
                <Progress value={currentMemory} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Device & Time Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-otids-primary" />
                  <span>Device Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-otids-secondary">Hostname</p>
                  <p className="font-semibold">{sensor.hostName}</p>
                </div>
                <div>
                  <p className="text-sm text-otids-secondary">Serial Number</p>
                  <p className="font-semibold">SN-{sensor.id}-2024-SENSOR</p>
                </div>
                <div>
                  <p className="text-sm text-otids-secondary">Firmware</p>
                  <p className="font-semibold">OTIDS Sensor v1.2.3</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-otids-primary" />
                  <span>Time Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-otids-secondary">System Time</p>
                  <p className="font-semibold">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-otids-secondary">Uptime</p>
                  <p className="font-semibold">7d 12h 34m</p>
                </div>
                <div>
                  <p className="text-sm text-otids-secondary">Power-On Time</p>
                  <p className="font-semibold">2024-01-08 09:15:30</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Network Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-otids-primary" />
                <span>Network Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-otids-secondary">Network Mode</p>
                  <p className="font-semibold">Monitor Mode</p>
                </div>
                <div>
                  <p className="text-sm text-otids-secondary">WAN IP</p>
                  <p className="font-semibold">{sensor.ipAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Configuration Files */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuration Management</CardTitle>
                  <CardDescription>GUI + YAML editor for system configuration</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Validate</Button>
                  <Button className="bg-otids-primary hover:bg-otids-primary/90">Save & Apply</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Categories */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Flow Detection", "VirusTotal", "Threat Intelligence", "Flow Alerts", "Exporting Alerts"].map(
                  (category) => (
                    <Button key={category} variant="outline" className="h-auto p-3 text-center bg-transparent">
                      <div>
                        <Settings className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-xs">{category}</p>
                      </div>
                    </Button>
                  ),
                )}
              </div>

              {/* YAML Editor */}
              <div>
                <h4 className="font-semibold mb-2">YAML Configuration</h4>
                <Textarea
                  value={yamlConfig}
                  onChange={(e) => setYamlConfig(e.target.value)}
                  className="font-mono text-sm min-h-[400px]"
                  placeholder="Enter YAML configuration..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
