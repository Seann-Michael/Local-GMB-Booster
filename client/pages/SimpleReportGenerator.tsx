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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Download,
  Search,
  Settings,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText,
  Target,
  Zap,
  TrendingUp,
  Map,
  Database,
} from "lucide-react";

// Types
interface ReportField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "status" | "currency" | "percentage";
  sortable: boolean;
}

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ReportField[];
  filters: FilterConfig[];
}

interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "text" | "dateRange" | "numberRange";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface ReportData {
  [key: string]: any;
}

interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

// Report Configurations
const reportConfigs: ReportConfig[] = [
  {
    id: "scan-performance",
    name: "Scan Performance Report",
    description: "Analyze scan results, success rates, and credit consumption",
    category: "Analytics",
    fields: [
      { id: "scanId", label: "Scan ID", type: "text", sortable: true },
      { id: "businessName", label: "Business Name", type: "text", sortable: true },
      { id: "scanType", label: "Scan Type", type: "status", sortable: true },
      { id: "keywords", label: "Keywords", type: "number", sortable: true },
      { id: "waypoints", label: "Waypoints", type: "number", sortable: true },
      { id: "creditsUsed", label: "Credits Used", type: "number", sortable: true },
      { id: "successRate", label: "Success Rate", type: "percentage", sortable: true },
      { id: "avgRanking", label: "Avg Ranking", type: "number", sortable: true },
      { id: "scanDate", label: "Scan Date", type: "date", sortable: true },
      { id: "priority", label: "Priority", type: "status", sortable: true },
      { id: "status", label: "Status", type: "status", sortable: true },
    ],
    filters: [
      {
        id: "scanType",
        label: "Scan Type",
        type: "select",
        options: [
          { value: "one-time", label: "One-time Scan" },
          { value: "recurring", label: "Recurring Scan" },
          { value: "bulk", label: "Bulk Scan" },
        ],
      },
      {
        id: "priority",
        label: "Priority Level",
        type: "select",
        options: [
          { value: "standard", label: "Standard" },
          { value: "expedited", label: "Expedited" },
          { value: "priority", label: "Priority" },
        ],
      },
      {
        id: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "Search by business name...",
      },
    ],
  },
  {
    id: "credit-usage",
    name: "Credit Usage Report",
    description: "Track credit consumption patterns and optimization opportunities",
    category: "Financial",
    fields: [
      { id: "userId", label: "User ID", type: "text", sortable: true },
      { id: "userName", label: "User Name", type: "text", sortable: true },
      { id: "transactionDate", label: "Date", type: "date", sortable: true },
      { id: "transactionType", label: "Type", type: "status", sortable: true },
      { id: "creditsAmount", label: "Credits", type: "number", sortable: true },
      { id: "description", label: "Description", type: "text", sortable: true },
      { id: "remainingBalance", label: "Balance After", type: "number", sortable: true },
      { id: "costEfficiency", label: "Cost Efficiency", type: "percentage", sortable: true },
    ],
    filters: [
      {
        id: "transactionType",
        label: "Transaction Type",
        type: "select",
        options: [
          { value: "scan", label: "Scan Usage" },
          { value: "purchase", label: "Credit Purchase" },
          { value: "bonus", label: "Bonus Credits" },
          { value: "refund", label: "Refund" },
        ],
      },
      {
        id: "userName",
        label: "User Name",
        type: "text",
        placeholder: "Search by user name...",
      },
    ],
  },
  {
    id: "business-rankings",
    name: "Business Rankings Report",
    description: "Analyze ranking performance across different businesses and keywords",
    category: "SEO",
    fields: [
      { id: "businessName", label: "Business Name", type: "text", sortable: true },
      { id: "keyword", label: "Keyword", type: "text", sortable: true },
      { id: "currentRank", label: "Current Rank", type: "number", sortable: true },
      { id: "previousRank", label: "Previous Rank", type: "number", sortable: true },
      { id: "rankChange", label: "Rank Change", type: "number", sortable: true },
      { id: "averageRank", label: "Average Rank", type: "number", sortable: true },
      { id: "lastUpdated", label: "Last Updated", type: "date", sortable: true },
      { id: "visibility", label: "Visibility Score", type: "percentage", sortable: true },
    ],
    filters: [
      {
        id: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "Search businesses...",
      },
      {
        id: "keyword",
        label: "Keyword",
        type: "text",
        placeholder: "Search keywords...",
      },
      {
        id: "performanceType",
        label: "Performance Type",
        type: "select",
        options: [
          { value: "improving", label: "Improving" },
          { value: "declining", label: "Declining" },
          { value: "stable", label: "Stable" },
          { value: "new", label: "New Tracking" },
        ],
      },
    ],
  },
  {
    id: "location-analysis",
    name: "Location Performance Report",
    description: "Analyze ranking performance across different geographic locations",
    category: "Geographic",
    fields: [
      { id: "businessName", label: "Business", type: "text", sortable: true },
      { id: "location", label: "Location", type: "text", sortable: true },
      { id: "averageRank", label: "Avg Rank", type: "number", sortable: true },
      { id: "topKeywords", label: "Top Keywords", type: "number", sortable: true },
      { id: "visibilityScore", label: "Visibility", type: "percentage", sortable: true },
      { id: "competitorDensity", label: "Competitor Density", type: "number", sortable: true },
      { id: "lastScan", label: "Last Scan", type: "date", sortable: true },
      { id: "improvement", label: "30-day Change", type: "number", sortable: true },
      { id: "marketPotential", label: "Market Potential", type: "status", sortable: true },
    ],
    filters: [
      {
        id: "location",
        label: "Location",
        type: "text",
        placeholder: "Search locations...",
      },
      {
        id: "marketPotential",
        label: "Market Potential",
        type: "select",
        options: [
          { value: "high", label: "High Potential" },
          { value: "medium", label: "Medium Potential" },
          { value: "low", label: "Low Potential" },
          { value: "saturated", label: "Saturated Market" },
        ],
      },
    ],
  },
  {
    id: "system-performance",
    name: "System Performance Report",
    description: "Monitor system health, API response times, and operational metrics",
    category: "Operations",
    fields: [
      { id: "timestamp", label: "Timestamp", type: "date", sortable: true },
      { id: "endpoint", label: "API Endpoint", type: "text", sortable: true },
      { id: "responseTime", label: "Response Time (ms)", type: "number", sortable: true },
      { id: "statusCode", label: "Status Code", type: "status", sortable: true },
      { id: "requestCount", label: "Request Count", type: "number", sortable: true },
      { id: "errorRate", label: "Error Rate", type: "percentage", sortable: true },
      { id: "throughput", label: "Throughput (req/sec)", type: "number", sortable: true },
      { id: "cpuUsage", label: "CPU Usage", type: "percentage", sortable: true },
      { id: "memoryUsage", label: "Memory Usage", type: "percentage", sortable: true },
      { id: "activeUsers", label: "Active Users", type: "number", sortable: true },
    ],
    filters: [
      {
        id: "endpoint",
        label: "API Endpoint",
        type: "select",
        options: [
          { value: "/api/scan", label: "Scan API" },
          { value: "/api/rankings", label: "Rankings API" },
          { value: "/api/credits", label: "Credits API" },
          { value: "/api/auth", label: "Authentication API" },
        ],
      },
      {
        id: "statusCode",
        label: "Status Code",
        type: "select",
        options: [
          { value: "200", label: "200 - Success" },
          { value: "400", label: "400 - Bad Request" },
          { value: "401", label: "401 - Unauthorized" },
          { value: "500", label: "500 - Server Error" },
        ],
      },
    ],
  },
];

