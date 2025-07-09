import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThumbsUp,
  MessageSquare,
  Search,
  Lightbulb,
  Rocket,
  CheckCircle,
  Clock,
  Code,
  Calendar,
  User,
  Filter,
  Zap,
  Smartphone,
  BarChart3,
  Settings,
  Globe,
  CreditCard,
  Mail,
  Shield,
  FileText,
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
  votes: number;
  userVoted: boolean;
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
  votes: number;
  estimatedCompletion?: string;
  completedAt?: string;
}

interface CategoryBoard {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  ideaCount: number;
  totalVotes: number;
  color: string;
}

export default function Ideas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [categoryBoards, setCategoryBoards] = useState<CategoryBoard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("boards");

  useEffect(() => {
    loadCategoryBoards();
    loadIdeas();
    loadRoadmap();
  }, []);

  const loadCategoryBoards = () => {
    const boards: CategoryBoard[] = [
      {
        id: "automation",
        name: "Automation & Workflows",
        description: "Streamline processes with smart automation",
        icon: Zap,
        ideaCount: 89,
        totalVotes: 1247,
        color: "bg-blue-500",
      },
      {
        id: "mobile",
        name: "Mobile Experience",
        description: "Enhance mobile apps and responsive design",
        icon: Smartphone,
        ideaCount: 34,
        totalVotes: 892,
        color: "bg-purple-500",
      },
      {
        id: "analytics",
        name: "Analytics & Reporting",
        description: "Better insights and data visualization",
        icon: BarChart3,
        ideaCount: 67,
        totalVotes: 1456,
        color: "bg-green-500",
      },
      {
        id: "integrations",
        name: "Integrations & APIs",
        description: "Connect with more tools and services",
        icon: Globe,
        ideaCount: 45,
        totalVotes: 678,
        color: "bg-orange-500",
      },
      {
        id: "payments",
        name: "Payments & Billing",
        description: "Payment processing and billing features",
        icon: CreditCard,
        ideaCount: 23,
        totalVotes: 534,
        color: "bg-emerald-500",
      },
      {
        id: "communication",
        name: "Communication",
        description: "Email, SMS, and messaging improvements",
        icon: Mail,
        ideaCount: 56,
        totalVotes: 789,
        color: "bg-pink-500",
      },
      {
        id: "security",
        name: "Security & Privacy",
        description: "Enhanced security and privacy controls",
        icon: Shield,
        ideaCount: 19,
        totalVotes: 345,
        color: "bg-red-500",
      },
      {
        id: "ui-ux",
        name: "UI/UX Improvements",
        description: "User interface and experience enhancements",
        icon: Settings,
        ideaCount: 78,
        totalVotes: 1123,
        color: "bg-indigo-500",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Improve guides, tutorials, and help content",
        icon: FileText,
        ideaCount: 12,
        totalVotes: 156,
        color: "bg-gray-500",
      },
    ];
    setCategoryBoards(boards);
  };

  const loadIdeas = () => {
    const mockIdeas: Idea[] = [
      {
        id: "1",
        title: "Dark Mode Support",
        description:
          "Add a dark theme option for better usability in low light environments",
        category: "ui-ux",
        status: "planned",
        votes: 42,
        userVoted: false,
        author: "John Smith",
        createdAt: "2024-01-15T10:30:00Z",
        comments: [],
        priority: "high",
      },
      {
        id: "2",
        title: "Native Mobile App",
        description:
          "Native mobile application for iOS and Android to manage projects on the go",
        category: "mobile",
        status: "under-review",
        votes: 58,
        userVoted: true,
        author: "Sarah Johnson",
        createdAt: "2024-01-10T09:15:00Z",
        comments: [],
        priority: "high",
      },
      {
        id: "3",
        title: "Advanced Analytics Dashboard",
        description:
          "More detailed analytics with custom metrics and better data visualization",
        category: "analytics",
        status: "submitted",
        votes: 34,
        userVoted: false,
        author: "Mike Chen",
        createdAt: "2024-01-12T14:20:00Z",
        comments: [],
        priority: "medium",
      },
      {
        id: "4",
        title: "Zapier Integration",
        description:
          "Connect with Zapier for unlimited automation possibilities",
        category: "integrations",
        status: "planned",
        votes: 67,
        userVoted: false,
        author: "Lisa Rodriguez",
        createdAt: "2024-01-08T11:45:00Z",
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
        description: "Implement system-wide dark theme with user preferences",
        status: "planned",
        category: "UI/UX",
        votes: 74,
        estimatedCompletion: "2024-06-01",
      },
      {
        id: "r2",
        title: "Advanced Reporting Engine",
        description:
          "Enhanced analytics and custom report generation with export capabilities",
        status: "in-progress",
        category: "Analytics",
        votes: 128,
        estimatedCompletion: "2024-04-15",
      },
      {
        id: "r3",
        title: "Mobile Push Notifications",
        description: "Real-time push notifications for mobile devices",
        status: "completed",
        category: "Mobile",
        votes: 89,
        completedAt: "2024-02-01",
      },
      {
        id: "r4",
        title: "Webhook Management",
        description: "Improved webhook configuration and monitoring tools",
        status: "planned",
        category: "Integrations",
        votes: 45,
        estimatedCompletion: "2024-07-01",
      },
    ];
    setRoadmapItems(mockRoadmap);
  };

  const handleVote = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            votes: idea.userVoted ? idea.votes - 1 : idea.votes + 1,
            userVoted: !idea.userVoted,
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
    if (selectedCategory && idea.category !== selectedCategory) {
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
  });

  const getCategoryName = (categoryId: string) => {
    const board = categoryBoards.find((b) => b.id === categoryId);
    return board ? board.name : categoryId;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Ideas & Roadmap
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Share your ideas and see what's coming next
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("boards")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "boards"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Boards
                </button>
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "roadmap"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Roadmap
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "feedback"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Feedback
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Boards Tab */}
          {activeTab === "boards" && (
            <div className="space-y-8">
              {/* Category Boards */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Boards
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryBoards.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => {
                        setSelectedCategory(board.id);
                        setActiveTab("feedback");
                      }}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-lg ${board.color} text-white`}
                        >
                          <board.icon className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {board.totalVotes}
                          </div>
                          <div className="text-xs text-gray-500">votes</div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {board.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {board.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {board.ideaCount} ideas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === "roadmap" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Roadmap</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Planned */}
                <div>
                  <div className="bg-gray-50 rounded-t-lg p-4 border-l-4 border-teal-500">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-500" />
                      Planned
                    </h3>
                  </div>
                  <div className="bg-white rounded-b-lg border border-gray-200 p-4 space-y-4">
                    {roadmapItems
                      .filter((item) => item.status === "planned")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {item.votes}
                            </Button>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
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
                  <div className="bg-gray-50 rounded-t-lg p-4 border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Code className="h-5 w-5 text-purple-500" />
                      In Progress
                    </h3>
                  </div>
                  <div className="bg-white rounded-b-lg border border-gray-200 p-4 space-y-4">
                    {roadmapItems
                      .filter((item) => item.status === "in-progress")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {item.votes}
                            </Button>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
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
                  <div className="bg-gray-50 rounded-t-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Completed
                    </h3>
                  </div>
                  <div className="bg-white rounded-b-lg border border-gray-200 p-4 space-y-4">
                    {roadmapItems
                      .filter((item) => item.status === "completed")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {item.votes}
                            </Button>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Completed
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedCategory
                      ? getCategoryName(selectedCategory)
                      : "All Ideas"}
                  </h2>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      ← Back to all ideas
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {filteredIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center">
                        <Button
                          variant={idea.userVoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(idea.id)}
                          className="h-8 px-2 text-xs"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {idea.votes}
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="text-lg font-medium text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors"
                              onClick={() => navigate(`/ideas/${idea.id}`)}
                            >
                              {idea.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {idea.description}
                            </p>
                          </div>
                          {getStatusBadge(idea.status)}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {idea.author}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(idea.category)}
                            </Badge>
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
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
