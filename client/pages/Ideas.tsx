import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Lightbulb,
  Rocket,
  CheckCircle,
  Clock,
  Code,
  Zap,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status:
    | "submitted"
    | "under-review"
    | "planned"
    | "in-progress"
    | "completed"
    | "declined";
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  author: string;
  createdAt: string;
  comments: Comment[];
  priority: "low" | "medium" | "high";
  images?: string[];
  fullDescription?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  category: string;
  estimatedCompletion?: string;
  completedAt?: string;
}

export default function Ideas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    loadIdeas();
    loadRoadmap();
  }, []);

  const loadIdeas = () => {
    // Load from localStorage or API
    const savedIdeas = localStorage.getItem("userIdeas");
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    } else {
      // Mock data
      const mockIdeas: Idea[] = [
        {
          id: "1",
          title: "Dark Mode Support",
          description:
            "Add a dark theme option for better usability in low light environments",
          fullDescription:
            "Add a comprehensive dark theme option that works across the entire application. This would include proper contrast ratios, accessibility compliance, and user preference persistence. The dark mode should be toggleable from the user settings and remember the user's choice across sessions.",
          category: "UI/UX",
          status: "planned",
          upvotes: 42,
          downvotes: 3,
          userVote: null,
          author: "John Smith",
          createdAt: "2024-01-15T10:30:00Z",
          comments: [
            {
              id: "c1",
              author: "Admin",
              content: "Great suggestion! This is now on our roadmap for Q2.",
              createdAt: "2024-01-16T14:20:00Z",
              isAdmin: true,
            },
          ],
          priority: "high",
          images: ["/api/placeholder/600/400"],
        },
        {
          id: "2",
          title: "Mobile App",
          description:
            "Native mobile application for iOS and Android to manage projects on the go",
          fullDescription:
            "Develop native mobile applications for both iOS and Android platforms. The app should include core functionality like project management, photo uploads, customer communication, and review management. Push notifications for new reviews and project updates would be essential.",
          category: "Mobile",
          status: "under-review",
          upvotes: 58,
          downvotes: 9,
          userVote: "up",
          author: "Sarah Johnson",
          createdAt: "2024-01-10T09:15:00Z",
          comments: [],
          priority: "high",
          images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
        },
        {
          id: "3",
          title: "Bulk Photo Upload",
          description:
            "Allow uploading multiple photos at once with drag-and-drop support",
          fullDescription:
            "Implement a drag-and-drop interface for bulk photo uploads. This should support multiple file formats, automatic resizing, and batch processing. Progress indicators and error handling for failed uploads would be important for user experience.",
          category: "Features",
          status: "completed",
          upvotes: 21,
          downvotes: 2,
          userVote: null,
          author: "Mike Davis",
          createdAt: "2024-01-05T16:45:00Z",
          comments: [],
          priority: "medium",
          images: ["/api/placeholder/500/300"],
        },
        {
          id: "4",
          title: "Integration with QuickBooks",
          description:
            "Sync project costs and billing information with QuickBooks",
          fullDescription:
            "Create a seamless integration with QuickBooks to automatically sync project costs, expenses, and billing information. This would save time on bookkeeping and ensure accurate financial records. Support for both QuickBooks Online and Desktop versions would be ideal.",
          category: "Integrations",
          status: "submitted",
          upvotes: 28,
          downvotes: 3,
          userVote: null,
          author: "Lisa Brown",
          createdAt: "2024-01-12T11:20:00Z",
          comments: [],
          priority: "medium",
        },
      ];
      setIdeas(mockIdeas);
      localStorage.setItem("userIdeas", JSON.stringify(mockIdeas));
    }
  };

  const loadRoadmap = () => {
    const mockRoadmap: RoadmapItem[] = [
      {
        id: "r1",
        title: "Dark Mode Support",
        description: "Implement system-wide dark theme",
        status: "planned",
        category: "UI/UX",
        estimatedCompletion: "2024-06-01",
      },
      {
        id: "r2",
        title: "Advanced Reporting",
        description: "Enhanced analytics and custom report generation",
        status: "in-progress",
        category: "Analytics",
        estimatedCompletion: "2024-04-15",
      },
      {
        id: "r3",
        title: "API Rate Limiting",
        description: "Implement proper API rate limiting and monitoring",
        status: "completed",
        category: "Performance",
        completedAt: "2024-01-20",
      },
      {
        id: "r4",
        title: "Two-Factor Authentication",
        description: "Add 2FA security feature for all user accounts",
        status: "in-progress",
        category: "Security",
        estimatedCompletion: "2024-03-30",
      },
    ];
    setRoadmapItems(mockRoadmap);
  };

  const handleVote = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          const newVotes = idea.userVoted ? idea.votes - 1 : idea.votes + 1;
          const updatedIdea = {
            ...idea,
            votes: newVotes,
            userVoted: !idea.userVoted,
          };
          return updatedIdea;
        }
        return idea;
      }),
    );
    toast.success("Vote recorded!");
  };

  const handleSubmitIdea = () => {
    if (!newIdea.title || !newIdea.description || !newIdea.category) {
      toast.error("Please fill in all fields");
      return;
    }

    const idea: Idea = {
      id: Date.now().toString(),
      title: newIdea.title,
      description: newIdea.description,
      category: newIdea.category,
      status: "submitted",
      votes: 1,
      userVoted: true,
      author: "Current User",
      createdAt: new Date().toISOString(),
      comments: [],
      priority: "medium",
    };

    const updatedIdeas = [...ideas, idea];
    setIdeas(updatedIdeas);
    localStorage.setItem("userIdeas", JSON.stringify(updatedIdeas));

    setNewIdea({ title: "", description: "", category: "" });
    setShowNewIdeaDialog(false);
    toast.success("Idea submitted successfully!");
  };

  const filteredIdeas = ideas
    .filter((idea) => {
      if (categoryFilter !== "all" && idea.category !== categoryFilter) {
        return false;
      }
      if (
        searchTerm &&
        !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !idea.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-500">
            <Code className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "planned":
        return (
          <Badge className="bg-purple-500">
            <Calendar className="h-3 w-3 mr-1" />
            Planned
          </Badge>
        );
      case "under-review":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">Submitted</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const categories = [
    "UI/UX",
    "Features",
    "Mobile",
    "Integrations",
    "Performance",
    "Security",
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Feature Ideas & Roadmap</h1>
            <p className="text-muted-foreground">
              Share your ideas and see what's coming next
            </p>
          </div>
          <Dialog open={showNewIdeaDialog} onOpenChange={setShowNewIdeaDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New Idea</DialogTitle>
                <DialogDescription>
                  Share your feature request or improvement idea
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newIdea.title}
                    onChange={(e) =>
                      setNewIdea((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Brief title for your idea"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newIdea.category}
                    onValueChange={(value) =>
                      setNewIdea((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newIdea.description}
                    onChange={(e) =>
                      setNewIdea((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed description of your idea..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewIdeaDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitIdea}>Submit Idea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="ideas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Ideas ({ideas.length})
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <Rocket className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="votes">Most Votes</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center min-w-[60px]">
                        <Button
                          variant={idea.userVoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(idea.id)}
                          className="mb-2"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg">{idea.votes}</span>
                        <span className="text-xs text-muted-foreground">
                          votes
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {idea.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {idea.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getPriorityBadge(idea.priority)}
                            {getStatusBadge(idea.status)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {idea.author}
                            </span>
                            <Badge variant="outline">{idea.category}</Badge>
                            <span>
                              {new Date(idea.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{idea.comments.length} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Planned */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Planned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmapItems
                      .filter((item) => item.status === "planned")
                      .map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.estimatedCompletion && (
                              <span className="text-xs text-muted-foreground">
                                Est:{" "}
                                {new Date(
                                  item.estimatedCompletion,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmapItems
                      .filter((item) => item.status === "in-progress")
                      .map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.estimatedCompletion && (
                              <span className="text-xs text-muted-foreground">
                                Est:{" "}
                                {new Date(
                                  item.estimatedCompletion,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Completed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmapItems
                      .filter((item) => item.status === "completed")
                      .map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.completedAt && (
                              <span className="text-xs text-green-600">
                                ✓{" "}
                                {new Date(
                                  item.completedAt,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
