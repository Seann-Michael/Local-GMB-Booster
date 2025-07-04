import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AppLayout } from "@/components/AppLayout";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Plus,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Eye,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isAgencyAdmin, isSuperAdmin } from "@/lib/auth";

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
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  timestamp: string;
  author: string;
  isStaff: boolean;
}

export default function Support() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium" as const,
    description: "",
  });

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
    "Other",
  ];

  useEffect(() => {
    // Load tickets based on user role
    const userRole = getCurrentUserRole();
    loadTicketsForRole(userRole);
  }, []);

  const getCurrentUserRole = () => {
    if (isSuperAdmin()) return "super-admin";
    if (isAgencyAdmin()) return "agency-admin";
    return "admin";
  };

  const loadTicketsForRole = (role: string) => {
    let existingTickets = JSON.parse(
      localStorage.getItem("support_tickets") || "[]",
    );

    // Filter tickets based on role
    if (role === "admin") {
      // Business admin only sees their own tickets
      const currentUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
      existingTickets = existingTickets.filter(
        (ticket: SupportTicket) => ticket.submittedBy === currentUser.email,
      );
    } else if (role === "agency-admin") {
      // Agency admin sees tickets from their business owners and their own
      existingTickets = existingTickets.filter(
        (ticket: SupportTicket) =>
          ticket.submittedBy.includes("agency") ||
          !ticket.submittedBy.includes("super"),
      );
    }
    // Super admin sees all tickets

    // Add sample tickets if none exist
    if (existingTickets.length === 0) {
      const sampleTickets: SupportTicket[] = [
        {
          id: "1",
          title: "Cannot access billing dashboard",
          category: "Technical Issue",
          priority: "high",
          status: "open",
          description:
            "When I try to access the billing dashboard, I get a 404 error. This started happening yesterday after the system update.",
          createdDate: "2024-03-12",
          updatedDate: "2024-03-12",
          submittedBy: "admin@joespizza.com",
          responses: [],
        },
        {
          id: "2",
          title: "Request for API integration documentation",
          category: "Integration Help",
          priority: "medium",
          status: "in-progress",
          description:
            "We need detailed documentation for integrating our POS system with your API. Specifically looking for webhook endpoints and authentication methods.",
          createdDate: "2024-03-10",
          updatedDate: "2024-03-11",
          submittedBy: "tech@sarahssalon.com",
          assignedTo: "Support Team",
          responses: [
            {
              id: "1",
              message:
                "Thank you for your request. I'll gather the API documentation and send it to you within 24 hours.",
              timestamp: "2024-03-11 10:30",
              author: "Support Team",
              isStaff: true,
            },
          ],
        },
        {
          id: "3",
          title: "Feature request: Dark mode",
          category: "Feature Request",
          priority: "low",
          status: "open",
          description:
            "It would be great to have a dark mode option for the dashboard. Many of our staff work evening shifts and would prefer a darker interface.",
          createdDate: "2024-03-08",
          updatedDate: "2024-03-08",
          submittedBy: "admin@mikesauto.com",
          responses: [],
        },
      ];

      localStorage.setItem("support_tickets", JSON.stringify(sampleTickets));
      setTickets(sampleTickets);
    } else {
      setTickets(existingTickets);
    }
  };

  const handleCreateTicket = () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: "open",
      description: formData.description,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      submittedBy: currentUser.email || "user@example.com",
      responses: [],
    };

    // Load existing tickets, add new one
    const existingTickets = JSON.parse(
      localStorage.getItem("support_tickets") || "[]",
    );
    existingTickets.push(newTicket);
    localStorage.setItem("support_tickets", JSON.stringify(existingTickets));

    // Update local state
    setTickets([newTicket, ...tickets]);

    // Reset form
    setFormData({
      title: "",
      category: "",
      priority: "medium",
      description: "",
    });
    setShowCreateForm(false);

    toast({
      title: "Ticket Created",
      description: `Support ticket #${newTicket.id} has been created successfully.`,
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

  const getLayoutComponent = () => {
    const role = getCurrentUserRole();
    if (role === "super-admin") return SuperAdminLayout;
    if (role === "agency-admin") return AgencyAdminLayout;
    return AppLayout;
  };

  const LayoutComponent = getLayoutComponent();

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">
              Get help and submit support tickets
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
            disabled={showCreateForm}
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll help you resolve it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Ticket Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as "low" | "medium" | "high" | "urgent",
                    }))
                  }
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Please provide detailed information about your issue..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets ({tickets.length})</CardTitle>
            <CardDescription>
              Track the status of your support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-sm text-muted-foreground">
                              #{ticket.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>
                          {getPriorityBadge(ticket.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          {new Date(ticket.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.updatedDate).toLocaleDateString()}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Add Response
                              </DropdownMenuItem>
                              {ticket.status === "open" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Resolved
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No support tickets found</p>
                <p className="text-sm">
                  Create your first ticket to get help from our support team
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Help Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Password reset instructions</li>
                <li>• Billing and payment questions</li>
                <li>• User management help</li>
                <li>• API integration guides</li>
                <li>• Data export procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Low Priority:</span>
                  <span>24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Priority:</span>
                  <span>12-24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>High Priority:</span>
                  <span>4-8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgent:</span>
                  <span>1-2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>For urgent technical issues:</p>
                <p className="font-medium">emergency@support.com</p>
                <p className="font-medium">1-800-SUPPORT</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Emergency support available 24/7 for critical system outages
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutComponent>
  );
}