// Mock Data Generators
const generateScanPerformanceData = (): ReportData[] => [
  {
    scanId: "SCN_001",
    businessName: "Pizza Palace Downtown",
    scanType: "one-time",
    keywords: 5,
    waypoints: 10,
    creditsUsed: 145,
    successRate: 95.2,
    avgRanking: 3.8,
    scanDate: "2024-01-20",
    priority: "expedited",
    status: "completed",
  },
  {
    scanId: "SCN_002",
    businessName: "Fresh Dental Care",
    scanType: "recurring",
    keywords: 8,
    waypoints: 15,
    creditsUsed: 280,
    successRate: 88.7,
    avgRanking: 5.2,
    scanDate: "2024-01-19",
    priority: "standard",
    status: "completed",
  },
  {
    scanId: "SCN_003",
    businessName: "TechCorp Solutions",
    scanType: "one-time",
    keywords: 12,
    waypoints: 25,
    creditsUsed: 425,
    successRate: 92.1,
    avgRanking: 2.9,
    scanDate: "2024-01-18",
    priority: "priority",
    status: "completed",
  },
  {
    scanId: "SCN_004",
    businessName: "Local Fitness Gym",
    scanType: "bulk",
    keywords: 20,
    waypoints: 40,
    creditsUsed: 780,
    successRate: 97.5,
    avgRanking: 4.1,
    scanDate: "2024-01-17",
    priority: "standard",
    status: "running",
  },
  {
    scanId: "SCN_005",
    businessName: "Coffee House Central",
    scanType: "one-time",
    keywords: 6,
    waypoints: 12,
    creditsUsed: 165,
    successRate: 91.3,
    avgRanking: 4.7,
    scanDate: "2024-01-16",
    priority: "expedited",
    status: "completed",
  },
];

