import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import {
  Shield,
  Users,
  Activity,
  Database,
  Settings,
  Eye,
  BarChart3,
  Server,
  Key,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Mock admin data
  const adminStats = {
    totalUsers: 45,
    activeProjects: 234,
    totalPhotos: 1567,
    storageUsed: "2.4 GB",
    monthlyUploads: 89,
    systemHealth: "Excellent",
  };

  const recentActivity = [
    { user: "John Smith", action: "Created project", time: "2 minutes ago" },
    {
      user: "Sarah Johnson",
      action: "Uploaded 5 photos",
      time: "15 minutes ago",
    },
    {
      user: "Mike Wilson",
      action: "Requested Google review",
      time: "1 hour ago",
    },
    {
      user: "Lisa Brown",
      action: "Updated project details",
      time: "2 hours ago",
    },
  ];

  const systemUsers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@smithconstruction.com",
      role: "Admin",
      status: "Active",
      lastLogin: "Today",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@renovations.com",
      role: "Editor",
      status: "Active",
      lastLogin: "Yesterday",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@contractingpro.com",
      role: "Viewer",
      status: "Inactive",
      lastLogin: "1 week ago",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple demo authentication
    if (
      credentials.username === "superadmin" &&
      credentials.password === "admin123"
    ) {
      setIsAuthenticated(true);
      toast.success("Super Admin access granted!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>Super Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your super admin credentials to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="superadmin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Super Admin
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
              <strong>Demo Credentials:</strong>
              <br />
              Username: superadmin
              <br />
              Password: admin123
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              System management and monitoring
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{adminStats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">
                    {adminStats.activeProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{adminStats.storageUsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold text-green-600">
                    {adminStats.systemHealth}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {user.lastLogin}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.role === "Admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Users
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Activity Log
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Controls */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="gap-2">
                <Database className="h-4 w-4" />
                Backup Database
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                System Settings
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
