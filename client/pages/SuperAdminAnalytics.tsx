import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageSquare,
  Clock,
  Target,
  Zap,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Mail,
  Bell,
  Smartphone,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { formatSystemDate } from "@/lib/dateUtils";

interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  targetAudience: string;
  category?: "system" | "marketing" | "support" | "emergency";
  createdAt: string;
  sentAt?: string;
  status: string;
  viewCount: number;
  dismissCount: number;
  isActive: boolean;
}

interface AnalyticsData {
  overview: {
    totalMessages: number;
    totalViews: number;
    totalDismissals: number;
    activeUsers: number;
    engagementRate: number;
    clickThroughRate: number;
    averageViewTime: number;
    conversionRate: number;
  };
  trends: {
    period: string;
    messages: number;
    views: number;
    dismissals: number;
    engagement: number;
  }[];
  messageTypes: {
    type: string;
    count: number;
    views: number;
    engagement: number;
    color: string;
  }[];
  categories: {
    category: string;
    count: number;
    engagement: number;
    performance: string;
  }[];
  audiences: {
    audience: string;
    count: number;
    engagement: number;
    preference: number;
  }[];
  topPerforming: BroadcastMessage[];
  lowPerforming: BroadcastMessage[];
  recentActivity: {
    timestamp: string;
    action: string;
    message: string;
    user?: string;
    impact: string;
  }[];
}

