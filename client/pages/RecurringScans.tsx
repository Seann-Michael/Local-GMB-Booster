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
  Clock,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RecurringScan {
  id: string;
  name: string;
  business: string;
  keywords: string[];
  frequency: string;
  status: "active" | "paused" | "stopped";
  lastRun: string;
  nextRun: string;
  averageRank: number;
  trend: "up" | "down" | "stable";
  locations: number;
}

const mockScans: RecurringScan[] = [
  {
    id: "1",
    name: "Joe's Pizza Local Rankings",
    business: "Joe's Pizza & More",
    keywords: ["pizza restaurant", "italian food", "pizza delivery"],
    frequency: "weekly",
    status: "active",
    lastRun: "2024-01-15",
    nextRun: "2024-01-22",
    averageRank: 3.2,
    trend: "up",
    locations: 24,
  },
  {
    id: "2",
    name: "Competitor Monitoring",
    business: "Joe's Pizza & More",
    keywords: ["pizza near me", "best pizza"],
    frequency: "daily",
    status: "active",
    lastRun: "2024-01-18",
    nextRun: "2024-01-19",
    averageRank: 5.8,
    trend: "down",
    locations: 16,
  },
  {
    id: "3",
    name: "Weekend Performance",
    business: "Joe's Pizza & More",
    keywords: ["pizza takeout", "family restaurant"],
    frequency: "monthly",
    status: "paused",
    lastRun: "2024-01-01",
    nextRun: "2024-02-01",
    averageRank: 2.1,
    trend: "stable",
    locations: 32,
  },
];

export default function RecurringScans() {
  const [scans, setScans] = useState<RecurringScan[]>(mockScans);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleScanStatus = (id: string) => {
    setScans(scans.map(scan => {
      if (scan.id === id) {
        const newStatus = scan.status === "active" ? "paused" : "active";
        toast.success(`Scan ${newStatus === "active" ? "activated" : "paused"}`);
        return { ...scan, status: newStatus };
      }
      return scan;
    }));
  };

  const deleteScan = (id: string) => {
    setScans(scans.filter(scan => scan.id !== id));
    toast.success("Scan deleted successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case "stopped":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Recurring Scans</h1>
            </div>
            <p className="text-gray-600">
              Monitor your local rankings automatically with scheduled scans.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Scan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Scans</p>
                  <p className="text-2xl font-bold text-green-600">
                    {scans.filter(s => s.status === "active").length}
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
                  <p className="text-sm font-medium text-gray-600">Paused Scans</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {scans.filter(s => s.status === "paused").length}
                  </p>
                </div>
                <Pause className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rank</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(scans.reduce((sum, s) => sum + s.averageRank, 0) / scans.length).toFixed(1)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Locations</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {scans.reduce((sum, s) => sum + s.locations, 0)}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recurring Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan Name</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Avg Rank</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{scan.name}</div>
                        <div className="text-sm text-gray-500">{scan.business}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {scan.keywords.slice(0, 2).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {scan.keywords.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{scan.keywords.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {scan.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(scan.status)}
                        <span className="capitalize text-sm">{scan.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(scan.lastRun).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(scan.nextRun).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={scan.averageRank <= 3 ? "default" : 
                                scan.averageRank <= 10 ? "secondary" : "destructive"}
                      >
                        #{scan.averageRank.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getTrendIcon(scan.trend)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleScanStatus(scan.id)}
                        >
                          {scan.status === "active" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteScan(scan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create New Scan Form */}
        {showCreateForm && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Create New Recurring Scan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="scanName">Scan Name</Label>
                    <Input
                      id="scanName"
                      placeholder="e.g., Weekly Pizza Rankings"
                    />
                  </div>

                  <div>
                    <Label htmlFor="business">Business</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joes-pizza">Joe's Pizza & More</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      defaultValue="09:00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowCreateForm(false);
                  toast.success("Recurring scan created successfully");
                }}>
                  Create Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
