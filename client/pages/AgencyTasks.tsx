import React, { useState, useEffect } from "react";
import { AgencyLayout } from "@/components/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Kanban,
  List,
  BarChart3,
  Filter,
  Eye,
  Edit,
  Trash,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

// Agency Task Types
interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";

  // Assignment
  assignedTo: string; // user ID
  assignedToName: string;
  assignedToEmail: string;
  assignedToAvatar?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedDate?: string;

  // Effort tracking
  estimatedHours?: number;
  actualHours?: number;

  // Metadata
  createdBy: string;
  category?: string;
  tags?: string[];

  // Subtasks
  subtasks: AgencySubtask[];

  // Dependencies
  dependencies?: string[]; // other task IDs
  blockedBy?: string[];
}

interface AgencySubtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "gray", bgColor: "bg-gray-100" },
  {
    value: "in-progress",
    label: "In Progress",
    color: "blue",
    bgColor: "bg-blue-100",
  },
  {
    value: "review",
    label: "Review",
    color: "yellow",
    bgColor: "bg-yellow-100",
  },
  {
    value: "completed",
    label: "Completed",
    color: "green",
    bgColor: "bg-green-100",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "red",
    bgColor: "bg-red-100",
  },
] as const;

const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "text-gray-600" },
  { value: "medium", label: "Medium", color: "text-blue-600" },
  { value: "high", label: "High", color: "text-yellow-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" },
] as const;

