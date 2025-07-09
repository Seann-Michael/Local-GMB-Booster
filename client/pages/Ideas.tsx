import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Search,
  Lightbulb,
  Rocket,
  CheckCircle,
  Clock,
  Code,
  Calendar,
  User,
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
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    loadIdeas();
    loadRoadmap();
  }, []);

  const loadIdeas = () => {
    const mockIdeas: Idea[] = [
      {
        id: "1",
        title: "Dark Mode Support",
        description:
          "Add a dark theme option for better usability in low light environments",
        category: "UI/UX",
        status: "planned",
        upvotes: 42,
        downvotes: 3,
        userVote: null,
        author: "John Smith",
        createdAt: "2024-01-15T10:30:00Z",
        comments: [],
        priority: "high",
      },
      {
        id: "2",
        title: "Mobile App",
        description:
          "Native mobile application for iOS and Android to manage projects on the go",
        category: "Mobile",
        status: "under-review",
        upvotes: 58,
        downvotes: 9,
        userVote: "up",
        author: "Sarah Johnson",
        createdAt: "2024-01-10T09:15:00Z",
        comments: [],
        priority: "high",
      },
    ];
    setIdeas(mockIdeas);
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
    ];
    setRoadmapItems(mockRoadmap);
  };

  const handleVote = (ideaId: string, voteType: "up" | "down") => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          let newUpvotes = idea.upvotes;
          let newDownvotes = idea.downvotes;
          let newUserVote: "up" | "down" | null = voteType;

          if (idea.userVote === "up") {
            newUpvotes--;
          } else if (idea.userVote === "down") {
            newDownvotes--;
          }

          if (idea.userVote === voteType) {
            newUserVote = null;
          } else {
            if (voteType === "up") {
              newUpvotes++;
            } else {
              newDownvotes++;
            }
          }

          return {
            ...idea,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote,
          };
        }
        return idea;
      }),
    );
    toast.success("Vote recorded!");
  };

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

  const filteredIdeas = ideas.filter((idea) => {
    if (categoryFilter !== "all" && idea.category !== categoryFilter) {
      return false;
    }
    if (
      searchTerm &&
      !idea.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
                      <SelectItem value="UI/UX">UI/UX</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Features">Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <Card
                  key={idea.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center min-w-[80px]">
                        <Button
                          variant={
                            idea.userVote === "up" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleVote(idea.id, "up")}
                          className="mb-2"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg text-green-600">
                          {idea.upvotes}
                        </span>
                        <span className="font-bold text-lg text-red-600">
                          {idea.downvotes}
                        </span>
                        <Button
                          variant={
                            idea.userVote === "down" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleVote(idea.id, "down")}
                          className="mt-2"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors">
                              {idea.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {idea.description}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
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
