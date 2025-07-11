import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Mail,
  Calendar,
  Save,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  Volume2,
  VolumeX,
  MessageSquare,
  Smartphone,
  Monitor,
} from "lucide-react";

// Types and Interfaces
interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
}

interface WorkflowTrigger {
  id: string;
  type: string;
  name: string;
  settings: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "paused";
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggers: WorkflowTrigger[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
}

interface WorkflowStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTime: number;
  lastRun: Date;
  averagePerDay: number;
}

interface ExecutionHistory {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "failed" | "running";
  startTime: Date;
  endTime?: Date;
  duration?: number;
  trigger: string;
  errorMessage?: string;
  progress: number;
}

// Mock data for workflows
const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Lead Nurturing Campaign",
    description: "Automated email sequence for new leads",
    status: "active",
    nodes: [],
    connections: [],
    triggers: [],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    lastRun: new Date("2024-01-20T10:30:00"),
    runCount: 152,
  },
  {
    id: "workflow-2",
    name: "Review Follow-up",
    description: "Send review requests after project completion",
    status: "active",
    nodes: [],
    connections: [],
    triggers: [],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    lastRun: new Date("2024-01-20T09:15:00"),
    runCount: 89,
  },
  {
    id: "workflow-3",
    name: "Client Onboarding",
    description: "Welcome sequence for new clients",
    status: "draft",
    nodes: [],
    connections: [],
    triggers: [],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-19"),
    runCount: 0,
  },
];

const mockStats: WorkflowStats = {
  totalRuns: 241,
  successfulRuns: 234,
  failedRuns: 7,
  avgExecutionTime: 3.2,
  lastRun: new Date("2024-01-20T10:30:00"),
  averagePerDay: 12.5,
};

// Mock execution history data
const mockExecutions: ExecutionHistory[] = [
  {
    id: "exec-1",
    workflowId: "workflow-1",
    workflowName: "Lead Nurturing Campaign",
    status: "success",
    startTime: new Date("2024-01-20T10:30:00"),
    endTime: new Date("2024-01-20T10:32:15"),
    duration: 135,
    trigger: "New lead added",
    progress: 100,
  },
  {
    id: "exec-2",
    workflowId: "workflow-2",
    workflowName: "Review Follow-up",
    status: "success",
    startTime: new Date("2024-01-20T09:15:00"),
    endTime: new Date("2024-01-20T09:16:30"),
    duration: 90,
    trigger: "Project completed",
    progress: 100,
  },
  {
    id: "exec-3",
    workflowId: "workflow-1",
    workflowName: "Lead Nurturing Campaign",
    status: "failed",
    startTime: new Date("2024-01-20T08:45:00"),
    endTime: new Date("2024-01-20T08:45:45"),
    duration: 45,
    trigger: "New lead added",
    errorMessage: "Email service timeout",
    progress: 60,
  },
  {
    id: "exec-4",
    workflowId: "workflow-2",
    workflowName: "Review Follow-up",
    status: "running",
    startTime: new Date("2024-01-20T11:00:00"),
    trigger: "Manual trigger",
    progress: 75,
  },
  {
    id: "exec-5",
    workflowId: "workflow-1",
    workflowName: "Lead Nurturing Campaign",
    status: "success",
    startTime: new Date("2024-01-19T16:20:00"),
    endTime: new Date("2024-01-19T16:22:10"),
    duration: 130,
    trigger: "Scheduled run",
    progress: 100,
  },
];