const generateCreditUsageData = (): ReportData[] => [
  {
    userId: "USR_001",
    userName: "John Smith",
    transactionDate: "2024-01-20",
    transactionType: "scan",
    creditsAmount: -145,
    description: "One-time scan: Pizza Palace (5 keywords, 10 waypoints)",
    remainingBalance: 4855,
    costEfficiency: 87.3,
  },
  {
    userId: "USR_002",
    userName: "Sarah Johnson",
    transactionDate: "2024-01-19",
    transactionType: "purchase",
    creditsAmount: 10000,
    description: "Credit package purchase - Professional Plan",
    remainingBalance: 15000,
    costEfficiency: 95.2,
  },
  {
    userId: "USR_001",
    userName: "John Smith",
    transactionDate: "2024-01-18",
    transactionType: "scan",
    creditsAmount: -280,
    description: "Recurring scan: Fresh Dental (8 keywords, 15 waypoints)",
    remainingBalance: 5000,
    costEfficiency: 92.1,
  },
  {
    userId: "USR_003",
    userName: "Mike Wilson",
    transactionDate: "2024-01-17",
    transactionType: "bonus",
    creditsAmount: 500,
    description: "New user bonus credits",
    remainingBalance: 2500,
    costEfficiency: 100.0,
  },
];

const generateBusinessRankingsData = (): ReportData[] => [
  {
    businessName: "Pizza Palace Downtown",
    keyword: "pizza delivery",
    currentRank: 3,
    previousRank: 5,
    rankChange: 2,
    averageRank: 4.2,
    lastUpdated: "2024-01-20",
    visibility: 78.5,
  },
  {
    businessName: "Pizza Palace Downtown",
    keyword: "italian restaurant",
    currentRank: 7,
    previousRank: 6,
    rankChange: -1,
    averageRank: 6.8,
    lastUpdated: "2024-01-20",
    visibility: 52.3,
  },
  {
    businessName: "Fresh Dental Care",
    keyword: "dentist near me",
    currentRank: 2,
    previousRank: 3,
    rankChange: 1,
    averageRank: 2.8,
    lastUpdated: "2024-01-19",
    visibility: 89.2,
  },
  {
    businessName: "Fresh Dental Care",
    keyword: "dental clinic",
    currentRank: 4,
    previousRank: 4,
    rankChange: 0,
    averageRank: 4.1,
    lastUpdated: "2024-01-19",
    visibility: 72.8,
  },
];

const generateLocationAnalysisData = (): ReportData[] => [
  {
    businessName: "Pizza Palace",
    location: "Downtown District",
    averageRank: 3.8,
    topKeywords: 3,
    visibilityScore: 78.5,
    competitorDensity: 12,
    lastScan: "2024-01-20",
    improvement: 2.3,
    marketPotential: "high",
  },
  {
    businessName: "Pizza Palace",
    location: "Suburban Area",
    averageRank: 5.2,
    topKeywords: 2,
    visibilityScore: 62.1,
    competitorDensity: 8,
    lastScan: "2024-01-18",
    improvement: -0.8,
    marketPotential: "medium",
  },
  {
    businessName: "Fresh Dental Care",
    location: "Medical District",
    averageRank: 2.1,
    topKeywords: 4,
    visibilityScore: 91.3,
    competitorDensity: 6,
    lastScan: "2024-01-19",
    improvement: 1.7,
    marketPotential: "high",
  },
];

const generateSystemPerformanceData = (): ReportData[] => [
  {
    timestamp: "2024-01-20 14:30:00",
    endpoint: "/api/scan",
    responseTime: 245,
    statusCode: "200",
    requestCount: 156,
    errorRate: 2.1,
    throughput: 12.8,
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    activeUsers: 23,
  },
  {
    timestamp: "2024-01-20 14:25:00",
    endpoint: "/api/rankings",
    responseTime: 123,
    statusCode: "200",
    requestCount: 89,
    errorRate: 0.5,
    throughput: 15.2,
    cpuUsage: 42.1,
    memoryUsage: 65.3,
    activeUsers: 23,
  },
  {
    timestamp: "2024-01-20 14:20:00",
    endpoint: "/api/credits",
    responseTime: 89,
    statusCode: "200",
    requestCount: 234,
    errorRate: 0.2,
    throughput: 18.7,
    cpuUsage: 38.9,
    memoryUsage: 61.2,
    activeUsers: 25,
  },
];

const dataGenerators: { [key: string]: () => ReportData[] } = {
  "scan-performance": generateScanPerformanceData,
  "credit-usage": generateCreditUsageData,
  "business-rankings": generateBusinessRankingsData,
  "location-analysis": generateLocationAnalysisData,
  "system-performance": generateSystemPerformanceData,
};

