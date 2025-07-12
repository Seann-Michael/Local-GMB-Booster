import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
  Settings,
  FolderKanban,
  X,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

// Enhanced Task Pipeline Types
interface TaskPipeline {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  columns: TaskColumn[];
}

interface TaskColumn {
  id: string;
  title: string;
  color: string;
  order: number;
  limit?: number; // WIP limit
}

interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  pipelineId: string;
  priority: "low" | "medium" | "high" | "urgent";
  order: number;

  // Assignment and relationships
  assignedTo: string;
  assignedToName: string;
  assignedToEmail: string;
  assignedToAvatar?: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;

  // Dates and tracking
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;

  // Metadata
  createdBy: string;
  category?: string;
  tags?: string[];

  // Subtasks
  subtasks: AgencySubtask[];
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

const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "text-gray-600" },
  { value: "medium", label: "Medium", color: "text-blue-600" },
  { value: "high", label: "High", color: "text-yellow-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" },
] as const;

const DEFAULT_COLUMNS: TaskColumn[] = [
  { id: "todo", title: "To Do", color: "#6B7280", order: 1 },
  { id: "in-progress", title: "In Progress", color: "#3B82F6", order: 2 },
  { id: "review", title: "Review", color: "#F59E0B", order: 3 },
  { id: "completed", title: "Completed", color: "#10B981", order: 4 },
];

