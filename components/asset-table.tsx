"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Search } from "lucide-react"

const assetsData = [
  {
    id: 1,
    assetName: "PLC-001",
    lastSeen: "2 minutes ago",
    macAddress: "00:1B:44:11:3A:B7",
    riskScore: "High",
    deviceType: "PLC Controller",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    assetName: "HMI-STATION-01",
    lastSeen: "5 minutes ago",
    macAddress: "00:1B:44:11:3A:C8",
    riskScore: "Medium",
    deviceType: "HMI Station",
    ipAddress: "192.168.1.101",
  },
  {
    id: 3,
    assetName: "SCADA-SERVER",
    lastSeen: "1 minute ago",
    macAddress: "00:1B:44:11:3A:D9",
    riskScore: "Low",
    deviceType: "SCADA Server",
    ipAddress: "192.168.1.102",
  },
  {
    id: 4,
    assetName: "SWITCH-CORE-01",
    lastSeen: "30 seconds ago",
    macAddress: "00:1B:44:11:3A:EA",
    riskScore: "Medium",
    deviceType: "Network Switch",
    ipAddress: "192.168.1.103",
  },
  {
    id: 5,
    assetName: "FIREWALL-01",
    lastSeen: "1 minute ago",
    macAddress: "00:1B:44:11:3A:FB",
    riskScore: "Low",
    deviceType: "Firewall",
    ipAddress: "192.168.1.104",
  },
]

interface AssetTableProps {
  onAssetClick: (asset: any) => void
}

export function AssetTable({ onAssetClick }: AssetTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssets = assetsData.filter(
    (asset) =>
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ipAddress.includes(searchTerm),
  )

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
    <Card className="shadow-otids">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-otids-primary">Asset Details</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-otids-secondary" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-otids-primary">Asset Name</TableHead>
              <TableHead className="text-otids-primary">Device Type</TableHead>
              <TableHead className="text-otids-primary">IP Address</TableHead>
              <TableHead className="text-otids-primary">MAC Address</TableHead>
              <TableHead className="text-otids-primary">Last Seen</TableHead>
              <TableHead className="text-otids-primary">Risk Score</TableHead>
              <TableHead className="text-otids-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-otids-secondary/20">
                <TableCell className="font-medium text-otids-primary">{asset.assetName}</TableCell>
                <TableCell className="text-otids-secondary">{asset.deviceType}</TableCell>
                <TableCell className="text-otids-secondary">{asset.ipAddress}</TableCell>
                <TableCell className="text-otids-secondary font-mono text-sm">{asset.macAddress}</TableCell>
                <TableCell className="text-otids-secondary">{asset.lastSeen}</TableCell>
                <TableCell>
                  <Badge className={getRiskColor(asset.riskScore)}>{asset.riskScore}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onAssetClick(asset)}>
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
