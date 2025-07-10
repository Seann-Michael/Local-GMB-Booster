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
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
  Eye,
  MoreVertical,
  Book,
  FileText,
  Video,
  HelpCircle,
  Settings,
  Users,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "archived";
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface HelpComment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  status: "approved" | "pending" | "spam";
  helpful: boolean;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
  order: number;
  visible: boolean;
}

export default function SuperAdminHelp() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [comments, setComments] = useState<HelpComment[]>([]);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HelpArticle | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState("articles");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "draft" as const,
    difficulty: "beginner" as const,
    featured: false,
  });

  useEffect(() => {
    loadHelpData();
  }, []);

  const loadHelpData = () => {
    // Load sample data
    const sampleArticles: HelpArticle[] = [
      {
        id: "1",
        title: "Getting Started with Your Dashboard",
        content:
          "Welcome to your new dashboard! This comprehensive guide will walk you through all the essential features...",
        category: "Getting Started",
        tags: ["dashboard", "basics", "tutorial"],
        status: "published",
        author: "Admin Team",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        views: 1247,
        helpfulVotes: 89,
        unhelpfulVotes: 12,
        featured: true,
        difficulty: "beginner",
      },
      {
        id: "2",
        title: "Advanced Project Management Features",
        content:
          "Learn how to use advanced features like custom workflows, automation rules, and team collaboration tools...",
        category: "Project Management",
        tags: ["projects", "advanced", "workflow"],
        status: "published",
        author: "Product Team",
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
        views: 856,
        helpfulVotes: 67,
        unhelpfulVotes: 8,
        featured: false,
        difficulty: "advanced",
      },
      {
        id: "3",
        title: "Billing and Payment FAQ",
        content:
          "Common questions about billing, payments, plan changes, and subscription management...",
        category: "Billing",
        tags: ["billing", "payments", "faq"],
        status: "published",
        author: "Support Team",
        createdAt: "2024-01-05T11:00:00Z",
        updatedAt: "2024-01-15T10:20:00Z",
        views: 542,
        helpfulVotes: 45,
        unhelpfulVotes: 5,
        featured: false,
        difficulty: "beginner",
      },
      {
        id: "4",
        title: "API Integration Guide",
        content:
          "Complete guide for integrating with our REST API, including authentication, endpoints, and examples...",
        category: "Developers",
        tags: ["api", "integration", "developers"],
        status: "draft",
        author: "Engineering Team",
        createdAt: "2024-01-20T15:00:00Z",
        updatedAt: "2024-01-21T09:30:00Z",
        views: 23,
        helpfulVotes: 2,
        unhelpfulVotes: 0,
        featured: false,
        difficulty: "advanced",
      },
    ];

    const sampleCategories: HelpCategory[] = [
      {
        id: "1",
        name: "Getting Started",
        description: "Essential guides for new users",
        icon: "rocket",
        articleCount: 8,
        order: 1,
        visible: true,
      },
      {
        id: "2",
        name: "Project Management",
        description: "Learn to manage projects effectively",
        icon: "folder",
        articleCount: 12,
        order: 2,
        visible: true,
      },
      {
        id: "3",
        name: "Billing",
        description: "Payment and subscription help",
        icon: "credit-card",
        articleCount: 6,
        order: 3,
        visible: true,
      },
      {
        id: "4",
        name: "Developers",
        description: "Technical documentation and APIs",
        icon: "code",
        articleCount: 15,
        order: 4,
        visible: true,
      },
    ];

    const sampleComments: HelpComment[] = [
      {
        id: "1",
        articleId: "1",
        author: "john@example.com",
        content:
          "This guide was really helpful! Thanks for the clear explanations.",
        createdAt: "2024-01-21T10:30:00Z",
        status: "approved",
        helpful: true,
      },
      {
        id: "2",
        articleId: "1",
        author: "spam@bot.com",
        content: "Click here for amazing deals!!!",
        createdAt: "2024-01-20T16:45:00Z",
        status: "spam",
        helpful: false,
      },
      {
        id: "3",
        articleId: "2",
        author: "sarah@company.com",
        content: "Could you add more examples for the workflow automation?",
        createdAt: "2024-01-19T14:20:00Z",
        status: "pending",
        helpful: true,
      },
    ];

    setArticles(sampleArticles);
    setCategories(sampleCategories);
    setComments(sampleComments);
  };

  const handleCreateArticle = () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newArticle: HelpArticle = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: formData.status,
      author: "Super Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      featured: formData.featured,
      difficulty: formData.difficulty,
    };

    setArticles([newArticle, ...articles]);
    resetForm();
    setShowCreateDialog(false);
    toast.success("Article created successfully!");
  };

  const handleEditArticle = (article: HelpArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags.join(", "),
      status: article.status,
      difficulty: article.difficulty,
      featured: article.featured,
    });
    setShowCreateDialog(true);
  };

  const handleUpdateArticle = () => {
    if (!editingArticle) return;

    const updatedArticles = articles.map((article) =>
      article.id === editingArticle.id
        ? {
            ...article,
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
            status: formData.status,
            difficulty: formData.difficulty,
            featured: formData.featured,
            updatedAt: new Date().toISOString(),
          }
        : article,
    );

    setArticles(updatedArticles);
    resetForm();
    setShowCreateDialog(false);
    setEditingArticle(null);
    toast.success("Article updated successfully!");
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((article) => article.id !== articleId));
      toast.success("Article deleted successfully!");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully!");
    }
  };

  const handleModerateComment = (
    commentId: string,
    status: "approved" | "spam",
  ) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, status } : comment,
      ),
    );
    toast.success(`Comment ${status} successfully!`);
  };

  const toggleFeatured = (articleId: string) => {
    setArticles(
      articles.map((article) =>
        article.id === articleId
          ? { ...article, featured: !article.featured }
          : article,
      ),
    );
    toast.success("Article updated!");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
      status: "draft",
      difficulty: "beginner",
      featured: false,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge className="bg-blue-500">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-yellow-500">Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-red-500">Advanced</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (categoryFilter !== "all" && article.category !== categoryFilter)
      return false;
    if (statusFilter !== "all" && article.status !== statusFilter) return false;
    if (
      searchTerm &&
      !article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !article.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    )
      return false;
    return true;
  });

  const pendingComments = comments.filter(
    (comment) => comment.status === "pending",
  );
  const spamComments = comments.filter((comment) => comment.status === "spam");

  return (
    <SuperAdminLayout>
      <div className="max-w-full overflow-x-hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Help Center Management</h1>
              <p className="text-muted-foreground">
                Manage help articles, comments, and knowledge base content
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? "Edit Article" : "Create New Article"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingArticle
                        ? "Update the article details."
                        : "Create a new help article for users."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter article title..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(value: any) =>
                            setFormData((prev) => ({
                              ...prev,
                              difficulty: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        placeholder="e.g. tutorial, getting started, dashboard"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Enter article content in Markdown..."
                        rows={12}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) =>
                            setFormData((prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor="featured">Featured Article</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setEditingArticle(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingArticle
                          ? handleUpdateArticle
                          : handleCreateArticle
                      }
                    >
                      {editingArticle ? "Update Article" : "Create Article"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Articles
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{articles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {articles.filter((a) => a.status === "published").length}{" "}
                  published
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {articles.reduce((sum, article) => sum + article.views, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all articles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Comments
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingComments.length}
                </div>
                <p className="text-xs text-muted-foreground">Need moderation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Spam Detected
                </CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{spamComments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Flagged comments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <Button
              variant={selectedTab === "articles" ? "default" : "ghost"}
              onClick={() => setSelectedTab("articles")}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Articles
            </Button>
            <Button
              variant={selectedTab === "comments" ? "default" : "ghost"}
              onClick={() => setSelectedTab("comments")}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Comments ({pendingComments.length})
            </Button>
            <Button
              variant={selectedTab === "categories" ? "default" : "ghost"}
              onClick={() => setSelectedTab("categories")}
              className="gap-2"
            >
              <Book className="h-4 w-4" />
              Categories
            </Button>
          </div>

          {/* Articles Tab */}
          {selectedTab === "articles" && (
            <>
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Articles Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Help Articles ({filteredArticles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Article</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredArticles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">
                                    {article.title}
                                  </div>
                                  {article.featured && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  By {article.author}
                                </div>
                                <div className="flex gap-1">
                                  {article.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{article.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {article.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(article.status)}
                            </TableCell>
                            <TableCell>
                              {getDifficultyBadge(article.difficulty)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.views}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3 text-green-500" />
                                  {article.helpfulVotes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsDown className="h-3 w-3 text-red-500" />
                                  {article.unhelpfulVotes}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(article.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      window.open(
                                        `/help/${article.id}`,
                                        "_blank",
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Article
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditArticle(article)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Article
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleFeatured(article.id)}
                                  >
                                    <Star className="h-4 w-4 mr-2" />
                                    {article.featured ? "Unfeature" : "Feature"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteArticle(article.id)
                                    }
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Article
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
            </>
          )}

          {/* Comments Tab */}
          {selectedTab === "comments" && (
            <Card>
              <CardHeader>
                <CardTitle>Comment Moderation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Comment</TableHead>
                        <TableHead>Article</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((comment) => {
                        const article = articles.find(
                          (a) => a.id === comment.articleId,
                        );
                        return (
                          <TableRow key={comment.id}>
                            <TableCell className="max-w-md">
                              <div className="truncate">{comment.content}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {article?.title || "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>{comment.author}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  comment.status === "approved"
                                    ? "default"
                                    : comment.status === "spam"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {comment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {comment.status === "pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleModerateComment(
                                          comment.id,
                                          "approved",
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleModerateComment(
                                          comment.id,
                                          "spam",
                                        )
                                      }
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories Tab */}
          {selectedTab === "categories" && (
            <Card>
              <CardHeader>
                <CardTitle>Help Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Articles</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.articleCount}</TableCell>
                          <TableCell>{category.order}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                category.visible ? "default" : "secondary"
                              }
                            >
                              {category.visible ? "Visible" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