export default function SuperAdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load messages and user preferences for analysis
      const messages = JSON.parse(
        localStorage.getItem("broadcastMessages") || "[]",
      );
      const userDismissals = JSON.parse(
        localStorage.getItem("userMessageDismissals") || "[]",
      );
      const userPreferences = getAllUserPreferences();

      // Calculate analytics
      const analytics = calculateAnalytics(
        messages,
        userDismissals,
        userPreferences,
        timeRange,
      );
      setAnalyticsData(analytics);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUserPreferences = () => {
    const preferences: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notificationPreferences_")) {
        try {
          const pref = JSON.parse(localStorage.getItem(key) || "{}");
          preferences.push(pref);
        } catch (e) {
          // Ignore invalid preferences
        }
      }
    }
    return preferences;
  };

  const calculateAnalytics = (
    messages: BroadcastMessage[],
    dismissals: any[],
    preferences: any[],
    timeRange: string,
  ): AnalyticsData => {
    const now = new Date();
    const rangeMs = getRangeInMs(timeRange);
    const cutoffDate = new Date(now.getTime() - rangeMs);

    // Filter messages by time range
    const filteredMessages = messages.filter(
      (m) => new Date(m.createdAt) >= cutoffDate,
    );

    // Calculate overview metrics
    const totalViews = filteredMessages.reduce(
      (sum, m) => sum + m.viewCount,
      0,
    );
    const totalDismissals = filteredMessages.reduce(
      (sum, m) => sum + m.dismissCount,
      0,
    );
    const engagementRate =
      totalViews > 0 ? ((totalViews - totalDismissals) / totalViews) * 100 : 0;

    // Calculate trends data
    const trends = calculateTrends(filteredMessages, timeRange);

    // Calculate message type analytics
    const messageTypes = calculateMessageTypes(filteredMessages);

    // Calculate category analytics
    const categories = calculateCategories(filteredMessages);

    // Calculate audience analytics
    const audiences = calculateAudiences(filteredMessages);

    // Find top and low performing messages
    const sortedByEngagement = [...filteredMessages].sort((a, b) => {
      const aEngagement =
        a.viewCount > 0
          ? ((a.viewCount - a.dismissCount) / a.viewCount) * 100
          : 0;
      const bEngagement =
        b.viewCount > 0
          ? ((b.viewCount - b.dismissCount) / b.viewCount) * 100
          : 0;
      return bEngagement - aEngagement;
    });

    const topPerforming = sortedByEngagement.slice(0, 5);
    const lowPerforming = sortedByEngagement.slice(-5).reverse();

    // Generate recent activity
    const recentActivity = generateRecentActivity(filteredMessages, dismissals);

    return {
      overview: {
        totalMessages: filteredMessages.length,
        totalViews,
        totalDismissals,
        activeUsers: preferences.filter((p) => p.enableNotifications).length,
        engagementRate,
        clickThroughRate: Math.random() * 15 + 5, // Mock data
        averageViewTime: Math.random() * 30 + 10, // Mock data
        conversionRate: Math.random() * 8 + 2, // Mock data
      },
      trends,
      messageTypes,
      categories,
      audiences,
      topPerforming,
      lowPerforming,
      recentActivity,
    };
  };

  const getRangeInMs = (range: string): number => {
    switch (range) {
      case "24h":
        return 24 * 60 * 60 * 1000;
      case "7d":
        return 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return 30 * 24 * 60 * 60 * 1000;
      case "90d":
        return 90 * 24 * 60 * 60 * 1000;
      default:
        return 30 * 24 * 60 * 60 * 1000;
    }
  };

  const calculateTrends = (messages: BroadcastMessage[], timeRange: string) => {
    const periods = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30;
    const trends = [];

    for (let i = periods - 1; i >= 0; i--) {
      const periodStart = new Date();
      const periodEnd = new Date();

      if (timeRange === "24h") {
        periodStart.setHours(periodStart.getHours() - i - 1);
        periodEnd.setHours(periodEnd.getHours() - i);
      } else {
        periodStart.setDate(periodStart.getDate() - i - 1);
        periodEnd.setDate(periodEnd.getDate() - i);
      }

      const periodMessages = messages.filter((m) => {
        const messageDate = new Date(m.createdAt);
        return messageDate >= periodStart && messageDate < periodEnd;
      });

      const views = periodMessages.reduce((sum, m) => sum + m.viewCount, 0);
      const dismissals = periodMessages.reduce(
        (sum, m) => sum + m.dismissCount,
        0,
      );
      const engagement = views > 0 ? ((views - dismissals) / views) * 100 : 0;

      trends.push({
        period:
          timeRange === "24h"
            ? `${periodStart.getHours()}:00`
            : formatSystemDate(periodStart.toISOString()),
        messages: periodMessages.length,
        views,
        dismissals,
        engagement,
      });
    }

    return trends;
  };

  const calculateMessageTypes = (messages: BroadcastMessage[]) => {
    const types = ["info", "warning", "success", "error"];
    const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

    return types.map((type, index) => {
      const typeMessages = messages.filter((m) => m.type === type);
      const views = typeMessages.reduce((sum, m) => sum + m.viewCount, 0);
      const dismissals = typeMessages.reduce(
        (sum, m) => sum + m.dismissCount,
        0,
      );
      const engagement = views > 0 ? ((views - dismissals) / views) * 100 : 0;

      return {
        type,
        count: typeMessages.length,
        views,
        engagement,
        color: colors[index],
      };
    });
  };

  const calculateCategories = (messages: BroadcastMessage[]) => {
    const categories = ["system", "marketing", "support", "emergency"];

    return categories.map((category) => {
      const categoryMessages = messages.filter((m) => m.category === category);
      const views = categoryMessages.reduce((sum, m) => sum + m.viewCount, 0);
      const dismissals = categoryMessages.reduce(
        (sum, m) => sum + m.dismissCount,
        0,
      );
      const engagement = views > 0 ? ((views - dismissals) / views) * 100 : 0;

      let performance = "average";
      if (engagement > 70) performance = "excellent";
      else if (engagement > 50) performance = "good";
      else if (engagement < 30) performance = "poor";

      return {
        category,
        count: categoryMessages.length,
        engagement,
        performance,
      };
    });
  };

  const calculateAudiences = (messages: BroadcastMessage[]) => {
    const audiences = ["all", "business-owners", "agency-admins", "staff"];

    return audiences.map((audience) => {
      const audienceMessages = messages.filter(
        (m) => m.targetAudience === audience,
      );
      const views = audienceMessages.reduce((sum, m) => sum + m.viewCount, 0);
      const dismissals = audienceMessages.reduce(
        (sum, m) => sum + m.dismissCount,
        0,
      );
      const engagement = views > 0 ? ((views - dismissals) / views) * 100 : 0;

      return {
        audience,
        count: audienceMessages.length,
        engagement,
        preference: Math.random() * 40 + 60, // Mock preference score
      };
    });
  };

  const generateRecentActivity = (
    messages: BroadcastMessage[],
    dismissals: any[],
  ) => {
    const activity = [];

    // Recent message activities
    const recentMessages = [...messages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    recentMessages.forEach((message) => {
      activity.push({
        timestamp: message.createdAt,
        action: "Message Sent",
        message: message.title,
        impact: message.viewCount > 10 ? "high" : "medium",
      });
    });

    // Recent dismissals
    const recentDismissals = dismissals
      .sort(
        (a, b) =>
          new Date(b.dismissedAt).getTime() - new Date(a.dismissedAt).getTime(),
      )
      .slice(0, 3);

    recentDismissals.forEach((dismissal) => {
      const message = messages.find((m) => m.id === dismissal.messageId);
      if (message) {
        activity.push({
          timestamp: dismissal.dismissedAt,
          action: "Message Dismissed",
          message: message.title,
          user: dismissal.userId,
          impact: "low",
        });
      }
    });

    return activity
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);
  };

  const exportReport = () => {
    if (!analyticsData) return;

    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      data: analyticsData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `broadcast-analytics-${timeRange}-${formatSystemDate(new Date().toISOString())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Analytics report exported successfully!");
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "engagement":
        return <TrendingUp className="h-4 w-4" />;
      case "views":
        return <Eye className="h-4 w-4" />;
      case "dismissals":
        return <XCircle className="h-4 w-4" />;
      case "messages":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return <Badge className="bg-green-500">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-500">Good</Badge>;
      case "average":
        return <Badge variant="secondary">Average</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      default:
        return <Badge variant="outline">{performance}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Broadcast Analytics
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive insights into message performance and user engagement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={loadAnalyticsData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={exportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Last updated: {lastUpdated.toLocaleString()}</span>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.totalMessages}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(analyticsData.overview.engagementRate)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.activeUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+3%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Message Types Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Message Types Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.messageTypes.map((type) => (
                  <div key={type.type} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(type.type)}
                      <span className="font-medium capitalize">
                        {type.type}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Messages:</span>
                        <span className="font-medium">{type.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Views:</span>
                        <span className="font-medium">{type.views}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Engagement:</span>
                        <span className="font-medium">
                          {Math.round(type.engagement)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Categories Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categories.map((category) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium capitalize">
                        {category.category}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {category.count} messages •{" "}
                        {Math.round(category.engagement)}% engagement
                      </p>
                    </div>
                    {getPerformanceBadge(category.performance)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Audience Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.audiences.map((audience) => (
                  <div
                    key={audience.audience}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {audience.audience === "all"
                          ? "All Users"
                          : audience.audience.replace("-", " ")}
                      </h4>
                      <Badge variant="secondary">
                        {audience.count} messages
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Engagement Rate:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2"
                              style={{ width: `${audience.engagement}%` }}
                            />
                          </div>
                          <span className="font-medium">
                            {Math.round(audience.engagement)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Preference Score:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-green-500 rounded-full h-2"
                              style={{ width: `${audience.preference}%` }}
                            />
                          </div>
                          <span className="font-medium">
                            {Math.round(audience.preference)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Top Performing Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Top Performing Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.topPerforming.map((message, index) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{message.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {message.viewCount} views • {message.dismissCount}{" "}
                        dismissed
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(message.type)}
                        <span className="text-xs capitalize">
                          {message.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Needs Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.lowPerforming.map((message, index) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{message.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {message.viewCount} views • {message.dismissCount}{" "}
                        dismissed
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(message.type)}
                        <span className="text-xs capitalize">
                          {message.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${
                        activity.impact === "high"
                          ? "bg-red-500"
                          : activity.impact === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSystemDate(activity.timestamp)}
                        {activity.user && ` • User: ${activity.user}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
