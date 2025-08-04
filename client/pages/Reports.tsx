import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart3,
  Download,
  Filter,
  Search,
  Settings,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Types for report system
interface ReportColumn {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "status" | "currency";
  sortable: boolean;
  visible: boolean;
}

interface ReportData {
  [key: string]: any;
}

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  columns: ReportColumn[];
  filters: ReportFilter[];
}

interface ReportFilter {
  id: string;
  label: string;
  type: "select" | "date" | "dateRange" | "text" | "number";
  options?: { value: string; label: string }[];
  required?: boolean;
}

// Mock report configurations
const reportConfigs: ReportConfig[] = [
  {
    id: "projects",
    name: "Projects Report",
    description: "Comprehensive project performance and status analysis",
    category: "Projects",
    columns: [
      {
        id: "name",
        label: "Project Name",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "client",
        label: "Client",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "status",
        label: "Status",
        type: "status",
        sortable: true,
        visible: true,
      },
      {
        id: "value",
        label: "Project Value",
        type: "currency",
        sortable: true,
        visible: true,
      },
      {
        id: "startDate",
        label: "Start Date",
        type: "date",
        sortable: true,
        visible: true,
      },
      {
        id: "endDate",
        label: "End Date",
        type: "date",
        sortable: true,
        visible: true,
      },
      {
        id: "progress",
        label: "Progress %",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "manager",
        label: "Manager",
        type: "text",
        sortable: true,
        visible: false,
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        sortable: true,
        visible: false,
      },
    ],
    filters: [
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
          { value: "on-hold", label: "On Hold" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      {
        id: "dateRange",
        label: "Date Range",
        type: "dateRange",
      },
      {
        id: "minValue",
        label: "Minimum Value",
        type: "number",
      },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Report",
    description: "Financial performance and revenue analytics",
    category: "Financial",
    columns: [
      {
        id: "period",
        label: "Period",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "revenue",
        label: "Total Revenue",
        type: "currency",
        sortable: true,
        visible: true,
      },
      {
        id: "projects",
        label: "Projects Count",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "avgProjectValue",
        label: "Avg Project Value",
        type: "currency",
        sortable: true,
        visible: true,
      },
      {
        id: "growth",
        label: "Growth %",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "target",
        label: "Target",
        type: "currency",
        sortable: true,
        visible: false,
      },
      {
        id: "variance",
        label: "Variance",
        type: "currency",
        sortable: true,
        visible: false,
      },
    ],
    filters: [
      {
        id: "period",
        label: "Period Type",
        type: "select",
        required: true,
        options: [
          { value: "monthly", label: "Monthly" },
          { value: "quarterly", label: "Quarterly" },
          { value: "yearly", label: "Yearly" },
        ],
      },
      {
        id: "dateRange",
        label: "Date Range",
        type: "dateRange",
      },
    ],
  },
  {
    id: "clients",
    name: "Client Analysis",
    description: "Client engagement and project history analysis",
    category: "Clients",
    columns: [
      {
        id: "name",
        label: "Client Name",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "email",
        label: "Email",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "totalProjects",
        label: "Total Projects",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "totalValue",
        label: "Total Value",
        type: "currency",
        sortable: true,
        visible: true,
      },
      {
        id: "lastProject",
        label: "Last Project",
        type: "date",
        sortable: true,
        visible: true,
      },
      {
        id: "status",
        label: "Status",
        type: "status",
        sortable: true,
        visible: true,
      },
      {
        id: "phone",
        label: "Phone",
        type: "text",
        sortable: true,
        visible: false,
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        sortable: true,
        visible: false,
      },
    ],
    filters: [
      {
        id: "status",
        label: "Client Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "prospect", label: "Prospect" },
        ],
      },
      {
        id: "minValue",
        label: "Minimum Total Value",
        type: "number",
      },
    ],
  },
  {
    id: "performance",
    name: "Performance Metrics",
    description: "Team and operational performance indicators",
    category: "Operations",
    columns: [
      {
        id: "metric",
        label: "Metric",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "value",
        label: "Current Value",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "target",
        label: "Target",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "variance",
        label: "Variance %",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "trend",
        label: "Trend",
        type: "status",
        sortable: true,
        visible: true,
      },
      {
        id: "lastUpdated",
        label: "Last Updated",
        type: "date",
        sortable: true,
        visible: true,
      },
      {
        id: "category",
        label: "Category",
        type: "text",
        sortable: true,
        visible: false,
      },
    ],
    filters: [
      {
        id: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "productivity", label: "Productivity" },
          { value: "quality", label: "Quality" },
          { value: "efficiency", label: "Efficiency" },
          { value: "satisfaction", label: "Satisfaction" },
        ],
      },
    ],
  },
  {
    id: "reviews",
    name: "Reviews Report",
    description: "Review request timing and performance analysis",
    category: "Reviews",
    columns: [
      {
        id: "projectName",
        label: "Project Name",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "clientName",
        label: "Client Name",
        type: "text",
        sortable: true,
        visible: true,
      },
      {
        id: "reviewSentDate",
        label: "Review Sent Date",
        type: "date",
        sortable: true,
        visible: true,
      },
      {
        id: "timingType",
        label: "Timing Type",
        type: "status",
        sortable: true,
        visible: true,
      },
      {
        id: "daysAfterCompletion",
        label: "Days After Completion",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "reviewStatus",
        label: "Review Status",
        type: "status",
        sortable: true,
        visible: true,
      },
      {
        id: "rating",
        label: "Rating",
        type: "number",
        sortable: true,
        visible: true,
      },
      {
        id: "responseTime",
        label: "Response Time (Days)",
        type: "number",
        sortable: true,
        visible: false,
      },
      {
        id: "followUpSent",
        label: "Follow-up Sent",
        type: "status",
        sortable: true,
        visible: false,
      },
    ],
    filters: [
      {
        id: "timingType",
        label: "Review Timing",
        type: "select",
        options: [
          { value: "immediate", label: "Immediate (0 days)" },
          { value: "1-day", label: "1 Day After" },
          { value: "3-days", label: "3 Days After" },
          { value: "1-week", label: "1 Week After" },
          { value: "2-weeks", label: "2 Weeks After" },
          { value: "1-month", label: "1 Month After" },
          { value: "custom", label: "Custom Timing" },
        ],
      },
      {
        id: "reviewStatus",
        label: "Review Status",
        type: "select",
        options: [
          { value: "pending", label: "Pending" },
          { value: "completed", label: "Completed" },
          { value: "no-response", label: "No Response" },
          { value: "declined", label: "Declined" },
        ],
      },
      {
        id: "dateRange",
        label: "Date Range",
        type: "dateRange",
      },
      {
        id: "minRating",
        label: "Minimum Rating",
        type: "number",
      },
    ],
  },
];

