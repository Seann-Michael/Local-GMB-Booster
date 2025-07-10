import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { SimpleWorkflowBuilder } from "@/components/automation/SimpleWorkflowBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Copy,
  Edit,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Activity,
  Users,
  Settings,
} from "lucide-react";
import { Workflow, WorkflowStats } from "@/types/automation";
import { generateId } from "@/lib/idGenerator";
import { cn } from "@/lib/utils";

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

export default function Automation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: generateId("workflow"),
      name: "Untitled Workflow",
      description: "",
      status: "draft",
      nodes: [],
      connections: [],
      triggers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0,
    };

    setWorkflows((prev) => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsCreateDialogOpen(false);
  };

  const handleWorkflowAction = (workflowId: string, action: string) => {
    setWorkflows((prev) =>
      prev.map((workflow) => {
        if (workflow.id === workflowId) {
          switch (action) {
            case "activate":
              return { ...workflow, status: "active" as const };
            case "pause":
              return { ...workflow, status: "paused" as const };
            case "delete":
              return workflow; // Handle separately
            default:
              return workflow;
          }
        }
        return workflow;
      }),
    );

    if (action === "delete") {
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
    }
  };

  if (selectedWorkflow) {
    return (
      <AppLayout>
        <div className="h-full">
          <SimpleWorkflowBuilder
            workflowId={selectedWorkflow.id}
            onSave={(workflow) => {
              setWorkflows((prev) =>
                prev.map((w) => (w.id === workflow.id ? workflow : w)),
              );
            }}
            onPublish={(workflow) => {
              handleWorkflowAction(workflow.id, "activate");
            }}
          />

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedWorkflow(null)}
            className="absolute top-4 left-4 z-50"
          >
            ← Back to Automations
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage automated workflows to streamline your business
              processes
            </p>
          </div>

          <Button onClick={handleCreateWorkflow}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                +{mockStats.averagePerDay} per day average
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
                {mockStats.successfulRuns} successful executions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Execution Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStats.avgExecutionTime}s
              </div>
              <p className="text-xs text-muted-foreground">
                Last run: {mockStats.lastRun?.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="workflows" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Execution History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {filterStatus === "all" ? "All" : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("paused")}>
                    Paused
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Workflows Data Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Executions</th>
                    <th className="text-left p-4 font-medium">Last Run</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-left p-4 font-medium">Updated</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkflows.map((workflow, index) => (
                    <tr
                      key={workflow.id}
                      className={cn(
                        "border-b hover:bg-muted/20 transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-muted/10",
                      )}
                    >
                      <td className="p-4">
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedWorkflow(workflow)}
                        >
                          <div className="font-medium text-foreground hover:text-primary transition-colors">
                            {workflow.name}
                          </div>
                          {workflow.description && (
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {workflow.description}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={
                            workflow.status === "active"
                              ? "default"
                              : workflow.status === "draft"
                                ? "secondary"
                                : workflow.status === "paused"
                                  ? "outline"
                                  : "destructive"
                          }
                          className="flex items-center gap-1 w-fit"
                        >
                          {workflow.status === "active" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {workflow.status === "draft" && (
                            <Edit className="h-3 w-3" />
                          )}
                          {workflow.status === "paused" && (
                            <Pause className="h-3 w-3" />
                          )}
                          {workflow.status === "error" && (
                            <Trash2 className="h-3 w-3" />
                          )}
                          <span className="capitalize">{workflow.status}</span>
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="font-medium">{workflow.runCount}</div>
                        {workflow.runCount > 0 && (
                          <div className="text-xs text-muted-foreground">
                            total runs
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          {workflow.lastRun
                            ? workflow.lastRun.toLocaleDateString()
                            : "Never"}
                        </div>
                        {workflow.lastRun && (
                          <div className="text-xs text-muted-foreground">
                            {workflow.lastRun.toLocaleTimeString()}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          {workflow.createdAt.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {workflow.createdAt.toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          {workflow.updatedAt.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {workflow.updatedAt.toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWorkflow(workflow)}
                            className="h-8 px-3"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {}}>
                                <Play className="mr-2 h-4 w-4" />
                                Test Workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {workflow.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleWorkflowAction(workflow.id, "pause")
                                  }
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleWorkflowAction(
                                      workflow.id,
                                      "activate",
                                    )
                                  }
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleWorkflowAction(workflow.id, "delete")
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredWorkflows.length === 0 && (
              <div className="border rounded-lg">
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No workflows found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Create your first workflow to get started"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreateWorkflow}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Execution History</CardTitle>
                    <CardDescription>
                      Recent workflow executions and their results
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date Range
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium">Workflow</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Started</th>
                        <th className="text-left p-3 font-medium">Duration</th>
                        <th className="text-left p-3 font-medium">Trigger</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "exec-1",
                          workflowName: "Lead Nurturing Campaign",
                          status: "success",
                          startedAt: new Date("2024-01-20T10:30:00"),
                          duration: 2.3,
                          trigger: "New Lead Added",
                          actionsCompleted: 3,
                          totalActions: 3,
                          error: null,
                        },
                        {
                          id: "exec-2",
                          workflowName: "Review Follow-up",
                          status: "success",
                          startedAt: new Date("2024-01-20T09:15:00"),
                          duration: 1.8,
                          trigger: "Project Completed",
                          actionsCompleted: 2,
                          totalActions: 2,
                          error: null,
                        },
                        {
                          id: "exec-3",
                          workflowName: "Client Onboarding",
                          status: "failed",
                          startedAt: new Date("2024-01-20T08:45:00"),
                          duration: 0.5,
                          trigger: "Manual Trigger",
                          actionsCompleted: 1,
                          totalActions: 4,
                          error: "Email delivery failed",
                        },
                        {
                          id: "exec-4",
                          workflowName: "Lead Nurturing Campaign",
                          status: "running",
                          startedAt: new Date("2024-01-20T10:25:00"),
                          duration: null,
                          trigger: "Schedule",
                          actionsCompleted: 2,
                          totalActions: 3,
                          error: null,
                        },
                        {
                          id: "exec-5",
                          workflowName: "Review Follow-up",
                          status: "success",
                          startedAt: new Date("2024-01-19T16:20:00"),
                          duration: 2.1,
                          trigger: "Project Completed",
                          actionsCompleted: 2,
                          totalActions: 2,
                          error: null,
                        },
                      ].map((execution, index) => (
                        <tr
                          key={execution.id}
                          className={cn(
                            "border-b hover:bg-muted/20 transition-colors",
                            index % 2 === 0 ? "bg-white" : "bg-muted/10",
                          )}
                        >
                          <td className="p-3">
                            <div className="font-medium text-sm">
                              {execution.workflowName}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                execution.status === "success"
                                  ? "default"
                                  : execution.status === "failed"
                                    ? "destructive"
                                    : execution.status === "running"
                                      ? "secondary"
                                      : "outline"
                              }
                              className="flex items-center gap-1 w-fit"
                            >
                              {execution.status === "success" && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {execution.status === "failed" && (
                                <XCircle className="h-3 w-3" />
                              )}
                              {execution.status === "running" && (
                                <Clock className="h-3 w-3" />
                              )}
                              <span className="capitalize">
                                {execution.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {execution.startedAt.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {execution.startedAt.toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {execution.duration
                                ? `${execution.duration}s`
                                : execution.status === "running"
                                  ? "Running..."
                                  : "-"}
                            </div>
                            {execution.error && (
                              <div className="text-xs text-destructive">
                                {execution.error}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{execution.trigger}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {execution.actionsCompleted}/
                              {execution.totalActions} actions
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full",
                                  execution.status === "success"
                                    ? "bg-green-500"
                                    : execution.status === "failed"
                                      ? "bg-red-500"
                                      : "bg-blue-500",
                                )}
                                style={{
                                  width: `${(execution.actionsCompleted / execution.totalActions) * 100}%`,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Detailed analytics and performance metrics will be available
                soon. Monitor your workflow performance, success rates, and
                execution trends.
              </p>
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
                  {mockWorkflows.map((workflow) => (
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
                        {
                          name: "New Lead Added",
                          count: 32,
                          percentage: 27,
                        },
                        { name: "Schedule", count: 28, percentage: 24 },
                        {
                          name: "Manual Trigger",
                          count: 13,
                          percentage: 11,
                        },
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
                                style={{
                                  width: `${trigger.percentage}%`,
                                }}
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
                        {
                          name: "Email Delivery",
                          count: 5,
                          percentage: 42,
                        },
                        {
                          name: "API Timeout",
                          count: 3,
                          percentage: 25,
                        },
                        {
                          name: "Invalid Data",
                          count: 2,
                          percentage: 17,
                        },
                        {
                          name: "Network Error",
                          count: 2,
                          percentage: 17,
                        },
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
                                style={{
                                  width: `${error.percentage}%`,
                                }}
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
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Auto Retry Failed Workflows
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Automatically retry failed executions
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxRetries">Maximum Retries</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 retry</SelectItem>
                          <SelectItem value="2">2 retries</SelectItem>
                          <SelectItem value="3">3 retries</SelectItem>
                          <SelectItem value="5">5 retries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retryDelay">Retry Delay</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                          <SelectItem value="900">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable Execution Logs</div>
                        <div className="text-sm text-muted-foreground">
                          Store detailed execution logs
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logRetention">Log Retention Period</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Execution Timezone</Label>
                      <Select defaultValue="America/New_York">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">
                            Eastern Time
                          </SelectItem>
                          <SelectItem value="America/Chicago">
                            Central Time
                          </SelectItem>
                          <SelectItem value="America/Denver">
                            Mountain Time
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            Pacific Time
                          </SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when to receive execution notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Workflow Failures</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when workflows fail
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-muted-foreground">
                      Receive daily execution summary
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Reports</div>
                    <div className="text-sm text-muted-foreground">
                      Get weekly performance reports
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">Notification Email</Label>
                  <Input
                    id="notificationEmail"
                    type="email"
                    placeholder="admin@company.com"
                    defaultValue="admin@smithconstruction.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>
                  Optimize workflow execution performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrent">
                      Max Concurrent Executions
                    </Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 execution</SelectItem>
                        <SelectItem value="3">3 executions</SelectItem>
                        <SelectItem value="5">5 executions</SelectItem>
                        <SelectItem value="10">10 executions</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="executionTimeout">Execution Timeout</Label>
                    <Select defaultValue="300">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="600">10 minutes</SelectItem>
                        <SelectItem value="1800">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Queue Failed Workflows</div>
                    <div className="text-sm text-muted-foreground">
                      Queue failed workflows for manual review
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-Scale Execution</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically adjust execution capacity
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
