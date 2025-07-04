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
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  UserPlus,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  Users,
  DollarSign,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Agency {
  id: string;
  agencyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending" | "suspended";
  plan: string;
  maxUsers: number;
  currentUsers: number;
  businessCount: number;
  signupDate: string;
  lastLogin: string;
  monthlyRevenue: number;
  address: string;
}

export default function SuperAdminAgencyManagement() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    // Load agencies from localStorage
    const savedAgencies = JSON.parse(
      localStorage.getItem("super_admin_agencies") || "[]",
    );

    // If no agencies exist, create sample data
    if (savedAgencies.length === 0) {
      const sampleAgencies: Agency[] = [
        {
          id: "1",
          agencyName: "Digital Marketing Pro",
          contactName: "Jane Smith",
          email: "jane@digitalmarketingpro.com",
          phone: "(555) 123-4567",
          status: "active",
          plan: "Professional",
          maxUsers: 15,
          currentUsers: 8,
          businessCount: 12,
          signupDate: "2024-01-10",
          lastLogin: "2024-03-12",
          monthlyRevenue: 392, // 8 users * $49
          address: "123 Marketing St, San Francisco, CA",
        },
        {
          id: "2",
          agencyName: "Growth Partners LLC",
          contactName: "Mike Johnson",
          email: "mike@growthpartners.com",
          phone: "(555) 987-6543",
          status: "active",
          plan: "Enterprise",
          maxUsers: 50,
          currentUsers: 25,
          businessCount: 45,
          signupDate: "2023-11-15",
          lastLogin: "2024-03-11",
          monthlyRevenue: 975, // 25 users * $39 (enterprise rate)
          address: "456 Business Ave, New York, NY",
        },
        {
          id: "3",
          agencyName: "Local SEO Experts",
          contactName: "Sarah Wilson",
          email: "sarah@localseoexperts.com",
          phone: "(555) 456-7890",
          status: "pending",
          plan: "Starter",
          maxUsers: 5,
          currentUsers: 2,
          businessCount: 3,
          signupDate: "2024-03-01",
          lastLogin: "2024-03-01",
          monthlyRevenue: 78, // 2 users * $39
          address: "789 SEO Blvd, Austin, TX",
        },
      ];

      localStorage.setItem(
        "super_admin_agencies",
        JSON.stringify(sampleAgencies),
      );
      setAgencies(sampleAgencies);
      setFilteredAgencies(sampleAgencies);
    } else {
      setAgencies(savedAgencies);
      setFilteredAgencies(savedAgencies);
    }
  }, []);

  useEffect(() => {
    let filtered = agencies.filter((agency) => {
      const matchesSearch =
        searchQuery === "" ||
        agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || agency.status === statusFilter;

      const matchesPlan = planFilter === "all" || agency.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });

    setFilteredAgencies(filtered);
  }, [searchQuery, statusFilter, planFilter, agencies]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      pending: { variant: "outline" as const, label: "Pending" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getTotalStats = () => {
    const activeAgencies = agencies.filter((a) => a.status === "active").length;
    const totalRevenue = agencies.reduce((sum, agency) => {
      return sum + (agency.status === "active" ? agency.monthlyRevenue : 0);
    }, 0);
    const totalBusinesses = agencies.reduce((sum, agency) => {
      return sum + agency.businessCount;
    }, 0);
    const totalUsers = agencies.reduce((sum, agency) => {
      return sum + agency.currentUsers;
    }, 0);

    return { activeAgencies, totalRevenue, totalBusinesses, totalUsers };
  };

  const stats = getTotalStats();

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Agency Management</h1>
            <p className="text-muted-foreground">
              Manage marketing agencies and their subscription plans
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link to="/super-admin/agencies/add">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Agency
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agencies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAgencies}</div>
              <p className="text-xs text-muted-foreground">
                {agencies.length} total agencies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From agency subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Businesses
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                Managed by agencies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total agency admin users
              </p>
            </CardContent>
          </Card>
        </div>

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
                    placeholder="Search agencies..."
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
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agencies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Agencies ({filteredAgencies.length})</CardTitle>
            <CardDescription>
              All marketing agencies and their subscription details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Businesses</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{agency.agencyName}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {agency.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {agency.contactName}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {agency.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {agency.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(agency.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{agency.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {agency.currentUsers}/{agency.maxUsers}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {agency.maxUsers - agency.currentUsers} available
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {agency.businessCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${agency.monthlyRevenue}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /month
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(agency.lastLogin).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/super-admin/agencies/${agency.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/super-admin/agencies/${agency.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Agency
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Login as Agency
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Suspend Agency
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAgencies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No agencies found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
