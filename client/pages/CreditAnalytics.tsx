import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { TrendingUp, DollarSign, Activity, Calendar } from "lucide-react";
import { useCredits } from "@/components/CreditProvider";
import { formatCredits } from "@/lib/creditSystem";

export default function CreditAnalytics() {
  const { balance, transactions } = useCredits();

  // Calculate basic analytics
  const totalSpent = transactions
    .filter(t => t.type === 'scan')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPurchased = transactions
    .filter(t => t.type === 'purchase' || t.type === 'bonus')
    .reduce((sum, t) => sum + t.amount, 0);

  const scanCount = transactions.filter(t => t.type === 'scan').length;

  const averagePerScan = scanCount > 0 ? totalSpent / scanCount : 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Credit Analytics</h1>
          </div>
          <p className="text-gray-600">
            Analyze your credit usage patterns and scan performance.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCredits(balance.remaining)}</div>
              <p className="text-xs text-muted-foreground">
                of {formatCredits(balance.total)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCredits(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {scanCount} scans completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Scan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCredits(Math.round(averagePerScan))}</div>
              <p className="text-xs text-muted-foreground">
                credits per scan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCredits(totalPurchased)}</div>
              <p className="text-xs text-muted-foreground">
                all-time purchases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usage Rate</span>
                <span className="text-sm text-gray-600">
                  {((balance.used / balance.total) * 100).toFixed(1)}% of total credits used
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                ></div>
              </div>

              {scanCount > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="text-sm text-gray-600">
                    <p>• {scanCount} total scans completed</p>
                    <p>• {formatCredits(totalSpent)} credits used for scanning</p>
                    <p>• Average scan cost: {formatCredits(Math.round(averagePerScan))} credits</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