export default function AgencyTasks() {
  // State management
  const [pipelines, setPipelines] = useState<TaskPipeline[]>([]);
  const [currentPipelineId, setCurrentPipelineId] = useState<string>("");
  const [tasks, setTasks] = useState<AgencyTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<AgencyTask[]>([]);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isCreatePipelineDialogOpen, setIsCreatePipelineDialogOpen] =
    useState(false);
  const [isEditPipelineDialogOpen, setIsEditPipelineDialogOpen] =
    useState(false);
  const [isCreateColumnDialogOpen, setIsCreateColumnDialogOpen] =
    useState(false);
  const [editingPipeline, setEditingPipeline] = useState<TaskPipeline | null>(
    null,
  );
  const [editingColumn, setEditingColumn] = useState<TaskColumn | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    priority: "all",
    assignedTo: "all",
    client: "all",
    project: "all",
    category: "all",
  });

  // Form states
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    assignedTo: "",
    assignedToName: "",
    assignedToEmail: "",
    clientId: "",
    clientName: "",
    projectId: "",
    projectName: "",
    dueDate: "",
    estimatedHours: "",
    category: "",
    tags: [] as string[],
    newTag: "",
  });

  const [newPipeline, setNewPipeline] = useState({
    name: "",
    description: "",
  });

  const [newColumn, setNewColumn] = useState({
    title: "",
    color: "#3B82F6",
    limit: "",
  });

  // Initialize with mock data
  useEffect(() => {
    const mockPipelines: TaskPipeline[] = [
      {
        id: "pipeline-1",
        name: "General Tasks",
        description: "Default task pipeline for general work",
        isDefault: true,
        createdAt: "2024-01-01T00:00:00Z",
        columns: DEFAULT_COLUMNS,
      },
      {
        id: "pipeline-2",
        name: "Client Projects",
        description: "Tasks related to client project work",
        isDefault: false,
        createdAt: "2024-01-02T00:00:00Z",
        columns: [
          { id: "backlog", title: "Backlog", color: "#6B7280", order: 1 },
          { id: "planning", title: "Planning", color: "#8B5CF6", order: 2 },
          {
            id: "development",
            title: "Development",
            color: "#3B82F6",
            order: 3,
          },
          { id: "testing", title: "Testing", color: "#F59E0B", order: 4 },
          { id: "deployed", title: "Deployed", color: "#10B981", order: 5 },
        ],
      },
      {
        id: "pipeline-3",
        name: "Sales Pipeline",
        description: "Track sales and business development tasks",
        isDefault: false,
        createdAt: "2024-01-03T00:00:00Z",
        columns: [
          { id: "lead", title: "Lead", color: "#EC4899", order: 1 },
          { id: "qualified", title: "Qualified", color: "#8B5CF6", order: 2 },
          { id: "proposal", title: "Proposal", color: "#F59E0B", order: 3 },
          {
            id: "negotiation",
            title: "Negotiation",
            color: "#EF4444",
            order: 4,
          },
          { id: "closed-won", title: "Closed Won", color: "#10B981", order: 5 },
          {
            id: "closed-lost",
            title: "Closed Lost",
            color: "#6B7280",
            order: 6,
          },
        ],
      },
    ];

    const mockTasks: AgencyTask[] = [
      {
        id: "task-1",
        title: "Redesign Agency Website",
        description:
          "Update our agency website with new branding and improved UX",
        columnId: "in-progress",
        pipelineId: "pipeline-1",
        priority: "high",
        order: 1,
        assignedTo: "user-1",
        assignedToName: "Sarah Johnson",
        assignedToEmail: "sarah@agency.com",
        clientId: "client-1",
        clientName: "TechCorp Ltd",
        projectId: "proj-1",
        projectName: "Website Redesign",
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
        ],
      },
      {
        id: "task-2",
        title: "Q1 Marketing Campaign Strategy",
        description: "Develop comprehensive marketing strategy for Q1 2024",
        columnId: "todo",
        pipelineId: "pipeline-1",
        priority: "urgent",
        order: 1,
        assignedTo: "user-2",
        assignedToName: "Mike Chen",
        assignedToEmail: "mike@agency.com",
        clientId: "client-2",
        clientName: "RetailPlus Inc",
        createdAt: "2024-01-20T09:00:00Z",
        updatedAt: "2024-01-20T09:00:00Z",
        dueDate: "2024-01-30",
        estimatedHours: 20,
        createdBy: "user-admin",
        category: "Marketing",
        tags: ["strategy", "campaign"],
        subtasks: [],
      },
      {
        id: "task-3",
        title: "Client Onboarding Process",
        description: "Create standardized onboarding process for new clients",
        columnId: "completed",
        pipelineId: "pipeline-1",
        priority: "medium",
        order: 1,
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
        subtasks: [],
      },
      // Client project tasks
      {
        id: "task-4",
        title: "API Integration",
        description: "Integrate third-party API for client project",
        columnId: "development",
        pipelineId: "pipeline-2",
        priority: "high",
        order: 1,
        assignedTo: "user-2",
        assignedToName: "Mike Chen",
        assignedToEmail: "mike@agency.com",
        clientId: "client-1",
        clientName: "TechCorp Ltd",
        projectId: "proj-1",
        projectName: "Website Redesign",
        createdAt: "2024-01-22T10:00:00Z",
        updatedAt: "2024-01-22T10:00:00Z",
        dueDate: "2024-02-05",
        estimatedHours: 16,
        createdBy: "user-admin",
        category: "Development",
        tags: ["api", "integration"],
        subtasks: [],
      },
      // Sales pipeline task
      {
        id: "task-5",
        title: "Follow up with LocalBiz prospects",
        description: "Schedule follow-up calls with potential clients",
        columnId: "qualified",
        pipelineId: "pipeline-3",
        priority: "medium",
        order: 1,
        assignedTo: "user-4",
        assignedToName: "David Kim",
        assignedToEmail: "david@agency.com",
        createdAt: "2024-01-25T14:00:00Z",
        updatedAt: "2024-01-25T14:00:00Z",
        dueDate: "2024-01-30",
        estimatedHours: 8,
        createdBy: "user-admin",
        category: "Sales",
        tags: ["follow-up", "prospects"],
        subtasks: [],
      },
    ];

    setPipelines(mockPipelines);
    setCurrentPipelineId(mockPipelines[0].id);
    setTasks(mockTasks);
    setIsLoading(false);
  }, []);

  // Filter tasks based on current pipeline and filters
  useEffect(() => {
    let filtered = tasks.filter(
      (task) => task.pipelineId === currentPipelineId,
    );

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedToName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          task.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.projectName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply other filters
    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }
    if (filters.assignedTo !== "all") {
      filtered = filtered.filter(
        (task) => task.assignedTo === filters.assignedTo,
      );
    }
    if (filters.client !== "all") {
      filtered = filtered.filter((task) => task.clientId === filters.client);
    }
    if (filters.project !== "all") {
      filtered = filtered.filter((task) => task.projectId === filters.project);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    setFilteredTasks(filtered);
  }, [tasks, currentPipelineId, searchQuery, filters]);

  // Drag and drop handler
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      // Handle column reordering
      const currentPipeline = pipelines.find((p) => p.id === currentPipelineId);
      if (!currentPipeline) return;

      const newColumns = Array.from(currentPipeline.columns);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, reorderedColumn);

      // Update column orders
      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index + 1,
      }));

      const updatedPipeline = {
        ...currentPipeline,
        columns: updatedColumns,
      };

      const updatedPipelines = pipelines.map((p) =>
        p.id === currentPipelineId ? updatedPipeline : p,
      );

      setPipelines(updatedPipelines);
      toast.success("Column order updated");
      return;
    }

    // Handle task movement
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const updatedTasks = tasks.map((t) =>
      t.id === draggableId
        ? {
            ...t,
            columnId: destination.droppableId,
            order: destination.index,
            updatedAt: new Date().toISOString(),
          }
        : t,
    );

    setTasks(updatedTasks);
    toast.success("Task moved successfully");
  };

  // Task creation
  const handleCreateTask = async () => {
    try {
      if (!newTask.title.trim()) {
        throw new Error("Task title is required");
      }

      if (!newTask.assignedToName.trim() || !newTask.assignedToEmail.trim()) {
        throw new Error("Please assign the task to someone");
      }

      const currentPipeline = pipelines.find((p) => p.id === currentPipelineId);
      const firstColumn = currentPipeline?.columns.sort(
        (a, b) => a.order - b.order,
      )[0];

      if (!firstColumn) {
        throw new Error("No columns available in current pipeline");
      }

      const task: AgencyTask = {
        id: `task-${Date.now()}`,
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        columnId: firstColumn.id,
        pipelineId: currentPipelineId,
        priority: newTask.priority,
        order: 0,
        assignedTo: `user-${Date.now()}`,
        assignedToName: newTask.assignedToName.trim(),
        assignedToEmail: newTask.assignedToEmail.trim(),
        clientId: newTask.clientId || undefined,
        clientName: newTask.clientName || undefined,
        projectId: newTask.projectId || undefined,
        projectName: newTask.projectName || undefined,
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
        clientId: "",
        clientName: "",
        projectId: "",
        projectName: "",
        dueDate: "",
        estimatedHours: "",
        category: "",
        tags: [],
        newTag: "",
      });

      setIsCreateTaskDialogOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    }
  };

  // Pipeline management
  const handleCreatePipeline = async () => {
    try {
      if (!newPipeline.name.trim()) {
        throw new Error("Pipeline name is required");
      }

      const pipeline: TaskPipeline = {
        id: `pipeline-${Date.now()}`,
        name: newPipeline.name.trim(),
        description: newPipeline.description.trim() || undefined,
        isDefault: false,
        createdAt: new Date().toISOString(),
        columns: DEFAULT_COLUMNS,
      };

      setPipelines([...pipelines, pipeline]);
      setNewPipeline({ name: "", description: "" });
      setIsCreatePipelineDialogOpen(false);
      toast.success("Pipeline created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create pipeline",
      );
    }
  };

  const handleDeletePipeline = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId);
    if (pipeline?.isDefault) {
      toast.error("Cannot delete the default pipeline");
      return;
    }

    const updatedPipelines = pipelines.filter((p) => p.id !== pipelineId);
    setPipelines(updatedPipelines);

    // Remove tasks from deleted pipeline
    const updatedTasks = tasks.filter((t) => t.pipelineId !== pipelineId);
    setTasks(updatedTasks);

    // Switch to default pipeline if current was deleted
    if (currentPipelineId === pipelineId) {
      const defaultPipeline = updatedPipelines.find((p) => p.isDefault);
      if (defaultPipeline) {
        setCurrentPipelineId(defaultPipeline.id);
      }
    }

    toast.success("Pipeline deleted successfully");
  };

  // Column management
  const handleCreateColumn = async () => {
    try {
      if (!newColumn.title.trim()) {
        throw new Error("Column title is required");
      }

      const currentPipeline = pipelines.find((p) => p.id === currentPipelineId);
      if (!currentPipeline) return;

      const maxOrder = Math.max(
        ...currentPipeline.columns.map((c) => c.order),
        0,
      );
      const column: TaskColumn = {
        id: `col-${Date.now()}`,
        title: newColumn.title.trim(),
        color: newColumn.color,
        order: maxOrder + 1,
        limit: newColumn.limit ? Number(newColumn.limit) : undefined,
      };

      const updatedPipeline = {
        ...currentPipeline,
        columns: [...currentPipeline.columns, column],
      };

      const updatedPipelines = pipelines.map((p) =>
        p.id === currentPipelineId ? updatedPipeline : p,
      );

      setPipelines(updatedPipelines);
      setNewColumn({ title: "", color: "#3B82F6", limit: "" });
      setIsCreateColumnDialogOpen(false);
      toast.success("Column created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create column",
      );
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const currentPipeline = pipelines.find((p) => p.id === currentPipelineId);
    if (!currentPipeline) return;

    // Don't allow deleting if there are tasks in the column
    const tasksInColumn = tasks.filter(
      (t) => t.pipelineId === currentPipelineId && t.columnId === columnId,
    );
    if (tasksInColumn.length > 0) {
      toast.error("Cannot delete column with tasks. Move tasks first.");
      return;
    }

    const updatedColumns = currentPipeline.columns.filter(
      (c) => c.id !== columnId,
    );
    const updatedPipeline = {
      ...currentPipeline,
      columns: updatedColumns,
    };

    const updatedPipelines = pipelines.map((p) =>
      p.id === currentPipelineId ? updatedPipeline : p,
    );

    setPipelines(updatedPipelines);
    toast.success("Column deleted successfully");
  };

  // Utility functions
  const getCurrentPipeline = () =>
    pipelines.find((p) => p.id === currentPipelineId);

  const getTasksByColumn = (columnId: string) =>
    filteredTasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);

  const getSubtaskProgress = (task: AgencyTask) => {
    if (task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isTaskOverdue = (task: AgencyTask) => {
    if (!task.dueDate || task.columnId === "completed") return false;
    return new Date(task.dueDate) < new Date();
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

  // Get unique values for filters
  const uniqueAssigneeIds = [...new Set(tasks.map((t) => t.assignedTo))];
  const uniqueAssignees = uniqueAssigneeIds.map((id) => {
    const task = tasks.find((t) => t.assignedTo === id);
    return { id, name: task?.assignedToName || "" };
  });

  const uniqueClientIds = [
    ...new Set(tasks.filter((t) => t.clientId).map((t) => t.clientId!)),
  ];
  const uniqueClients = uniqueClientIds.map((id) => {
    const task = tasks.find((t) => t.clientId === id);
    return { id, name: task?.clientName || "" };
  });

  const uniqueProjectIds = [
    ...new Set(tasks.filter((t) => t.projectId).map((t) => t.projectId!)),
  ];
  const uniqueProjects = uniqueProjectIds.map((id) => {
    const task = tasks.find((t) => t.projectId === id);
    return { id, name: task?.projectName || "" };
  });

  const uniqueCategories = [
    ...new Set(tasks.map((t) => t.category).filter(Boolean)),
  ];

  // Calculate stats for current pipeline
  const currentPipelineTasks = tasks.filter(
    (t) => t.pipelineId === currentPipelineId,
  );
  const stats = {
    total: currentPipelineTasks.length,
    overdue: currentPipelineTasks.filter((t) => isTaskOverdue(t)).length,
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

  const currentPipeline = getCurrentPipeline();

  return (
    <AgencyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Agency Tasks</h1>
            <p className="text-muted-foreground">
              Manage tasks across multiple pipelines
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isCreatePipelineDialogOpen}
              onOpenChange={setIsCreatePipelineDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderKanban className="h-4 w-4 mr-2" />
                  New Pipeline
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Pipeline</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipeline-name">Pipeline Name *</Label>
                    <Input
                      id="pipeline-name"
                      value={newPipeline.name}
                      onChange={(e) =>
                        setNewPipeline((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter pipeline name..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pipeline-description">Description</Label>
                    <Textarea
                      id="pipeline-description"
                      value={newPipeline.description}
                      onChange={(e) =>
                        setNewPipeline((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Pipeline description..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatePipelineDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePipeline}>
                      Create Pipeline
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isCreateTaskDialogOpen}
              onOpenChange={setIsCreateTaskDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                      <Label htmlFor="client-name">Client (optional)</Label>
                      <Input
                        id="client-name"
                        value={newTask.clientName}
                        onChange={(e) => {
                          setNewTask((prev) => ({
                            ...prev,
                            clientName: e.target.value,
                            clientId: e.target.value
                              ? `client-${Date.now()}`
                              : "",
                          }));
                        }}
                        placeholder="Client name..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project (optional)</Label>
                      <Input
                        id="project-name"
                        value={newTask.projectName}
                        onChange={(e) => {
                          setNewTask((prev) => ({
                            ...prev,
                            projectName: e.target.value,
                            projectId: e.target.value
                              ? `proj-${Date.now()}`
                              : "",
                          }));
                        }}
                        placeholder="Project name..."
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
                      onClick={() => setIsCreateTaskDialogOpen(false)}
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

        {/* Pipeline Selector and Stats */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Label>Pipeline:</Label>
                <Select
                  value={currentPipelineId}
                  onValueChange={setCurrentPipelineId}
                >
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{pipeline.name}</span>
                          {pipeline.isDefault && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentPipeline && !currentPipeline.isDefault && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setIsCreateColumnDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePipeline(currentPipelineId)}
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Pipeline
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {currentPipeline?.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {currentPipeline.description}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-lg font-semibold">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-lg font-semibold text-red-600">
                    {stats.overdue}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="w-32">
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
              <SelectTrigger className="w-36">
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

            <Select
              value={filters.client}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, client: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.project}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, project: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        {currentPipeline && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto pb-4">
              <Droppable
                droppableId="board"
                type="column"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-4 min-h-[600px]"
                    style={{
                      width: `${currentPipeline.columns.length * 320}px`,
                    }}
                  >
                    {currentPipeline.columns
                      .sort((a, b) => a.order - b.order)
                      .map((column, index) => (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="w-80 flex-shrink-0"
                            >
                              <div className="bg-gray-50 rounded-lg p-3 h-full">
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
                                >
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: column.color }}
                                    />
                                    <h3 className="font-medium">
                                      {column.title}
                                    </h3>
                                    <Badge variant="secondary">
                                      {getTasksByColumn(column.id).length}
                                      {column.limit && `/${column.limit}`}
                                    </Badge>
                                  </div>
                                  {!currentPipeline.isDefault && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Column
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteColumn(column.id)
                                          }
                                          className="text-red-600"
                                        >
                                          <Trash className="h-4 w-4 mr-2" />
                                          Delete Column
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>

                                <Droppable droppableId={column.id} type="task">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`space-y-3 min-h-[500px] transition-colors ${
                                        snapshot.isDraggingOver
                                          ? "bg-blue-50"
                                          : ""
                                      }`}
                                    >
                                      {getTasksByColumn(column.id).map(
                                        (task, taskIndex) => (
                                          <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={taskIndex}
                                          >
                                            {(provided, snapshot) => (
                                              <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-3 cursor-grab active:cursor-grabbing transition-shadow ${
                                                  snapshot.isDragging
                                                    ? "shadow-lg"
                                                    : "hover:shadow-md"
                                                }`}
                                              >
                                                <div className="space-y-3">
                                                  <div className="flex items-start justify-between">
                                                    <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                                                      {task.title}
                                                    </h4>
                                                    <DropdownMenu>
                                                      <DropdownMenuTrigger
                                                        asChild
                                                      >
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          className="h-6 w-6 p-0"
                                                          onClick={(e) =>
                                                            e.stopPropagation()
                                                          }
                                                        >
                                                          <MoreHorizontal className="h-3 w-3" />
                                                        </Button>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                          <Eye className="h-4 w-4 mr-2" />
                                                          View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                          <Edit className="h-4 w-4 mr-2" />
                                                          Edit Task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                          <Trash className="h-4 w-4 mr-2" />
                                                          Delete Task
                                                        </DropdownMenuItem>
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
                                                          (p) =>
                                                            p.value ===
                                                            task.priority,
                                                        )?.color
                                                      }`}
                                                    >
                                                      {
                                                        TASK_PRIORITIES.find(
                                                          (p) =>
                                                            p.value ===
                                                            task.priority,
                                                        )?.label
                                                      }
                                                    </Badge>
                                                    {task.category && (
                                                      <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                      >
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

                                                  {task.clientName && (
                                                    <div className="text-xs text-muted-foreground">
                                                      <strong>Client:</strong>{" "}
                                                      {task.clientName}
                                                    </div>
                                                  )}

                                                  {task.projectName && (
                                                    <div className="text-xs text-muted-foreground">
                                                      <strong>Project:</strong>{" "}
                                                      {task.projectName}
                                                    </div>
                                                  )}

                                                  {task.subtasks.length > 0 && (
                                                    <div className="space-y-2">
                                                      <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                          Subtasks
                                                        </span>
                                                        <span>
                                                          {getSubtaskProgress(
                                                            task,
                                                          )}
                                                          %
                                                        </span>
                                                      </div>
                                                      <Progress
                                                        value={getSubtaskProgress(
                                                          task,
                                                        )}
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
                                                        className={`flex items-center gap-1 ${
                                                          isTaskOverdue(task)
                                                            ? "text-red-600"
                                                            : "text-muted-foreground"
                                                        }`}
                                                      >
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                          {formatDate(
                                                            task.dueDate,
                                                          )}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>

                                                  {task.tags &&
                                                    task.tags.length > 0 && (
                                                      <div className="flex flex-wrap gap-1">
                                                        {task.tags
                                                          .slice(0, 3)
                                                          .map((tag) => (
                                                            <Badge
                                                              key={tag}
                                                              variant="outline"
                                                              className="text-xs px-1 py-0"
                                                            >
                                                              {tag}
                                                            </Badge>
                                                          ))}
                                                        {task.tags.length >
                                                          3 && (
                                                          <Badge
                                                            variant="outline"
                                                            className="text-xs px-1 py-0"
                                                          >
                                                            +
                                                            {task.tags.length -
                                                              3}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    )}
                                                </div>
                                              </Card>
                                            )}
                                          </Draggable>
                                        ),
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}

        {/* Create Column Dialog */}
        <Dialog
          open={isCreateColumnDialogOpen}
          onOpenChange={setIsCreateColumnDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="column-title">Column Title *</Label>
                <Input
                  id="column-title"
                  value={newColumn.title}
                  onChange={(e) =>
                    setNewColumn((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter column title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="column-color">Color</Label>
                <Input
                  id="column-color"
                  type="color"
                  value={newColumn.color}
                  onChange={(e) =>
                    setNewColumn((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="column-limit">WIP Limit (optional)</Label>
                <Input
                  id="column-limit"
                  type="number"
                  value={newColumn.limit}
                  onChange={(e) =>
                    setNewColumn((prev) => ({ ...prev, limit: e.target.value }))
                  }
                  placeholder="Work in progress limit..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateColumnDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateColumn}>Add Column</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No tasks found in this pipeline
            </p>
            <Button
              onClick={() => setIsCreateTaskDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </Button>
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
