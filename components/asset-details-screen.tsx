"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for asset details with pagination
const generateNetworkData = (page: number) => {
  const data = []
  const startIndex = (page - 1) * 10
  for (let i = 0; i < 10; i++) {
    data.push({
      id: startIndex + i + 1,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
      sourceIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
      destIP: `10.0.0.${Math.floor(Math.random() * 255)}`,
      protocol: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)],
      packetSize: Math.floor(Math.random() * 1500) + 64,
    })
  }
  return data
}

const generateVulnerabilityData = (page: number) => {
  const vulnerabilities = ["CVE-2023-1234", "CVE-2023-5678", "CVE-2023-9012", "CVE-2023-3456", "CVE-2023-7890"]
  const data = []
  const startIndex = (page - 1) * 10
  for (let i = 0; i < 10; i++) {
    data.push({
      id: startIndex + i + 1,
      cveId: vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)],
      baseScore: (Math.random() * 10).toFixed(1),
      impactScore: (Math.random() * 10).toFixed(1),
      exploitability: (Math.random() * 10).toFixed(1),
      severity: ["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
    })
  }
  return data
}

interface AssetDetailsScreenProps {
  asset: any
  onBack: () => void
}

export function AssetDetailsScreen({ asset, onBack }: AssetDetailsScreenProps) {
  const [networkPage, setNetworkPage] = useState(1)
  const [vulnerabilityPage, setVulnerabilityPage] = useState(1)

  const networkData = generateNetworkData(networkPage)
  const vulnerabilityData = generateVulnerabilityData(vulnerabilityPage)
  const totalNetworkPages = 25 // Mock total pages
  const totalVulnerabilityPages = 15 // Mock total pages

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

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Assets
        </Button>
        <h1 className="text-2xl font-bold text-otids-primary">Asset Details - {asset?.assetName}</h1>
      </div>

      {/* Asset Summary */}
      <Card className="shadow-otids">
        <CardHeader>
          <CardTitle className="text-otids-primary">Asset Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-otids-secondary">Host Name</div>
              <div className="font-semibold text-otids-primary">{asset?.assetName}</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">MAC Address</div>
              <div className="font-mono text-sm text-otids-primary">{asset?.macAddress}</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">Device Type</div>
              <div className="font-semibold text-otids-primary">{asset?.deviceType}</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">IP Address</div>
              <div className="font-semibold text-otids-primary">{asset?.ipAddress}</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">Risk Score</div>
              <Badge className={getSeverityColor(asset?.riskScore)}>{asset?.riskScore}</Badge>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">Last Seen</div>
              <div className="font-semibold text-otids-primary">{asset?.lastSeen}</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">First Seen</div>
              <div className="font-semibold text-otids-primary">2024-01-15 09:30:25</div>
            </div>
            <div>
              <div className="text-sm text-otids-secondary">Purdue Level</div>
              <div className="font-semibold text-otids-primary">Level 2</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Information</TabsTrigger>
          <TabsTrigger value="network">Network Information</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="network-map">Network Map</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-otids-secondary">Manufacturer</div>
                  <div className="font-semibold text-otids-primary">Siemens</div>
                </div>
                <div>
                  <div className="text-sm text-otids-secondary">Serial Number</div>
                  <div className="font-semibold text-otids-primary">SN123456789</div>
                </div>
                <div>
                  <div className="text-sm text-otids-secondary">Model</div>
                  <div className="font-semibold text-otids-primary">S7-1200</div>
                </div>
                <div>
                  <div className="text-sm text-otids-secondary">Firmware Version</div>
                  <div className="font-semibold text-otids-primary">V4.5.2</div>
                </div>
                <div>
                  <div className="text-sm text-otids-secondary">Open Ports</div>
                  <div className="font-semibold text-otids-primary">22, 80, 443, 502</div>
                </div>
                <div>
                  <div className="text-sm text-otids-secondary">Operating System</div>
                  <div className="font-semibold text-otids-primary">Embedded Linux</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">Network Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Destination IP</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Packet Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-sm">{row.timestamp}</TableCell>
                      <TableCell className="font-mono text-sm">{row.sourceIP}</TableCell>
                      <TableCell className="font-mono text-sm">{row.destIP}</TableCell>
                      <TableCell>{row.protocol}</TableCell>
                      <TableCell>{row.packetSize} bytes</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination currentPage={networkPage} totalPages={totalNetworkPages} onPageChange={setNetworkPage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">Vulnerability Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CVE ID</TableHead>
                    <TableHead>Base Score</TableHead>
                    <TableHead>Impact Score</TableHead>
                    <TableHead>Exploitability</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilityData.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell className="font-mono text-sm">{vuln.cveId}</TableCell>
                      <TableCell>{vuln.baseScore}</TableCell>
                      <TableCell>{vuln.impactScore}</TableCell>
                      <TableCell>{vuln.exploitability}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={vulnerabilityPage}
                totalPages={totalVulnerabilityPages}
                onPageChange={setVulnerabilityPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network-map" className="space-y-4">
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">Network Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-semibold">Network Topology Visualization</div>
                  <div className="text-sm mt-2">Interactive network map showing connections for {asset?.assetName}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
