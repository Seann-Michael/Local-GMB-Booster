import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Building2,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  clientGrowth: {
    month: string;
    newClients: number;
    lostClients: number;
    totalClients: number;
  }[];
  revenueGrowth: {
    month: string;
    revenue: number;
    commission: number;
  }[];
  planDistribution: {
    plan: string;
    count: number;
    revenue: number;
  }[];
  clientRetention: {
    retained: number;
    churned: number;
    total: number;
  };
  performanceMetrics: {
    avgProjectsPerClient: number;
    avgClientValue: number;
    clientSatisfaction: number;
    growthRate: number;
  };
}

export default function AgencyAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [timeRange, setTimeRange] = useState("6months");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Load agency clients
    const clients = JSON.parse(localStorage.getItem("agency_clients") || "[]");

    // Generate analytics data based on existing clients
    const activeClients = clients.filter(
      (client: any) => client.status === "active",
    );

    // Sample client growth data
    const clientGrowth = [
      { month: "Oct", newClients: 1, lostClients: 0, totalClients: 1 },
      { month: "Nov", newClients: 1, lostClients: 0, totalClients: 2 },
      { month: "Dec", newClients: 0, lostClients: 0, totalClients: 2 },
      { month: "Jan", newClients: 1, lostClients: 0, totalClients: 3 },
      { month: "Feb", newClients: 0, lostClients: 0, totalClients: 3 },
      { month: "Mar", newClients: 0, lostClients: 0, totalClients: 3 },
    ];

    // Calculate revenue growth
    const revenueGrowth = clientGrowth.map((data, index) => {
      const monthlyRevenue = data.totalClients * 120; // Average $120 per client
      return {
        month: data.month,
        revenue: monthlyRevenue,
        commission: monthlyRevenue * 0.15,
      };
    });

    // Plan distribution
    const planCounts = activeClients.reduce((acc: any, client: any) => {
      acc[client.plan] = (acc[client.plan] || 0) + 1;
      return acc;
    }, {});

    const planDistribution = Object.entries(planCounts).map(
      ([plan, count]: [string, any]) => {
        const planPrices: { [key: string]: number } = {
          Basic: 99,
          Professional: 149,
          Premium: 199,
          Enterprise: 299,
        };
        return {
          plan,
          count,
          revenue: count * (planPrices[plan] || 99),
        };
      },
    );

    // Client retention (mock data)
    const clientRetention = {
      retained: Math.max(activeClients.length - 1, 0),
      churned: Math.floor(activeClients.length * 0.1),
      total: activeClients.length + Math.floor(activeClients.length * 0.1),
    };

    // Performance metrics
    const totalRevenue = activeClients.reduce(
      (sum: number, client: any) => sum + client.monthlyValue,
      0,
    );
    const avgClientValue =
      activeClients.length > 0 ? totalRevenue / activeClients.length : 0;
    const avgProjectsPerClient =
      activeClients.reduce(
        (sum: number, client: any) => sum + (client.projects || 0),
        0,
      ) / Math.max(activeClients.length, 1);

    const performanceMetrics = {
      avgProjectsPerClient,
      avgClientValue,
      clientSatisfaction: 87.5, // Mock satisfaction score
      growthRate: 15.2, // Mock growth rate
    };

    setAnalyticsData({
      clientGrowth,
      revenueGrowth,
      planDistribution,
      clientRetention,
      performanceMetrics,
    });

    setIsLoading(false);
  };

  const refreshData = () => {
    loadAnalyticsData();
  };

  const exportData = () => {
    // In a real app, this would export analytics data
    console.log("Exporting analytics data...");
  };

  if (!analyticsData) {
    return (
      <AgencyAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading analytics...</p>
          </div>
        </div>
      </AgencyAdminLayout>
    );
  }

  const retentionRate =
    analyticsData.clientRetention.total > 0
      ? (analyticsData.clientRetention.retained /
          analyticsData.clientRetention.total) *
        100
      : 0;

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your agency's performance and growth metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Projects/Client
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.performanceMetrics.avgProjectsPerClient.toFixed(
                  1,
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Client Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analyticsData.performanceMetrics.avgClientValue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Client Retention
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {retentionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.clientRetention.retained} of{" "}
                {analyticsData.clientRetention.total} clients retained
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.performanceMetrics.growthRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                Monthly growth rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Client Growth</CardTitle>
              <CardDescription>New clients acquired over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.clientGrowth.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 text-sm font-medium">
                        {data.month}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max((data.totalClients / 5) * 100, 10)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium w-12 text-right">
                      {data.totalClients}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Commission</CardTitle>
              <CardDescription>
                Monthly revenue and your commission earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenueGrowth.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <span className="text-sm text-muted-foreground">
                        ${data.commission.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max((data.revenue / 600) * 100, 5)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution & Client Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>
                How your clients are distributed across plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.planDistribution.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{plan.plan}</Badge>
                      <div>
                        <p className="font-medium">{plan.count} clients</p>
                        <p className="text-sm text-muted-foreground">
                          ${plan.revenue}/month revenue
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        ${(plan.revenue * 0.15).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        commission
                      </p>
                    </div>
                  </div>
                ))}
                {analyticsData.planDistribution.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No plan data available</p>
                    <p className="text-sm">Add clients to see distribution</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Client Insights</CardTitle>
              <CardDescription>
                Key metrics about your client base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Satisfaction</span>
                    <span className="font-medium">
                      {analyticsData.performanceMetrics.clientSatisfaction}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${analyticsData.performanceMetrics.clientSatisfaction}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Retention Rate</span>
                    <span className="font-medium">
                      {retentionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${retentionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.clientRetention.retained}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Clients Retained
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {analyticsData.clientRetention.churned}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Clients Lost
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Goals & Recommendations</CardTitle>
            <CardDescription>
              Insights to help grow your agency business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Growth Target</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Add 2 more clients to reach $300/month commission
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Upsell Opportunity</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  2 clients on Basic plan could be upgraded to Professional
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium">Client Focus</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Restaurant clients show highest satisfaction rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
