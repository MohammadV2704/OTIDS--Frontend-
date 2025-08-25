"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard-charts"
import { SensorsTable } from "@/components/sensors-table"
import { AssetOverview } from "@/components/asset-overview"
import { AssetTable } from "@/components/asset-table"
import { AssetDetailsScreen } from "@/components/asset-details-screen"
import { NetworkMetrics } from "@/components/network-metrics"
import { NetworkTrafficTable } from "@/components/network-traffic-table"
import { NetworkMapVisualization } from "@/components/network-map-visualization"
import { VulnerabilityOverview } from "@/components/vulnerability-overview"
import { SeverityDistributionChart } from "@/components/severity-distribution-chart"
import { VulnerabilitiesTable } from "@/components/vulnerabilities-table"
import { SecurityEventsOverview } from "@/components/security-events-overview"
import { AlertsTimelineChart } from "@/components/alerts-timeline-chart"
import { SecurityEventsTable } from "@/components/security-events-table"
import { IncidentManagement } from "@/components/incident-management"
import { IncidentDetailScreen } from "@/components/incident-detail-screen"
import { SecurityEventsFlyout } from "@/components/security-events-flyout"
import { SystemInformationScreen } from "@/components/system-information-screen"
import { SensorManagementScreen } from "@/components/sensor-management-screen"
import { IndividualSensorDashboard } from "@/components/individual-sensor-dashboard"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<string>("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showAssetDetail, setShowAssetDetail] = useState(false)
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventFlyoutOpen, setIsEventFlyoutOpen] = useState(false)
  const [eventModalType, setEventModalType] = useState<"event" | "incident">("event")
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [showIncidentDetail, setShowIncidentDetail] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<"main" | "system-info" | "sensor-management">("main")
  const [selectedSensor, setSelectedSensor] = useState<any>(null)
  const [showSensorDashboard, setShowSensorDashboard] = useState(false)

  const handleLogin = (username: string, password: string) => {
    // Simple demo authentication - in real app, this would validate against backend
    if (username && password) {
      setUser(username)
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser("")
    setActiveTab("dashboard")
  }

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset)
    setShowAssetDetail(true)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setEventModalType("event")
    setIsEventFlyoutOpen(true)
  }

  const handleIncidentClick = (incident: any) => {
    setSelectedIncident(incident)
    setShowIncidentDetail(true)
  }

  const handleBackToIncidents = () => {
    setShowIncidentDetail(false)
    setSelectedIncident(null)
    setActiveTab("incidents")
  }

  const handleSystemInformation = () => {
    setCurrentScreen("system-info")
  }

  const handleSensorManagement = () => {
    setCurrentScreen("sensor-management")
  }

  const handleBackToMain = () => {
    setCurrentScreen("main")
    setShowSensorDashboard(false)
  }

  const handleSensorClick = (sensor: any) => {
    setSelectedSensor(sensor)
    setShowSensorDashboard(true)
  }

  const handleBackToSensors = () => {
    setShowSensorDashboard(false)
    setSelectedSensor(null)
  }

  const handleBackToAssets = () => {
    setShowAssetDetail(false)
    setSelectedAsset(null)
    setActiveTab("assets")
  }

  // Added tab change handler to properly reset incident detail state
  const handleTabChange = (tab: string) => {
    // Reset incident detail state when navigating away from incidents
    if (tab !== "incidents" && showIncidentDetail) {
      setShowIncidentDetail(false)
      setSelectedIncident(null)
    }

    // Reset asset detail state when navigating away from assets
    if (tab !== "assets" && showAssetDetail) {
      setShowAssetDetail(false)
      setSelectedAsset(null)
    }

    setActiveTab(tab)
  }

  const renderTabContent = () => {
    if (showAssetDetail && selectedAsset) {
      return <AssetDetailsScreen asset={selectedAsset} onBack={handleBackToAssets} />
    }

    if (showIncidentDetail && selectedIncident) {
      return <IncidentDetailScreen incident={selectedIncident} onBack={handleBackToIncidents} />
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <DashboardStats />
            <DashboardCharts />
            <SensorsTable />
          </div>
        )
      case "assets":
        return (
          <div className="space-y-4">
            <AssetOverview />
            <AssetTable onAssetClick={handleAssetClick} />
          </div>
        )
      case "network":
        return (
          <div className="space-y-4">
            <NetworkMetrics />
            <NetworkTrafficTable />
          </div>
        )
      case "network-map":
        return <NetworkMapVisualization />
      case "vulnerabilities":
        return (
          <div className="space-y-4">
            <VulnerabilityOverview />
            <SeverityDistributionChart />
            <VulnerabilitiesTable />
          </div>
        )
      case "security-events":
        return (
          <div className="space-y-4">
            <SecurityEventsOverview />
            <AlertsTimelineChart />
            <SecurityEventsTable onEventClick={handleEventClick} />
          </div>
        )
      case "events":
        return (
          <div className="space-y-4">
            <SecurityEventsOverview />
            <SecurityEventsTable onEventClick={handleEventClick} />
          </div>
        )
      case "incidents":
        return <IncidentManagement onIncidentClick={handleIncidentClick} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SidebarNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
          onSystemInformation={handleSystemInformation}
          onSensorManagement={handleSensorManagement}
        />
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentScreen === "main" ? (
              renderTabContent()
            ) : (
              <div>
                {currentScreen === "system-info" && <SystemInformationScreen onBack={handleBackToMain} />}
                {currentScreen === "sensor-management" && !showSensorDashboard && (
                  <SensorManagementScreen onBack={handleBackToMain} onSensorClick={handleSensorClick} />
                )}
                {showSensorDashboard && selectedSensor && (
                  <IndividualSensorDashboard sensor={selectedSensor} onBack={handleBackToSensors} />
                )}
                {currentScreen !== "system-info" &&
                  currentScreen !== "sensor-management" &&
                  currentScreen !== "main" &&
                  !showSensorDashboard && (
                    <Button onClick={handleBackToMain} className="mt-4">
                      Back to Dashboard
                    </Button>
                  )}
              </div>
            )}
          </div>
        </main>
      </div>

      <SecurityEventsFlyout
        event={selectedEvent}
        isOpen={isEventFlyoutOpen}
        onClose={() => setIsEventFlyoutOpen(false)}
        type={eventModalType}
      />
    </div>
  )
}
