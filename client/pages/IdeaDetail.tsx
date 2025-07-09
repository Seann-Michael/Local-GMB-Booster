import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  Code,
  Send,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
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
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAdmin?: boolean;
}

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // Load idea data (normally from API)
    const loadIdea = () => {
      const mockIdea: Idea = {
        id: id || "1",
        title: "Dark Mode Support",
        description:
          "Add a dark theme option for better usability in low light environments",
        fullDescription:
          "Add a comprehensive dark theme option that works across the entire application. This would include proper contrast ratios, accessibility compliance, and user preference persistence. The dark mode should be toggleable from the user settings and remember the user's choice across sessions.\n\nKey features would include:\n• Toggle switch in user preferences\n• System preference detection\n• Persistent user choice across sessions\n• Proper contrast ratios for accessibility\n• Smooth transitions between themes\n• Support for all existing UI components\n\nThis would greatly improve usability for users who work in low-light environments or prefer dark interfaces.",
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
            content:
              "Great suggestion! This is now on our roadmap for Q2. We're excited to implement this feature.",
            createdAt: "2024-01-16T14:20:00Z",
            isAdmin: true,
          },
          {
            id: "c2",
            author: "Sarah Johnson",
            content:
              "This would be amazing! I work late nights and a dark mode would really help reduce eye strain.",
            createdAt: "2024-01-17T09:15:00Z",
            isAdmin: false,
          },
          {
            id: "c3",
            author: "Mike Davis",
            content:
              "Please make sure it follows the user's system preference automatically. That would be perfect!",
            createdAt: "2024-01-18T16:45:00Z",
            isAdmin: false,
          },
        ],
        priority: "high",
        images: ["/api/placeholder/600/400", "/api/placeholder/500/300"],
      };
      setIdea(mockIdea);
    };

    if (id) {
      loadIdea();
    }
  }, [id]);

  const handleVote = (voteType: "up" | "down") => {
    if (!idea) return;

    setIdea((prev) => {
      if (!prev) return prev;

      let newUpvotes = prev.upvotes;
      let newDownvotes = prev.downvotes;
      let newUserVote: "up" | "down" | null = voteType;

      // Remove previous vote if exists
      if (prev.userVote === "up") {
        newUpvotes--;
      } else if (prev.userVote === "down") {
        newDownvotes--;
      }

      // If clicking the same vote type, remove the vote
      if (prev.userVote === voteType) {
        newUserVote = null;
      } else {
        // Add new vote
        if (voteType === "up") {
          newUpvotes++;
        } else {
          newDownvotes++;
        }
      }

      return {
        ...prev,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote,
      };
    });
    toast.success("Vote recorded!");
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !idea) return;

    setIsSubmittingComment(true);

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };

    setIdea((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: [...prev.comments, comment],
      };
    });

    setNewComment("");
    setIsSubmittingComment(false);
    toast.success("Comment added!");
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium Priority</Badge>;
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return null;
    }
  };

  if (!idea) {
    return (
      <AppLayout>
        <div className="container px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading idea...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/ideas")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Idea Details</h1>
            <p className="text-muted-foreground">
              View and discuss feature ideas
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Idea Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {idea.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {idea.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {idea.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(idea.priority)}
                    {getStatusBadge(idea.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {idea.fullDescription || idea.description}
                  </p>
                </div>

                {/* Images */}
                {idea.images && idea.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Images ({idea.images.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {idea.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Idea image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({idea.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this idea..."
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmittingComment ? "Adding..." : "Add Comment"}
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {idea.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {comment.author}
                            </span>
                            {comment.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Voting Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Vote on this idea</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button
                  variant={idea.userVote === "up" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleVote("up")}
                  className="w-full gap-2"
                >
                  <ThumbsUp className="h-5 w-5" />
                  Upvote ({idea.upvotes})
                </Button>
                <Button
                  variant={idea.userVote === "down" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleVote("down")}
                  className="w-full gap-2"
                >
                  <ThumbsDown className="h-5 w-5" />
                  Downvote ({idea.downvotes})
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Net Score: {idea.upvotes - idea.downvotes}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Votes:</span>
                  <span className="font-medium">
                    {idea.upvotes + idea.downvotes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Comments:</span>
                  <span className="font-medium">{idea.comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <Badge variant="outline">{idea.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Priority:</span>
                  {getPriorityBadge(idea.priority)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
