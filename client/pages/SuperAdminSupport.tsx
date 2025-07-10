import React, { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Eye,
  Edit,
  UserCheck,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Send,
  Paperclip,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  description: string;
  createdDate: string;
  updatedDate: string;
  assignedTo?: string;
  submittedBy: string;
  userType: "admin" | "agency-admin" | "super-admin";
  organization?: string;
  responses: TicketResponse[];
  tags: string[];
  estimatedResolution?: string;
  actualResolution?: string;
  satisfactionRating?: number;
  timeSpent: number; // minutes
}

interface TicketResponse {
  id: string;
  message: string;
  timestamp: string;
  author: string;
  isStaff: boolean;
  isInternal: boolean;
  attachments?: string[];
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  activeTickets: number;
  totalResolved: number;
  avgResolutionTime: number; // hours
  status: "online" | "away" | "busy" | "offline";
}

export default function SuperAdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [sortField, setSortField] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium" as const,
    description: "",
    assignedTo: "",
    tags: "",
    estimatedResolution: "",
  });

  const [newResponse, setNewResponse] = useState("");

  const categories = [
    "Technical Issue",
    "Billing Question",
    "Feature Request",
    "Account Access",
    "Integration Help",
    "Data Export",
    "Performance Issue",
    "Security Concern",
    "Training Request",
    "Bug Report",
    "API Support",
    "Other",
  ];

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = () => {
    // Load sample tickets
    const sampleTickets: SupportTicket[] = [
      {
        id: "TICK-001",
        title: "Cannot access billing dashboard",
        category: "Technical Issue",
        priority: "high",
        status: "open",
        description:
          "When I try to access the billing dashboard, I get a 404 error. This started happening yesterday after the system update.",
        createdDate: "2024-01-21T09:00:00Z",
        updatedDate: "2024-01-21T09:00:00Z",
        assignedTo: "John Support",
        submittedBy: "admin@joespizza.com",
        userType: "admin",
        organization: "Joe's Pizza",
        responses: [],
        tags: ["billing", "404", "urgent"],
        estimatedResolution: "2024-01-21T17:00:00Z",
        timeSpent: 0,
      },
      {
        id: "TICK-002",
        title: "API integration documentation request",
        category: "Integration Help",
        priority: "medium",
        status: "in-progress",
        description:
          "We need detailed documentation for integrating our POS system with your API. Specifically looking for webhook endpoints and authentication methods.",
        createdDate: "2024-01-20T14:30:00Z",
        updatedDate: "2024-01-21T10:15:00Z",
        assignedTo: "Sarah Tech",
        submittedBy: "tech@sarahssalon.com",
        userType: "admin",
        organization: "Sarah's Salon",
        responses: [
          {
            id: "1",
            message:
              "Thank you for your request. I'll gather the API documentation and send it to you within 24 hours.",
            timestamp: "2024-01-20T15:30:00Z",
            author: "Sarah Tech",
            isStaff: true,
            isInternal: false,
          },
          {
            id: "2",
            message: "Starting work on this now. ETA 2 hours.",
            timestamp: "2024-01-21T10:15:00Z",
            author: "Sarah Tech",
            isStaff: true,
            isInternal: true,
          },
        ],
        tags: ["api", "documentation", "integration"],
        estimatedResolution: "2024-01-21T16:00:00Z",
        timeSpent: 45,
      },
      {
        id: "TICK-003",
        title: "Feature request: Dark mode for agency dashboard",
        category: "Feature Request",
        priority: "low",
        status: "open",
        description:
          "It would be great to have a dark mode option for the agency dashboard. Many of our staff work evening shifts and would prefer a darker interface.",
        createdDate: "2024-01-19T11:00:00Z",
        updatedDate: "2024-01-19T11:00:00Z",
        submittedBy: "admin@agencyexample.com",
        userType: "agency-admin",
        organization: "Example Marketing Agency",
        responses: [],
        tags: ["feature-request", "dark-mode", "ui"],
        timeSpent: 0,
      },
      {
        id: "TICK-004",
        title: "Critical: Payment processing down",
        category: "Technical Issue",
        priority: "urgent",
        status: "resolved",
        description:
          "Our payment processing system is completely down. Customers cannot make payments and we're losing revenue. This needs immediate attention.",
        createdDate: "2024-01-18T08:30:00Z",
        updatedDate: "2024-01-18T11:45:00Z",
        assignedTo: "Mike Senior",
        submittedBy: "billing@bigrestaurant.com",
        userType: "admin",
        organization: "Big Restaurant Chain",
        responses: [
          {
            id: "1",
            message:
              "We've identified the issue with the payment gateway. Working on a fix now.",
            timestamp: "2024-01-18T09:00:00Z",
            author: "Mike Senior",
            isStaff: true,
            isInternal: false,
          },
          {
            id: "2",
            message:
              "Issue resolved. Payment processing is back online. Please test and confirm.",
            timestamp: "2024-01-18T11:30:00Z",
            author: "Mike Senior",
            isStaff: true,
            isInternal: false,
          },
        ],
        tags: ["critical", "payments", "urgent"],
        estimatedResolution: "2024-01-18T10:00:00Z",
        actualResolution: "2024-01-18T11:45:00Z",
        satisfactionRating: 5,
        timeSpent: 195,
      },
    ];

    // Load sample staff members
    const sampleStaff: StaffMember[] = [
      {
        id: "1",
        name: "John Support",
        email: "john@support.com",
        role: "Support Specialist",
        department: "Customer Support",
        activeTickets: 8,
        totalResolved: 156,
        avgResolutionTime: 4.2,
        status: "online",
      },
      {
        id: "2",
        name: "Sarah Tech",
        email: "sarah@support.com",
        role: "Technical Support",
        department: "Technical Support",
        activeTickets: 5,
        totalResolved: 89,
        avgResolutionTime: 6.8,
        status: "busy",
      },
      {
        id: "3",
        name: "Mike Senior",
        email: "mike@support.com",
        role: "Senior Support Engineer",
        department: "Engineering Support",
        activeTickets: 3,
        totalResolved: 234,
        avgResolutionTime: 3.1,
        status: "online",
      },
      {
        id: "4",
        name: "Lisa Manager",
        email: "lisa@support.com",
        role: "Support Manager",
        department: "Management",
        activeTickets: 2,
        totalResolved: 67,
        avgResolutionTime: 2.5,
        status: "away",
      },
    ];

    setTickets(sampleTickets);
    setStaffMembers(sampleStaff);
    setIsLoading(false);
  };

  const handleCreateTicket = () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTicket: SupportTicket = {
      id: `TICK-${(tickets.length + 1).toString().padStart(3, "0")}`,
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: "open",
      description: formData.description,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      assignedTo: formData.assignedTo || undefined,
      submittedBy: "super-admin@system.com",
      userType: "super-admin",
      organization: "Internal",
      responses: [],
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      estimatedResolution: formData.estimatedResolution || undefined,
      timeSpent: 0,
    };

    setTickets([newTicket, ...tickets]);
    resetForm();
    setShowCreateDialog(false);
    toast.success("Support ticket created successfully!");
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              assignedTo: assignee,
              status: assignee ? "in-progress" : "open",
              updatedDate: new Date().toISOString(),
            }
          : ticket,
      ),
    );
    toast.success("Ticket assigned successfully!");
  };

  const handleUpdateStatus = (
    ticketId: string,
    status: "open" | "in-progress" | "resolved" | "closed",
  ) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status,
              updatedDate: new Date().toISOString(),
              actualResolution:
                status === "resolved" ? new Date().toISOString() : undefined,
            }
          : ticket,
      ),
    );
    toast.success(`Ticket marked as ${status}!`);
  };

  const handleAddResponse = () => {
    if (!selectedTicket || !newResponse.trim()) return;

    const response: TicketResponse = {
      id: Date.now().toString(),
      message: newResponse,
      timestamp: new Date().toISOString(),
      author: "Super Admin",
      isStaff: true,
      isInternal: false,
    };

    setTickets(
      tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              responses: [...ticket.responses, response],
              updatedDate: new Date().toISOString(),
            }
          : ticket,
      ),
    );

    setNewResponse("");
    toast.success("Response added successfully!");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      priority: "medium",
      description: "",
      assignedTo: "",
      tags: "",
      estimatedResolution: "",
    });
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: "secondary" as const, label: "Low" },
      medium: { variant: "outline" as const, label: "Medium" },
      high: { variant: "default" as const, label: "High" },
      urgent: { variant: "destructive" as const, label: "Urgent" },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { variant: "outline" as const, label: "Open", icon: MessageSquare },
      "in-progress": {
        variant: "default" as const,
        label: "In Progress",
        icon: Clock,
      },
      resolved: {
        variant: "secondary" as const,
        label: "Resolved",
        icon: CheckCircle,
      },
      closed: {
        variant: "secondary" as const,
        label: "Closed",
        icon: CheckCircle,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      if (statusFilter !== "all" && ticket.status !== statusFilter)
        return false;
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter)
        return false;
      if (assigneeFilter !== "all" && ticket.assignedTo !== assigneeFilter)
        return false;
      if (
        searchTerm &&
        !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ticket.organization?.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField as keyof SupportTicket];
      let bValue = b[sortField as keyof SupportTicket];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const getTicketStats = () => {
    const openTickets = tickets.filter((t) => t.status === "open").length;
    const inProgressTickets = tickets.filter(
      (t) => t.status === "in-progress",
    ).length;
    const urgentTickets = tickets.filter((t) => t.priority === "urgent").length;
    const avgResolutionTime =
      tickets
        .filter((t) => t.actualResolution)
        .reduce((sum, ticket) => {
          const created = new Date(ticket.createdDate);
          const resolved = new Date(ticket.actualResolution!);
          return sum + (resolved.getTime() - created.getTime()) / 3600000; // hours
        }, 0) / Math.max(tickets.filter((t) => t.actualResolution).length, 1);

    return { openTickets, inProgressTickets, urgentTickets, avgResolutionTime };
  };

  const stats = getTicketStats();

  return (
    <SuperAdminLayout>
      <div className="max-w-full overflow-x-hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Support Management</h1>
              <p className="text-muted-foreground">
                Manage support tickets across the entire platform
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Support Ticket</DialogTitle>
                    <DialogDescription>
                      Create an internal support ticket for platform issues.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Brief description of the issue"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {(categories || []).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: any) =>
                            setFormData((prev) => ({
                              ...prev,
                              priority: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        value={formData.assignedTo}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedTo: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {(staffMembers || [])
                            .filter((staff) => staff && staff.id && staff.name)
                            .map((staff) => (
                              <SelectItem key={staff.id} value={staff.name}>
                                {staff.name} ({staff.role})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        placeholder="e.g. urgent, billing, api"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Detailed description of the issue..."
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="estimatedResolution">
                        Estimated Resolution (Optional)
                      </Label>
                      <Input
                        id="estimatedResolution"
                        type="datetime-local"
                        value={formData.estimatedResolution}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimatedResolution: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTicket}>Create Ticket</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Open Tickets
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.inProgressTickets} in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Urgent Tickets
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.urgentTickets}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Resolution
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.avgResolutionTime.toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground">
                  Average resolution time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Staff
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staffMembers.filter((s) => s.status === "online").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {staffMembers.length} total staff
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Staff Status */}
          <Card>
            <CardHeader>
              <CardTitle>Support Staff Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {staffMembers.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(staff.status)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{staff.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {staff.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {staff.activeTickets} active • {staff.totalResolved}{" "}
                        resolved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={assigneeFilter}
                    onValueChange={setAssigneeFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="">Unassigned</SelectItem>
                      {(staffMembers || [])
                        .filter((staff) => staff && staff.id && staff.name)
                        .map((staff) => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("id")}
                        >
                          Ticket ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("title")}
                        >
                          Subject
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("submittedBy")}
                        >
                          Requester
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("priority")}
                        >
                          Priority
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("status")}
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("createdDate")}
                        >
                          Created
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTicketDetail(true);
                        }}
                      >
                        <TableCell className="font-mono text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {ticket.category}
                            </div>
                            <div className="flex gap-1">
                              {ticket.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {ticket.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{ticket.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {ticket.submittedBy}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {ticket.organization}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {ticket.userType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(ticket.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          {ticket.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                                {ticket.assignedTo
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="text-sm">
                                {ticket.assignedTo}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Unassigned
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ticket.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowTicketDetail(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(ticket.id, "in-progress")
                                }
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Mark In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(ticket.id, "resolved")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Reassign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Detail Dialog */}
          <Dialog open={showTicketDetail} onOpenChange={setShowTicketDetail}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selectedTicket?.id}</span>
                  {selectedTicket && getPriorityBadge(selectedTicket.priority)}
                  {selectedTicket && getStatusBadge(selectedTicket.status)}
                </DialogTitle>
                <DialogDescription>{selectedTicket?.title}</DialogDescription>
              </DialogHeader>
              {selectedTicket && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Submitted by:</strong>{" "}
                      {selectedTicket.submittedBy}
                    </div>
                    <div>
                      <strong>Organization:</strong>{" "}
                      {selectedTicket.organization}
                    </div>
                    <div>
                      <strong>Category:</strong> {selectedTicket.category}
                    </div>
                    <div>
                      <strong>Assigned to:</strong>{" "}
                      {selectedTicket.assignedTo || "Unassigned"}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(selectedTicket.createdDate).toLocaleString()}
                    </div>
                    <div>
                      <strong>Updated:</strong>{" "}
                      {new Date(selectedTicket.updatedDate).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <strong>Description:</strong>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      {selectedTicket.description}
                    </div>
                  </div>

                  {selectedTicket.tags.length > 0 && (
                    <div>
                      <strong>Tags:</strong>
                      <div className="flex gap-1 mt-2">
                        {selectedTicket.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <strong>
                      Responses ({selectedTicket.responses.length}):
                    </strong>
                    <div className="mt-2 space-y-3 max-h-64 overflow-y-auto">
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-3 rounded-lg ${
                            response.isStaff
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <strong>
                              {response.author}
                              {response.isStaff && (
                                <Badge variant="outline" className="ml-2">
                                  Staff
                                </Badge>
                              )}
                              {response.isInternal && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  Internal
                                </Badge>
                              )}
                            </strong>
                            <span className="text-xs text-muted-foreground">
                              {new Date(response.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div>{response.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-response">Add Response</Label>
                    <Textarea
                      id="new-response"
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                      className="mt-2"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          Internal Note
                        </Button>
                      </div>
                      <Button
                        onClick={handleAddResponse}
                        disabled={!newResponse.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
