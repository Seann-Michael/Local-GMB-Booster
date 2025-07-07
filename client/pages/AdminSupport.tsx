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
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import {
  Plus,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Paperclip,
  Send,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

interface SupportTicket {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  createdDate: string;
  updatedDate: string;
  submittedBy: string;
  responses: SupportResponse[];
  attachments?: string[];
}

interface SupportResponse {
  id: string;
  message: string;
  author: string;
  authorRole: string;
  timestamp: string;
}

interface TicketFormData {
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  attachments: File[];
}

export default function AdminSupport() {
  const currentUser = getCurrentUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    category: "",
    priority: "medium",
    description: "",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const existingTickets = JSON.parse(
      localStorage.getItem("support_tickets") || "[]",
    );

    // Filter tickets by current user
    const userTickets = existingTickets.filter(
      (ticket: SupportTicket) => ticket.submittedBy === currentUser?.email,
    );

    setTickets(userTickets);
  };

  const handleInputChange = (field: keyof TicketFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleCreateTicket = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newTicket: SupportTicket = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        status: "open",
        description: formData.description,
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
        submittedBy: currentUser?.email || "unknown@example.com",
        responses: [],
        attachments: formData.attachments.map((file) => file.name),
      };

      // Get existing tickets and add new one
      const existingTickets = JSON.parse(
        localStorage.getItem("support_tickets") || "[]",
      );
      const updatedTickets = [...existingTickets, newTicket];
      localStorage.setItem("support_tickets", JSON.stringify(updatedTickets));

      // Simulate notification to agency admin and super admin
      toast.success(
        "Support ticket created successfully! Agency admin and super admin have been notified.",
      );

      // Reset form and close
      setFormData({
        title: "",
        category: "",
        priority: "medium",
        description: "",
        attachments: [],
      });
      setShowCreateForm(false);
      loadTickets();
    } catch (error) {
      toast.error("Failed to create support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageSquare className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">
              Create and manage your support tickets
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
            disabled={showCreateForm}
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Subject *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="account">Account Issue</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value as any)
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

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {formData.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeAttachment(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
            <CardDescription>
              Track the status of your submitted tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any support tickets yet.
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {ticket.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-white ${getPriorityColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded-full ${getStatusColor(ticket.status)}`}
                          >
                            {getStatusIcon(ticket.status)}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-white ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.createdDate}</TableCell>
                      <TableCell>{ticket.updatedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
