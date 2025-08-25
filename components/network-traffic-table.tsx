"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Pause, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data generator for real-time simulation
const generateTrafficData = () => {
  const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "SSH", "FTP", "DNS"]
  const ips = [
    "192.168.1.100",
    "192.168.1.101",
    "192.168.1.102",
    "192.168.1.103",
    "10.0.0.15",
    "10.0.0.16",
    "172.16.0.5",
    "172.16.0.6",
  ]
  const macs = [
    "00:1B:44:11:3A:B7",
    "00:1B:44:11:3A:C8",
    "00:1B:44:11:3A:D9",
    "00:1B:44:11:3A:EA",
    "00:1B:44:11:3A:FB",
    "00:1B:44:11:3A:GC",
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
    sourceMac: macs[Math.floor(Math.random() * macs.length)],
    destMac: macs[Math.floor(Math.random() * macs.length)],
    sourceIP: ips[Math.floor(Math.random() * ips.length)],
    destIP: ips[Math.floor(Math.random() * ips.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    length: Math.floor(Math.random() * 1500) + 64,
    sourcePort: Math.floor(Math.random() * 65535) + 1,
    destPort: Math.floor(Math.random() * 65535) + 1,
  }))
}

export function NetworkTrafficTable() {
  const [trafficData, setTrafficData] = useState(generateTrafficData())
  const [searchTerm, setSearchTerm] = useState("")
  const [protocolFilter, setProtocolFilter] = useState("all")
  const [isRealTime, setIsRealTime] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setTrafficData(generateTrafficData())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isRealTime])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, protocolFilter])

  const filteredData = trafficData.filter((row) => {
    const matchesSearch =
      row.sourceIP.includes(searchTerm) ||
      row.destIP.includes(searchTerm) ||
      row.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.sourceMac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.destMac.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProtocol = protocolFilter === "all" || row.protocol === protocolFilter

    return matchesSearch && matchesProtocol
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const getProtocolColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      TCP: "bg-blue-100 text-blue-800",
      UDP: "bg-green-100 text-green-800",
      ICMP: "bg-yellow-100 text-yellow-800",
      HTTP: "bg-purple-100 text-purple-800",
      HTTPS: "bg-indigo-100 text-indigo-800",
      SSH: "bg-red-100 text-red-800",
      FTP: "bg-orange-100 text-orange-800",
      DNS: "bg-teal-100 text-teal-800",
    }
    return colors[protocol] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="shadow-otids">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-lg font-semibold text-otids-primary">Network Traffic Monitor</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
                className={isRealTime ? "bg-green-50 text-green-700" : ""}
              >
                {isRealTime ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isRealTime ? "Live" : "Paused"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTrafficData(generateTrafficData())}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={protocolFilter} onValueChange={setProtocolFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                <SelectItem value="TCP">TCP</SelectItem>
                <SelectItem value="UDP">UDP</SelectItem>
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="HTTPS">HTTPS</SelectItem>
                <SelectItem value="SSH">SSH</SelectItem>
                <SelectItem value="ICMP">ICMP</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-otids-secondary" />
              <Input
                placeholder="Search traffic..."
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
                <TableHead className="text-otids-primary">Timestamp</TableHead>
                <TableHead className="text-otids-primary">Source MAC</TableHead>
                <TableHead className="text-otids-primary">Dest MAC</TableHead>
                <TableHead className="text-otids-primary">Source IP</TableHead>
                <TableHead className="text-otids-primary">Dest IP</TableHead>
                <TableHead className="text-otids-primary">Protocol</TableHead>
                <TableHead className="text-otids-primary">Length</TableHead>
                <TableHead className="text-otids-primary">Source Port</TableHead>
                <TableHead className="text-otids-primary">Dest Port</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-otids-secondary/20">
                  <TableCell className="font-mono text-xs text-otids-secondary">{row.timestamp}</TableCell>
                  <TableCell className="font-mono text-xs text-otids-secondary">{row.sourceMac}</TableCell>
                  <TableCell className="font-mono text-xs text-otids-secondary">{row.destMac}</TableCell>
                  <TableCell className="font-medium text-otids-primary">{row.sourceIP}</TableCell>
                  <TableCell className="font-medium text-otids-primary">{row.destIP}</TableCell>
                  <TableCell>
                    <Badge className={getProtocolColor(row.protocol)}>{row.protocol}</Badge>
                  </TableCell>
                  <TableCell className="text-otids-secondary">{row.length} bytes</TableCell>
                  <TableCell className="text-otids-secondary">{row.sourcePort}</TableCell>
                  <TableCell className="text-otids-secondary">{row.destPort}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-otids-secondary">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
            {isRealTime && " • Live updates every 3 seconds"}
          </div>
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