export default function AgencyTasks() {
  const [tasks, setTasks] = useState<AgencyTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<AgencyTask[]>([]);
  const [view, setView] = useState<"kanban" | "chart">("kanban");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgencyTask | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assignedTo: "all",
    category: "all",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    assignedTo: "",
    assignedToName: "",
    assignedToEmail: "",
    dueDate: "",
    estimatedHours: "",
    category: "",
    tags: [] as string[],
    newTag: "",
  });

  // Mock data - replace with actual API
  useEffect(() => {
    const mockTasks: AgencyTask[] = [
      {
        id: "task-1",
        title: "Redesign Agency Website",
        description:
          "Update our agency website with new branding and improved UX",
        status: "in-progress",
        priority: "high",
        assignedTo: "user-1",
        assignedToName: "Sarah Johnson",
        assignedToEmail: "sarah@agency.com",
        assignedToAvatar: "",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        dueDate: "2024-02-15",
        estimatedHours: 40,
        actualHours: 25,
        createdBy: "user-admin",
        category: "Design",
        tags: ["website", "branding", "ux"],
        subtasks: [
          {
            id: "sub-1",
            title: "Create wireframes",
            completed: true,
            assignedTo: "user-1",
            assignedToName: "Sarah Johnson",
            createdAt: "2024-01-15T10:00:00Z",
            completedAt: "2024-01-18T16:00:00Z",
          },
          {
            id: "sub-2",
            title: "Design mockups",
            completed: false,
            assignedTo: "user-1",
            assignedToName: "Sarah Johnson",
            dueDate: "2024-01-25",
            createdAt: "2024-01-18T16:00:00Z",
          },
          {
            id: "sub-3",
            title: "Implement responsive design",
            completed: false,
            createdAt: "2024-01-20T10:00:00Z",
          },
        ],
      },
      {
        id: "task-2",
        title: "Q1 Marketing Campaign Strategy",
        description: "Develop comprehensive marketing strategy for Q1 2024",
        status: "todo",
        priority: "urgent",
        assignedTo: "user-2",
        assignedToName: "Mike Chen",
        assignedToEmail: "mike@agency.com",
        createdAt: "2024-01-20T09:00:00Z",
        updatedAt: "2024-01-20T09:00:00Z",
        dueDate: "2024-01-30",
        estimatedHours: 20,
        createdBy: "user-admin",
        category: "Marketing",
        tags: ["strategy", "campaign"],
        subtasks: [
          {
            id: "sub-4",
            title: "Market research",
            completed: false,
            assignedTo: "user-2",
            assignedToName: "Mike Chen",
            createdAt: "2024-01-20T09:00:00Z",
          },
          {
            id: "sub-5",
            title: "Budget allocation",
            completed: false,
            createdAt: "2024-01-20T09:00:00Z",
          },
        ],
      },
      {
        id: "task-3",
        title: "Client Onboarding Process",
        description: "Create standardized onboarding process for new clients",
        status: "completed",
        priority: "medium",
        assignedTo: "user-3",
        assignedToName: "Emily Rodriguez",
        assignedToEmail: "emily@agency.com",
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-18T17:00:00Z",
        dueDate: "2024-01-20",
        completedDate: "2024-01-18T17:00:00Z",
        estimatedHours: 15,
        actualHours: 12,
        createdBy: "user-admin",
        category: "Process",
        tags: ["onboarding", "clients"],
        subtasks: [
          {
            id: "sub-6",
            title: "Document current process",
            completed: true,
            assignedTo: "user-3",
            assignedToName: "Emily Rodriguez",
            createdAt: "2024-01-10T08:00:00Z",
            completedAt: "2024-01-15T12:00:00Z",
          },
          {
            id: "sub-7",
            title: "Create templates",
            completed: true,
            assignedTo: "user-3",
            assignedToName: "Emily Rodriguez",
            createdAt: "2024-01-15T12:00:00Z",
            completedAt: "2024-01-18T17:00:00Z",
          },
        ],
      },
      {
        id: "task-4",
        title: "Team Training on New Tools",
        status: "review",
        priority: "low",
        assignedTo: "user-4",
        assignedToName: "David Kim",
        assignedToEmail: "david@agency.com",
        createdAt: "2024-01-12T11:00:00Z",
        updatedAt: "2024-01-22T15:00:00Z",
        dueDate: "2024-02-01",
        estimatedHours: 8,
        actualHours: 6,
        createdBy: "user-admin",
        category: "Training",
        tags: ["team", "tools"],
        subtasks: [],
      },
    ];

    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
    setIsLoading(false);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Assigned to filter
    if (filters.assignedTo !== "all") {
      filtered = filtered.filter(
        (task) => task.assignedTo === filters.assignedTo,
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filters]);

  const handleCreateTask = async () => {
    try {
      if (!newTask.title.trim()) {
        throw new Error("Task title is required");
      }

      if (!newTask.assignedToName.trim() || !newTask.assignedToEmail.trim()) {
        throw new Error("Please assign the task to someone");
      }

      const task: AgencyTask = {
        id: `task-${Date.now()}`,
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        status: "todo",
        priority: newTask.priority,
        assignedTo: `user-${Date.now()}`,
        assignedToName: newTask.assignedToName.trim(),
        assignedToEmail: newTask.assignedToEmail.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: newTask.dueDate || undefined,
        estimatedHours: newTask.estimatedHours
          ? Number(newTask.estimatedHours)
          : undefined,
        createdBy: "current-user",
        category: newTask.category || undefined,
        tags: newTask.tags.filter((tag) => tag.trim() !== ""),
        subtasks: [],
      };

      setTasks([...tasks, task]);

      // Reset form
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        assignedToName: "",
        assignedToEmail: "",
        dueDate: "",
        estimatedHours: "",
        category: "",
        tags: [],
        newTag: "",
      });

      setIsCreateDialogOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus as any,
            updatedAt: new Date().toISOString(),
            completedDate:
              newStatus === "completed" ? new Date().toISOString() : undefined,
          }
        : task,
    );
    setTasks(updatedTasks);
    toast.success("Task status updated");
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    completed: !subtask.completed,
                    completedAt: !subtask.completed
                      ? new Date().toISOString()
                      : undefined,
                  }
                : subtask,
            ),
            updatedAt: new Date().toISOString(),
          }
        : task,
    );
    setTasks(updatedTasks);
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const addTag = () => {
    if (
      newTask.newTag.trim() &&
      !newTask.tags.includes(newTask.newTag.trim())
    ) {
      setNewTask((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTask((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Play className="h-4 w-4 text-blue-600" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <Circle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSubtaskProgress = (task: AgencyTask) => {
    if (task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isTaskOverdue = (task: AgencyTask) => {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => isTaskOverdue(t)).length,
  };

  // Group tasks by status for kanban
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    review: filteredTasks.filter((t) => t.status === "review"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
    cancelled: filteredTasks.filter((t) => t.status === "cancelled"),
  };

  // Get unique values for filters
  const uniqueAssignees = [
    ...new Set(
      tasks.map((t) => ({ id: t.assignedTo, name: t.assignedToName })),
    ),
  ];
  const uniqueCategories = [
    ...new Set(tasks.map((t) => t.category).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Agency Tasks</h1>
            <p className="text-muted-foreground">
              Manage internal tasks and team assignments
            </p>
          </div>
          <div className="flex gap-2">
            <Tabs value={view} onValueChange={(value: any) => setView(value)}>
              <TabsList>
                <TabsTrigger value="kanban">
                  <Kanban className="h-4 w-4 mr-2" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="chart">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Title *</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Task description..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: any) =>
                          setNewTask((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_PRIORITIES.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newTask.category}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        placeholder="e.g., Design, Marketing..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignee-name">Assign to *</Label>
                      <Input
                        id="assignee-name"
                        value={newTask.assignedToName}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            assignedToName: e.target.value,
                          }))
                        }
                        placeholder="Team member name..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignee-email">Email *</Label>
                      <Input
                        id="assignee-email"
                        type="email"
                        value={newTask.assignedToEmail}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            assignedToEmail: e.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimated-hours">Est. Hours</Label>
                      <Input
                        id="estimated-hours"
                        type="number"
                        value={newTask.estimatedHours}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            estimatedHours: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTask.newTag}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            newTag: e.target.value,
                          }))
                        }
                        placeholder="Add a tag..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                    {newTask.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTask.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">To Do</p>
                  <p className="text-2xl font-bold">{stats.todo}</p>
                </div>
                <Circle className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <Play className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Review</p>
                  <p className="text-2xl font-bold">{stats.review}</p>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.overdue}
                  </p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {TASK_PRIORITIES.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.assignedTo}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, assignedTo: value }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Views */}
        <Tabs value={view} onValueChange={(value: any) => setView(value)}>
          {/* Kanban View */}
          <TabsContent value="kanban" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[600px]">
              {TASK_STATUSES.map((status) => (
                <div key={status.value} className="space-y-4">
                  <div className={`p-3 rounded-lg ${status.bgColor}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{status.label}</h3>
                      <Badge variant="secondary">
                        {tasksByStatus[status.value]?.length || 0}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {tasksByStatus[status.value]?.map((task) => (
                      <Card
                        key={task.id}
                        className="p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                              {task.title}
                            </h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {TASK_STATUSES.map((newStatus) => (
                                  <DropdownMenuItem
                                    key={newStatus.value}
                                    onClick={() =>
                                      handleStatusChange(
                                        task.id,
                                        newStatus.value,
                                      )
                                    }
                                    disabled={task.status === newStatus.value}
                                  >
                                    {getStatusIcon(newStatus.value)}
                                    <span className="ml-2">
                                      {newStatus.label}
                                    </span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                TASK_PRIORITIES.find(
                                  (p) => p.value === task.priority,
                                )?.color
                              }`}
                            >
                              {
                                TASK_PRIORITIES.find(
                                  (p) => p.value === task.priority,
                                )?.label
                              }
                            </Badge>
                            {task.category && (
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                            )}
                          </div>

                          {task.subtasks.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Subtasks
                                </span>
                                <span>{getSubtaskProgress(task)}%</span>
                              </div>
                              <Progress
                                value={getSubtaskProgress(task)}
                                className="h-2"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  {task.assignedToName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground">
                                {task.assignedToName}
                              </span>
                            </div>
                            {task.dueDate && (
                              <div
                                className={`flex items-center gap-1 ${isTaskOverdue(task) ? "text-red-600" : "text-muted-foreground"}`}
                              >
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            )}
                          </div>

                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  +{task.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Chart/List View */}
          <TabsContent value="chart" className="space-y-4">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTaskExpansion(task.id)}
                              className="flex items-center gap-1 hover:bg-gray-100 rounded p-1"
                            >
                              {task.subtasks.length > 0 &&
                                (expandedTasks.has(task.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                ))}
                              <h3 className="font-medium">{task.title}</h3>
                            </button>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  TASK_PRIORITIES.find(
                                    (p) => p.value === task.priority,
                                  )?.color
                                }`}
                              >
                                {
                                  TASK_PRIORITIES.find(
                                    (p) => p.value === task.priority,
                                  )?.label
                                }
                              </Badge>
                              {task.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {task.category}
                                </Badge>
                              )}
                              {isTaskOverdue(task) && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{task.assignedToName}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Due {formatDate(task.dueDate)}</span>
                              </div>
                            )}
                            {task.estimatedHours && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {task.actualHours || 0}/{task.estimatedHours}h
                                </span>
                              </div>
                            )}
                            {task.subtasks.length > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>
                                  {
                                    task.subtasks.filter((st) => st.completed)
                                      .length
                                  }
                                  /{task.subtasks.length} subtasks
                                </span>
                              </div>
                            )}
                          </div>

                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {task.subtasks.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span>{getSubtaskProgress(task)}%</span>
                              </div>
                              <Progress
                                value={getSubtaskProgress(task)}
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {TASK_STATUSES.map((status) => (
                              <DropdownMenuItem
                                key={status.value}
                                onClick={() =>
                                  handleStatusChange(task.id, status.value)
                                }
                                disabled={task.status === status.value}
                              >
                                {getStatusIcon(status.value)}
                                <span className="ml-2">{status.label}</span>
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                              onClick={() => setSelectedTask(task)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Expanded Subtasks */}
                      {expandedTasks.has(task.id) &&
                        task.subtasks.length > 0 && (
                          <div className="border-l-2 border-gray-200 pl-4 space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div
                                key={subtask.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() =>
                                      toggleSubtask(task.id, subtask.id)
                                    }
                                    className="rounded"
                                  />
                                  <span
                                    className={`text-sm ${
                                      subtask.completed
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }`}
                                  >
                                    {subtask.title}
                                  </span>
                                  {subtask.assignedToName && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {subtask.assignedToName}
                                    </Badge>
                                  )}
                                </div>
                                {subtask.dueDate && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(subtask.dueDate)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks found</p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first task
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  );
}
