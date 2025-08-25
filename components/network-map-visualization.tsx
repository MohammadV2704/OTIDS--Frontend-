"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Network, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

// Mock network data
const networkData = {
  nodes: [
    { id: "PLC-001", name: "Primary PLC", type: "plc", risk: "high", connections: 15 },
    { id: "HMI-001", name: "Control Station", type: "hmi", risk: "medium", connections: 8 },
    { id: "SCADA-001", name: "SCADA Server", type: "scada", risk: "low", connections: 12 },
    { id: "SWITCH-001", name: "Core Switch", type: "switch", risk: "medium", connections: 20 },
    { id: "FIREWALL-001", name: "Security Gateway", type: "firewall", risk: "low", connections: 5 },
    { id: "PLC-002", name: "Secondary PLC", type: "plc", risk: "medium", connections: 10 },
    { id: "HMI-002", name: "Operator Panel", type: "hmi", risk: "low", connections: 6 },
    { id: "SENSOR-001", name: "Temperature Sensor", type: "sensor", risk: "low", connections: 2 },
  ],
  links: [
    { source: "FIREWALL-001", target: "SWITCH-001", strength: 0.8 },
    { source: "SWITCH-001", target: "PLC-001", strength: 0.9 },
    { source: "SWITCH-001", target: "SCADA-001", strength: 0.7 },
    { source: "PLC-001", target: "HMI-001", strength: 0.8 },
    { source: "PLC-001", target: "PLC-002", strength: 0.6 },
    { source: "HMI-001", target: "HMI-002", strength: 0.5 },
    { source: "SCADA-001", target: "SENSOR-001", strength: 0.4 },
    { source: "PLC-002", target: "HMI-001", strength: 0.7 },
  ],
}

