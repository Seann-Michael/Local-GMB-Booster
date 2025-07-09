import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/AppLayout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  Calculator,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProjectValue {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  estimatedValue: number;
  actualValue: number;
  paidAmount: number;
  remainingAmount: number;
  profitMargin: number;
  costs: {
    materials: number;
    labor: number;
    overhead: number;
    other: number;
  };
  status:
    | "estimated"
    | "quoted"
    | "approved"
    | "in_progress"
    | "completed"
    | "invoiced"
    | "paid";
  startDate: string;
  completionDate?: string;
  paymentTerms: "net_30" | "net_15" | "immediate" | "50_50" | "milestone";
  lastUpdated: string;
  milestones: ProjectMilestone[];
  changeOrders: ChangeOrder[];
}

interface ProjectMilestone {
  id: string;
  name: string;
  value: number;
  dueDate: string;
  completedDate?: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  invoiced: boolean;
  paid: boolean;
}

interface ChangeOrder {
  id: string;
  description: string;
  value: number;
  approved: boolean;
  createdDate: string;
  approvedDate?: string;
}

interface RevenueMetrics {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalOutstanding: number;
  averageMargin: number;
  projectsCompleted: number;
  projectsInProgress: number;
  monthlyRevenue: number;
  projectedRevenue: number;
}