export default function Automation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("executions");
  const [executionHistory, setExecutionHistory] =
    useState<ExecutionHistory[]>(mockExecutions);
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    type: "email",
  });

  const handleWorkflowAction = (
    workflowId: string,
    action: "play" | "pause" | "stop" | "edit" | "delete" | "copy",
  ) => {
    setWorkflows((prev) =>
      prev
        .map((workflow) => {
          if (workflow.id === workflowId) {
            switch (action) {
              case "play":
                return { ...workflow, status: "active" as const };
              case "pause":
                return { ...workflow, status: "paused" as const };
              case "stop":
                return { ...workflow, status: "draft" as const };
              case "delete":
                return workflow; // Handle deletion in filter
              default:
                return workflow;
            }
          }
          return workflow;
        })
        .filter(
          (workflow) => !(action === "delete" && workflow.id === workflowId),
        ),
    );

    console.log(`${action} workflow ${workflowId}`);
  };

  const getStatusBadge = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  const getExecutionStatusBadge = (status: ExecutionHistory["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
            <p className="text-muted-foreground">
              Create and manage automated workflows for your business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm" onClick={() => setIsNewWorkflowOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Workflows
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">
                {workflows.filter((w) => w.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Executions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalRuns}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.averagePerDay} per day avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (mockStats.successfulRuns / mockStats.totalRuns) * 100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {mockStats.failedRuns} failures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Execution Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStats.avgExecutionTime}s
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflows List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workflows</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{workflow.name}</h3>
                        {getStatusBadge(workflow.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{workflow.runCount} executions</span>
                        <span>
                          Updated {workflow.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {workflow.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleWorkflowAction(workflow.id, "pause")
                        }
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {workflow.status === "paused" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleWorkflowAction(workflow.id, "play")
                        }
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleWorkflowAction(workflow.id, "edit")
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleWorkflowAction(workflow.id, "copy")
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleWorkflowAction(workflow.id, "delete")
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="executions">Execution History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="executions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>
                  Monitor workflow execution status and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executionHistory.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell className="font-medium">
                          {execution.workflowName}
                        </TableCell>
                        <TableCell>
                          {getExecutionStatusBadge(execution.status)}
                        </TableCell>
                        <TableCell>
                          {execution.startTime.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {formatDuration(execution.duration)}
                        </TableCell>
                        <TableCell>{execution.trigger}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={execution.progress}
                              className="w-16"
                            />
                            <span className="text-xs text-muted-foreground">
                              {execution.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Activity className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {execution.status === "running" && (
                                <DropdownMenuItem>
                                  <Square className="mr-2 h-4 w-4" />
                                  Stop Execution
                                </DropdownMenuItem>
                              )}
                              {execution.status === "failed" && (
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Retry
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Logs
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">97.1%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2s</div>
                  <p className="text-xs text-muted-foreground">
                    -0.3s from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Daily Executions
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Error Rate
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.9%</div>
                  <p className="text-xs text-muted-foreground">
                    -1.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>
                  Individual workflow metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.runCount} executions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">95%</div>
                          <div className="text-muted-foreground">Success</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">2.1s</div>
                          <div className="text-muted-foreground">Avg Time</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {workflow.lastRun ? "Today" : "Never"}
                          </div>
                          <div className="text-muted-foreground">Last Run</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>
                  Execution patterns over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Most Active Triggers</h4>
                    <div className="space-y-2">
                      {[
                        {
                          name: "Project Completed",
                          count: 45,
                          percentage: 38,
                        },
                        { name: "New Lead Added", count: 32, percentage: 27 },
                        { name: "Schedule", count: 28, percentage: 24 },
                        { name: "Manual Trigger", count: 13, percentage: 11 },
                      ].map((trigger) => (
                        <div
                          key={trigger.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{trigger.name}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">
                              {trigger.count}
                            </div>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${trigger.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Error Categories</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Email Delivery", count: 5, percentage: 42 },
                        { name: "API Timeout", count: 3, percentage: 25 },
                        { name: "Invalid Data", count: 2, percentage: 17 },
                        { name: "Network Error", count: 2, percentage: 17 },
                      ].map((error) => (
                        <div
                          key={error.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{error.name}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">
                              {error.count}
                            </div>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-destructive h-2 rounded-full"
                                style={{ width: `${error.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Settings</CardTitle>
                <CardDescription>
                  Configure how workflows are executed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Concurrent Executions</Label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Timeout (seconds)</Label>
                      <Input type="number" defaultValue="300" />
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Attempts</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No retries</SelectItem>
                          <SelectItem value="1">1 retry</SelectItem>
                          <SelectItem value="3">3 retries</SelectItem>
                          <SelectItem value="5">5 retries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Delay (seconds)</Label>
                      <Input type="number" defaultValue="60" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Log all workflow executions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send email alerts for failures
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-pause on Errors</Label>
                        <p className="text-sm text-muted-foreground">
                          Pause workflows after consecutive failures
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Performance Monitoring</Label>
                        <p className="text-sm text-muted-foreground">
                          Track detailed execution metrics
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Notification Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email Recipients</Label>
                        <Textarea
                          placeholder="Enter email addresses (one per line)"
                          defaultValue="admin@example.com&#10;manager@example.com"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Daily Summary Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive daily execution summaries
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Notification Threshold</Label>
                        <Select defaultValue="any">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any failure</SelectItem>
                            <SelectItem value="consecutive-3">
                              3 consecutive failures
                            </SelectItem>
                            <SelectItem value="consecutive-5">
                              5 consecutive failures
                            </SelectItem>
                            <SelectItem value="rate-10">
                              10% failure rate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Weekly Performance Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive weekly analytics reports
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
