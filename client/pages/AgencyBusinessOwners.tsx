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
import { AgencyLayout } from "@/components/AgencyLayout";
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
  Building2,
  Calendar,
  ExternalLink,
  User,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface BusinessOwner {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending" | "suspended";
  plan: string;
  signupDate: string;
  lastLogin: string;
  projects: number;
  adminUsers: number;
  address: string;
}

export default function AgencyBusinessOwners() {
  const [businesses, setBusinesses] = useState<BusinessOwner[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessOwner[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    // Load agency businesses from localStorage
    const agencyBusinesses = JSON.parse(
      localStorage.getItem("agency_businesses") || "[]",
    );

    // If no businesses exist, create some sample data
    if (agencyBusinesses.length === 0) {
      const sampleBusinesses: BusinessOwner[] = [
        {
          id: "1",
          businessName: "Joe's Pizza",
          ownerName: "Joe Smith",
          email: "joe@joespizza.com",
          phone: "(555) 123-4567",
          status: "active",
          plan: "Professional",
          signupDate: "2024-01-15",
          lastLogin: "2024-03-10",
          projects: 8,
          adminUsers: 2,
          address: "123 Main St, New York, NY",
        },
        {
          id: "2",
          businessName: "Sarah's Salon",
          ownerName: "Sarah Johnson",
          email: "sarah@sarahssalon.com",
          phone: "(555) 987-6543",
          status: "active",
          plan: "Premium",
          signupDate: "2024-02-01",
          lastLogin: "2024-03-12",
          projects: 12,
          adminUsers: 3,
          address: "456 Beauty Ave, Los Angeles, CA",
        },
        {
          id: "3",
          businessName: "Mike's Auto Repair",
          ownerName: "Mike Wilson",
          email: "mike@mikesauto.com",
          phone: "(555) 456-7890",
          status: "pending",
          plan: "Basic",
          signupDate: "2024-03-05",
          lastLogin: "2024-03-05",
          projects: 0,
          adminUsers: 1,
          address: "789 Repair Rd, Chicago, IL",
        },
      ];

      localStorage.setItem(
        "agency_businesses",
        JSON.stringify(sampleBusinesses),
      );
      setBusinesses(sampleBusinesses);
      setFilteredBusinesses(sampleBusinesses);
    } else {
      setBusinesses(agencyBusinesses);
      setFilteredBusinesses(agencyBusinesses);
    }
  }, []);

  useEffect(() => {
    let filtered = businesses.filter((business) => {
      const matchesSearch =
        searchQuery === "" ||
        business.businessName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        business.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || business.status === statusFilter;

      const matchesPlan = planFilter === "all" || business.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });

    setFilteredBusinesses(filtered);
  }, [searchQuery, statusFilter, planFilter, businesses]);

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

  const impersonateUser = (business: BusinessOwner) => {
    // Store current agency session
    const currentUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
    localStorage.setItem("agency_session", JSON.stringify(currentUser));

    // Create impersonated user session
    const impersonatedUser = {
      id: business.id,
      name: business.ownerName,
      email: business.email,
      role: "admin",
      isImpersonated: true,
      businessName: business.businessName,
    };

    localStorage.setItem("auth_user", JSON.stringify(impersonatedUser));
    window.location.href = "/";
  };

  const getTotalStats = () => {
    const activeBusinesses = businesses.filter(
      (b) => b.status === "active",
    ).length;
    const totalProjects = businesses.reduce((sum, business) => {
      return sum + business.projects;
    }, 0);
    const totalAdminUsers = businesses.reduce((sum, business) => {
      return sum + business.adminUsers;
    }, 0);

    return { activeBusinesses, totalProjects, totalAdminUsers };
  };

  const stats = getTotalStats();

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Business Owners</h1>
            <p className="text-muted-foreground">
              Manage business owners and their accounts under your agency
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/agency/admin/business-owners/add">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Business Owner
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Businesses
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                {businesses.length} total businesses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Across all businesses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Admin Users
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdminUsers}</div>
              <p className="text-xs text-muted-foreground">
                Managed by businesses
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
                    placeholder="Search businesses..."
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
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Businesses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Business Owners ({filteredBusinesses.length})</CardTitle>
            <CardDescription>
              All business owners under your agency management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Admin Users</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {business.businessName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {business.ownerName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {business.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {business.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {business.projects}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {business.adminUsers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(business.lastLogin).toLocaleDateString()}
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
                                to={`/agency/admin/business-owners/${business.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/agency/admin/business-owners/${business.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Business
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => impersonateUser(business)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Login as User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No business owners found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
