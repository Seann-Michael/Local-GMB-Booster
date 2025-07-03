import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Users,
  Activity,
  Server,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserMinus,
  Crown,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function SuperAdmin() {
  // Mock data for comprehensive analytics
  const systemStats = {
    systemHealth: 98.5,
    apiHealth: 99.2,
    serverLoad: 67,
    newSignupsToday: 12,
    newSignupsWeek: 67,
    newSignupsMonth: 289,
    canceledToday: 2,
    canceledWeek: 8,
    canceledMonth: 23,
    freeTrials: 23,
    paidUsers: 66,
    avgLifetime: "14.5 months",
  };

  const trends = {
    users: { value: 12.5, isPositive: true },
    revenue: { value: 8.3, isPositive: true },
    cancellations: { value: 15.2, isPositive: false },
    newSignups: { value: 23.1, isPositive: true },
  };

  return (
    <SuperAdminLayout title="Local GMB Booster Analytics" breadcrumbs={[]}>
      <div className="space-y-6">
        {/* Financial Analytics Row */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Crown className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-lg font-bold">{systemStats.paidUsers}</div>
                <div className="text-sm text-muted-foreground">Paid Users</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold">
                  {systemStats.freeTrials}
                </div>
                <div className="text-sm text-muted-foreground">Free Trials</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <UserPlus className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold">
                  {systemStats.newSignupsMonth}
                </div>
                <div className="text-sm text-muted-foreground">
                  New This Month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <UserMinus className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-lg font-bold">
                  {systemStats.canceledMonth}
                </div>
                <div className="text-sm text-muted-foreground">
                  Canceled This Month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health Dashboard */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Health</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {systemStats.apiHealth}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Load</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${systemStats.serverLoad}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {systemStats.serverLoad}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                User Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. User Lifetime</span>
                <span className="text-sm font-medium">
                  {systemStats.avgLifetime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Today</span>
                <span className="text-sm font-medium text-green-600">
                  +{systemStats.newSignupsToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New This Week</span>
                <span className="text-sm font-medium text-green-600">
                  +{systemStats.newSignupsWeek}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Canceled Today</span>
                <span className="text-sm font-medium text-red-600">
                  -{systemStats.canceledToday}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">User Growth</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends.users.value}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue Growth</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends.revenue.value}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Signups</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends.newSignups.value}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancellations</span>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    +{trends.cancellations.value}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
