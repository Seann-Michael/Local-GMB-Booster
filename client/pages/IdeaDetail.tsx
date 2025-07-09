import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Calendar,
  User,
  Send,
  CheckCircle,
  Clock,
  Code,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAdmin?: boolean;
}

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

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdea();
  }, [id]);

  const loadIdea = () => {
    // Mock data - in real app this would be an API call
    const mockIdea: Idea = {
      id: id || "1",
      title: "Dark Mode Support",
      description: `Add a comprehensive dark theme option for better usability in low light environments. This would include:

• System-wide dark theme that respects user's OS preference
• Toggle option in user settings
• High contrast mode for accessibility
• Custom theme colors for branding
• Automatic switching based on time of day

The implementation should ensure all components, modals, and pages properly support dark mode without breaking the existing design system. We should also consider user preferences and provide smooth transitions between light and dark modes.

This feature has been highly requested by our user base, especially those who work in low-light environments or prefer dark interfaces for reduced eye strain during extended usage sessions.`,
      category: "ui-ux",
      status: "planned",
      votes: 142,
      userVoted: false,
      author: "John Smith",
      createdAt: "2024-01-15T10:30:00Z",
      comments: [
        {
          id: "c1",
          author: "Sarah Johnson",
          content:
            "This would be amazing! I use the app a lot in the evening and a dark mode would really help reduce eye strain.",
          createdAt: "2024-01-16T09:15:00Z",
        },
        {
          id: "c2",
          author: "Admin Team",
          content:
            "Thanks for the feedback! We're currently evaluating the technical requirements for this feature. We'll need to update our design system to support dual themes across all components.",
          createdAt: "2024-01-17T14:22:00Z",
          isAdmin: true,
        },
        {
          id: "c3",
          author: "Mike Chen",
          content:
            "Please also consider high contrast mode for accessibility. Some users with visual impairments would benefit greatly from this.",
          createdAt: "2024-01-18T11:30:00Z",
        },
      ],
      priority: "high",
    };
    setIdea(mockIdea);
    setLoading(false);
  };

  const handleVote = () => {
    if (!idea) return;

    setIdea({
      ...idea,
      votes: idea.userVoted ? idea.votes - 1 : idea.votes + 1,
      userVoted: !idea.userVoted,
    });
    toast.success("Vote recorded!");
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !idea) return;

    setIsSubmittingComment(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setIdea({
      ...idea,
      comments: [...idea.comments, comment],
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
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return <Badge variant="secondary">Submitted</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      "ui-ux": "UI/UX Improvements",
      mobile: "Mobile Experience",
      analytics: "Analytics & Reporting",
      integrations: "Integrations & APIs",
      automation: "Automation & Workflows",
      payments: "Payments & Billing",
      communication: "Communication",
      security: "Security & Privacy",
      documentation: "Documentation",
    };
    return categories[categoryId] || categoryId;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!idea) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Idea Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The idea you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/ideas")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ideas
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate("/ideas")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ideas
        </Button>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {idea.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {idea.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">
                    {getCategoryName(idea.category)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(idea.status)}
                <Button
                  variant={idea.userVoted ? "default" : "outline"}
                  onClick={handleVote}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {idea.votes}
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-200">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {idea.description}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Comments ({idea.comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <div className="mb-8">
              <Textarea
                placeholder="Share your thoughts on this idea..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmittingComment}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {idea.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comment.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author}
                        </span>
                        {comment.isAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {idea.comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
