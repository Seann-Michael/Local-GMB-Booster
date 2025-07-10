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
                <CardTitle>Execution History</CardTitle>
                <CardDescription>
                  Recent workflow executions and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Execution history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>
                  Configure global automation preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
