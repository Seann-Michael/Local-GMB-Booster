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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  Search,
  BookOpen,
  Users,
  Building2,
  Settings,
  Camera,
  FolderOpen,
  MessageSquare,
  CreditCard,
  BarChart3,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Image,
  File,
  Video,
  AlertTriangle,
  CheckCircle,
  Paperclip,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  userType: "all" | "admin" | "agency" | "super-admin";
  content: string;
  tags: string[];
  lastUpdated: string;
  popular?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  userType: "all" | "admin" | "agency" | "super-admin";
}

interface SupportTicket {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  assignedTo?: string;
  attachments: string[];
}

export default function KnowledgeBase() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuper = isSuperAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [showSupportTickets, setShowSupportTickets] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "",
    priority: "medium" as const,
    description: "",
  });

  // Determine which layout to use based on current path or user role
  const getLayoutComponent = () => {
    if (location.pathname.startsWith("/super-admin")) {
      return SuperAdminLayout;
    }
    if (location.pathname.startsWith("/agency")) {
      return AgencyAdminLayout;
    }
    return AppLayout;
  };

  const LayoutComponent = getLayoutComponent();

  // Load support tickets
  useEffect(() => {
    const savedTickets = localStorage.getItem("support_tickets");
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      title: newTicket.title,
      category: newTicket.category || "general",
      priority: newTicket.priority,
      status: "open",
      description: newTicket.description,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || "Anonymous",
      updatedAt: new Date().toISOString(),
      attachments: [],
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem("support_tickets", JSON.stringify(updatedTickets));

    setNewTicket({
      title: "",
      category: "",
      priority: "medium",
      description: "",
    });
    setShowCreateTicket(false);
    toast.success("Support ticket created successfully!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // If no user logged in, show public layout
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b">
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">GMB Booster Help</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <a href="/signin">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="container px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Help Center</h1>
            <p className="text-muted-foreground text-lg">
              Find answers, guides, and resources to get the most out of GMB
              Booster
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <LayoutComponent>
      <div className="container px-4 py-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            {isSuper && (
              <Button onClick={() => setIsCreating(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Article
              </Button>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers, guides, and resources to get the most out of GMB
            Booster
          </p>
        </div>

        {/* Support Tickets Section */}
        {!selectedCategory &&
          !searchQuery &&
          !selectedArticle &&
          !editingArticle &&
          currentUser && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Support Tickets</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSupportTickets(!showSupportTickets)}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {showSupportTickets
                      ? "Hide Tickets"
                      : `View Tickets (${tickets.length})`}
                  </Button>
                  <Button
                    onClick={() => setShowCreateTicket(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Ticket
                  </Button>
                </div>
              </div>

              {showSupportTickets && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Recent Support Tickets
                    </CardTitle>
                    <CardDescription>
                      Track and manage your support requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tickets.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No support tickets yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first support ticket to get help with any
                          issues.
                        </p>
                        <Button
                          onClick={() => setShowCreateTicket(true)}
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
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tickets.slice(0, 5).map((ticket) => (
                            <TableRow
                              key={ticket.id}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {ticket.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    #{ticket.id}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {ticket.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusColor(ticket.status)}
                                >
                                  {ticket.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(
                                  ticket.createdAt,
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Create Ticket Modal */}
              {showCreateTicket && (
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Create Support Ticket</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCreateTicket(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      Describe your issue and we'll help you resolve it quickly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-title">Title *</Label>
                        <Input
                          id="ticket-title"
                          placeholder="Brief description of your issue"
                          value={newTicket.title}
                          onChange={(e) =>
                            setNewTicket({
                              ...newTicket,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket-category">Category</Label>
                        <Select
                          value={newTicket.category}
                          onValueChange={(value) =>
                            setNewTicket({ ...newTicket, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing & Account
                            </SelectItem>
                            <SelectItem value="feature">
                              Feature Request
                            </SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="general">
                              General Question
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticket-priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value: any) =>
                          setNewTicket({ ...newTicket, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Low - General question
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium - Normal issue
                          </SelectItem>
                          <SelectItem value="high">
                            High - Important issue
                          </SelectItem>
                          <SelectItem value="urgent">
                            Urgent - Business critical
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticket-description">Description *</Label>
                      <Textarea
                        id="ticket-description"
                        placeholder="Please provide detailed information about your issue..."
                        className="min-h-32"
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleCreateTicket} className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Create Ticket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateTicket(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
      </div>
    </LayoutComponent>
  );
}
