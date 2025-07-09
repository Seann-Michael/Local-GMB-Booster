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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ideas & Roadmap
          </h1>
          <p className="text-gray-600">
            Share your ideas and see what's coming next
          </p>
        </div>

        <Tabs defaultValue="ideas" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <Rocket className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Ideas List */}
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center min-w-[60px]">
                      <Button
                        variant={idea.userVote === "up" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(idea.id, "up")}
                        className="mb-2 h-8 w-8 p-0"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {idea.upvotes}
                        </div>
                        <div className="text-lg font-bold text-red-500">
                          {idea.downvotes}
                        </div>
                      </div>
                      <Button
                        variant={
                          idea.userVote === "down" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleVote(idea.id, "down")}
                        className="mt-2 h-8 w-8 p-0"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors">
                            {idea.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {idea.description}
                          </p>
                        </div>
                        {getStatusBadge(idea.status)}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {idea.author}
                          </span>
                          <Badge variant="outline">{idea.category}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{idea.comments.length} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Planned */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Planned
                </h3>
                <div className="space-y-3">
                  {roadmapItems
                    .filter((item) => item.status === "planned")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.estimatedCompletion && (
                            <span className="text-xs text-gray-500">
                              {new Date(
                                item.estimatedCompletion,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* In Progress */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  In Progress
                </h3>
                <div className="space-y-3">
                  {roadmapItems
                    .filter((item) => item.status === "in-progress")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.estimatedCompletion && (
                            <span className="text-xs text-gray-500">
                              {new Date(
                                item.estimatedCompletion,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Completed */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completed
                </h3>
                <div className="space-y-3">
                  {roadmapItems
                    .filter((item) => item.status === "completed")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-xs text-green-600">✓ Done</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
