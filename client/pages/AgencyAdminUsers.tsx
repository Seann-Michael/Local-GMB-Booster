import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserPlus,
  Download,
  Mail,
  Phone,
  Users,
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  assignedBusinesses: string[];
}

export default function AgencyAdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [agencyPlan, setAgencyPlan] = useState({
    name: "Professional",
    maxUsers: 15,
    currentUsers: 0,
    pricePerUser: 49,
  });

  useEffect(() => {
    // Load admin users from localStorage
    const savedUsers = JSON.parse(
      localStorage.getItem("agency_admin_users") || "[]",
    );

    // If no users exist, create sample data
    if (savedUsers.length === 0) {
      const sampleUsers: AdminUser[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john@digitalmarketingpro.com",
          phone: "(555) 123-4567",
          role: "admin",
          status: "active",
          lastLogin: "2024-03-12",
          createdDate: "2024-01-15",
          permissions: ["all"],
          assignedBusinesses: ["1", "2", "3"],
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@digitalmarketingpro.com",
          phone: "(555) 987-6543",
          role: "editor",
          status: "active",
          lastLogin: "2024-03-11",
          createdDate: "2024-02-01",
          permissions: ["edit_projects", "view_analytics"],
          assignedBusinesses: ["1", "2"],
        },
        {
          id: "3",
          name: "Mike Wilson",
          email: "mike@digitalmarketingpro.com",
          phone: "(555) 456-7890",
          role: "viewer",
          status: "pending",
          lastLogin: "2024-03-01",
          createdDate: "2024-03-01",
          permissions: ["view_projects"],
          assignedBusinesses: ["3"],
        },
      ];

      localStorage.setItem("agency_admin_users", JSON.stringify(sampleUsers));
      setAdminUsers(sampleUsers);
      setFilteredUsers(sampleUsers);

      // Update agency plan current users
      setAgencyPlan((prev) => ({ ...prev, currentUsers: sampleUsers.length }));
    } else {
      setAdminUsers(savedUsers);
      setFilteredUsers(savedUsers);
      setAgencyPlan((prev) => ({ ...prev, currentUsers: savedUsers.length }));
    }
  }, []);

  useEffect(() => {
    let filtered = adminUsers.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, roleFilter, adminUsers]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      inactive: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: AlertCircle,
      },
      pending: { variant: "outline" as const, label: "Pending", icon: Clock },
      suspended: {
        variant: "destructive" as const,
        label: "Suspended",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "default" as const, label: "Admin" },
      editor: { variant: "secondary" as const, label: "Editor" },
      viewer: { variant: "outline" as const, label: "Viewer" },
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateMonthlyCost = () => {
    const baseUsers = Math.min(agencyPlan.currentUsers, 5);
    const additionalUsers = Math.max(agencyPlan.currentUsers - 5, 0);

    // Tiered pricing: first 5 users at full price, additional users at 80%
    const baseTotal = baseUsers * agencyPlan.pricePerUser;
    const additionalTotal = additionalUsers * agencyPlan.pricePerUser * 0.8;

    return baseTotal + additionalTotal;
  };

  const canAddMoreUsers = agencyPlan.currentUsers < agencyPlan.maxUsers;

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Users</h1>
            <p className="text-muted-foreground">
              Manage admin users and their permissions within your agency
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/agency-admin/admin-users/add">
              <Button className="gap-2" disabled={!canAddMoreUsers}>
                <UserPlus className="h-4 w-4" />
                Add Admin User
              </Button>
            </Link>
          </div>
        </div>

        {/* Plan Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Usage & Billing</CardTitle>
            <CardDescription>
              Current usage of your {agencyPlan.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Users Used</span>
                  <span className="font-medium">
                    {agencyPlan.currentUsers}/{agencyPlan.maxUsers}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(agencyPlan.currentUsers / agencyPlan.maxUsers) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {agencyPlan.maxUsers - agencyPlan.currentUsers} slots
                  remaining
                </p>
              </div>

              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  ${calculateMonthlyCost().toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Monthly Cost
                </div>
              </div>

              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  ${agencyPlan.pricePerUser}
                </div>
                <div className="text-xs text-muted-foreground">Per User</div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {agencyPlan.currentUsers > 5 ? "20%" : "0%"}
                </div>
                <div className="text-xs text-green-700">Volume Discount</div>
              </div>
            </div>

            {agencyPlan.currentUsers > 5 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  🎉 Volume discount active! Users 6+ are 20% off ($
                  {(agencyPlan.pricePerUser * 0.8).toFixed(0)}/month each)
                </p>
              </div>
            )}

            {!canAddMoreUsers && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ You've reached your plan limit. Upgrade to add more admin
                  users.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search admin users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              All admin users in your agency with their roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Businesses</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {user.assignedBusinesses.length}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.createdDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/agency-admin/admin-users/${user.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/agency-admin/admin-users/${user.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Login as User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Smartphone className="mr-2 h-4 w-4" />
                              Send Mobile App Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No admin users found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Permissions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Understanding what each role can do in your agency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Admin</h4>
                  <Badge variant="default">Full Access</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manage all businesses</li>
                  <li>• Add/edit admin users</li>
                  <li>• View all analytics</li>
                  <li>• Billing management</li>
                  <li>• Agency settings</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Editor</h4>
                  <Badge variant="secondary">Limited Access</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Edit assigned businesses</li>
                  <li>• Manage projects</li>
                  <li>• View business analytics</li>
                  <li>• Cannot manage users</li>
                  <li>• Cannot access billing</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium">Viewer</h4>
                  <Badge variant="outline">Read Only</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View assigned businesses</li>
                  <li>• Read project details</li>
                  <li>• Basic analytics access</li>
                  <li>• Cannot edit anything</li>
                  <li>• Cannot manage users</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
