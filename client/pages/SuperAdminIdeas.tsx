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
  Lightbulb,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Rocket,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

interface IdeaSubmission {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "roadmap";
  author: string;
  submittedAt: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  priority: "low" | "medium" | "high";
  adminNotes?: string;
}

interface RoadmapAssignment {
  status: "planned" | "in-progress" | "completed";
  estimatedCompletion?: string;
  assignedTo?: string;
}

export default function SuperAdminIdeas() {
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingIdea, setEditingIdea] = useState<IdeaSubmission | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRoadmapDialog, setShowRoadmapDialog] = useState(false);
  const [roadmapAssignment, setRoadmapAssignment] = useState<RoadmapAssignment>(
    {
      status: "planned",
    },
  );
  const [sortField, setSortField] = useState<string>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = () => {
    // Mock data - in real app this would come from API
    const mockIdeas: IdeaSubmission[] = [
      {
        id: "1",
        title: "Dark Mode Support",
        description:
          "Add comprehensive dark theme support across the entire platform with user preferences and automatic switching.",
        category: "ui-ux",
        status: "approved",
        author: "John Smith",
        submittedAt: "2024-01-15T10:30:00Z",
        upvotes: 156,
        downvotes: 14,
        comments: 23,
        priority: "high",
        adminNotes: "High user demand, fits with Q2 roadmap",
      },
      {
        id: "2",
        title: "Advanced Search Filters",
        description:
          "Enhanced search functionality with filters, saved searches, and advanced query options.",
        category: "search",
        status: "pending",
        author: "Sarah Johnson",
        submittedAt: "2024-03-10T14:20:00Z",
        upvotes: 89,
        downvotes: 5,
        comments: 12,
        priority: "medium",
      },
      {
        id: "3",
        title: "Mobile Push Notifications",
        description:
          "Real-time push notifications for mobile apps with customizable settings and preferences.",
        category: "mobile",
        status: "roadmap",
        author: "Mike Chen",
        submittedAt: "2024-02-28T09:15:00Z",
        upvotes: 201,
        downvotes: 18,
        comments: 31,
        priority: "high",
        adminNotes: "Assigned to mobile team for Q3 development",
      },
      {
        id: "4",
        title: "Bulk Data Export",
        description:
          "Allow users to export large datasets in various formats (CSV, JSON, XML) with scheduling options.",
        category: "data",
        status: "rejected",
        author: "Lisa Rodriguez",
        submittedAt: "2024-03-05T16:45:00Z",
        upvotes: 34,
        downvotes: 67,
        comments: 8,
        priority: "low",
        adminNotes: "Performance concerns and security implications",
      },
    ];
    setIdeas(mockIdeas);
  };

  const handleStatusChange = (
    ideaId: string,
    newStatus: "approved" | "rejected",
  ) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, status: newStatus } : idea,
      ),
    );
    toast.success(`Idea ${newStatus} successfully`);
  };

  const handleDeleteIdea = (ideaId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this idea? This action cannot be undone.",
      )
    ) {
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
      toast.success("Idea deleted successfully");
    }
  };

  const handleEditIdea = (idea: IdeaSubmission) => {
    setEditingIdea({ ...idea });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingIdea) return;

    setIdeas((prev) =>
      prev.map((idea) => (idea.id === editingIdea.id ? editingIdea : idea)),
    );
    setShowEditDialog(false);
    setEditingIdea(null);
    toast.success("Idea updated successfully");
  };

  const handleAssignToRoadmap = (idea: IdeaSubmission) => {
    setEditingIdea(idea);
    setRoadmapAssignment({ status: "planned" });
    setShowRoadmapDialog(true);
  };

  const handleRoadmapAssignmentSave = () => {
    if (!editingIdea) return;

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === editingIdea.id
          ? {
              ...idea,
              status: "roadmap",
              adminNotes: `Assigned to roadmap: ${roadmapAssignment.status}`,
            }
          : idea,
      ),
    );
    setShowRoadmapDialog(false);
    setEditingIdea(null);
    setRoadmapAssignment({ status: "planned" });
    toast.success("Idea assigned to roadmap successfully");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredIdeas = ideas
    .filter((idea) => {
      if (statusFilter !== "all" && idea.status !== statusFilter) return false;
      if (
        searchTerm &&
        !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !idea.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !idea.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField as keyof IdeaSubmission];
      let bValue = b[sortField as keyof IdeaSubmission];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "roadmap":
        return (
          <Badge className="bg-purple-500">
            <Rocket className="h-3 w-3 mr-1" />
            On Roadmap
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <SuperAdminLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Ideas Management</h1>
            <p className="text-muted-foreground">
              Review and manage user-submitted feature ideas
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold">
                    {ideas.filter((i) => i.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {ideas.filter((i) => i.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Roadmap</p>
                  <p className="text-2xl font-bold">
                    {ideas.filter((i) => i.status === "roadmap").length}
                  </p>
                </div>
                <Rocket className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Ideas</p>
                  <p className="text-2xl font-bold">{ideas.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas, descriptions, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="roadmap">On Roadmap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Table */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Ideas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("title")}
                      >
                        Idea
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("author")}
                      >
                        Author
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[80px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("priority")}
                      >
                        Priority
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("upvotes")}
                      >
                        Engagement
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-medium"
                        onClick={() => handleSort("submittedAt")}
                      >
                        Submitted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIdeas.map((idea) => (
                    <TableRow
                      key={idea.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => window.open(`/ideas/${idea.id}`, "_blank")}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">
                            {idea.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {idea.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{idea.author}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {idea.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(idea.status)}</TableCell>
                      <TableCell>{getPriorityBadge(idea.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-green-500" />
                            {idea.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3 text-red-500" />
                            {idea.downvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {idea.comments}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(idea.submittedAt).toLocaleDateString()}
                        </div>
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
                              onClick={() =>
                                window.open(`/ideas/${idea.id}`, "_blank")
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditIdea(idea)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Idea
                            </DropdownMenuItem>
                            {idea.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(idea.id, "approved")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(idea.id, "rejected")
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {(idea.status === "approved" ||
                              idea.status === "pending") && (
                              <DropdownMenuItem
                                onClick={() => handleAssignToRoadmap(idea)}
                              >
                                <Rocket className="h-4 w-4 mr-2" />
                                Assign to Roadmap
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

        {/* Edit Idea Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Idea</DialogTitle>
              <DialogDescription>
                Modify the idea details and admin notes.
              </DialogDescription>
            </DialogHeader>
            {editingIdea && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingIdea.title}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev ? { ...prev, title: e.target.value } : null,
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingIdea.description}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingIdea.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setEditingIdea((prev) =>
                        prev ? { ...prev, priority: value } : null,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-notes">Admin Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingIdea.adminNotes || ""}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev ? { ...prev, adminNotes: e.target.value } : null,
                      )
                    }
                    placeholder="Internal notes about this idea..."
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Roadmap Assignment Dialog */}
        <Dialog open={showRoadmapDialog} onOpenChange={setShowRoadmapDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign to Roadmap</DialogTitle>
              <DialogDescription>
                Set the roadmap status and timeline for this idea.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roadmap-status">Roadmap Status</Label>
                <Select
                  value={roadmapAssignment.status}
                  onValueChange={(
                    value: "planned" | "in-progress" | "completed",
                  ) =>
                    setRoadmapAssignment((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimated-completion">
                  Estimated Completion (Optional)
                </Label>
                <Input
                  id="estimated-completion"
                  type="date"
                  value={roadmapAssignment.estimatedCompletion || ""}
                  onChange={(e) =>
                    setRoadmapAssignment((prev) => ({
                      ...prev,
                      estimatedCompletion: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assigned-to">Assigned To (Optional)</Label>
                <Input
                  id="assigned-to"
                  value={roadmapAssignment.assignedTo || ""}
                  onChange={(e) =>
                    setRoadmapAssignment((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
                  }
                  placeholder="Team or person responsible"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRoadmapDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRoadmapAssignmentSave}>
                Assign to Roadmap
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}
