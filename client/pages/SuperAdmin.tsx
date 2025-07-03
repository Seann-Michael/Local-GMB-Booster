import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Shield,
  Users,
  Activity,
  Database,
  Building2,
  BarChart3,
  Server,
  TrendingUp,
  TrendingDown,
  Camera,
  Video,
  FolderOpen,
  DollarSign,
  UserPlus,
  UserMinus,
  Crown,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface Business {
  id: string;
  name: string;
  admin: string;
  email: string;
  users: number;
  photos: number;
  videos: number;
  projects: number;
  storage: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "Active" | "Trial" | "Suspended" | "Canceled";
  lastActivity: string;
  signupDate: string;
  canceledDate?: string;
  revenue: number;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  business: string;
  lastLogin: string;
  totalLogins: number;
  photosUploaded: number;
  videosUploaded: number;
  projectsCreated: number;
  storageUsed: string;
  accountAge: string;
  activityLevel: "High" | "Medium" | "Low";
}

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
    <div className="min-h-screen bg-background">
      {/* Super Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <span className="text-xl font-semibold">Super Admin Portal</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.isImpersonated && (
              <Button
                variant="outline"
                onClick={returnToSuperAdmin}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Return to Super Admin
              </Button>
            )}

            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Local GMB Booster Analytics
            </h1>
            <p className="text-muted-foreground">
              System analytics, user management, and business intelligence
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/super-admin/users")}
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">
                    {systemStats.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm mt-1">
                    {trends.users.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        trends.users.isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {trends.users.value}%
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Businesses
                  </p>
                  <p className="text-2xl font-bold">
                    {systemStats.totalBusinesses}
                  </p>
                  <div className="flex items-center text-sm mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">8.3%</span>
                  </div>
                </div>
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${systemStats.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm mt-1">
                    {trends.revenue.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        trends.revenue.isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {trends.revenue.value}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold">
                    {systemStats.systemHealth}%
                  </p>
                  <div className="flex items-center text-sm mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">Excellent</span>
                  </div>
                </div>
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analytics Row */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
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
        <div className="grid gap-6 md:grid-cols-3 mb-6">
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
                <BarChart3 className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Photos</span>
                <span className="text-sm font-medium">
                  {systemStats.totalPhotos.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Videos</span>
                <span className="text-sm font-medium">
                  {systemStats.totalVideos.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Projects</span>
                <span className="text-sm font-medium">
                  {systemStats.totalProjects.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">
                  {systemStats.totalStorage}
                </span>
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
                <span className="text-sm">Active Users</span>
                <span className="text-sm font-medium">
                  {systemStats.activeUsers}
                </span>
              </div>
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
                <span className="text-sm">Canceled Today</span>
                <span className="text-sm font-medium text-red-600">
                  -{systemStats.canceledToday}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Business Management</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.map((business) => (
                  <TableRow
                    key={business.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate(`/super-admin/business/${business.id}`)
                    }
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{business.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {business.admin}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {business.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          business.status === "Active"
                            ? "default"
                            : business.status === "Trial"
                              ? "secondary"
                              : business.status === "Suspended"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {business.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          business.plan === "Enterprise"
                            ? "default"
                            : business.plan === "Pro"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {business.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{business.users}</div>
                        <div className="text-xs text-muted-foreground">
                          users
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Camera className="h-3 w-3" />
                          {business.photos}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Video className="h-3 w-3" />
                          {business.videos}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <FolderOpen className="h-3 w-3" />
                          {business.projects}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{business.storage}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${business.revenue}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(business.signupDate).toLocaleDateString()}
                      </div>
                      {business.canceledDate && (
                        <div className="text-xs text-red-600">
                          Canceled:{" "}
                          {new Date(business.canceledDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{business.lastActivity}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => impersonateUser(business.id)}
                          className="gap-1"
                        >
                          <LogIn className="h-3 w-3" />
                          Sign In As
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/super-admin/business/${business.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
