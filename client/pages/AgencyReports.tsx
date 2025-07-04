import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  TrendingUp,
  Building2,
  Mail,
  Clock,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "client" | "financial" | "performance" | "commission";
  icon: any;
  lastGenerated?: string;
  frequency: "manual" | "weekly" | "monthly" | "quarterly";
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  period: string;
  status: "ready" | "generating" | "scheduled";
  size: string;
  downloadUrl?: string;
}

export default function AgencyReports() {
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    [],
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    initializeReports();
  }, []);

  const initializeReports = () => {
    const templates: ReportTemplate[] = [
      {
        id: "client-overview",
        name: "Client Overview Report",
        description: "Comprehensive overview of all clients and their status",
        type: "client",
        icon: Users,
        lastGenerated: "2024-03-10",
        frequency: "monthly",
      },
      {
        id: "commission-summary",
        name: "Commission Summary",
        description: "Detailed breakdown of commission earnings",
        type: "commission",
        icon: DollarSign,
        lastGenerated: "2024-03-08",
        frequency: "monthly",
      },
      {
        id: "performance-metrics",
        name: "Performance Metrics",
        description: "Key performance indicators and growth metrics",
        type: "performance",
        icon: BarChart3,
        lastGenerated: "2024-03-05",
        frequency: "weekly",
      },
      {
        id: "financial-summary",
        name: "Financial Summary",
        description: "Revenue, expenses, and profit analysis",
        type: "financial",
        icon: TrendingUp,
        lastGenerated: "2024-03-01",
        frequency: "quarterly",
      },
      {
        id: "client-activity",
        name: "Client Activity Report",
        description: "Individual client project activity and engagement",
        type: "client",
        icon: Building2,
        frequency: "manual",
      },
      {
        id: "growth-analysis",
        name: "Growth Analysis",
        description: "Client acquisition and retention analysis",
        type: "performance",
        icon: TrendingUp,
        frequency: "quarterly",
      },
    ];

    const sampleReports: GeneratedReport[] = [
      {
        id: "1",
        name: "Client Overview Report - March 2024",
        type: "client",
        generatedDate: "2024-03-10",
        period: "March 2024",
        status: "ready",
        size: "2.3 MB",
        downloadUrl: "#",
      },
      {
        id: "2",
        name: "Commission Summary - February 2024",
        type: "commission",
        generatedDate: "2024-03-08",
        period: "February 2024",
        status: "ready",
        size: "1.8 MB",
        downloadUrl: "#",
      },
      {
        id: "3",
        name: "Performance Metrics - Week 10",
        type: "performance",
        generatedDate: "2024-03-05",
        period: "Week 10, 2024",
        status: "ready",
        size: "1.2 MB",
        downloadUrl: "#",
      },
      {
        id: "4",
        name: "Financial Summary - Q1 2024",
        type: "financial",
        generatedDate: "2024-03-01",
        period: "Q1 2024",
        status: "generating",
        size: "3.1 MB",
      },
    ];

    setReportTemplates(templates);
    setGeneratedReports(sampleReports);

    // Set default date range (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setDateRange({
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    });
  };

  const generateReport = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a report template");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select a date range");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const template = reportTemplates.find((t) => t.id === selectedTemplate);
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: `${template?.name} - ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`,
        type: template?.type || "client",
        generatedDate: new Date().toISOString().split("T")[0],
        period: `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`,
        status: "ready",
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloadUrl: "#",
      };

      setGeneratedReports((prev) => [newReport, ...prev]);
      toast.success("Report generated successfully!");

      // Reset form
      setSelectedTemplate("");
      setDateRange({ startDate: "", endDate: "" });
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (report: GeneratedReport) => {
    // In a real app, this would trigger the actual download
    toast.success(`Downloading ${report.name}...`);
    console.log("Downloading report:", report);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ready: { variant: "default" as const, label: "Ready", icon: CheckCircle },
      generating: {
        variant: "secondary" as const,
        label: "Generating",
        icon: RefreshCw,
      },
      scheduled: {
        variant: "outline" as const,
        label: "Scheduled",
        icon: Clock,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon
          className={`h-3 w-3 ${status === "generating" ? "animate-spin" : ""}`}
        />
        {config.label}
      </Badge>
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      client: "bg-blue-100 text-blue-800",
      financial: "bg-green-100 text-green-800",
      performance: "bg-purple-100 text-purple-800",
      commission: "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredReports =
    filterType === "all"
      ? generatedReports
      : generatedReports.filter((report) => report.type === filterType);

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              Generate and manage your agency reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Reports
            </Button>
          </div>
        </div>

        {/* Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>
              Create a custom report for your specified date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="template">Report Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>
              Pre-configured report templates for common use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <Badge
                        variant="outline"
                        className={getTypeColor(template.type)}
                      >
                        {template.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Frequency: {template.frequency}</span>
                      {template.lastGenerated && (
                        <span>
                          Last:{" "}
                          {new Date(
                            template.lastGenerated,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Generated Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>
                  Download and manage your previously generated reports
                </CardDescription>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getTypeColor(report.type)}
                        >
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>
                        {new Date(report.generatedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReport(report)}
                          disabled={report.status !== "ready"}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports found</p>
                <p className="text-sm">
                  Generate your first report using the form above
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Generated
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {generatedReports.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {generatedReports.filter((r) => r.status === "ready").length}{" "}
                ready to download
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Popular
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Client Overview</div>
              <p className="text-xs text-muted-foreground">
                Most generated report type
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {generatedReports
                  .reduce(
                    (sum, report) =>
                      sum + parseFloat(report.size.split(" ")[0]),
                    0,
                  )
                  .toFixed(1)}{" "}
                MB
              </div>
              <p className="text-xs text-muted-foreground">
                All generated reports
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgencyAdminLayout>
  );
}
