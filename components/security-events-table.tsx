"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, RefreshCw, X, Filter, ChevronLeft, ChevronRight } from "lucide-react"

const securityEventsData = [
  {
    id: "SE-001",
    time: "2024-01-15 14:30:25",
    description: "Connection to unknown destination",
    sourceIP: "192.168.1.100",
    targetIP: "203.0.113.45",
    sourcePort: 1024,
    targetPort: 443,
    severity: "High",
    protocol: "TCP",
    action: "Blocked",
  },
  {
    id: "SE-002",
    time: "2024-01-15 14:28:15",
    description: "Suspicious port scanning activity",
    sourceIP: "10.0.0.15",
    targetIP: "192.168.1.0/24",
    sourcePort: 0,
    targetPort: 0,
    severity: "Medium",
    protocol: "TCP",
    action: "Monitored",
  },
  {
    id: "SE-003",
    time: "2024-01-15 14:25:10",
    description: "Failed authentication attempt",
    sourceIP: "172.16.0.5",
    targetIP: "192.168.1.10",
    sourcePort: 2048,
    targetPort: 22,
    severity: "Medium",
    protocol: "SSH",
    action: "Logged",
  },
  {
    id: "SE-004",
    time: "2024-01-15 14:22:45",
    description: "Malware communication detected",
    sourceIP: "192.168.1.50",
    targetIP: "198.51.100.25",
    sourcePort: 3456,
    targetPort: 8080,
    severity: "High",
    protocol: "HTTP",
    action: "Quarantined",
  },
  {
    id: "SE-005",
    time: "2024-01-15 14:20:30",
    description: "Unusual data transfer volume",
    sourceIP: "192.168.1.25",
    targetIP: "203.0.113.100",
    sourcePort: 4567,
    targetPort: 21,
    severity: "Low",
    protocol: "FTP",
    action: "Monitored",
  },
]

interface SecurityEventsTableProps {
  onEventClick: (event: any) => void
}

export function SecurityEventsTable({ onEventClick }: SecurityEventsTableProps) {
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

  const filteredData = getFilteredByDate(securityEventsData).filter((event) => {
    const matchesSearch =
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.sourceIP.includes(searchTerm) ||
      event.targetIP.includes(searchTerm) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter

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
      case "Info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "Blocked":
        return "bg-red-100 text-red-800"
      case "Quarantined":
        return "bg-orange-100 text-orange-800"
      case "Monitored":
        return "bg-blue-100 text-blue-800"
      case "Logged":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-otids">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-otids-primary">Recent Security Events</CardTitle>
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
                <SelectItem value="Info">Info</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-otids-secondary" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
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
                <TableHead className="text-otids-primary">Source Port</TableHead>
                <TableHead className="text-otids-primary">Target Port</TableHead>
                <TableHead className="text-otids-primary">Severity</TableHead>
                <TableHead className="text-otids-primary">Action</TableHead>
                <TableHead className="text-otids-primary">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((event) => (
                <TableRow key={event.id} className="hover:bg-otids-secondary/20">
                  <TableCell className="font-mono text-sm font-medium text-otids-primary">{event.id}</TableCell>
                  <TableCell className="font-mono text-xs text-otids-secondary">{event.time}</TableCell>
                  <TableCell className="text-otids-primary max-w-xs truncate">{event.description}</TableCell>
                  <TableCell className="font-mono text-sm text-otids-primary">{event.sourceIP}</TableCell>
                  <TableCell className="font-mono text-sm text-otids-primary">{event.targetIP}</TableCell>
                  <TableCell className="text-otids-secondary">{event.sourcePort || "-"}</TableCell>
                  <TableCell className="text-otids-secondary">{event.targetPort || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(event.action)}>{event.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onEventClick(event)}>
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
            {filteredData.length} security events
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
  )
}
