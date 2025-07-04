import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  Settings,
  BarChart3,
  UserPlus,
  CreditCard,
  EyeOff,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
}

interface RevenueStats {
  monthlyRevenue: number;
  projectedRevenue: number;
  averageClientValue: number;
  commissionRate: number;
}

export default function AgencyAdmin() {
  const [hideMetrics, setHideMetrics] = useState(true); // Default: metrics hidden
  const [clientStats, setClientStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    pendingClients: 0,
  });

  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    monthlyRevenue: 0,
    projectedRevenue: 0,
    averageClientValue: 0,
    commissionRate: 15, // 15% commission
  });

  const [recentClients, setRecentClients] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [agencyPlan, setAgencyPlan] = useState({
    name: "Professional",
    maxUsers: 10,
    currentUsers: 3,
    pricePerUser: 49,
  });

  useEffect(() => {
    // Load agency-specific stats from localStorage or API
    const agencyData = JSON.parse(localStorage.getItem("agency_data") || "{}");
    const clients = JSON.parse(localStorage.getItem("agency_clients") || "[]");

    // Calculate stats
    const active = clients.filter((c: any) => c.status === "active").length;
    const inactive = clients.filter((c: any) => c.status === "inactive").length;
    const pending = clients.filter((c: any) => c.status === "pending").length;

    setClientStats({
      totalClients: clients.length,
      activeClients: active,
      inactiveClients: inactive,
      pendingClients: pending,
    });

    // Calculate revenue stats
    const totalRevenue = clients.reduce((sum: number, client: any) => {
      if (client.status === "active") {
        return sum + (client.monthlyPlan || 99); // Default $99/month
      }
      return sum;
    }, 0);

    setRevenueStats({
      monthlyRevenue: totalRevenue * 0.15, // 15% commission
      projectedRevenue: totalRevenue * 0.15 * 12,
      averageClientValue:
        clients.length > 0 ? totalRevenue / clients.length : 0,
      commissionRate: 15,
    });

    // Set recent clients (last 5)
    setRecentClients(clients.slice(-5).reverse());
  }, []);

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agency Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your clients and admin users
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
            <Link to="/agency-admin/admin-users/add">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Admin User
              </Button>
            </Link>
            <Link to="/agency-admin/settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Conditionally visible */}
        {!hideMetrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientStats.totalClients}
                </div>
                <p className="text-xs text-muted-foreground">
                  {clientStats.activeClients} active,{" "}
                  {clientStats.pendingClients} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Admin Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agencyPlan.currentUsers}/{agencyPlan.maxUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {agencyPlan.maxUsers - agencyPlan.currentUsers} remaining
                  slots
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Cost
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(agencyPlan.currentUsers * agencyPlan.pricePerUser).toFixed(
                    0,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${agencyPlan.pricePerUser}/user per month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Plan Status
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agencyPlan.name}</div>
                <p className="text-xs text-muted-foreground">
                  Up to {agencyPlan.maxUsers} admin users
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Management
              </CardTitle>
              <CardDescription>
                View and manage all your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/agency-admin/clients">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View All Clients
                  </Button>
                </Link>
                <Link to="/agency-admin/clients/add">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Client
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Track your agency's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/agency-admin/analytics">
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/agency-admin/reports">
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Generate Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Payments
              </CardTitle>
              <CardDescription>
                Manage billing and commission payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/agency-admin/billing">
                  <Button variant="outline" className="w-full gap-2">
                    <DollarSign className="h-4 w-4" />
                    View Billing
                  </Button>
                </Link>
                <Link to="/agency-admin/commission">
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Commission Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>
              Your latest client additions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client: any, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.businessName || `Client ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.email || "No email"} • Added{" "}
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          client.status === "active" ? "default" : "secondary"
                        }
                      >
                        {client.status || "pending"}
                      </Badge>
                      <Link to={`/agency-admin/clients/${client.id || index}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No clients added yet</p>
                <Link to="/agency-admin/clients/add">
                  <Button className="mt-2 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Client
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
