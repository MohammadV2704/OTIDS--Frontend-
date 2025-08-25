"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Clock, Target, RefreshCw, X, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const incidentTimelineData = [
  { time: "00:00", high: 1, medium: 3, low: 5, info: 8 },
  { time: "04:00", high: 0, medium: 2, low: 4, info: 6 },
  { time: "08:00", high: 2, medium: 5, low: 7, info: 10 },
  { time: "12:00", high: 3, medium: 8, low: 9, info: 12 },
  { time: "16:00", high: 2, medium: 6, low: 8, info: 11 },
  { time: "20:00", high: 1, medium: 4, low: 6, info: 9 },
]

const incidentsData = [
  {
    id: "INC-001",
    time: "2024-01-15 14:30:25",
    description: "Multiple failed login attempts from external IP",
    sourceIP: "203.0.113.45",
    targetIP: "192.168.1.10",
    severity: "High",
    threatLevel: "Critical",
    duration: "45 minutes",
    targetIPs: ["192.168.1.10", "192.168.1.11"],
    portsScanned: [22, 23, 80, 443],
    status: "Active",
  },
  {
    id: "INC-002",
    time: "2024-01-15 13:15:10",
    description: "Suspicious network scanning activity",
    sourceIP: "198.51.100.25",
    targetIP: "192.168.1.0/24",
    severity: "Medium",
    threatLevel: "Medium",
    duration: "2 hours",
    targetIPs: ["192.168.1.1-254"],
    portsScanned: [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995],
    status: "Investigating",
  },
  {
    id: "INC-003",
    time: "2024-01-15 12:45:30",
    description: "Malware communication detected",
    sourceIP: "192.168.1.50",
    targetIP: "185.199.108.153",
    severity: "High",
    threatLevel: "High",
    duration: "30 minutes",
    targetIPs: ["185.199.108.153"],
    portsScanned: [8080, 8443],
    status: "Contained",
  },
]

interface IncidentManagementProps {
  onIncidentClick: (incident: any) => void
}

export function IncidentManagement({ onIncidentClick }: IncidentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [dateFilter, setDateFilter] = useState("all")

  const getFilteredByDate = (data: any[]) => {
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      return data.filter((item) => item.time.startsWith(today))
    }
    return data
  }

  const filteredData = getFilteredByDate(incidentsData).filter((incident) => {
    const matchesSearch =
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.sourceIP.includes(searchTerm) ||
      incident.targetIP.includes(searchTerm) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const clearFilters = () => {
    setSearchTerm("")
    setSeverityFilter("all")
    setDateFilter("all")
    setCurrentPage(1)
  }

  const refreshData = () => {
    setCurrentPage(1)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800"
      case "Investigating":
        return "bg-yellow-100 text-yellow-800"
      case "Contained":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Incident Timeline Chart */}
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Incident Threat Timeline (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={incidentTimelineData}>
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
              <Line type="monotone" dataKey="high" stroke="#DC2626" strokeWidth={2} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#EA580C" strokeWidth={2} name="Medium" />
              <Line type="monotone" dataKey="low" stroke="#D97706" strokeWidth={2} name="Low" />
              <Line type="monotone" dataKey="info" stroke="#3B82F6" strokeWidth={2} name="Info" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="shadow-otids">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-otids-primary">Active Incidents</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={dateFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("all")}
              >
                All
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button
                variant={dateFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("today")}
              >
                <Filter className="h-4 w-4 mr-1" />
                Today
              </Button>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-otids-secondary" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-otids-primary">ID</TableHead>
                  <TableHead className="text-otids-primary">Time</TableHead>
                  <TableHead className="text-otids-primary">Description</TableHead>
                  <TableHead className="text-otids-primary">Source IP</TableHead>
                  <TableHead className="text-otids-primary">Target IP</TableHead>
                  <TableHead className="text-otids-primary">Severity</TableHead>
                  <TableHead className="text-otids-primary">Status</TableHead>
                  <TableHead className="text-otids-primary">Duration</TableHead>
                  <TableHead className="text-otids-primary">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((incident) => (
                  <TableRow key={incident.id} className="hover:bg-otids-secondary/20">
                    <TableCell className="font-mono text-sm font-medium text-otids-primary">{incident.id}</TableCell>
                    <TableCell className="font-mono text-xs text-otids-secondary">{incident.time}</TableCell>
                    <TableCell className="text-otids-primary max-w-xs truncate">{incident.description}</TableCell>
                    <TableCell className="font-mono text-sm text-otids-primary">{incident.sourceIP}</TableCell>
                    <TableCell className="font-mono text-sm text-otids-primary">{incident.targetIP}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                    </TableCell>
                    <TableCell className="text-otids-secondary">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{incident.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onIncidentClick(incident)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-otids-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} incidents
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-otids-secondary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Flow Analysis */}
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-otids-primary">Incident Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-otids-primary">Active Threats</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-otids-primary">Avg Response Time</p>
                    <p className="text-2xl font-bold text-yellow-600">12m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-otids-primary">Resolved Today</p>
                    <p className="text-2xl font-bold text-green-600">15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Target className="h-12 w-12 text-otids-primary mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-otids-primary mb-2">Incident Flow Visualization</h3>
            <p className="text-otids-secondary">
              Interactive flow diagram showing source IP to registered ports would be displayed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
