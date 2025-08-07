import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { AppLayout } from "@/components/AppLayout";
import {
  History,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  MapPin,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ScanHistoryItem {
  id: string;
  scanName: string;
  business: string;
  keywords: string[];
  scanType: "one-time" | "recurring";
  status: "completed" | "running" | "failed";
  startTime: string;
  endTime?: string;
  duration?: string;
  locationsScanned: number;
  averageRank: number;
  topRankings: number;
  improvementChange: number;
  creditsUsed: number;
}

const mockHistory: ScanHistoryItem[] = [
  {
    id: "1",
    scanName: "Weekend Pizza Analysis",
    business: "Joe's Pizza & More",
    keywords: ["pizza restaurant", "italian food", "pizza delivery"],
    scanType: "one-time",
    status: "completed",
    startTime: "2024-01-18T14:30:00Z",
    endTime: "2024-01-18T14:45:00Z",
    duration: "15m 30s",
    locationsScanned: 24,
    averageRank: 3.2,
    topRankings: 8,
    improvementChange: 1.2,
    creditsUsed: 1440,
  },
  {
    id: "2",
    scanName: "Joe's Pizza Local Rankings",
    business: "Joe's Pizza & More",
    keywords: ["pizza restaurant", "italian food"],
    scanType: "recurring",
    status: "completed",
    startTime: "2024-01-15T09:00:00Z",
    endTime: "2024-01-15T09:12:00Z",
    duration: "12m 15s",
    locationsScanned: 24,
    averageRank: 4.1,
    topRankings: 6,
    improvementChange: -0.3,
    creditsUsed: 960,
  },
  {
    id: "3",
    scanName: "Competitor Analysis",
    business: "Joe's Pizza & More",
    keywords: ["pizza near me", "best pizza", "pizza delivery"],
    scanType: "one-time",
    status: "completed",
    startTime: "2024-01-12T16:20:00Z",
    endTime: "2024-01-12T16:38:00Z",
    duration: "18m 45s",
    locationsScanned: 32,
    averageRank: 5.8,
    topRankings: 4,
    improvementChange: 0.0,
    creditsUsed: 1920,
  },
  {
    id: "4",
    scanName: "Daily Monitoring",
    business: "Joe's Pizza & More",
    keywords: ["pizza restaurant"],
    scanType: "recurring",
    status: "failed",
    startTime: "2024-01-10T08:00:00Z",
    duration: "2m 15s",
    locationsScanned: 0,
    averageRank: 0,
    topRankings: 0,
    improvementChange: 0,
    creditsUsed: 0,
  },
  {
    id: "5",
    scanName: "Monthly Performance Review",
    business: "Joe's Pizza & More",
    keywords: ["pizza", "italian restaurant", "takeout", "delivery"],
    scanType: "recurring",
    status: "completed",
    startTime: "2024-01-01T10:00:00Z",
    endTime: "2024-01-01T10:25:00Z",
    duration: "25m 12s",
    locationsScanned: 48,
    averageRank: 2.9,
    topRankings: 15,
    improvementChange: 2.1,
    creditsUsed: 3840,
  },
];

export default function ScanHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ScanHistoryItem[]>(mockHistory);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.scanType === filterType;
    const matchesSearch =
      !searchQuery ||
      item.scanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
  };

  const viewScanDetails = (scanId: string) => {
    navigate("/admin/maps", { state: { scanId } });
  };

  const exportScanData = (scanId: string) => {
    const scan = history.find((s) => s.id === scanId);
    if (scan) {
      toast.success(`Exporting data for "${scan.scanName}"`);
      // In a real app, this would trigger a download
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate summary stats
  const totalScans = history.length;
  const completedScans = history.filter((h) => h.status === "completed").length;
  const totalCreditsUsed = history.reduce((sum, h) => sum + h.creditsUsed, 0);
  const averageRankAcrossAll =
    completedScans > 0
      ? history
          .filter((h) => h.status === "completed")
          .reduce((sum, h) => sum + h.averageRank, 0) / completedScans
      : 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <History className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
          </div>
          <p className="text-gray-600">
            View and analyze all your completed ranking scans and their results.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Scans
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalScans}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedScans}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rank</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {averageRankAcrossAll.toFixed(1)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Credits Used
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalCreditsUsed.toLocaleString()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Scans</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="one-time">One Time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date Range</Label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Scan History ({filteredHistory.length} results)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Avg Rank</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.scanName}</div>
                        <div className="text-sm text-gray-500">
                          {item.business}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.keywords.slice(0, 2).map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                          {item.keywords.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.keywords.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.scanType === "one-time" ? "default" : "secondary"
                        }
                      >
                        {item.scanType === "one-time"
                          ? "One Time"
                          : "Recurring"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="capitalize text-sm">
                          {item.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(item.startTime)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.duration || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {item.locationsScanned}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.status === "completed" ? (
                        <Badge
                          variant={
                            item.averageRank <= 3
                              ? "default"
                              : item.averageRank <= 10
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          #{item.averageRank.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(item.improvementChange)}
                        <span
                          className={`text-sm ${
                            item.improvementChange > 0
                              ? "text-green-600"
                              : item.improvementChange < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {item.improvementChange > 0 ? "+" : ""}
                          {item.improvementChange.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.creditsUsed.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewScanDetails(item.id)}
                          disabled={item.status !== "completed"}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportScanData(item.id)}
                          disabled={item.status !== "completed"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No scan history found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "Start running scans to see your history here."}
                </p>
                {!searchQuery &&
                  filterStatus === "all" &&
                  filterType === "all" && (
                    <Button
                      onClick={() => navigate("/admin/maps/one-time-scan")}
                    >
                      Run Your First Scan
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