export function NetworkMapVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [assetFilter, setAssetFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [zoom, setZoom] = useState(1)
  const [simulation, setSimulation] = useState<any>(null)

  const networkStats = [
    { label: "Total Nodes", value: networkData.nodes.length.toString(), color: "text-blue-600" },
    { label: "Active Connections", value: networkData.links.length.toString(), color: "text-green-600" },
    {
      label: "High Risk Nodes",
      value: networkData.nodes.filter((n) => n.risk === "high").length.toString(),
      color: "text-red-600",
    },
    { label: "Isolated Devices", value: "2", color: "text-yellow-600" },
  ]

  const filteredNodes = networkData.nodes.filter((node) => {
    const matchesAsset = assetFilter === "all" || node.type === assetFilter
    const matchesRisk = riskFilter === "all" || node.risk === riskFilter
    return matchesAsset && matchesRisk
  })

  const filteredLinks = networkData.links.filter((link) => {
    const sourceExists = filteredNodes.some((node) => node.id === link.source)
    const targetExists = filteredNodes.some((node) => node.id === link.target)
    return sourceExists && targetExists
  })

  useEffect(() => {
    if (!svgRef.current || typeof window === "undefined") return

    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current)
      const width = 800
      const height = 500

      // Clear previous content
      svg.selectAll("*").remove()

      // Create main group with zoom behavior
      const g = svg.append("g")

      const zoomBehavior = d3
        .zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
          setZoom(event.transform.k)
        })

      svg.call(zoomBehavior as any)

      const simulationInstance = d3
        .forceSimulation(filteredNodes as any)
        .force(
          "link",
          d3
            .forceLink(filteredLinks)
            .id((d: any) => d.id)
            .distance(100)
            .strength(0.5),
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30))

      setSimulation(simulationInstance)

      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(filteredLinks)
        .enter()
        .append("line")
        .attr("stroke", "#94a3b8")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d: any) => Math.sqrt(d.strength * 10))

      const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(filteredNodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("cursor", "pointer")
        .call(
          d3
            .drag()
            .on("start", (event, d: any) => {
              if (!event.active) simulationInstance.alphaTarget(0.3).restart()
              d.fx = d.x
              d.fy = d.y
            })
            .on("drag", (event, d: any) => {
              d.fx = event.x
              d.fy = event.y
            })
            .on("end", (event, d: any) => {
              if (!event.active) simulationInstance.alphaTarget(0)
              d.fx = null
              d.fy = null
            }) as any,
        )

      // Add circles to nodes
      node
        .append("circle")
        .attr("r", 20)
        .attr("fill", (d: any) => getNodeColor(d.risk))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .on("mouseenter", function (event, d) {
          d3.select(this).transition().duration(200).attr("r", 25).attr("stroke-width", 3)
        })
        .on("mouseleave", function (event, d) {
          d3.select(this).transition().duration(200).attr("r", 20).attr("stroke-width", 2)
        })
        .on("click", (event, d) => {
          setSelectedNode(d)
        })

      // Add icons to nodes
      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "10")
        .attr("fill", "#ffffff")
        .attr("font-weight", "bold")
        .text((d: any) => getNodeIcon(d.type))

      // Add labels to nodes
      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "35")
        .attr("font-size", "12")
        .attr("fill", "#374151")
        .text((d: any) => d.name)

      simulationInstance.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      })

      const linkLabels = g
        .append("g")
        .attr("class", "link-labels")
        .selectAll("text")
        .data(filteredLinks)
        .enter()
        .append("text")
        .attr("font-size", "10")
        .attr("fill", "#6b7280")
        .attr("text-anchor", "middle")
        .text((d: any) => `${Math.round(d.strength * 100)}%`)

      simulationInstance.on("tick", () => {
        linkLabels
          .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
          .attr("y", (d: any) => (d.source.y + d.target.y) / 2)
      })
    })

    return () => {
      if (simulation) {
        simulation.stop()
      }
    }
  }, [filteredNodes, filteredLinks])

  const getNodeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "plc":
        return "P"
      case "hmi":
        return "H"
      case "scada":
        return "S"
      case "switch":
        return "SW"
      case "firewall":
        return "FW"
      case "sensor":
        return "SE"
      default:
        return "?"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleZoomIn = () => {
    if (svgRef.current && typeof window !== "undefined") {
      import("d3").then((d3) => {
        const svg = d3.select(svgRef.current)
        svg.transition().call(d3.zoom().scaleBy as any, 1.5)
      })
    }
  }

  const handleZoomOut = () => {
    if (svgRef.current && typeof window !== "undefined") {
      import("d3").then((d3) => {
        const svg = d3.select(svgRef.current)
        svg.transition().call(d3.zoom().scaleBy as any, 0.75)
      })
    }
  }

  const handleReset = () => {
    if (svgRef.current && typeof window !== "undefined") {
      import("d3").then((d3) => {
        const svg = d3.select(svgRef.current)
        svg.transition().call(d3.zoom().transform as any, d3.zoomIdentity)
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {networkStats.map((stat, index) => (
          <Card key={index} className="shadow-otids">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-otids-secondary">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Network className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Map Visualization */}
      <Card className="shadow-otids">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-otids-primary">Interactive Network Topology</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="plc">PLC</SelectItem>
                  <SelectItem value="hmi">HMI</SelectItem>
                  <SelectItem value="scada">SCADA</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <svg ref={svgRef} width="100%" height="500" viewBox="0 0 800 500" className="border rounded bg-white" />
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-otids-secondary">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-otids-secondary">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-otids-secondary">Low Risk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Details and Selected Node Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedNode && (
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-otids-primary">Selected Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-otids-primary">{selectedNode.name}</p>
                    <p className="text-sm text-otids-secondary">ID: {selectedNode.id}</p>
                    <p className="text-sm text-otids-secondary">Type: {selectedNode.type.toUpperCase()}</p>
                    <p className="text-sm text-otids-secondary">Connections: {selectedNode.connections}</p>
                  </div>
                  <Badge className={getRiskColor(selectedNode.risk)}>{selectedNode.risk.toUpperCase()}</Badge>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-otids-primary mb-2">Connected Devices</h4>
                  <div className="space-y-2">
                    {filteredLinks
                      .filter((link) => link.source === selectedNode.id || link.target === selectedNode.id)
                      .map((link, index) => {
                        const connectedNodeId = link.source === selectedNode.id ? link.target : link.source
                        const connectedNode = filteredNodes.find((n) => n.id === connectedNodeId)
                        return connectedNode ? (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-otids-secondary">{connectedNode.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(link.strength * 100).toFixed(0)}% strength
                            </Badge>
                          </div>
                        ) : null
                      })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-otids">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-otids-primary">Network Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-otids-primary">{filteredNodes.length}</p>
                  <p className="text-sm text-otids-secondary">Visible Nodes</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-otids-primary">{filteredLinks.length}</p>
                  <p className="text-sm text-otids-secondary">Active Links</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-otids-primary">Device Types</h4>
                {["plc", "hmi", "scada", "switch", "firewall", "sensor"].map((type) => {
                  const count = filteredNodes.filter((n) => n.type === type).length
                  return count > 0 ? (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-otids-secondary capitalize">{type}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
