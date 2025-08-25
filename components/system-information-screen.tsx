"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Cpu, HardDrive, Clock, Network, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface SystemInformationScreenProps {
  onBack: () => void
}

interface DataPoint {
  time: Date
  usage: number
}

export function SystemInformationScreen({ onBack }: SystemInformationScreenProps) {
  const cpuChartRef = useRef<HTMLDivElement>(null)
  const memoryChartRef = useRef<HTMLDivElement>(null)
  const [cpuData, setCpuData] = useState<DataPoint[]>([])
  const [memoryData, setMemoryData] = useState<DataPoint[]>([])
  const [currentCpu, setCurrentCpu] = useState(45)
  const [maxCpu, setMaxCpu] = useState(78)
  const [currentMemory, setCurrentMemory] = useState(62)
  const [maxMemory, setMaxMemory] = useState(85)
  const [systemTime, setSystemTime] = useState(new Date())

  const handleBackClick = () => {
    // Prevent event bubbling and ensure clean navigation
    onBack()
  }

  // D3.js chart creation function
  const createD3Chart = (
    containerRef: React.RefObject<HTMLDivElement>,
    data: DataPoint[],
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

    const yScale = (value: number) => {
      return height - (value / 100) * height
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

    // Create area gradient
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
    stop1.setAttribute("stop-opacity", "0.3")

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop2.setAttribute("offset", "100%")
    stop2.setAttribute("stop-color", color)
    stop2.setAttribute("stop-opacity", "0.1")

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Create line path
    let pathData = ""
    let areaData = ""

    data.forEach((point, index) => {
      const x = xScale(point.time)
      const y = yScale(point.usage)

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
    path.setAttribute("stroke-width", "2")
    path.setAttribute("fill", "none")
    g.appendChild(path)

    // Create data points
    data.forEach((point) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", xScale(point.time).toString())
      circle.setAttribute("cy", yScale(point.usage).toString())
      circle.setAttribute("r", "3")
      circle.setAttribute("fill", color)
      circle.setAttribute("stroke", "#ffffff")
      circle.setAttribute("stroke-width", "2")

      // Add hover effect
      circle.addEventListener("mouseenter", () => {
        circle.setAttribute("r", "5")
        // Create tooltip
        const tooltip = document.createElement("div")
        tooltip.className = "absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
        tooltip.textContent = `${point.usage}% at ${point.time.toLocaleTimeString()}`
        tooltip.style.left = `${xScale(point.time) + margin.left}px`
        tooltip.style.top = `${yScale(point.usage) + margin.top - 30}px`
        container.appendChild(tooltip)
      })

      circle.addEventListener("mouseleave", () => {
        circle.setAttribute("r", "3")
        const tooltip = container.querySelector(".absolute")
        if (tooltip) tooltip.remove()
      })

      g.appendChild(circle)
    })

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
      const value = (100 / 5) * (5 - i)
      const y = (height / 5) * i
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", "-10")
      text.setAttribute("y", (y + 5).toString())
      text.setAttribute("text-anchor", "end")
      text.setAttribute("font-size", "12")
      text.setAttribute("fill", "#6b7280")
      text.textContent = `${value}%`
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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      // Generate realistic CPU usage (30-80%)
      const newCpuUsage = Math.floor(Math.random() * 50) + 30
      setCurrentCpu(newCpuUsage)
      if (newCpuUsage > maxCpu) setMaxCpu(newCpuUsage)

      // Generate realistic Memory usage (40-90%)
      const newMemoryUsage = Math.floor(Math.random() * 50) + 40
      setCurrentMemory(newMemoryUsage)
      if (newMemoryUsage > maxMemory) setMaxMemory(newMemoryUsage)

      // Update charts (keep last 20 data points)
      setCpuData((prev) => [...prev.slice(-19), { time: now, usage: newCpuUsage }])
      setMemoryData((prev) => [...prev.slice(-19), { time: now, usage: newMemoryUsage }])

      setSystemTime(now)
    }, 2000)

    // Initialize with some data
    const initialTime = new Date()
    const initialCpuData = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(initialTime.getTime() - (9 - i) * 2000),
      usage: Math.floor(Math.random() * 50) + 30,
    }))
    const initialMemoryData = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(initialTime.getTime() - (9 - i) * 2000),
      usage: Math.floor(Math.random() * 50) + 40,
    }))

    setCpuData(initialCpuData)
    setMemoryData(initialMemoryData)

    return () => clearInterval(interval)
  }, [maxCpu, maxMemory])

  // Update D3 charts when data changes
  useEffect(() => {
    createD3Chart(cpuChartRef, cpuData, "#3b82f6", "cpu")
  }, [cpuData])

  useEffect(() => {
    createD3Chart(memoryChartRef, memoryData, "#10b981", "memory")
  }, [memoryData])

  const formatUptime = () => {
    const days = 15
    const hours = 8
    const minutes = 42
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBackClick} className="flex items-center space-x-2" type="button">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-otids-primary">System Information</h1>
          <p className="text-otids-secondary">Real-time system monitoring and device information</p>
        </div>
      </div>

      {/* CPU & Memory Usage Monitor with D3.js Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-otids-primary" />
              <span>CPU Usage Monitor</span>
            </CardTitle>
            <CardDescription>Real-time CPU utilization with timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-otids-secondary">Current CPU</p>
                <p className="text-2xl font-bold text-otids-primary">{currentCpu}%</p>
              </div>
              <div>
                <p className="text-sm text-otids-secondary">Max CPU</p>
                <p className="text-2xl font-bold text-red-600">{maxCpu}%</p>
              </div>
            </div>
            <Progress value={currentCpu} className="h-2" />
            <div ref={cpuChartRef} className="h-48 relative" />
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-otids-primary" />
              <span>Memory Usage Monitor</span>
            </CardTitle>
            <CardDescription>Real-time memory utilization with timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-otids-secondary">Current Memory</p>
                <p className="text-2xl font-bold text-otids-primary">{currentMemory}%</p>
              </div>
              <div>
                <p className="text-sm text-otids-secondary">Max Memory</p>
                <p className="text-2xl font-bold text-red-600">{maxMemory}%</p>
              </div>
            </div>
            <Progress value={currentMemory} className="h-2" />
            <div ref={memoryChartRef} className="h-48 relative" />
          </CardContent>
        </Card>
      </div>

      {/* Device Information & Time Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Information Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-otids-primary" />
              <span>Device Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-otids-secondary">Hostname</p>
                <p className="font-semibold">OTIDS-MAIN-01</p>
              </div>
              <div>
                <p className="text-sm text-otids-secondary">Serial Number</p>
                <p className="font-semibold">SN-2024-OTIDS-001</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-otids-secondary">Firmware</p>
              <div className="flex items-center space-x-2">
                <p className="font-semibold">OTIDS v2.4.1</p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Latest
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Information Panel */}
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
              <p className="font-semibold text-lg">{systemTime.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-otids-secondary">Uptime</p>
                <p className="font-semibold">{formatUptime()}</p>
              </div>
              <div>
                <p className="text-sm text-otids-secondary">Power-On Time</p>
                <p className="font-semibold">2024-01-01 09:15:30</p>
              </div>
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
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Bridge Mode</p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-otids-secondary">WAN IP</p>
              <p className="font-semibold">203.0.113.45</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
