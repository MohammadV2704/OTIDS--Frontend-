"use client"
import { X, Clock, MapPin, Shield, AlertTriangle, Info, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SecurityEventsFlyoutProps {
  event: any
  isOpen: boolean
  onClose: () => void
  type: "event" | "incident"
}

export function SecurityEventsFlyout({ event, isOpen, onClose, type }: SecurityEventsFlyoutProps) {
  if (!isOpen || !event) return null

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
      case "high":
        return AlertTriangle
      case "medium":
        return Shield
      case "low":
        return Info
      default:
        return Activity
    }
  }

  const SeverityIcon = getSeverityIcon(event.severity)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/20" onClick={onClose} />

      {/* Flyout Panel */}
      <div className="w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === "event" ? "Security Event Details" : "Incident Details"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SeverityIcon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">ID: {event.id}</span>
            </div>

            <Badge className={`${getSeverityColor(event.severity)} text-white`}>{event.severity}</Badge>

            <p className="text-sm text-gray-600">{event.description}</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Time:</span>
                    <span className="text-sm font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Source IP:</span>
                    <span className="text-sm font-medium">{event.sourceIp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Target IP:</span>
                    <span className="text-sm font-medium">{event.targetIp}</span>
                  </div>
                  {event.sourcePort && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Source Port:</span>
                      <span className="text-sm font-medium">{event.sourcePort}</span>
                    </div>
                  )}
                  {event.targetPort && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Target Port:</span>
                      <span className="text-sm font-medium">{event.targetPort}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence Score:</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Event Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Start Time</p>
                        <p className="text-xs text-gray-500">{event.startTime || event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-otids-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Create Time</p>
                        <p className="text-xs text-gray-500">{event.createTime || event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Analysis Started</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Classification Complete</p>
                        <p className="text-xs text-gray-500">1 minute ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Raw Data (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(
                      {
                        id: event.id,
                        timestamp: event.time,
                        start_time: event.startTime || event.time,
                        create_time: event.createTime || event.time,
                        source_ip: event.sourceIp,
                        target_ip: event.targetIp,
                        source_port: event.sourcePort,
                        target_port: event.targetPort,
                        severity: event.severity,
                        description: event.description,
                        protocol: "TCP",
                        packet_size: "1024",
                        flags: ["SYN", "ACK"],
                      },
                      null,
                      2,
                    )}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
