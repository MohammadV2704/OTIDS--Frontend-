"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AssetDetailModalProps {
  asset: any
  isOpen: boolean
  onClose: () => void
}

export function AssetDetailModal({ asset, isOpen, onClose }: AssetDetailModalProps) {
  const [activeTab, setActiveTab] = useState("summary")

  if (!asset) return null

  const tabs = [
    { id: "summary", label: "Asset Summary" },
    { id: "system", label: "System Information" },
    { id: "network", label: "Network Information" },
    { id: "vulnerabilities", label: "Vulnerability Information" },
    { id: "network-map", label: "Network Map" },
  ]

  const vulnerabilityData = [
    {
      cveId: "CVE-2023-1234",
      node: asset?.assetName,
      baseScore: 7.5,
      impactScore: 5.9,
      exploitability: 3.9,
      vulnerabilityId: "VULN-001",
    },
    {
      cveId: "CVE-2023-5678",
      node: asset?.assetName,
      baseScore: 6.1,
      impactScore: 4.2,
      exploitability: 2.8,
      vulnerabilityId: "VULN-002",
    },
  ]

  const networkData = [
    {
      timestamp: "2024-01-15 14:30:25",
      sourceIP: "192.168.1.100",
      destIP: "192.168.1.101",
      sourceMAC: "00:1B:44:11:3A:B7",
      destMAC: "00:1B:44:11:3A:C8",
      protocol: "TCP",
      packetSize: 1024,
    },
    {
      timestamp: "2024-01-15 14:30:26",
      sourceIP: "192.168.1.101",
      destIP: "192.168.1.100",
      sourceMAC: "00:1B:44:11:3A:C8",
      destMAC: "00:1B:44:11:3A:B7",
      protocol: "TCP",
      packetSize: 512,
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-otids-primary mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Host Name:</span> {asset.assetName}
                  </div>
                  <div>
                    <span className="font-medium">MAC Address:</span> {asset.macAddress}
                  </div>
                  <div>
                    <span className="font-medium">Device Type:</span> {asset.deviceType}
                  </div>
                  <div>
                    <span className="font-medium">IP Address:</span> {asset.ipAddress}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-otids-primary mb-2">Network Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Open Ports:</span> 80, 443, 502
                  </div>
                  <div>
                    <span className="font-medium">Module Family:</span> Industrial Control
                  </div>
                  <div>
                    <span className="font-medium">Purdue Level:</span> Level 2
                  </div>
                  <div>
                    <span className="font-medium">First Seen:</span> 2024-01-10 09:15:30
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "system":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-otids-primary mb-2">Hardware Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Manufacturer:</span> Schneider Electric
                  </div>
                  <div>
                    <span className="font-medium">Model:</span> M340 PLC
                  </div>
                  <div>
                    <span className="font-medium">Serial Number:</span> SE-M340-001234
                  </div>
                  <div>
                    <span className="font-medium">Firmware Version:</span> v2.8.1
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-otids-primary mb-2">System Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Interface Manufacturer:</span> Schneider Electric
                  </div>
                  <div>
                    <span className="font-medium">Module Type:</span> CPU Module
                  </div>
                  <div>
                    <span className="font-medium">Backplane Port:</span> Slot 0
                  </div>
                  <div>
                    <span className="font-medium">Open System Flags:</span> Modbus TCP Enabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "network":
        return (
          <div>
            <h4 className="font-medium text-otids-primary mb-4">Recent Network Activity</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Dest IP</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Packet Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {networkData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">{row.timestamp}</TableCell>
                    <TableCell>{row.sourceIP}</TableCell>
                    <TableCell>{row.destIP}</TableCell>
                    <TableCell>{row.protocol}</TableCell>
                    <TableCell>{row.packetSize} bytes</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case "vulnerabilities":
        return (
          <div>
            <h4 className="font-medium text-otids-primary mb-4">Known Vulnerabilities</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CVE ID</TableHead>
                  <TableHead>Base Score</TableHead>
                  <TableHead>Impact Score</TableHead>
                  <TableHead>Exploitability</TableHead>
                  <TableHead>Vulnerability ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vulnerabilityData.map((vuln, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{vuln.cveId}</TableCell>
                    <TableCell>
                      <Badge
                        className={vuln.baseScore >= 7 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                      >
                        {vuln.baseScore}
                      </Badge>
                    </TableCell>
                    <TableCell>{vuln.impactScore}</TableCell>
                    <TableCell>{vuln.exploitability}</TableCell>
                    <TableCell>{vuln.vulnerabilityId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case "network-map":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-otids-primary mb-4">Network Connections</h4>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Connected Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-otids-primary">8</div>
                  <p className="text-xs text-otids-secondary">Direct connections</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Edges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-otids-primary">15</div>
                  <p className="text-xs text-otids-secondary">Network paths</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">High</div>
                  <p className="text-xs text-otids-secondary">Network exposure</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-otids-secondary text-center">
                Interactive network topology visualization would be displayed here
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DialogTitle className="text-xl font-bold text-otids-primary">{asset.assetName}</DialogTitle>
              <Badge className={getRiskColor(asset.riskScore)}>{asset.riskScore} Risk</Badge>
              <span className="text-sm text-otids-secondary">Last seen: {asset.lastSeen}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex space-x-1 border-b border-otids mb-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent hover:border-otids-primary hover:text-otids-primary ${
                  activeTab === tab.id ? "border-otids-primary text-otids-primary bg-otids-primary-light/20" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="mt-4">{renderTabContent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