// Mock data generators
const generateProjectsData = (): ReportData[] => [
  {
    id: 1,
    name: "Modern Kitchen Remodel",
    client: "John Smith",
    status: "active",
    value: 25000,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    progress: 75,
    manager: "Sarah Johnson",
    location: "Downtown",
  },
  {
    id: 2,
    name: "Bathroom Renovation",
    client: "Emily Davis",
    status: "completed",
    value: 15000,
    startDate: "2023-12-01",
    endDate: "2024-01-30",
    progress: 100,
    manager: "Mike Wilson",
    location: "Suburbs",
  },
  {
    id: 3,
    name: "Office Space Design",
    client: "TechCorp Inc",
    status: "on-hold",
    value: 45000,
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    progress: 30,
    manager: "Sarah Johnson",
    location: "Business District",
  },
  {
    id: 4,
    name: "Backyard Landscaping",
    client: "Robert Wilson",
    status: "active",
    value: 12000,
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    progress: 60,
    manager: "Lisa Chen",
    location: "Residential Area",
  },
];

const generateRevenueData = (): ReportData[] => [
  {
    id: 1,
    period: "January 2024",
    revenue: 85000,
    projects: 5,
    avgProjectValue: 17000,
    growth: 12.5,
    target: 80000,
    variance: 5000,
  },
  {
    id: 2,
    period: "December 2023",
    revenue: 75000,
    projects: 4,
    avgProjectValue: 18750,
    growth: 8.2,
    target: 75000,
    variance: 0,
  },
  {
    id: 3,
    period: "November 2023",
    revenue: 69000,
    projects: 6,
    avgProjectValue: 11500,
    growth: -5.1,
    target: 70000,
    variance: -1000,
  },
];

