import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Crown,
  Gift,
  CreditCard,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Calendar,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SuperAdminFinancial() {
  const [timeFrame, setTimeFrame] = useState("30d");
  const [hideMetrics, setHideMetrics] = useState(true);

  // Mock financial data based on time frame
  const financialData = {
    "1d": {
      totalRevenue: 4567,
      paidUsers: 1247,
      freeUsers: 423,
      newThisMonth: 89,
      churnRate: 2.1,
      avgRevenuePerUser: 67,
      planBreakdown: {
        basic: { count: 456, revenue: 22800 },
        professional: { count: 567, revenue: 42525 },
        premium: { count: 224, revenue: 44800 },
      },
    },
    "7d": {
      totalRevenue: 32890,
      paidUsers: 1247,
      freeUsers: 423,
      newThisMonth: 156,
      churnRate: 1.8,
      avgRevenuePerUser: 89,
      planBreakdown: {
        basic: { count: 456, revenue: 22800 },
        professional: { count: 567, revenue: 42525 },
        premium: { count: 224, revenue: 44800 },
      },
    },
    "30d": {
      totalRevenue: 142450,
      paidUsers: 1247,
      freeUsers: 423,
      newThisMonth: 234,
      churnRate: 1.5,
      avgRevenuePerUser: 114,
      planBreakdown: {
        basic: { count: 456, revenue: 22800 },
        professional: { count: 567, revenue: 42525 },
        premium: { count: 224, revenue: 44800 },
      },
    },
    "60d": {
      totalRevenue: 298670,
      paidUsers: 1524,
      freeUsers: 512,
      newThisMonth: 387,
      churnRate: 1.2,
      avgRevenuePerUser: 196,
      planBreakdown: {
        basic: { count: 567, revenue: 28350 },
        professional: { count: 689, revenue: 51675 },
        premium: { count: 268, revenue: 53600 },
      },
    },
    "90d": {
      totalRevenue: 456890,
      paidUsers: 1847,
      freeUsers: 634,
      newThisMonth: 498,
      churnRate: 0.9,
      avgRevenuePerUser: 247,
      planBreakdown: {
        basic: { count: 678, revenue: 33900 },
        professional: { count: 812, revenue: 60900 },
        premium: { count: 357, revenue: 71400 },
      },
    },
    "180d": {
      totalRevenue: 892340,
      paidUsers: 2156,
      freeUsers: 743,
      newThisMonth: 612,
      churnRate: 0.7,
      avgRevenuePerUser: 414,
      planBreakdown: {
        basic: { count: 789, revenue: 39450 },
        professional: { count: 934, revenue: 70050 },
        premium: { count: 433, revenue: 86600 },
      },
    },
    "365d": {
      totalRevenue: 1756890,
      paidUsers: 2847,
      freeUsers: 892,
      newThisMonth: 845,
      churnRate: 0.5,
      avgRevenuePerUser: 617,
      planBreakdown: {
        basic: { count: 1024, revenue: 51200 },
        professional: { count: 1156, revenue: 86700 },
        premium: { count: 667, revenue: 133400 },
      },
    },
  };

  const currentData =
    financialData[timeFrame as keyof typeof financialData] ||
    financialData["30d"];

  // Revenue trend data for charts
  const revenueTrends = [
    { period: "6 months ago", revenue: 98000, growth: "+12%" },
    { period: "5 months ago", revenue: 112000, growth: "+14%" },
    { period: "4 months ago", revenue: 128000, growth: "+14%" },
    { period: "3 months ago", revenue: 145000, growth: "+13%" },
    { period: "2 months ago", revenue: 162000, growth: "+12%" },
    { period: "Last month", revenue: 178000, growth: "+10%" },
    { period: "This month", revenue: 198000, growth: "+11%" },
  ];

  const planColors = {
    basic: "bg-blue-500",
    professional: "bg-green-500",
    premium: "bg-purple-500",
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor revenue, subscriptions, and financial metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="60d">Last 60 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="180d">Last 180 Days</SelectItem>
                <SelectItem value="365d">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/super-admin">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHideMetrics(!hideMetrics)}
              className="ml-2"
            >
              {hideMetrics ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics
                  ? "***"
                  : `$${currentData.totalRevenue.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12.5% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : currentData.paidUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +8.1% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Users</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : currentData.freeUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +5.2% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ARPU</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : `$${currentData.avgRevenuePerUser}`}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +3.2% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Growth Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics
                  ? "***"
                  : currentData.newThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                New paying customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : `${currentData.churnRate}%`}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                -0.3% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : "3.2%"}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +0.4% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Growth
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideMetrics ? "***" : "+14.2%"}
              </div>
              <p className="text-xs text-muted-foreground">Revenue growth</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Views */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly recurring revenue over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(revenueTrends || []).map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-sm font-medium truncate">
                        {data.period}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2 relative min-w-[100px]">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max((data.revenue / 200000) * 100, 10)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ${hideMetrics ? "***" : data.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        {data.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <p className="text-sm text-muted-foreground">
                Revenue and user breakdown by subscription plan
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentData?.planBreakdown || {}).map(
                  ([plan, data], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            planColors[plan as keyof typeof planColors] ||
                            "bg-gray-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium capitalize">{plan}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.count} users
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${hideMetrics ? "***" : data.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${Math.round(data.revenue / data.count)}/user
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Reports</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate detailed financial reports and analytics
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analyze user behavior and subscription patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  User Cohorts
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Crown className="h-4 w-4" />
                  Subscription Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Insights</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track growth metrics and performance indicators
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Revenue Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  User Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
