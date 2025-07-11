import React, { useState, useEffect } from "react";
import { AgencyLayout } from "@/components/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  Users,
  FileText,
  Image,
  MessageSquare,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Phone,
  Mail,
  Building,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AgencyProject,
  PROJECT_STATUSES,
  AGENCY_SERVICES,
} from "@/types/agency";

// Import task and note components
import { AgencyProjectTasks } from "@/components/Agency/AgencyProjectTasks";
import { AgencyProjectNotes } from "@/components/Agency/AgencyProjectNotes";
import { AgencyProjectDocuments } from "@/components/Agency/AgencyProjectDocuments";

export default function AgencyProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<AgencyProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;

      try {
        // Mock data - replace with actual API call
        const mockProject: AgencyProject = {
          id: id,
          name: "Website Redesign for TechCorp",
          description:
            "Complete website redesign and development for TechCorp's new product launch. This includes a modern, responsive design with improved user experience, faster loading times, and better conversion optimization.",
          type: "one-off",
          status: "active",
          clientId: "client-1",
          clientName: "TechCorp Ltd",
          clientEmail: "john@techcorp.com",
          clientPhone: "+1-555-0123",
          services: ["website-design", "website-development", "seo"],
          budget: 15000,
          estimatedHours: 120,
          actualHours: 68,
          startDate: "2024-01-15",
          dueDate: "2024-03-15",
          documents: [
            {
              id: "doc-1",
              projectId: id,
              name: "Project Brief.pdf",
              fileName: "project-brief.pdf",
              fileSize: 2048000,
              fileType: "application/pdf",
              url: "/mock/project-brief.pdf",
              visibility: "internal",
              uploadedBy: "user-1",
              uploadedByName: "Sarah Johnson",
              uploadedAt: "2024-01-15T10:00:00Z",
              category: "brief",
            },
            {
              id: "doc-2",
              projectId: id,
              name: "Design Mockups.zip",
              fileName: "design-mockups.zip",
              fileSize: 15360000,
              fileType: "application/zip",
              url: "/mock/design-mockups.zip",
              visibility: "client",
              uploadedBy: "user-2",
              uploadedByName: "Mike Chen",
              uploadedAt: "2024-02-01T14:30:00Z",
              category: "design",
            },
          ],
          images: [
            {
              id: "img-1",
              projectId: id,
              url: "/mock/current-website-screenshot.png",
              fileName: "current-website.png",
              fileSize: 1024000,
              alt: "Current website screenshot",
              visibility: "internal",
              uploadedBy: "user-1",
              uploadedByName: "Sarah Johnson",
              uploadedAt: "2024-01-16T09:00:00Z",
              category: "before",
              isPrimary: true,
            },
          ],
          tasks: [
            {
              id: "task-1",
              projectId: id,
              title: "Conduct stakeholder interviews",
              description:
                "Interview key stakeholders to understand requirements and goals",
              status: "completed",
              priority: "high",
              assignedTo: "user-1",
              assignedToType: "internal",
              assignedToName: "Sarah Johnson",
              assignedToEmail: "sarah@agency.com",
              createdAt: "2024-01-15T10:00:00Z",
              updatedAt: "2024-01-18T16:00:00Z",
              dueDate: "2024-01-20",
              completedDate: "2024-01-18T16:00:00Z",
              estimatedHours: 8,
              actualHours: 6,
              createdBy: "user-1",
              comments: [],
              attachments: [],
            },
            {
              id: "task-2",
              projectId: id,
              title: "Create wireframes and user flows",
              description: "Design the site architecture and user journey",
              status: "in-progress",
              priority: "high",
              assignedTo: "user-2",
              assignedToType: "internal",
              assignedToName: "Mike Chen",
              assignedToEmail: "mike@agency.com",
              createdAt: "2024-01-20T10:00:00Z",
              updatedAt: "2024-02-01T12:00:00Z",
              dueDate: "2024-02-05",
              estimatedHours: 16,
              actualHours: 12,
              createdBy: "user-1",
              comments: [],
              attachments: [],
            },
            {
              id: "task-3",
              projectId: id,
              title: "Review and approve design concepts",
              description:
                "Client to review the proposed design concepts and provide feedback",
              status: "todo",
              priority: "medium",
              assignedTo: "client-1",
              assignedToType: "client",
              assignedToName: "John Smith",
              assignedToEmail: "john@techcorp.com",
              createdAt: "2024-02-01T15:00:00Z",
              updatedAt: "2024-02-01T15:00:00Z",
              dueDate: "2024-02-10",
              estimatedHours: 4,
              createdBy: "user-2",
              comments: [],
              attachments: [],
            },
          ],
          notes: [
            {
              id: "note-1",
              projectId: id,
              title: "Initial Client Meeting",
              content:
                "Client emphasized the importance of mobile responsiveness and fast loading times. They want to see a modern design that reflects their innovative tech solutions.",
              type: "internal",
              authorId: "user-1",
              authorName: "Sarah Johnson",
              createdAt: "2024-01-15T14:00:00Z",
              updatedAt: "2024-01-15T14:00:00Z",
              isPinned: true,
              tags: ["meeting", "requirements"],
            },
            {
              id: "note-2",
              projectId: id,
              content:
                "We've completed the initial wireframes and are ready for your review. Please check the design concepts in the client portal and let us know your thoughts by Friday.",
              type: "client-facing",
              authorId: "user-2",
              authorName: "Mike Chen",
              createdAt: "2024-02-01T16:00:00Z",
              updatedAt: "2024-02-01T16:00:00Z",
              tags: ["update", "review"],
            },
          ],
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-02-01T16:45:00Z",
          createdBy: "user-1",
          assignedTeam: ["user-1", "user-2", "user-3"],
          progress: 65,
          milestones: [
            {
              id: "milestone-1",
              projectId: id,
              title: "Discovery & Requirements",
              description:
                "Complete stakeholder interviews and requirements gathering",
              dueDate: "2024-01-25",
              completedDate: "2024-01-24T17:00:00Z",
              status: "completed",
              deliverables: ["Requirements Document", "Stakeholder Interviews"],
              createdAt: "2024-01-15T10:00:00Z",
              updatedAt: "2024-01-24T17:00:00Z",
            },
            {
              id: "milestone-2",
              projectId: id,
              title: "Design Phase",
              description: "Complete wireframes, mockups, and design concepts",
              dueDate: "2024-02-15",
              status: "pending",
              deliverables: ["Wireframes", "Design Mockups", "Style Guide"],
              createdAt: "2024-01-15T10:00:00Z",
              updatedAt: "2024-02-01T12:00:00Z",
            },
          ],
        };

        setProject(mockProject);
      } catch (error) {
        toast.error("Failed to load project");
        navigate("/agency/admin/projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus: string) => {
    if (!project) return;

    setIsUpdating(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProject((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as any,
              updatedAt: new Date().toISOString(),
            }
          : null,
      );

      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update project status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    if (!project) return;

    setProject((prev) =>
      prev
        ? {
            ...prev,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
          }
        : null,
    );
  };

  const getStatusColor = (status: string) => {
    const statusConfig = PROJECT_STATUSES.find((s) => s.value === status);
    return statusConfig?.color || "gray";
  };

  const getStatusVariant = (status: string) => {
    switch (getStatusColor(status)) {
      case "green":
        return "default";
      case "blue":
        return "secondary";
      case "yellow":
        return "outline";
      case "red":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getServiceLabels = (services: string[]) => {
    return services.map((service) => {
      const serviceConfig = AGENCY_SERVICES.find((s) => s.value === service);
      return serviceConfig?.label || service;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTimeProgress = () => {
    if (!project?.startDate || !project?.dueDate) return 0;

    const start = new Date(project.startDate).getTime();
    const end = new Date(project.dueDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AgencyLayout>
    );
  }

  if (!project) {
    return (
      <AgencyLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Button asChild className="mt-4">
            <Link to="/agency/admin/projects">Back to Projects</Link>
          </Button>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agency/admin/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">
                Client: {project.clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(project.status)}>
              {PROJECT_STATUSES.find((s) => s.value === project.status)?.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/agency/admin/projects/${project.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                {project.status === "active" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("paused")}
                    disabled={isUpdating}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Project
                  </DropdownMenuItem>
                )}
                {project.status === "paused" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("active")}
                    disabled={isUpdating}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume Project
                  </DropdownMenuItem>
                )}
                {project.status !== "completed" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("completed")}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{project.progress}%</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <Progress value={project.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours</p>
                  <p className="text-2xl font-bold">
                    {project.actualHours || 0}
                    {project.estimatedHours && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{project.estimatedHours}
                      </span>
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="text-2xl font-bold">
                    {project.assignedTeam.length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">
                  Tasks ({project.tasks.length})
                </TabsTrigger>
                <TabsTrigger value="notes">
                  Notes ({project.notes.length})
                </TabsTrigger>
                <TabsTrigger value="files">
                  Files ({project.documents.length + project.images.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getServiceLabels(project.services).map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {project.milestones && project.milestones.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <Badge
                                variant={
                                  milestone.status === "completed"
                                    ? "default"
                                    : milestone.status === "overdue"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {milestone.status}
                              </Badge>
                            </div>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {milestone.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {formatDate(milestone.dueDate)}
                            </p>
                          </div>
                          {milestone.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tasks">
                <AgencyProjectTasks
                  projectId={project.id}
                  tasks={project.tasks}
                  onTasksChange={(tasks) =>
                    setProject((prev) => (prev ? { ...prev, tasks } : null))
                  }
                />
              </TabsContent>

              <TabsContent value="notes">
                <AgencyProjectNotes
                  projectId={project.id}
                  notes={project.notes}
                  onNotesChange={(notes) =>
                    setProject((prev) => (prev ? { ...prev, notes } : null))
                  }
                />
              </TabsContent>

              <TabsContent value="files">
                <AgencyProjectDocuments
                  projectId={project.id}
                  documents={project.documents}
                  images={project.images}
                  onDocumentsChange={(documents) =>
                    setProject((prev) => (prev ? { ...prev, documents } : null))
                  }
                  onImagesChange={(images) =>
                    setProject((prev) => (prev ? { ...prev, images } : null))
                  }
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{project.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${project.clientEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {project.clientEmail}
                    </a>
                  </div>
                </div>
                {project.clientPhone && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Phone
                    </Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${project.clientPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {project.clientPhone}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Start Date
                  </Label>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                {project.dueDate && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Due Date
                    </Label>
                    <p className="font-medium">{formatDate(project.dueDate)}</p>
                  </div>
                )}
                {project.completedDate && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Completed
                    </Label>
                    <p className="font-medium">
                      {formatDate(project.completedDate)}
                    </p>
                  </div>
                )}
                {project.dueDate && !project.completedDate && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Time Progress
                    </Label>
                    <Progress
                      value={calculateTimeProgress()}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateTimeProgress()}% of timeline elapsed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Type */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <div className="flex items-center gap-2">
                    {project.type === "recurring" ? (
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">
                      {project.type === "one-off" ? "One-off" : "Recurring"}
                    </span>
                  </div>
                </div>
                {project.recurringSettings && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Frequency
                    </Label>
                    <p className="font-medium">
                      {project.recurringSettings.frequency}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Created
                  </Label>
                  <p className="font-medium">{formatDate(project.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Last Updated
                  </Label>
                  <p className="font-medium">{formatDate(project.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
}

// Helper component for Label
function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