const getIcon = (category: string) => {
  switch (category) {
    case "Analytics": return Target;
    case "Financial": return Zap;
    case "SEO": return TrendingUp;
    case "Geographic": return Map;
    case "Operations": return Database;
    default: return BarChart3;
  }
};

export default function SimpleReportGenerator() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({});
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [searchTerm, setSearchTerm] = useState("");

  const currentConfig = reportConfigs.find(config => config.id === selectedReport);

  // Initialize column visibility when report changes
  React.useEffect(() => {
    if (currentConfig) {
      const visibility: { [key: string]: boolean } = {};
      currentConfig.fields.forEach(field => {
        visibility[field.id] = true; // Show all columns by default
      });
      setColumnVisibility(visibility);
    }
  }, [currentConfig]);

  const runReport = async () => {
    if (!selectedReport) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    const generator = dataGenerators[selectedReport];
    if (generator) {
      setReportData(generator());
    }
    setLoading(false);
  };

  const handleSort = (fieldId: string) => {
    const field = currentConfig?.fields.find(f => f.id === fieldId);
    if (!field?.sortable) return;

    setSortConfig(prev => {
      if (prev?.field === fieldId) {
        return {
          field: fieldId,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { field: fieldId, direction: "asc" };
    });
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = [...reportData];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        filtered = filtered.filter(row => 
          String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [reportData, searchTerm, filters, sortConfig]);

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "date":
        return new Date(value).toLocaleDateString();
      case "percentage":
        return `${Number(value).toFixed(1)}%`;
      case "status":
        const getStatusVariant = (status: string) => {
          const positive = ["completed", "active", "success", "improving", "high"];
          const warning = ["pending", "running", "medium", "stable"];
          const negative = ["failed", "error", "declined", "low", "declining"];
          
          if (positive.some(p => status.toLowerCase().includes(p))) return "default";
          if (warning.some(w => status.toLowerCase().includes(w))) return "secondary";
          return "destructive";
        };
        
        return (
          <Badge variant={getStatusVariant(String(value))}>
            {String(value)}
          </Badge>
        );
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      default:
        return String(value);
    }
  };

  const getSortIcon = (fieldId: string) => {
    if (!sortConfig || sortConfig.field !== fieldId) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const visibleFields = currentConfig?.fields.filter(field => columnVisibility[field.id]) || [];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Generator</h1>
            <p className="text-muted-foreground">
              Generate comprehensive reports with customizable parameters and data analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!reportData.length}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" disabled={!reportData.length}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Configuration
            </CardTitle>
            <CardDescription>
              Select a report type and configure parameters to generate insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <Label className="text-base font-medium">Report Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                {reportConfigs.map(config => {
                  const Icon = getIcon(config.category);
                  return (
                    <Card
                      key={config.id}
                      className={`cursor-pointer transition-colors hover:border-primary/50 ${
                        selectedReport === config.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedReport(config.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedReport === config.id ? "bg-primary text-white" : "bg-muted"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">{config.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {config.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {config.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            {currentConfig && currentConfig.filters.length > 0 && (
              <div>
                <Label className="text-base font-medium">Filters & Parameters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {currentConfig.filters.map(filter => (
                    <div key={filter.id} className="space-y-2">
                      <Label className="text-sm">{filter.label}</Label>
                      {filter.type === "select" && (
                        <Select
                          value={filters[filter.id] || ""}
                          onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, [filter.id]: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {filter.type === "text" && (
                        <Input
                          placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
                          value={filters[filter.id] || ""}
                          onChange={(e) =>
                            setFilters(prev => ({ ...prev, [filter.id]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Report Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runReport} 
                  disabled={!selectedReport || loading}
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  )}
                  Generate Report
                </Button>
                {currentConfig && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{currentConfig.fields.length}</span> available fields
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Results */}
        {reportData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Report Results
                  </CardTitle>
                  <CardDescription>
                    Showing {sortedAndFilteredData.length} of {reportData.length} records
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currentConfig?.fields.map(field => (
                        <DropdownMenuCheckboxItem
                          key={field.id}
                          checked={columnVisibility[field.id]}
                          onCheckedChange={() =>
                            setColumnVisibility(prev => ({
                              ...prev,
                              [field.id]: !prev[field.id],
                            }))
                          }
                        >
                          {field.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleFields.map(field => (
                        <TableHead
                          key={field.id}
                          className={field.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                          onClick={() => field.sortable && handleSort(field.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{field.label}</span>
                            {field.sortable && getSortIcon(field.id)}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredData.map((row, index) => (
                      <TableRow key={index}>
                        {visibleFields.map(field => (
                          <TableCell key={field.id}>
                            {formatCellValue(row[field.id], field.type)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedReport && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Select a Report Type</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose from our comprehensive report types above to generate detailed insights about your business performance, scan results, and system metrics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
