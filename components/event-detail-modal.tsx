"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Download, AlertTriangle } from "lucide-react"

interface EventDetailModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
  type: "event" | "incident"
}

export function EventDetailModal({ event, isOpen, onClose, type }: EventDetailModalProps) {
  if (!event) return null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
      case "Critical":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const mockJsonData = {
    eventId: event.id,
    timestamp: event.time,
    sourceIP: event.sourceIP,
    targetIP: event.targetIP,
    severity: event.severity,
    description: event.description,
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      protocol: event.protocol || "TCP",
      packetSize: 1024,
      flags: ["SYN", "ACK"],
    },
    geolocation: {
      country: "Unknown",
      city: "Unknown",
      coordinates: [0, 0],
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DialogTitle className="text-xl font-bold text-otids-primary">
                {type === "incident" ? "Incident" : "Security Event"} {event.id}
              </DialogTitle>
              <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
              {type === "incident" && event.status && <Badge variant="outline">{event.status}</Badge>}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Report
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
            {type === "incident" && <TabsTrigger value="analysis">Analysis</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> {event.id}
                  </div>
                  <div>
                    <span className="font-medium">Severity:</span> {event.severity}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {event.description}
                  </div>
                  <div>
                    <span className="font-medium">Source IP:</span> {event.sourceIP}
                  </div>
                  <div>
                    <span className="font-medium">Target IP:</span> {event.targetIP}
                  </div>
                  {event.sourcePort && (
                    <div>
                      <span className="font-medium">Source Port:</span> {event.sourcePort}
                    </div>
                  )}
                  {event.targetPort && (
                    <div>
                      <span className="font-medium">Target Port:</span> {event.targetPort}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Start Time:</span> {event.time}
                  </div>
                  <div>
                    <span className="font-medium">Created Time:</span> {event.time}
                  </div>
                  <div>
                    <span className="font-medium">Confidence Score:</span> 85%
                  </div>
                  {type === "incident" && (
                    <>
                      <div>
                        <span className="font-medium">Threat Level:</span> {event.threatLevel}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {event.duration}
                      </div>
                    </>
                  )}
                  <div>
                    <span className="font-medium">Notes:</span> Automated detection by IDS system
                  </div>
                </CardContent>
              </Card>
            </div>

            {event.severity === "High" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800">High Severity Alert</h4>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  This event requires immediate attention. Consider implementing containment measures and escalating to
                  the security team.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-otids-primary">Event Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-otids-primary">Event Detected</p>
                      <p className="text-sm text-otids-secondary">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-otids-primary">Analysis Started</p>
                      <p className="text-sm text-otids-secondary">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-otids-primary">Response Initiated</p>
                      <p className="text-sm text-otids-secondary">{event.time}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-otids-primary">Raw Event Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(mockJsonData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {type === "incident" && (
            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Target Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Target IPs:</span>{" "}
                      {event.targetIPs ? event.targetIPs.join(", ") : event.targetIP}
                    </div>
                    <div>
                      <span className="font-medium">Ports Scanned:</span>{" "}
                      {event.portsScanned ? event.portsScanned.join(", ") : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Attack Vector:</span> Network-based
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Impact Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Affected Systems:</span> {event.targetIPs?.length || 1}
                    </div>
                    <div>
                      <span className="font-medium">Business Impact:</span> Medium
                    </div>
                    <div>
                      <span className="font-medium">Data at Risk:</span> Configuration data
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
