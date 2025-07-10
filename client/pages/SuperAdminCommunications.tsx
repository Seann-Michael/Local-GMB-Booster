import React, { useState } from "react";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuperAdminBroadcast from "./SuperAdminBroadcast";
import SuperAdminMessageTemplates from "./SuperAdminMessageTemplates";
import SuperAdminAnalytics from "./SuperAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  FileText,
  BarChart3,
  Send,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Target,
  Plus,
  RefreshCw,
  Download,
} from "lucide-react";

export default function SuperAdminCommunications() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for overview
  const stats = {
    totalMessages: 1247,
    activeTemplates: 28,
    totalViews: 89567,
    engagementRate: 23.4,
    openRate: 67.8,
    clickRate: 15.2,
    recentMessages: 5,
    scheduledMessages: 3,
  };

  const recentActivity = [
    {
      id: "1",
      type: "broadcast",
      title: "Weekly Project Updates",
      status: "sent",
      recipients: 1245,
      openRate: 72.3,
      sentAt: "2024-01-21T10:30:00Z",
    },
    {
      id: "2",
      type: "template",
      title: "Welcome Email Template",
      status: "updated",
      usageCount: 156,
      lastUsed: "2024-01-21T09:15:00Z",
    },
    {
      id: "3",
      type: "broadcast",
      title: "System Maintenance Notice",
      status: "scheduled",
      recipients: 2340,
      scheduledFor: "2024-01-22T02:00:00Z",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "updated":
        return <Badge variant="outline">Updated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "broadcast":
        return <Megaphone className="h-4 w-4 text-blue-500" />;
      case "template":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-full overflow-x-hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Communications Center</h1>
              <p className="text-muted-foreground">
                Manage broadcasts, templates, and communication analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Message
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="campaigns">
                <Target className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="broadcast">
                <Megaphone className="h-4 w-4 mr-2" />
                Broadcast
              </TabsTrigger>
              <TabsTrigger value="templates">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Messages
                    </CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalMessages.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Templates
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.activeTemplates}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ready to use
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Views
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalViews.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Engagement Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.engagementRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% improvement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Open Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {stats.openRate}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Average across all campaigns
                    </p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${stats.openRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Click Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.clickRate}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click-through performance
                    </p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stats.clickRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full gap-2" size="sm">
                      <Send className="h-4 w-4" />
                      Send Broadcast
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      <FileText className="h-4 w-4" />
                      Create Template
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getTypeIcon(activity.type)}
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.type === "broadcast" &&
                                `${activity.recipients} recipients`}
                              {activity.type === "template" &&
                                `Used ${activity.usageCount} times`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {activity.openRate && (
                            <div className="text-sm text-muted-foreground">
                              {activity.openRate}% open rate
                            </div>
                          )}
                          {getStatusBadge(activity.status)}
                          <div className="text-xs text-muted-foreground">
                            {activity.sentAt &&
                              new Date(activity.sentAt).toLocaleDateString()}
                            {activity.lastUsed &&
                              new Date(activity.lastUsed).toLocaleDateString()}
                            {activity.scheduledFor &&
                              `Scheduled: ${new Date(activity.scheduledFor).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Scheduled */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Scheduled Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold">
                        {stats.scheduledMessages}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Messages pending delivery
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Active Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold">7</div>
                      <p className="text-sm text-muted-foreground">
                        Currently running
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Campaigns
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      Currently running
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Draft Campaigns
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Being prepared
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Scheduled
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">
                      Ready to launch
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "1",
                        name: "Summer Product Launch",
                        status: "active",
                        type: "email",
                        audience: 12450,
                        sent: 8230,
                        opens: 3456,
                        clicks: 892,
                        startDate: "2024-01-15",
                        endDate: "2024-02-15",
                      },
                      {
                        id: "2",
                        name: "Customer Feedback Survey",
                        status: "active",
                        type: "sms",
                        audience: 5600,
                        sent: 5600,
                        opens: 4120,
                        clicks: 1580,
                        startDate: "2024-01-20",
                        endDate: "2024-01-27",
                      },
                      {
                        id: "3",
                        name: "Holiday Promotion",
                        status: "scheduled",
                        type: "email",
                        audience: 18900,
                        sent: 0,
                        opens: 0,
                        clicks: 0,
                        startDate: "2024-01-25",
                        endDate: "2024-02-10",
                      },
                      {
                        id: "4",
                        name: "New Feature Announcement",
                        status: "draft",
                        type: "push",
                        audience: 24500,
                        sent: 0,
                        opens: 0,
                        clicks: 0,
                        startDate: "2024-02-01",
                        endDate: "2024-02-15",
                      },
                    ].map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {campaign.type === "email" && (
                              <Mail className="h-5 w-5 text-blue-500" />
                            )}
                            {campaign.type === "sms" && (
                              <MessageSquare className="h-5 w-5 text-green-500" />
                            )}
                            {campaign.type === "push" && (
                              <Send className="h-5 w-5 text-purple-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {campaign.audience.toLocaleString()} recipients •{" "}
                              {new Date(
                                campaign.startDate,
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {campaign.sent.toLocaleString()} sent
                            </div>
                            <div className="text-muted-foreground">
                              {campaign.opens.toLocaleString()} opens •{" "}
                              {campaign.clicks.toLocaleString()} clicks
                            </div>
                          </div>
                          {campaign.status === "active" && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                          {campaign.status === "scheduled" && (
                            <Badge className="bg-blue-500">Scheduled</Badge>
                          )}
                          {campaign.status === "draft" && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Broadcast Tab */}
            <TabsContent value="broadcast">
              <SuperAdminBroadcast />
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <SuperAdminMessageTemplates />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <SuperAdminAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