const generateClientsData = (): ReportData[] => [
  {
    id: 1,
    name: "John Smith",
    email: "john@email.com",
    totalProjects: 3,
    totalValue: 75000,
    lastProject: "2024-01-15",
    status: "active",
    phone: "(555) 123-4567",
    location: "New York",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@email.com",
    totalProjects: 2,
    totalValue: 32000,
    lastProject: "2023-12-01",
    status: "active",
    phone: "(555) 234-5678",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "TechCorp Inc",
    email: "contact@techcorp.com",
    totalProjects: 1,
    totalValue: 45000,
    lastProject: "2024-02-01",
    status: "prospect",
    phone: "(555) 345-6789",
    location: "San Francisco",
  },
];

const generatePerformanceData = (): ReportData[] => [
  {
    id: 1,
    metric: "Project Completion Rate",
    value: 92,
    target: 95,
    variance: -3.2,
    trend: "declining",
    lastUpdated: "2024-01-20",
    category: "productivity",
  },
  {
    id: 2,
    metric: "Client Satisfaction Score",
    value: 4.7,
    target: 4.5,
    variance: 4.4,
    trend: "improving",
    lastUpdated: "2024-01-19",
    category: "satisfaction",
  },
  {
    id: 3,
    metric: "Average Project Duration",
    value: 45,
    target: 40,
    variance: 12.5,
    trend: "stable",
    lastUpdated: "2024-01-18",
    category: "efficiency",
  },
];

const generateReviewsData = (): ReportData[] => [
  {
    id: 1,
    projectName: "Modern Kitchen Remodel",
    clientName: "John Smith",
    reviewSentDate: "2024-01-18",
    timingType: "3-days",
    daysAfterCompletion: 3,
    reviewStatus: "completed",
    rating: 5,
    responseTime: 2,
    followUpSent: "no",
  },
  {
    id: 2,
    projectName: "Bathroom Renovation",
    clientName: "Emily Davis",
    reviewSentDate: "2024-01-16",
    timingType: "1-week",
    daysAfterCompletion: 7,
    reviewStatus: "completed",
    rating: 4,
    responseTime: 4,
    followUpSent: "no",
  },
  {
    id: 3,
    projectName: "Office Space Design",
    clientName: "TechCorp Inc",
    reviewSentDate: "2024-01-20",
    timingType: "immediate",
    daysAfterCompletion: 0,
    reviewStatus: "pending",
    rating: 0,
    responseTime: 0,
    followUpSent: "yes",
  },
  {
    id: 4,
    projectName: "Backyard Landscaping",
    clientName: "Robert Wilson",
    reviewSentDate: "2024-01-15",
    timingType: "1-day",
    daysAfterCompletion: 1,
    reviewStatus: "no-response",
    rating: 0,
    responseTime: 0,
    followUpSent: "yes",
  },
  {
    id: 5,
    projectName: "Living Room Redesign",
    clientName: "Sarah Johnson",
    reviewSentDate: "2024-01-22",
    timingType: "2-weeks",
    daysAfterCompletion: 14,
    reviewStatus: "completed",
    rating: 5,
    responseTime: 1,
    followUpSent: "no",
  },
];

