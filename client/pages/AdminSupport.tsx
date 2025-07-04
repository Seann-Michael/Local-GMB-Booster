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
  ArrowUpDown,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  timestamp: string;
  author: string;
  isStaff: boolean;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortField, setSortField] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium" as const,
    description: "",
  });

  const categories = [
    "Technical Issue",
    "Account Access",
    "Feature Request",
    "Data Export",
    "Performance Issue",
    "Training Request",
    "Project Management",
    "Gallery Issues",
    "Settings Help",
    "Other",
  ];

  useEffect(() => {
    // Load admin-specific tickets
    const existingTickets = JSON.parse(
      localStorage.getItem("admin_support_tickets") || "[]",
    );

    if (existingTickets.length === 0) {
      const sampleTickets: SupportTicket[] = [
        {
          id: "1",
          title: "Cannot upload project photos",
          category: "Technical Issue",
          priority: "high",
          status: "open",
          description:
            "When I try to upload photos to my project, the upload fails with an error message. This is preventing me from completing my project documentation.",
          createdDate: "2024-03-12",
          updatedDate: "2024-03-12",
          submittedBy: "admin@business.com",
          responses: [],
        },
        {
          id: "2",
          title: "Request for project export feature",
          category: "Feature Request",
          priority: "medium",
          status: "in-progress",
          description:
            "It would be helpful to export project data including photos and documentation as a PDF report for client presentations.",
          createdDate: "2024-03-10",
          updatedDate: "2024-03-11",
          submittedBy: "admin@business.com",
          assignedTo: "Business Support Team",
          responses: [
            {
              id: "1",
              message:
                "Thank you for your feature request. Our development team is reviewing this and we'll update you on the timeline soon.",
              timestamp: "2024-03-11 10:30",
              author: "Business Support Team",
              isStaff: true,
            },
          ],
        },
      ];

      localStorage.setItem(
        "admin_support_tickets",
        JSON.stringify(sampleTickets),
      );
      setTickets(sampleTickets);
    } else {
      setTickets(existingTickets);
    }
  }, []);

  const handleCreateTicket = () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: "open",
      description: formData.description,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      submittedBy: "admin@business.com",
      responses: [],
    };

    const existingTickets = JSON.parse(
      localStorage.getItem("admin_support_tickets") || "[]",
    );
    existingTickets.push(newTicket);
    localStorage.setItem(
      "admin_support_tickets",
      JSON.stringify(existingTickets),
    );

    setTickets([newTicket, ...tickets]);

    setFormData({
      title: "",
      category: "",
      priority: "medium",
      description: "",
    });
    setShowCreateForm(false);

    toast.success(
      `Support ticket #${newTicket.id} has been created successfully.`,
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue = a[sortField as keyof SupportTicket];
    let bValue = b[sortField as keyof SupportTicket];

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleRowClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    toast.success(`Opening ticket #${ticket.id}: ${ticket.title}`);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Business Support</h1>
            <p className="text-muted-foreground">
              Get help with your business account and projects
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
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("title")}
                        >
                          Ticket
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 font-medium"
                          onClick={() => handleSort("category")}
                        >
                          Category
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
                    {sortedTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(ticket)}
                      >
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
                        <TableCell onClick={(e) => e.stopPropagation()}>
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
                <li>• Project photo upload issues</li>
                <li>• Account access problems</li>
                <li>• Gallery organization help</li>
                <li>• Settings configuration</li>
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
                Business Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>For urgent business issues:</p>
                <p className="font-medium">business@support.com</p>
                <p className="font-medium">1-800-BIZ-HELP</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Business support available during business hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
