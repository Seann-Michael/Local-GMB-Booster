import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  ArrowLeft,
  Users,
  Activity,
  Database,
  Building2,
  Eye,
  BarChart3,
  Edit,
  Trash2,
  Camera,
  Video,
  FolderOpen,
  DollarSign,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Save,
  X,
  Plus,
  LogIn,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

interface BusinessUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "Active" | "Inactive";
  lastLogin: string;
  photosUploaded: number;
  videosUploaded: number;
  projectsCreated: number;
  joinedDate: string;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "charge" | "refund" | "credit";
  status: "completed" | "pending" | "failed";
}

interface TimestampedNote {
  id: string;
  note: string;
  timestamp: string;
  adminUser: string;
}

interface TechnicalDetail {
  id: string;
  userId: string;
  userName: string;
  device: string;
  browser: string;
  ipAddress: string;
  lastLogin: string;
  location: string;
}

export default function BusinessDetail() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BusinessUser | null>(null);

  // Mock business data
  const [businessData, setBusinessData] = useState({
    id: businessId || "1",
    name: "Smith Construction LLC",
    admin: "John Smith",
    email: "john@smithconstruction.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Springfield, IL 62701",
    plan: "Pro",
    status: "Active",
    signupDate: "2023-08-15",
    lastActivity: "2 hours ago",
    users: 8,
    photos: 1247,
    videos: 89,
    projects: 34,
    storage: "2.4GB",
    storageLimit: "50GB",
    revenue: 348,
    notes:
      "Great customer, always pays on time. Upgraded to Pro plan after 2 months.",
  });

  const [users, setUsers] = useState<BusinessUser[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@smithconstruction.com",
      role: "admin",
      status: "Active",
      lastLogin: "2 hours ago",
      photosUploaded: 456,
      videosUploaded: 23,
      projectsCreated: 12,
      joinedDate: "2023-08-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@smithconstruction.com",
      role: "editor",
      status: "Active",
      lastLogin: "1 day ago",
      photosUploaded: 789,
      videosUploaded: 45,
      projectsCreated: 18,
      joinedDate: "2023-09-01",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@smithconstruction.com",
      role: "viewer",
      status: "Inactive",
      lastLogin: "1 week ago",
      photosUploaded: 2,
      videosUploaded: 21,
      projectsCreated: 4,
      joinedDate: "2023-10-15",
    },
  ]);

  const [activityLog] = useState<ActivityLog[]>([
    {
      id: "1",
      user: "John Smith",
      action: "Created new project",
      timestamp: "2 hours ago",
      details: "Kitchen Renovation - 123 Oak St",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Uploaded 5 photos",
      timestamp: "4 hours ago",
      details: "Added to Bathroom Remodel project",
    },
    {
      id: "3",
      user: "John Smith",
      action: "Updated business profile",
      timestamp: "1 day ago",
      details: "Changed phone number",
    },
    {
      id: "4",
      user: "Mike Johnson",
      action: "Completed project",
      timestamp: "3 days ago",
      details: "Deck Installation - 456 Pine Ave",
    },
  ]);

  const [financialHistory] = useState<FinancialRecord[]>([
    {
      id: "1",
      date: "2024-01-15",
      description: "Pro Plan Subscription",
      amount: 29.0,
      type: "charge",
      status: "completed",
    },
    {
      id: "2",
      date: "2023-12-15",
      description: "Pro Plan Subscription",
      amount: 29.0,
      type: "charge",
      status: "completed",
    },
    {
      id: "3",
      date: "2023-11-15",
      description: "Pro Plan Subscription",
      amount: 29.0,
      type: "charge",
      status: "completed",
    },
    {
      id: "4",
      date: "2023-10-20",
      description: "Upgrade Credit",
      amount: -10.0,
      type: "credit",
      status: "completed",
    },
  ]);

  const handleSaveBusiness = () => {
    setIsEditing(false);
    toast.success("Business details updated successfully");
  };

  const handleCancelPlan = () => {
    setBusinessData((prev) => ({ ...prev, status: "Canceled" }));
    toast.success("Plan canceled successfully");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast.success("User removed successfully");
  };

  const impersonateUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      toast.success(`Signing in as ${user.name}...`);
      // Implementation would be similar to business impersonation
    }
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
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/super-admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {businessData.name}
            </h1>
            <p className="text-muted-foreground">
              Business management and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => impersonateUser("1")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In As Admin
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Business
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveBusiness} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Business Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{businessData.users}</p>
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
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold">{businessData.projects}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{businessData.storage}</p>
                  <p className="text-xs text-muted-foreground">
                    of {businessData.storageLimit}
                  </p>
                </div>
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${businessData.revenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Business Details
                <Badge
                  variant={
                    businessData.status === "Active"
                      ? "default"
                      : businessData.status === "Trial"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {businessData.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  {isEditing ? (
                    <Input
                      value={businessData.name}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Admin Name</Label>
                  {isEditing ? (
                    <Input
                      value={businessData.admin}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          admin: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.admin}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={businessData.email}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={businessData.phone}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  {isEditing ? (
                    <Input
                      value={businessData.address}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  {isEditing ? (
                    <Select
                      value={businessData.plan}
                      onValueChange={(value) =>
                        setBusinessData((prev) => ({ ...prev, plan: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">
                      {businessData.plan}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Signup Date</Label>
                  <p className="text-sm p-2 bg-muted rounded">
                    {new Date(businessData.signupDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Internal Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={businessData.notes}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">
                    {businessData.notes}
                  </p>
                )}
              </div>

              {businessData.status === "Active" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <X className="h-4 w-4" />
                      Cancel Plan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Plan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this business's plan?
                        This action cannot be undone and they will lose access
                        to premium features.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelPlan}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, Cancel Plan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue</span>
                  <span className="font-bold">${businessData.revenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Revenue</span>
                  <span className="font-bold">$29</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Since</span>
                  <span className="text-sm">
                    {new Date(businessData.signupDate).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Transactions</h4>
                  {financialHistory.slice(0, 3).map((record) => (
                    <div
                      key={record.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{record.description}</span>
                      <span
                        className={
                          record.type === "credit" ? "text-green-600" : ""
                        }
                      >
                        ${Math.abs(record.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management ({users.length})</CardTitle>
              <Button className="gap-2" onClick={() => setShowAddUser(true)}>
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Content Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>{user.photosUploaded} photos</div>
                        <div>{user.videosUploaded} videos</div>
                        <div>{user.projectsCreated} projects</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => impersonateUser(user.id)}
                          className="gap-1"
                        >
                          <LogIn className="h-3 w-3" />
                          Sign In As
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLog.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
