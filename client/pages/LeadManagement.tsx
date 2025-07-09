import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Download,
  Search,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Briefcase,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  source:
    | "website"
    | "referral"
    | "social"
    | "advertising"
    | "cold_call"
    | "other";
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  projectType: string;
  leadScore: number;
  activities: Activity[];
  tags: string[];
}

interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "proposal" | "follow_up";
  description: string;
  createdAt: string;
  createdBy: string;
  outcome?: string;
}

interface LeadMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageValue: number;
  totalPipelineValue: number;
  wonValue: number;
  lostValue: number;
  averageTimeToClose: number;
}

export default function LeadManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<LeadMetrics>({
    totalLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    averageValue: 0,
    totalPipelineValue: 0,
    wonValue: 0,
    lostValue: 0,
    averageTimeToClose: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    priority: "all",
    assignedTo: "all",
    dateRange: "all",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    source: "website",
    status: "new",
    priority: "medium",
    estimatedValue: 0,
    probability: 20,
    expectedCloseDate: "",
    notes: "",
    assignedTo: "current_user",
    projectType: "",
    tags: [],
  });

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters, searchQuery]);

  const loadLeads = () => {
    const mockLeads: Lead[] = [
      {
        id: "lead-1",
        name: "Sarah Johnson",
        email: "sarah@johnsoncorp.com",
        phone: "(555) 123-4567",
        company: "Johnson Corp",
        address: "123 Main St, Downtown, NY 10001",
        source: "website",
        status: "qualified",
        priority: "high",
        estimatedValue: 15000,
        probability: 75,
        expectedCloseDate: "2024-02-15",
        notes: "Interested in complete office renovation. Has budget approved.",
        assignedTo: "John Smith",
        createdAt: "2024-01-10T09:00:00Z",
        lastActivity: "2024-01-18T14:30:00Z",
        projectType: "Office Renovation",
        leadScore: 85,
        activities: [
          {
            id: "act-1",
            type: "call",
            description: "Initial consultation call - very interested",
            createdAt: "2024-01-10T09:00:00Z",
            createdBy: "John Smith",
            outcome: "positive",
          },
          {
            id: "act-2",
            type: "email",
            description: "Sent detailed proposal and timeline",
            createdAt: "2024-01-15T11:20:00Z",
            createdBy: "John Smith",
          },
          {
            id: "act-3",
            type: "meeting",
            description: "Site visit scheduled for next week",
            createdAt: "2024-01-18T14:30:00Z",
            createdBy: "John Smith",
          },
        ],
        tags: ["hot-lead", "office", "high-value"],
      },
      {
        id: "lead-2",
        name: "Mike Wilson",
        email: "mike.wilson@email.com",
        phone: "(555) 987-6543",
        company: "",
        address: "456 Oak Ave, Suburb, NY 10002",
        source: "referral",
        status: "proposal",
        priority: "medium",
        estimatedValue: 8500,
        probability: 60,
        expectedCloseDate: "2024-02-28",
        notes:
          "Kitchen remodel referral from previous client. Comparing quotes.",
        assignedTo: "Sarah Davis",
        createdAt: "2024-01-08T16:45:00Z",
        lastActivity: "2024-01-20T10:15:00Z",
        projectType: "Kitchen Remodel",
        leadScore: 65,
        activities: [
          {
            id: "act-4",
            type: "call",
            description: "Referral call from Tom Anderson",
            createdAt: "2024-01-08T16:45:00Z",
            createdBy: "Sarah Davis",
          },
          {
            id: "act-5",
            type: "meeting",
            description: "Home consultation completed",
            createdAt: "2024-01-12T13:00:00Z",
            createdBy: "Sarah Davis",
            outcome: "proposal_needed",
          },
        ],
        tags: ["referral", "kitchen", "residential"],
      },
      {
        id: "lead-3",
        name: "David Chen",
        email: "d.chen@techstartup.io",
        phone: "(555) 456-7890",
        company: "TechStartup Inc",
        address: "789 Innovation Dr, Tech Park, NY 10003",
        source: "advertising",
        status: "new",
        priority: "medium",
        estimatedValue: 25000,
        probability: 30,
        expectedCloseDate: "2024-03-15",
        notes:
          "New tech startup looking for complete office buildout. Early stage.",
        assignedTo: "Mike Johnson",
        createdAt: "2024-01-20T11:30:00Z",
        lastActivity: "2024-01-20T11:30:00Z",
        projectType: "Commercial Buildout",
        leadScore: 45,
        activities: [
          {
            id: "act-6",
            type: "email",
            description: "Initial inquiry via Google Ads",
            createdAt: "2024-01-20T11:30:00Z",
            createdBy: "System",
          },
        ],
        tags: ["commercial", "new-business", "tech"],
      },
      {
        id: "lead-4",
        name: "Lisa Rodriguez",
        email: "lisa.r@email.com",
        phone: "(555) 321-0987",
        company: "",
        address: "321 Pine St, Residential Area, NY 10004",
        source: "social",
        status: "won",
        priority: "high",
        estimatedValue: 12000,
        probability: 100,
        expectedCloseDate: "2024-01-25",
        notes: "Bathroom renovation. Project started this week!",
        assignedTo: "Tom Wilson",
        createdAt: "2023-12-15T14:20:00Z",
        lastActivity: "2024-01-22T09:00:00Z",
        projectType: "Bathroom Renovation",
        leadScore: 95,
        activities: [
          {
            id: "act-7",
            type: "note",
            description: "Project started - converted to active customer!",
            createdAt: "2024-01-22T09:00:00Z",
            createdBy: "Tom Wilson",
            outcome: "won",
          },
        ],
        tags: ["won", "bathroom", "residential"],
      },
    ];

    setLeads(mockLeads);
    calculateMetrics(mockLeads);
  };

  const calculateMetrics = (leadData: Lead[]) => {
    const totalLeads = leadData.length;
    const qualifiedLeads = leadData.filter((lead) =>
      ["qualified", "proposal", "negotiation", "won"].includes(lead.status),
    ).length;
    const wonLeads = leadData.filter((lead) => lead.status === "won");
    const lostLeads = leadData.filter((lead) => lead.status === "lost");

    const conversionRate =
      totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0;
    const averageValue =
      totalLeads > 0
        ? leadData.reduce((sum, lead) => sum + lead.estimatedValue, 0) /
          totalLeads
        : 0;
    const totalPipelineValue = leadData
      .filter((lead) => !["won", "lost"].includes(lead.status))
      .reduce(
        (sum, lead) => sum + (lead.estimatedValue * lead.probability) / 100,
        0,
      );
    const wonValue = wonLeads.reduce(
      (sum, lead) => sum + lead.estimatedValue,
      0,
    );
    const lostValue = lostLeads.reduce(
      (sum, lead) => sum + lead.estimatedValue,
      0,
    );

    setMetrics({
      totalLeads,
      qualifiedLeads,
      conversionRate,
      averageValue,
      totalPipelineValue,
      wonValue,
      lostValue,
      averageTimeToClose: 18, // Mock average
    });
  };

  const applyFilters = () => {
    let filtered = leads;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.projectType.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply filters
    if (filters.status !== "all") {
      filtered = filtered.filter((lead) => lead.status === filters.status);
    }
    if (filters.source !== "all") {
      filtered = filtered.filter((lead) => lead.source === filters.source);
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter((lead) => lead.priority === filters.priority);
    }

    setFilteredLeads(filtered);
  };

  const addLead = () => {
    if (!newLead.name || !newLead.email || !newLead.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name!,
      email: newLead.email!,
      phone: newLead.phone!,
      company: newLead.company || "",
      address: newLead.address || "",
      source: newLead.source as Lead["source"],
      status: newLead.status as Lead["status"],
      priority: newLead.priority as Lead["priority"],
      estimatedValue: newLead.estimatedValue || 0,
      probability: newLead.probability || 20,
      expectedCloseDate: newLead.expectedCloseDate || "",
      notes: newLead.notes || "",
      assignedTo: newLead.assignedTo || "current_user",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      projectType: newLead.projectType || "",
      leadScore: 50, // Default score
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "note",
          description: "Lead created",
          createdAt: new Date().toISOString(),
          createdBy: "current_user",
        },
      ],
      tags: newLead.tags || [],
    };

    const updatedLeads = [lead, ...leads];
    setLeads(updatedLeads);
    calculateMetrics(updatedLeads);
    setIsAddingLead(false);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      source: "website",
      status: "new",
      priority: "medium",
      estimatedValue: 0,
      probability: 20,
      expectedCloseDate: "",
      notes: "",
      assignedTo: "current_user",
      projectType: "",
      tags: [],
    });
    toast.success("Lead added successfully!");
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        const updatedLead = {
          ...lead,
          status: newStatus,
          lastActivity: new Date().toISOString(),
        };
        updatedLead.activities.push({
          id: `act-${Date.now()}`,
          type: "note",
          description: `Status changed to ${newStatus}`,
          createdAt: new Date().toISOString(),
          createdBy: "current_user",
        });
        return updatedLead;
      }
      return lead;
    });

    setLeads(updatedLeads);
    calculateMetrics(updatedLeads);
    toast.success("Lead status updated!");
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-orange-100 text-orange-800";
      case "won":
        return "bg-emerald-100 text-emerald-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: Lead["priority"]) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Track leads, manage pipeline, and forecast revenue
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Create a new lead and start tracking its progress
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newLead.name}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newLead.company}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newLead.email}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={newLead.phone}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newLead.address}
                      onChange={(e) =>
                        setNewLead((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Project address"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Lead Source</Label>
                      <Select
                        value={newLead.source}
                        onValueChange={(value) =>
                          setNewLead((prev) => ({
                            ...prev,
                            source: value as Lead["source"],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="advertising">
                            Advertising
                          </SelectItem>
                          <SelectItem value="cold_call">Cold Call</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newLead.priority}
                        onValueChange={(value) =>
                          setNewLead((prev) => ({
                            ...prev,
                            priority: value as Lead["priority"],
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
                    <div className="space-y-2">
                      <Label htmlFor="estimated-value">Estimated Value</Label>
                      <Input
                        id="estimated-value"
                        type="number"
                        value={newLead.estimatedValue}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            estimatedValue: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="15000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type</Label>
                      <Input
                        id="project-type"
                        value={newLead.projectType}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            projectType: e.target.value,
                          }))
                        }
                        placeholder="Kitchen Remodel, Office Renovation, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expected-close">
                        Expected Close Date
                      </Label>
                      <Input
                        id="expected-close"
                        type="date"
                        value={newLead.expectedCloseDate}
                        onChange={(e) =>
                          setNewLead((prev) => ({
                            ...prev,
                            expectedCloseDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newLead.notes}
                      onChange={(e) =>
                        setNewLead((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Initial requirements, budget info, timeline..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingLead(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addLead}>Add Lead</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.qualifiedLeads} qualified
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pipeline Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.totalPipelineValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Weighted by probability
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Leads to customers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Deal Size
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.averageValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per project value</p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-6">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.source}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, source: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        status: "all",
                        source: "all",
                        priority: "all",
                        assignedTo: "all",
                        dateRange: "all",
                      });
                      setSearchQuery("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>Leads ({filteredLeads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Expected Close</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(lead.priority)}
                              <div className="font-medium">{lead.name}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lead.company && `${lead.company} • `}
                              {lead.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lead.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {lead.projectType}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Score: {lead.leadScore}/100
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) =>
                              updateLeadStatus(lead.id, value as Lead["status"])
                            }
                          >
                            <SelectTrigger
                              className={`w-32 ${getStatusColor(lead.status)}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">
                                Contacted
                              </SelectItem>
                              <SelectItem value="qualified">
                                Qualified
                              </SelectItem>
                              <SelectItem value="proposal">Proposal</SelectItem>
                              <SelectItem value="negotiation">
                                Negotiation
                              </SelectItem>
                              <SelectItem value="won">Won</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${lead.estimatedValue.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${lead.probability}%` }}
                              />
                            </div>
                            <span className="text-sm">{lead.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.expectedCloseDate
                              ? new Date(
                                  lead.expectedCloseDate,
                                ).toLocaleDateString()
                              : "Not set"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-7">
              {[
                "new",
                "contacted",
                "qualified",
                "proposal",
                "negotiation",
                "won",
                "lost",
              ].map((status) => {
                const statusLeads = leads.filter(
                  (lead) => lead.status === status,
                );
                const statusValue = statusLeads.reduce(
                  (sum, lead) => sum + lead.estimatedValue,
                  0,
                );

                return (
                  <Card key={status}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm capitalize">
                        {status.replace("_", " ")}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {statusLeads.length} leads • $
                        {statusValue.toLocaleString()}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {statusLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="font-medium text-sm">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.projectType}
                          </div>
                          <div className="text-xs font-medium">
                            ${lead.estimatedValue.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "website",
                      "referral",
                      "social",
                      "advertising",
                      "cold_call",
                    ].map((source) => {
                      const sourceLeads = leads.filter(
                        (lead) => lead.source === source,
                      );
                      const percentage =
                        leads.length > 0
                          ? (sourceLeads.length / leads.length) * 100
                          : 0;

                      return (
                        <div
                          key={source}
                          className="flex items-center justify-between"
                        >
                          <div className="capitalize">
                            {source.replace("_", " ")}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">
                              {sourceLeads.length}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Pipeline Value</span>
                      <span className="font-medium">
                        ${metrics.totalPipelineValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Won Value (YTD)</span>
                      <span className="font-medium text-green-600">
                        ${metrics.wonValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lost Value (YTD)</span>
                      <span className="font-medium text-red-600">
                        ${metrics.lostValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Time to Close</span>
                      <span className="font-medium">
                        {metrics.averageTimeToClose} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Score Average</span>
                      <span className="font-medium">
                        {leads.length > 0
                          ? Math.round(
                              leads.reduce(
                                (sum, lead) => sum + lead.leadScore,
                                0,
                              ) / leads.length,
                            )
                          : 0}
                        /100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <Dialog
            open={!!selectedLead}
            onOpenChange={() => setSelectedLead(null)}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getPriorityIcon(selectedLead.priority)}
                  {selectedLead.name}
                  <Badge className={getStatusColor(selectedLead.status)}>
                    {selectedLead.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedLead.company} • {selectedLead.projectType}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedLead.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedLead.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedLead.address}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Type:</strong> {selectedLead.projectType}
                      </div>
                      <div>
                        <strong>Estimated Value:</strong> $
                        {selectedLead.estimatedValue.toLocaleString()}
                      </div>
                      <div>
                        <strong>Probability:</strong> {selectedLead.probability}
                        %
                      </div>
                      <div>
                        <strong>Expected Close:</strong>{" "}
                        {selectedLead.expectedCloseDate || "Not set"}
                      </div>
                      <div>
                        <strong>Lead Score:</strong> {selectedLead.leadScore}
                        /100
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedLead.notes || "No notes added"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Activity Timeline</h4>
                  <div className="space-y-3">
                    {selectedLead.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="border-l-2 border-muted pl-3"
                      >
                        <div className="text-sm font-medium">
                          {activity.type.replace("_", " ")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString()} by{" "}
                          {activity.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