const dataGenerators: { [key: string]: () => ReportData[] } = {
  projects: generateProjectsData,
  revenue: generateRevenueData,
  clients: generateClientsData,
  performance: generatePerformanceData,
  reviews: generateReviewsData,
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [searchTerm, setSearchTerm] = useState("");

  const currentConfig = reportConfigs.find(
    (config) => config.id === selectedReport,
  );

  // Initialize column visibility when report changes
  React.useEffect(() => {
    if (currentConfig) {
      const visibility: { [key: string]: boolean } = {};
      currentConfig.columns.forEach((col) => {
        visibility[col.id] = col.visible;
      });
      setColumnVisibility(visibility);
    }
  }, [currentConfig]);

  const runReport = async () => {
    if (!selectedReport) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const generator = dataGenerators[selectedReport];
    if (generator) {
      setReportData(generator());
    }
    setLoading(false);
  };

  const handleSort = (columnId: string) => {
    if (!currentConfig?.columns.find((col) => col.id === columnId)?.sortable)
      return;

    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === columnId &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: columnId, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return reportData;

    return [...reportData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [reportData, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchLower),
        );
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [sortedData, searchTerm]);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const formatCellValue = (value: any, type: string) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "date":
        return new Date(value).toLocaleDateString();
      case "status":
        return (
          <Badge
            variant={
              value === "active" ||
              value === "completed" ||
              value === "improving"
                ? "default"
                : value === "on-hold" || value === "stable"
                  ? "secondary"
                  : "destructive"
            }
          >
            {value}
          </Badge>
        );
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const getSortIcon = (columnId: string) => {
    if (!sortConfig || sortConfig.key !== columnId) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const visibleColumns =
    currentConfig?.columns.filter((col) => columnVisibility[col.id]) || [];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Generate and analyze business reports with customizable data views
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" disabled={!reportData.length} className="w-full sm:w-auto min-h-[44px]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Select report type and configure parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  value={selectedReport}
                  onValueChange={setSelectedReport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        <div>
                          <div className="font-medium">{config.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {config.category}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentConfig?.filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <Label>{filter.label}</Label>
                  {filter.type === "select" && (
                    <Select
                      value={filters[filter.id] || ""}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, [filter.id]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${filter.label.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {filter.type === "number" && (
                    <Input
                      type="number"
                      placeholder={`Enter ${filter.label.toLowerCase()}`}
                      value={filters[filter.id] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [filter.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                  {filter.type === "text" && (
                    <Input
                      placeholder={`Enter ${filter.label.toLowerCase()}`}
                      value={filters[filter.id] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [filter.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                  {filter.type === "dateRange" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Start date"
                        value={filters[`${filter.id}_start`] || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [`${filter.id}_start`]: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="date"
                        placeholder="End date"
                        value={filters[`${filter.id}_end`] || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [`${filter.id}_end`]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={runReport} disabled={!selectedReport || loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Run Report
              </Button>
              {currentConfig && (
                <p className="text-sm text-muted-foreground">
                  {currentConfig.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Results */}
        {reportData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Report Results</CardTitle>
                  <CardDescription>
                    {filteredData.length} of {reportData.length} records
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full sm:w-64 min-h-[44px]"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
                        <Settings className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currentConfig?.columns.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={columnVisibility[column.id]}
                          onCheckedChange={() =>
                            toggleColumnVisibility(column.id)
                          }
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="rounded-md border min-w-[600px]">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead
                          key={column.id}
                          className={
                            column.sortable
                              ? "cursor-pointer hover:bg-muted/50"
                              : ""
                          }
                          onClick={() =>
                            column.sortable && handleSort(column.id)
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <span>{column.label}</span>
                            {column.sortable && getSortIcon(column.id)}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow key={row.id || index}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column.id}>
                            {formatCellValue(row[column.id], column.type)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedReport && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Select a Report</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose a report type from the configuration above to generate
                insights about your business performance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