export default function ProjectValue() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<ProjectValue[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectValue[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalEstimated: 0,
    totalActual: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    averageMargin: 0,
    projectsCompleted: 0,
    projectsInProgress: 0,
    monthlyRevenue: 0,
    projectedRevenue: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    client: "all",
    profitability: "all",
  });

  useEffect(() => {
    loadProjectValues();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateMetrics();
  }, [projects, filters]);

  const loadProjectValues = () => {
    const mockProjects: ProjectValue[] = [
      {
        id: "pv-1",
        projectId: "proj-1",
        projectName: "Downtown Office Renovation",
        clientName: "Johnson Corp",
        estimatedValue: 75000,
        actualValue: 82500,
        paidAmount: 41250,
        remainingAmount: 41250,
        profitMargin: 28.5,
        costs: {
          materials: 35000,
          labor: 25000,
          overhead: 8000,
          other: 2000,
        },
        status: "in_progress",
        startDate: "2024-01-15",
        paymentTerms: "50_50",
        lastUpdated: "2024-01-20T14:30:00Z",
        milestones: [
          {
            id: "ms-1",
            name: "Foundation & Structural",
            value: 30000,
            dueDate: "2024-02-01",
            completedDate: "2024-01-28",
            status: "completed",
            invoiced: true,
            paid: true,
          },
          {
            id: "ms-2",
            name: "Electrical & Plumbing",
            value: 25000,
            dueDate: "2024-02-15",
            status: "in_progress",
            invoiced: false,
            paid: false,
          },
          {
            id: "ms-3",
            name: "Finishing Work",
            value: 27500,
            dueDate: "2024-03-01",
            status: "pending",
            invoiced: false,
            paid: false,
          },
        ],
        changeOrders: [
          {
            id: "co-1",
            description: "Additional electrical outlets in conference room",
            value: 2500,
            approved: true,
            createdDate: "2024-01-18",
            approvedDate: "2024-01-19",
          },
          {
            id: "co-2",
            description: "Upgrade to premium flooring",
            value: 5000,
            approved: true,
            createdDate: "2024-01-20",
            approvedDate: "2024-01-20",
          },
        ],
      },
      {
        id: "pv-2",
        projectId: "proj-2",
        projectName: "Kitchen Remodel - Wilson Residence",
        clientName: "Mike Wilson",
        estimatedValue: 25000,
        actualValue: 26800,
        paidAmount: 26800,
        remainingAmount: 0,
        profitMargin: 35.2,
        costs: {
          materials: 12000,
          labor: 8000,
          overhead: 2500,
          other: 800,
        },
        status: "completed",
        startDate: "2023-12-01",
        completionDate: "2024-01-15",
        paymentTerms: "milestone",
        lastUpdated: "2024-01-15T16:00:00Z",
        milestones: [
          {
            id: "ms-4",
            name: "Demolition & Prep",
            value: 8000,
            dueDate: "2023-12-08",
            completedDate: "2023-12-07",
            status: "completed",
            invoiced: true,
            paid: true,
          },
          {
            id: "ms-5",
            name: "Installation",
            value: 12000,
            dueDate: "2023-12-28",
            completedDate: "2023-12-30",
            status: "completed",
            invoiced: true,
            paid: true,
          },
          {
            id: "ms-6",
            name: "Final Touches",
            value: 6800,
            dueDate: "2024-01-15",
            completedDate: "2024-01-15",
            status: "completed",
            invoiced: true,
            paid: true,
          },
        ],
        changeOrders: [
          {
            id: "co-3",
            description: "Upgrade cabinet hardware",
            value: 1800,
            approved: true,
            createdDate: "2023-12-15",
            approvedDate: "2023-12-15",
          },
        ],
      },
      {
        id: "pv-3",
        projectId: "proj-3",
        projectName: "Bathroom Renovation - Rodriguez Home",
        clientName: "Lisa Rodriguez",
        estimatedValue: 18000,
        actualValue: 18000,
        paidAmount: 9000,
        remainingAmount: 9000,
        profitMargin: 32.1,
        costs: {
          materials: 8500,
          labor: 6000,
          overhead: 2000,
          other: 500,
        },
        status: "quoted",
        startDate: "2024-02-01",
        paymentTerms: "50_50",
        lastUpdated: "2024-01-22T10:15:00Z",
        milestones: [
          {
            id: "ms-7",
            name: "Demolition",
            value: 6000,
            dueDate: "2024-02-08",
            status: "pending",
            invoiced: false,
            paid: false,
          },
          {
            id: "ms-8",
            name: "Installation",
            value: 12000,
            dueDate: "2024-02-22",
            status: "pending",
            invoiced: false,
            paid: false,
          },
        ],
        changeOrders: [],
      },
      {
        id: "pv-4",
        projectId: "proj-4",
        projectName: "Commercial Office Buildout",
        clientName: "TechStartup Inc",
        estimatedValue: 120000,
        actualValue: 125000,
        paidAmount: 0,
        remainingAmount: 125000,
        profitMargin: 22.8,
        costs: {
          materials: 55000,
          labor: 40000,
          overhead: 15000,
          other: 5000,
        },
        status: "approved",
        startDate: "2024-03-01",
        paymentTerms: "milestone",
        lastUpdated: "2024-01-25T11:45:00Z",
        milestones: [
          {
            id: "ms-9",
            name: "Phase 1 - Infrastructure",
            value: 45000,
            dueDate: "2024-03-15",
            status: "pending",
            invoiced: false,
            paid: false,
          },
          {
            id: "ms-10",
            name: "Phase 2 - Build-out",
            value: 50000,
            dueDate: "2024-04-01",
            status: "pending",
            invoiced: false,
            paid: false,
          },
          {
            id: "ms-11",
            name: "Phase 3 - Finishing",
            value: 30000,
            dueDate: "2024-04-15",
            status: "pending",
            invoiced: false,
            paid: false,
          },
        ],
        changeOrders: [
          {
            id: "co-4",
            description: "Additional conference rooms",
            value: 5000,
            approved: true,
            createdDate: "2024-01-22",
            approvedDate: "2024-01-23",
          },
        ],
      },
    ];

    setProjects(mockProjects);
  };

  const calculateMetrics = () => {
    const totalEstimated = projects.reduce(
      (sum, p) => sum + p.estimatedValue,
      0,
    );
    const totalActual = projects.reduce((sum, p) => sum + p.actualValue, 0);
    const totalPaid = projects.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalOutstanding = projects.reduce(
      (sum, p) => sum + p.remainingAmount,
      0,
    );
    const averageMargin =
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.profitMargin, 0) / projects.length
        : 0;

    const projectsCompleted = projects.filter(
      (p) => p.status === "completed",
    ).length;
    const projectsInProgress = projects.filter((p) =>
      ["in_progress", "approved"].includes(p.status),
    ).length;

    // Calculate monthly revenue (simplified - current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = projects
      .filter((p) => {
        if (!p.completionDate) return false;
        const completionDate = new Date(p.completionDate);
        return (
          completionDate.getMonth() === currentMonth &&
          completionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, p) => sum + p.actualValue, 0);

    // Projected revenue for active projects
    const projectedRevenue = projects
      .filter((p) => ["approved", "in_progress"].includes(p.status))
      .reduce((sum, p) => sum + p.actualValue, 0);

    setMetrics({
      totalEstimated,
      totalActual,
      totalPaid,
      totalOutstanding,
      averageMargin,
      projectsCompleted,
      projectsInProgress,
      monthlyRevenue,
      projectedRevenue,
    });
  };

  const applyFilters = () => {
    let filtered = projects;

    if (filters.status !== "all") {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.profitability !== "all") {
      if (filters.profitability === "high") {
        filtered = filtered.filter((p) => p.profitMargin >= 30);
      } else if (filters.profitability === "medium") {
        filtered = filtered.filter(
          (p) => p.profitMargin >= 20 && p.profitMargin < 30,
        );
      } else if (filters.profitability === "low") {
        filtered = filtered.filter((p) => p.profitMargin < 20);
      }
    }

    setFilteredProjects(filtered);
  };

  const getStatusColor = (status: ProjectValue["status"]) => {
    switch (status) {
      case "estimated":
        return "bg-gray-100 text-gray-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "invoiced":
        return "bg-purple-100 text-purple-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProfitColor = (margin: number) => {
    if (margin >= 30) return "text-green-600";
    if (margin >= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getMilestoneStatusColor = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Value & Revenue
            </h1>
            <p className="text-muted-foreground">
              Track project values, profitability, and revenue forecasting
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.totalActual.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">
                  +$
                  {(
                    metrics.totalActual - metrics.totalEstimated
                  ).toLocaleString()}
                </span>{" "}
                vs estimated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.totalOutstanding.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((metrics.totalPaid / metrics.totalActual) * 100).toFixed(1)}%
                collected
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Profit Margin
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.averageMargin.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across {projects.length} projects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pipeline Value
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.projectedRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.projectsInProgress} active projects
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Project Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="estimated">Estimated</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="invoiced">Invoiced</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.profitability}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, profitability: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Profitability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Margins</SelectItem>
                      <SelectItem value="high">High (30%+)</SelectItem>
                      <SelectItem value="medium">Medium (20-30%)</SelectItem>
                      <SelectItem value="low">Low (&lt;20%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="this_quarter">This Quarter</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        status: "all",
                        dateRange: "all",
                        client: "all",
                        profitability: "all",
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Projects ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Estimated</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Profit Margin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {project.projectName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.clientName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Started:{" "}
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${project.estimatedValue.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${project.actualValue.toLocaleString()}
                          </div>
                          {project.actualValue !== project.estimatedValue && (
                            <div
                              className={`text-sm ${project.actualValue > project.estimatedValue ? "text-green-600" : "text-red-600"}`}
                            >
                              {project.actualValue > project.estimatedValue
                                ? "+"
                                : ""}
                              $
                              {(
                                project.actualValue - project.estimatedValue
                              ).toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${project.paidAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(
                              (project.paidAmount / project.actualValue) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${project.remainingAmount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-medium ${getProfitColor(project.profitMargin)}`}
                          >
                            {project.profitMargin.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            $
                            {(
                              (project.actualValue * project.profitMargin) /
                              100
                            ).toLocaleString()}{" "}
                            profit
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profit Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {project.projectName}
                          </span>
                          <span
                            className={getProfitColor(project.profitMargin)}
                          >
                            {project.profitMargin.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={project.profitMargin}
                          className="h-2"
                        />
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">
                              Materials
                            </div>
                            <div>
                              ${project.costs.materials.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Labor</div>
                            <div>${project.costs.labor.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Overhead
                            </div>
                            <div>
                              ${project.costs.overhead.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Profit</div>
                            <div
                              className={getProfitColor(project.profitMargin)}
                            >
                              $
                              {(
                                (project.actualValue * project.profitMargin) /
                                100
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["materials", "labor", "overhead", "other"].map(
                      (costType) => {
                        const totalCost = projects.reduce(
                          (sum, p) =>
                            sum + p.costs[costType as keyof typeof p.costs],
                          0,
                        );
                        const totalRevenue = projects.reduce(
                          (sum, p) => sum + p.actualValue,
                          0,
                        );
                        const percentage =
                          totalRevenue > 0
                            ? (totalCost / totalRevenue) * 100
                            : 0;

                        return (
                          <div key={costType} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="capitalize">{costType}</span>
                              <span>
                                ${totalCost.toLocaleString()} (
                                {percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">{project.projectName}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {project.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-3 border rounded"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">
                                {milestone.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Due:{" "}
                                {new Date(
                                  milestone.dueDate,
                                ).toLocaleDateString()}
                                {milestone.completedDate && (
                                  <span className="ml-2">
                                    • Completed:{" "}
                                    {new Date(
                                      milestone.completedDate,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-medium">
                                  ${milestone.value.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {milestone.invoiced
                                    ? "Invoiced"
                                    : "Not invoiced"}{" "}
                                  •{milestone.paid ? " Paid" : " Unpaid"}
                                </div>
                              </div>

                              <Badge
                                className={getMilestoneStatusColor(
                                  milestone.status,
                                )}
                              >
                                {milestone.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      {project.changeOrders.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium mb-2">Change Orders</h5>
                          {project.changeOrders.map((changeOrder) => (
                            <div
                              key={changeOrder.id}
                              className="flex justify-between items-center py-2"
                            >
                              <div>
                                <div className="font-medium">
                                  {changeOrder.description}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Created:{" "}
                                  {new Date(
                                    changeOrder.createdDate,
                                  ).toLocaleDateString()}
                                  {changeOrder.approvedDate && (
                                    <span>
                                      {" "}
                                      • Approved:{" "}
                                      {new Date(
                                        changeOrder.approvedDate,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  ${changeOrder.value.toLocaleString()}
                                </span>
                                <Badge
                                  variant={
                                    changeOrder.approved
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {changeOrder.approved
                                    ? "Approved"
                                    : "Pending"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Month Revenue</span>
                      <span className="font-medium">
                        ${metrics.monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pipeline Revenue</span>
                      <span className="font-medium">
                        ${metrics.projectedRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Outstanding Collections</span>
                      <span className="font-medium">
                        ${metrics.totalOutstanding.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center font-medium">
                        <span>Projected Total</span>
                        <span className="text-lg">
                          $
                          {(
                            metrics.projectedRevenue + metrics.totalOutstanding
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Projects Completed</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {metrics.projectsCompleted}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Projects In Progress</span>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {metrics.projectsInProgress}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Profit Margin</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span
                          className={`font-medium ${getProfitColor(metrics.averageMargin)}`}
                        >
                          {metrics.averageMargin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Collection Rate</span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {(
                            (metrics.totalPaid / metrics.totalActual) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
