"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Download, ChevronLeft, ChevronRight } from "lucide-react"

const vulnerabilitiesData = [
  {
    id: 1,
    cveId: "CVE-2023-4567",
    vulnerableNode: "PLC-001",
    publishedDate: "2023-08-15",
    model: "Schneider M340",
    baseScore: 9.8,
    impactScore: 5.9,
    exploitabilityScore: 3.9,
    vulnerabilityId: "VULN-001",
    severity: "Critical",
    status: "Open",
    description: "Remote code execution vulnerability in Modbus TCP implementation",
  },
  {
    id: 2,
    cveId: "CVE-2023-3456",
    vulnerableNode: "HMI-STATION-01",
    publishedDate: "2023-07-22",
    model: "Siemens WinCC",
    baseScore: 7.5,
    impactScore: 4.2,
    exploitabilityScore: 3.3,
    vulnerabilityId: "VULN-002",
    severity: "High",
    status: "In Progress",
    description: "Authentication bypass in web interface",
  },
  {
    id: 3,
    cveId: "CVE-2023-2345",
    vulnerableNode: "SCADA-SERVER",
    publishedDate: "2023-06-10",
    model: "Wonderware InTouch",
    baseScore: 6.1,
    impactScore: 3.6,
    exploitabilityScore: 2.5,
    vulnerabilityId: "VULN-003",
    severity: "Medium",
    status: "Patched",
    description: "SQL injection in historian database queries",
  },
  {
    id: 4,
    cveId: "CVE-2023-1234",
    vulnerableNode: "FIREWALL-01",
    publishedDate: "2023-05-18",
    model: "Fortinet FortiGate",
    baseScore: 5.3,
    impactScore: 2.9,
    exploitabilityScore: 2.4,
    vulnerabilityId: "VULN-004",
    severity: "Medium",
    status: "Open",
    description: "Information disclosure through error messages",
  },
  {
    id: 5,
    cveId: "CVE-2023-0123",
    vulnerableNode: "SWITCH-CORE-01",
    publishedDate: "2023-04-25",
    model: "Cisco IE-3000",
    baseScore: 3.7,
    impactScore: 1.4,
    exploitabilityScore: 2.3,
    vulnerabilityId: "VULN-005",
    severity: "Low",
    status: "Patched",
    description: "Denial of service through malformed packets",
  },
]

export function VulnerabilitiesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const filteredData = vulnerabilitiesData.filter((vuln) => {
    const matchesSearch =
      vuln.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.vulnerableNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter
    const matchesStatus = statusFilter === "all" || vuln.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, severityFilter, statusFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
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
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Patched":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return "text-red-700 font-bold"
    if (score >= 7.0) return "text-orange-600 font-semibold"
    if (score >= 4.0) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="shadow-otids">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-otids-primary">Vulnerability Details</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Patched">Patched</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-otids-secondary" />
              <Input
                placeholder="Search vulnerabilities..."
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
                <TableHead className="text-otids-primary">CVE ID</TableHead>
                <TableHead className="text-otids-primary">Vulnerable Node</TableHead>
                <TableHead className="text-otids-primary">Model</TableHead>
                <TableHead className="text-otids-primary">Published Date</TableHead>
                <TableHead className="text-otids-primary">Base Score</TableHead>
                <TableHead className="text-otids-primary">Impact Score</TableHead>
                <TableHead className="text-otids-primary">Exploitability</TableHead>
                <TableHead className="text-otids-primary">Severity</TableHead>
                <TableHead className="text-otids-primary">Status</TableHead>
                <TableHead className="text-otids-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((vuln) => (
                <TableRow key={vuln.id} className="hover:bg-otids-secondary/20">
                  <TableCell className="font-mono text-sm font-medium text-otids-primary">{vuln.cveId}</TableCell>
                  <TableCell className="font-medium text-otids-primary">{vuln.vulnerableNode}</TableCell>
                  <TableCell className="text-otids-secondary">{vuln.model}</TableCell>
                  <TableCell className="text-otids-secondary">{vuln.publishedDate}</TableCell>
                  <TableCell className={getScoreColor(vuln.baseScore)}>{vuln.baseScore}</TableCell>
                  <TableCell className="text-otids-secondary">{vuln.impactScore}</TableCell>
                  <TableCell className="text-otids-secondary">{vuln.exploitabilityScore}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vuln.status)}>{vuln.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" title="View CVE Details">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-otids-secondary">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            vulnerabilities
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
