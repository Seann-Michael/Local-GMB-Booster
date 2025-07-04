import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  BarChart3,
  Users,
  Building2,
  Activity,
  Database,
  DollarSign,
  Camera,
  Video,
  FolderOpen,
  MessageSquare,
  Webhook,
  Phone,
  TrendingUp,
  TrendingDown,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuperAdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function SuperAdminLayout({
  children,
  title,
  breadcrumbs,
}: SuperAdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeFrame, setTimeFrame] = useState("30d");

  // Enhanced usage statistics with new metrics
  const usageStats = {
    "7d": {
      totalUsers: 1247,
      totalBusinesses: 89,
      totalPhotos: 45623,
      totalVideos: 3456,
      totalProjects: 2890,
      totalReviews: 1456,
      totalApiCalls: 234567,
      totalWebhooks: 8932,
      revenue: 89240,
    },
    "30d": {
      totalUsers: 1247,
      totalBusinesses: 89,
      totalPhotos: 45623,
      totalVideos: 3456,
      totalProjects: 2890,
      totalReviews: 5234,
      totalApiCalls: 987654,
      totalWebhooks: 34521,
      revenue: 89240,
    },
    "90d": {
      totalUsers: 1247,
      totalBusinesses: 89,
      totalPhotos: 45623,
      totalVideos: 3456,
      totalProjects: 2890,
      totalReviews: 12890,
      totalApiCalls: 2456789,
      totalWebhooks: 89654,
      revenue: 267720,
    },
  };

  const currentStats =
    usageStats[timeFrame as keyof typeof usageStats] || usageStats["30d"];

  const sidebarItems = [
    {
      label: "Dashboard",
      href: "/super-admin",
      icon: BarChart3,
      active: location.pathname === "/super-admin",
    },
    {
      label: "User Management",
      href: "/super-admin/users",
      icon: Users,
      active: location.pathname === "/super-admin/users",
    },
    {
      label: "Business Management",
      href: "/super-admin/businesses",
      icon: Building2,
      active: location.pathname === "/super-admin/businesses",
    },
    {
      label: "Agency Management",
      href: "/super-admin/agencies",
      icon: Shield,
      active: location.pathname.startsWith("/super-admin/agencies"),
    },
  ];

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("superadmin_session");
    toast.success("Signed out successfully");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
                  <Shield className="h-4 w-4 text-destructive-foreground" />
                </div>
                <span className="font-semibold text-sm">Super Admin</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    sidebarCollapsed && "px-2",
                  )}
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start gap-2",
              sidebarCollapsed && "px-2",
            )}
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/super-admin">
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Time Frame Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Frame:</span>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Usage Statistics - Only show on dashboard */}
        {location.pathname === "/super-admin" && (
          <div className="p-6 border-b">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Users
                      </p>
                      <p className="text-lg font-bold">
                        {currentStats?.totalUsers?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Businesses
                      </p>
                      <p className="text-lg font-bold">
                        {currentStats?.totalBusinesses || "0"}
                      </p>
                    </div>
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Photos</p>
                      <p className="text-lg font-bold">
                        {currentStats?.totalPhotos?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Videos</p>
                      <p className="text-lg font-bold">
                        {currentStats.totalVideos.toLocaleString()}
                      </p>
                    </div>
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                      <p className="text-lg font-bold">
                        {currentStats.totalReviews.toLocaleString()}
                      </p>
                    </div>
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">API Calls</p>
                      <p className="text-lg font-bold">
                        {currentStats.totalApiCalls.toLocaleString()}
                      </p>
                    </div>
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Webhooks</p>
                      <p className="text-lg font-bold">
                        {currentStats.totalWebhooks.toLocaleString()}
                      </p>
                    </div>
                    <Webhook className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold">
                        ${currentStats.revenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
