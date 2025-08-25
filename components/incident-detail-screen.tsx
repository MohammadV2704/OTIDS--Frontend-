"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Shield, Network, Clock, Target } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts"

interface IncidentDetailScreenProps {
  incident: any
  onBack: () => void
}

const severityData = [
  { name: "High", value: 15, color: "#ef4444" },
  { name: "Medium", value: 28, color: "#f97316" },
  { name: "Low", value: 42, color: "#eab308" },
  { name: "Info", value: 35, color: "#3b82f6" },
]

const flowAnalysisData = [
  {
    sourceIP: "203.0.113.45",
    registeredPorts: [22, 23, 80, 443],
    target: "Web Server Cluster",
    connections: 45,
    threatLevel: "High",
  },
  {
    sourceIP: "198.51.100.25",
    registeredPorts: [21, 22, 25, 53],
    target: "Mail Server",
    connections: 23,
    threatLevel: "Medium",
  },
  {
    sourceIP: "192.168.1.50",
    registeredPorts: [8080, 8443],
    target: "Application Server",
    connections: 12,
    threatLevel: "High",
  },
]

const timelineData = [
  { time: "00:00", events: 5, severity: "Low" },
  { time: "02:00", events: 8, severity: "Medium" },
  { time: "04:00", events: 12, severity: "Medium" },
  { time: "06:00", events: 25, severity: "High" },
  { time: "08:00", events: 35, severity: "High" },
  { time: "10:00", events: 18, severity: "Medium" },
  { time: "12:00", events: 32, severity: "High" },
  { time: "14:00", events: 28, severity: "High" },
  { time: "16:00", events: 15, severity: "Medium" },
  { time: "18:00", events: 22, severity: "Medium" },
  { time: "20:00", events: 10, severity: "Low" },
  { time: "22:00", events: 6, severity: "Low" },
]

const incidentTableData = [
  {
    id: "INC-001",
    time: "2024-01-15 14:30:25",
    description: "Multiple failed login attempts from external IP",
    sourceIP: "203.0.113.45",
    targetIP: "192.168.1.10",
    sourcePort: "4432",
    targetPort: "22",
    severity: "High",
    threatLevel: "Critical",
  },
  {
    id: "INC-002",
    time: "2024-01-15 14:32:10",
    description: "Suspicious network scanning activity detected",
    sourceIP: "198.51.100.25",
    targetIP: "192.168.1.0/24",
    sourcePort: "2234",
    targetPort: "80",
    severity: "Medium",
    threatLevel: "Medium",
  },
  {
    id: "INC-003",
    time: "2024-01-15 14:35:45",
    description: "Malware communication to external C&C server",
    sourceIP: "192.168.1.50",
    targetIP: "185.199.108.153",
    sourcePort: "8080",
    targetPort: "8443",
    severity: "High",
    threatLevel: "High",
  },
  {
    id: "INC-004",
    time: "2024-01-15 14:40:12",
    description: "Unauthorized access attempt to admin panel",
    sourceIP: "203.0.113.45",
    targetIP: "192.168.1.5",
    sourcePort: "3389",
    targetPort: "443",
    severity: "High",
    threatLevel: "Critical",
  },
]

export function IncidentDetailScreen({ incident, onBack }: IncidentDetailScreenProps) {
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

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full bg-otids-secondary overflow-auto">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-otids-primary hover:bg-otids-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incidents
          </Button>
          <h1 className="text-2xl font-bold text-otids-primary">Incident Details - {incident.id}</h1>
        </div>

        <Card className="mb-6 shadow-otids">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-otids-primary">
              <Shield className="h-5 w-5" />
              Incident Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Source IP</div>
                <div className="text-lg font-semibold text-otids-primary mt-1">{incident.sourceIP}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Target IP</div>
                <div className="text-lg font-semibold text-otids-primary mt-1">{incident.targetIP}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Threat Score</div>
                <div className="text-lg font-semibold text-red-600 mt-1">85/100</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Threat Level</div>
                <Badge className={getThreatLevelColor(incident.threatLevel)} variant="secondary">
                  {incident.threatLevel}
                </Badge>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Duration</div>
                <div className="text-lg font-semibold text-otids-primary mt-1">{incident.duration}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Scanner Port</div>
                <div className="text-lg font-semibold text-otids-primary mt-1">22, 80, 443</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Start Time</div>
                <div className="text-lg font-semibold text-otids-primary mt-1">{incident.time}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-otids-primary/20">
                <div className="text-sm font-medium text-otids-secondary">Description</div>
                <div className="text-sm text-otids-primary mt-1">{incident.description}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">Incident Severity Distribution (Pie Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-otids">
            <CardHeader>
              <CardTitle className="text-otids-primary">Incident Severity Distribution (Bar Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFA94D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 shadow-otids">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-otids-primary">
              <Network className="h-5 w-5" />
              Incident Flow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {flowAnalysisData.map((flow, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-otids-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-otids-primary">Flow {index + 1}</h4>
                    <Badge className={getThreatLevelColor(flow.threatLevel)} variant="secondary">
                      {flow.threatLevel} Threat
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-center min-w-[120px]">
                        <div className="text-xs font-medium text-blue-600 mb-1">Source IP</div>
                        <div className="text-sm font-bold text-blue-800">{flow.sourceIP}</div>
                      </div>
                      <div className="text-otids-primary text-xl">→</div>
                      <div className="bg-otids-primary/10 p-3 rounded-lg text-center min-w-[120px]">
                        <div className="text-xs font-medium text-otids-primary mb-1">Registered Ports</div>
                        <div className="text-sm font-bold text-otids-primary">{flow.registeredPorts.join(", ")}</div>
                      </div>
                      <div className="text-otids-primary text-xl">→</div>
                      <div className="bg-green-100 p-3 rounded-lg text-center min-w-[120px]">
                        <div className="text-xs font-medium text-green-600 mb-1">Target</div>
                        <div className="text-sm font-bold text-green-800">{flow.target}</div>
                      </div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg text-center">
                      <div className="text-xs font-medium text-red-600 mb-1">Connections</div>
                      <div className="text-lg font-bold text-red-800">{flow.connections}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-otids">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-otids-primary">
              <Clock className="h-5 w-5" />
              Incident Timeline Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="time" stroke="#6C6C6C" />
                  <YAxis stroke="#6C6C6C" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #FFA94D",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#FFA94D"
                    strokeWidth={3}
                    dot={{ fill: "#FFA94D", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#FFA94D", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-otids-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Peak Activity (30+ events)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Moderate Activity (10-30 events)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Activity (&lt;10 events)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-otids">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-otids-primary">
              <Target className="h-5 w-5" />
              Related Incident Events
            </CardTitle>
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
                    <TableHead className="text-otids-primary">Threat Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentTableData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-otids-secondary/20">
                      <TableCell className="font-mono text-sm font-medium text-otids-primary">{row.id}</TableCell>
                      <TableCell className="font-mono text-xs text-otids-secondary">{row.time}</TableCell>
                      <TableCell className="text-otids-primary max-w-xs">{row.description}</TableCell>
                      <TableCell className="font-mono text-sm text-otids-primary">{row.sourceIP}</TableCell>
                      <TableCell className="font-mono text-sm text-otids-primary">{row.targetIP}</TableCell>
                      <TableCell className="font-mono text-sm text-otids-primary">{row.sourcePort}</TableCell>
                      <TableCell className="font-mono text-sm text-otids-primary">{row.targetPort}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(row.severity)} variant="secondary">
                          {row.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getThreatLevelColor(row.threatLevel)} variant="secondary">
                          {row.threatLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
