import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Database,
  Globe,
  Phone,
  CreditCard,
  RefreshCw,
  Calendar,
  MapPin,
} from "lucide-react";

interface SystemStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  description: string;
  lastChecked: string;
  responseTime?: number;
  uptime?: number;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  startTime: string;
  resolvedTime?: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

export default function StatusPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [overallStatus, setOverallStatus] = useState<
    "operational" | "degraded" | "outage"
  >("operational");

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    // Mock system status data
    const mockSystems: SystemStatus[] = [
      {
        name: "Core Application",
        status: "operational",
        description: "Main application services",
        lastChecked: new Date().toISOString(),
        responseTime: 145,
        uptime: 99.9,
      },
      {
        name: "Database",
        status: "operational",
        description: "Primary database cluster",
        lastChecked: new Date().toISOString(),
        responseTime: 12,
        uptime: 99.95,
      },
      {
        name: "API Services",
        status: "operational",
        description: "REST API endpoints",
        lastChecked: new Date().toISOString(),
        responseTime: 89,
        uptime: 99.8,
      },
      {
        name: "Twilio SMS",
        status: "operational",
        description: "SMS notification service",
        lastChecked: new Date().toISOString(),
        responseTime: 234,
        uptime: 99.7,
      },
      {
        name: "Google Maps API",
        status: "operational",
        description: "Location and mapping services",
        lastChecked: new Date().toISOString(),
        responseTime: 178,
        uptime: 99.85,
      },
      {
        name: "Stripe Payments",
        status: "operational",
        description: "Payment processing",
        lastChecked: new Date().toISOString(),
        responseTime: 156,
        uptime: 99.9,
      },
      {
        name: "File Storage",
        status: "operational",
        description: "Image and document storage",
        lastChecked: new Date().toISOString(),
        responseTime: 98,
        uptime: 99.95,
      },
      {
        name: "Email Service",
        status: "degraded",
        description: "Email notifications and delivery",
        lastChecked: new Date().toISOString(),
        responseTime: 2340,
        uptime: 98.2,
      },
    ];

    // Mock incidents
    const mockIncidents: Incident[] = [
      {
        id: "inc-001",
        title: "Email Delivery Delays",
        status: "monitoring",
        severity: "medium",
        description:
          "Some users may experience delays in receiving email notifications",
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updates: [
          {
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            message: "We are investigating reports of delayed email delivery",
            status: "investigating",
          },
          {
            time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            message: "Issue identified with email service provider",
            status: "identified",
          },
          {
            time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            message: "Fix implemented, monitoring email delivery",
            status: "monitoring",
          },
        ],
      },
    ];

    setSystems(mockSystems);
    setIncidents(mockIncidents);
    setLastUpdated(new Date().toISOString());

    // Calculate overall status
    const hasOutage = mockSystems.some((s) => s.status === "outage");
    const hasDegraded = mockSystems.some((s) => s.status === "degraded");

    if (hasOutage) {
      setOverallStatus("outage");
    } else if (hasDegraded) {
      setOverallStatus("degraded");
    } else {
      setOverallStatus("operational");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case "outage":
        return <Badge variant="destructive">Outage</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getSystemIcon = (systemName: string) => {
    if (systemName.includes("Database")) return Database;
    if (systemName.includes("API")) return Globe;
    if (systemName.includes("SMS") || systemName.includes("Twilio"))
      return Phone;
    if (systemName.includes("Maps")) return MapPin;
    if (systemName.includes("Payment") || systemName.includes("Stripe"))
      return CreditCard;
    return Activity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">System Status</h1>
          <p className="text-muted-foreground mb-4">
            Current status and uptime of all systems
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              <span className="font-medium">
                {overallStatus === "operational"
                  ? "All Systems Operational"
                  : overallStatus === "degraded"
                    ? "Some Systems Degraded"
                    : "System Outage Detected"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSystemStatus}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Active Incidents */}
        {incidents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{incident.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {incident.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Updates:</h4>
                      {incident.updates.map((update, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-[120px]">
                            <Calendar className="h-3 w-3" />
                            {new Date(update.time).toLocaleTimeString()}
                          </div>
                          <p>{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => {
            const Icon = getSystemIcon(system.name);
            return (
              <Card key={system.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="font-medium">{system.name}</h3>
                    </div>
                    {getStatusIcon(system.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {system.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      {getStatusBadge(system.status)}
                    </div>
                    {system.responseTime && (
                      <div className="flex justify-between text-sm">
                        <span>Response Time:</span>
                        <span
                          className={
                            system.responseTime > 1000
                              ? "text-red-500"
                              : system.responseTime > 500
                                ? "text-yellow-500"
                                : "text-green-500"
                          }
                        >
                          {system.responseTime}ms
                        </span>
                      </div>
                    )}
                    {system.uptime && (
                      <div className="flex justify-between text-sm">
                        <span>Uptime:</span>
                        <span
                          className={
                            system.uptime < 99
                              ? "text-red-500"
                              : system.uptime < 99.5
                                ? "text-yellow-500"
                                : "text-green-500"
                          }
                        >
                          {system.uptime.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last checked:</span>
                      <span>
                        {new Date(system.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Historical Uptime Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>30-Day Uptime History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-sm text-muted-foreground">Overall Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systems.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Services Monitored
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <p className="text-sm text-muted-foreground">
                  Incidents This Month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
