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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: "feature" | "improvement" | "bug-fix" | "integration";
  status: "planned" | "in-progress" | "completed" | "under-review";
  priority: "low" | "medium" | "high";
  votes: number;
  userVoted: boolean;
  submittedBy: string;
  submittedDate: string;
  estimatedCompletion?: string;
  comments: RoadmapComment[];
  tags: string[];
}

interface RoadmapComment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  votes: number;
}

export default function Roadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RoadmapItem[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "status">("votes");

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "feature" as const,
    tags: "",
  });

  useEffect(() => {
    // Load roadmap items from localStorage
    const savedItems = JSON.parse(
      localStorage.getItem("roadmap_items") || "[]",
    );

    if (savedItems.length === 0) {
      const sampleItems: RoadmapItem[] = [
        {
          id: "1",
          title: "Advanced Photo Editing Tools",
          description:
            "Add built-in photo editing capabilities including filters, cropping, and basic adjustments to streamline the workflow.",
          category: "feature",
          status: "planned",
          priority: "high",
          votes: 47,
          userVoted: false,
          submittedBy: "John D.",
          submittedDate: "2024-03-10",
          estimatedCompletion: "Q2 2024",
          tags: ["photo", "editing", "workflow"],
          comments: [
            {
              id: "1",
              author: "Sarah M.",
              message:
                "This would save so much time! Currently having to use external tools.",
              timestamp: "2024-03-11",
              votes: 8,
            },
          ],
        },
        {
          id: "2",
          title: "Mobile App for iOS and Android",
          description:
            "Native mobile applications for field workers to upload photos and update project status on the go.",
          category: "feature",
          status: "in-progress",
          priority: "high",
          votes: 89,
          userVoted: true,
          submittedBy: "Mike R.",
          submittedDate: "2024-02-15",
          estimatedCompletion: "Q3 2024",
          tags: ["mobile", "ios", "android", "field-work"],
          comments: [],
        },
        {
          id: "3",
          title: "Improved Gallery Search and Filtering",
          description:
            "Enhanced search capabilities with AI-powered tagging and advanced filtering options for better photo organization.",
          category: "improvement",
          status: "completed",
          priority: "medium",
          votes: 34,
          userVoted: false,
          submittedBy: "Lisa K.",
          submittedDate: "2024-01-20",
          tags: ["gallery", "search", "ai", "organization"],
          comments: [],
        },
        {
          id: "4",
          title: "Integration with Google Drive",
          description:
            "Automatic backup and sync of project photos with Google Drive for enhanced data security.",
          category: "integration",
          status: "under-review",
          priority: "medium",
          votes: 23,
          userVoted: false,
          submittedBy: "Tom B.",
          submittedDate: "2024-03-08",
          tags: ["google-drive", "backup", "sync"],
          comments: [],
        },
        {
          id: "5",
          title: "Fix: Photo Upload Progress Indicator",
          description:
            "Resolve issue where photo upload progress is not accurately displayed, causing user confusion.",
          category: "bug-fix",
          status: "in-progress",
          priority: "high",
          votes: 15,
          userVoted: true,
          submittedBy: "Alex W.",
          submittedDate: "2024-03-12",
          tags: ["upload", "progress", "ui"],
          comments: [],
        },
      ];

      localStorage.setItem("roadmap_items", JSON.stringify(sampleItems));
      setItems(sampleItems);
    } else {
      setItems(savedItems);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "recent":
          return (
            new Date(b.submittedDate).getTime() -
            new Date(a.submittedDate).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleCreateItem = () => {
    if (!newItem.title || !newItem.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const roadmapItem: RoadmapItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      status: "under-review",
      priority: "medium",
      votes: 1,
      userVoted: true,
      submittedBy: "You",
      submittedDate: new Date().toISOString().split("T")[0],
      tags: newItem.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      comments: [],
    };

    const updatedItems = [roadmapItem, ...items];
    setItems(updatedItems);
    localStorage.setItem("roadmap_items", JSON.stringify(updatedItems));

    setNewItem({ title: "", description: "", category: "feature", tags: "" });
    setShowCreateDialog(false);
    toast.success("Your idea has been submitted for review!");
  };

  const handleVote = (itemId: string, isUpvote: boolean) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (isUpvote && !item.userVoted) {
          return { ...item, votes: item.votes + 1, userVoted: true };
        } else if (!isUpvote && item.userVoted) {
          return {
            ...item,
            votes: Math.max(0, item.votes - 1),
            userVoted: false,
          };
        }
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("roadmap_items", JSON.stringify(updatedItems));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: {
        variant: "outline" as const,
        label: "Planned",
        icon: Calendar,
      },
      "in-progress": {
        variant: "default" as const,
        label: "In Progress",
        icon: Clock,
      },
      completed: {
        variant: "secondary" as const,
        label: "Completed",
        icon: CheckCircle2,
      },
      "under-review": {
        variant: "destructive" as const,
        label: "Under Review",
        icon: Target,
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

  const getCategoryIcon = (category: string) => {
    const icons = {
      feature: Lightbulb,
      improvement: TrendingUp,
      "bug-fix": Target,
      integration: Rocket,
    };
    return icons[category as keyof typeof icons] || Lightbulb;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      feature: { variant: "default" as const, label: "Feature" },
      improvement: { variant: "secondary" as const, label: "Improvement" },
      "bug-fix": { variant: "destructive" as const, label: "Bug Fix" },
      integration: { variant: "outline" as const, label: "Integration" },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Product Roadmap</h1>
            <p className="text-muted-foreground">
              Share ideas, vote on features, and see what's coming next
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Your Idea</DialogTitle>
                <DialogDescription>
                  Help us improve by sharing your feature requests and
                  suggestions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Brief, descriptive title for your idea"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(
                      value:
                        | "feature"
                        | "improvement"
                        | "bug-fix"
                        | "integration",
                    ) => setNewItem((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">New Feature</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="bug-fix">Bug Fix</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed description of your idea and how it would help"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <Input
                    id="tags"
                    value={newItem.tags}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="mobile, ui, integration (comma-separated)"
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
                <Button onClick={handleCreateItem}>Submit Idea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feature">Features</SelectItem>
                  <SelectItem value="improvement">Improvements</SelectItem>
                  <SelectItem value="bug-fix">Bug Fixes</SelectItem>
                  <SelectItem value="integration">Integrations</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: "votes" | "recent" | "status") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">Most Voted</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Roadmap Items */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                        <Button
                          variant={item.userVoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(item.id, true)}
                          className="w-10 h-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-lg">
                          {item.votes}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(item.id, false)}
                          className="w-10 h-8"
                          disabled={!item.userVoted}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(item.category)}
                            {getStatusBadge(item.status)}
                          </div>
                        </div>

                        <p className="text-muted-foreground">
                          {item.description}
                        </p>

                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{item.submittedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  item.submittedDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {item.comments.length > 0 && (
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{item.comments.length} comments</span>
                              </div>
                            )}
                          </div>
                          {item.estimatedCompletion && (
                            <div className="flex items-center gap-1">
                              <span>ETA: {item.estimatedCompletion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No ideas found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  selectedCategory !== "all" ||
                  selectedStatus !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "Be the first to submit an idea!"}
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Submit First Idea
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
