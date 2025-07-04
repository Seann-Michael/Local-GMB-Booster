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
  const [hideMetrics, setHideMetrics] = useState(true); // Default: metrics hidden

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
      totalRevenue: 31289,
      paidUsers: 1289,
      freeUsers: 445,
      newThisMonth: 267,
      churnRate: 1.8,
      avgRevenuePerUser: 69,
      planBreakdown: {
        basic: { count: 467, revenue: 23350 },
        professional: { count: 587, revenue: 44025 },
        premium: { count: 235, revenue: 47000 },
      },
    },
    "30d": {
      totalRevenue: 134567,
      paidUsers: 1456,
      freeUsers: 523,
      newThisMonth: 289,
      churnRate: 1.5,
      avgRevenuePerUser: 72,
      planBreakdown: {
        basic: { count: 523, revenue: 26150 },
        professional: { count: 678, revenue: 50850 },
        premium: { count: 255, revenue: 51000 },
      },
    },
    "60d": {
      totalRevenue: 267890,
      paidUsers: 1623,
      freeUsers: 567,
      newThisMonth: 434,
      churnRate: 1.3,
      avgRevenuePerUser: 74,
      planBreakdown: {
        basic: { count: 589, revenue: 29450 },
        professional: { count: 734, revenue: 55050 },
        premium: { count: 300, revenue: 60000 },
      },
    },
    "90d": {
      totalRevenue: 398765,
      paidUsers: 1789,
      freeUsers: 612,
      newThisMonth: 567,
      churnRate: 1.2,
      avgRevenuePerUser: 76,
      planBreakdown: {
        basic: { count: 645, revenue: 32250 },
        professional: { count: 823, revenue: 61725 },
        premium: { count: 321, revenue: 64200 },
      },
    },
    "180d": {
      totalRevenue: 756432,
      paidUsers: 2156,
      freeUsers: 723,
      newThisMonth: 789,
      churnRate: 1.0,
      avgRevenuePerUser: 78,
      planBreakdown: {
        basic: { count: 778, revenue: 38900 },
        professional: { count: 989, revenue: 74175 },
        premium: { count: 389, revenue: 77800 },
      },
    },
    "365d": {
      totalRevenue: 1423567,
      paidUsers: 2847,
      freeUsers: 934,
      newThisMonth: 1234,
      churnRate: 0.8,
      avgRevenuePerUser: 82,
      planBreakdown: {
        basic: { count: 1023, revenue: 51150 },
        professional: { count: 1345, revenue: 100875 },
        premium: { count: 479, revenue: 95800 },
      },
    },
  };

  const currentData = financialData[timeFrame as keyof typeof financialData];

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
              Revenue metrics and financial KPIs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setHideMetrics(!hideMetrics)}
              className="gap-2"
            >
              {hideMetrics ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {hideMetrics ? "Show Metrics" : "Hide Metrics"}
            </Button>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
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
                Analytics Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Financial Metrics - Conditionally visible */}
        {!hideMetrics && (
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
                  ${currentData.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                  +18% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paid Users
                </CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.paidUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                  +12% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Free Users
                </CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.freeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-blue-500" />
                  +8% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Revenue Per User
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${currentData.avgRevenuePerUser}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                  +5.2% from last period
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Financial Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentData.newThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                New paid subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.churnRate}%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDown className="h-3 w-3 mr-1 text-green-500" />
                -0.3% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (currentData.paidUsers /
                    (currentData.paidUsers + currentData.freeUsers)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Free to paid conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Trends</CardTitle>
              <CardDescription>
                Monthly recurring revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueTrends.map((data, index) => (
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-16 text-right">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </span>
                      <span className="text-xs text-green-600 w-10">
                        {data.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>
                Revenue and user breakdown by subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentData.planBreakdown).map(
                  ([plan, data], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            planColors[plan as keyof typeof planColors]
                          }`}
                        />
                        <div>
                          <p className="font-medium capitalize">{plan} Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {data.count} users
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${data.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${(data.revenue / data.count).toFixed(0)}/user
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Plan Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Revenue</span>
                  <span>${currentData.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                  <span>Total Paid Users</span>
                  <span>{currentData.paidUsers.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Management Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plan Management
              </CardTitle>
              <CardDescription>
                Manage subscription plans and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/super-admin/plans">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View All Plans
                  </Button>
                </Link>
                <Link to="/super-admin/plans/pricing">
                  <Button className="w-full gap-2">
                    <DollarSign className="h-4 w-4" />
                    Manage Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Promo Codes
              </CardTitle>
              <CardDescription>
                Create and manage promotional offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/super-admin/promo-codes">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View Promo Codes
                  </Button>
                </Link>
                <Link to="/super-admin/promo-codes/create">
                  <Button className="w-full gap-2">
                    <Gift className="h-4 w-4" />
                    Create Promo Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Reports
              </CardTitle>
              <CardDescription>
                Generate detailed financial reports
              </CardDescription>
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
