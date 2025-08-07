import { useState, useCallback, useEffect } from "react";
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
import { AppLayout } from "@/components/AppLayout";
// import { GoogleMapComponent } from "@/components/GoogleMaps/GoogleMapComponent";
import {
  MapPin,
  Target,
  Star,
  Phone,
  Globe,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Calendar,
  BarChart3,
  Eye,
  Download,
  GitCompare,
  X,
  Crown,
  Award,
  Shield,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data for the audit report
const mockAuditData = {
  id: "audit_001",
  businessName: "Smith Construction LLC",
  scanDate: "2024-12-14T10:30:00Z",
  location: "Springfield, IL",
  center: { lat: 39.7817, lng: -89.6501 },
  keywords: ["general contractor", "home builder", "construction company", "home renovation"],
  selectedKeyword: "general contractor",
  waypoints: [
    {
      id: "wp_001",
      position: { lat: 39.7917, lng: -89.6601 },
      rank: 1,
      businessProfile: {
        name: "Smith Construction LLC",
        rating: 4.8,
        reviews: 247,
        phone: "(217) 555-0123",
        website: "smithconstruction.com",
        address: "123 Main St, Springfield, IL",
        hours: "Mon-Fri 8AM-6PM",
        verified: true,
      },
      competitors: [
        { name: "Elite Builders", rank: 2, rating: 4.6, reviews: 189 },
        { name: "Springfield Construction", rank: 3, rating: 4.4, reviews: 156 },
        { name: "Premier Home Builders", rank: 4, rating: 4.5, reviews: 203 },
      ],
    },
    {
      id: "wp_002", 
      position: { lat: 39.7717, lng: -89.6401 },
      rank: 3,
      businessProfile: {
        name: "Smith Construction LLC",
        rating: 4.8,
        reviews: 247,
        phone: "(217) 555-0123",
        website: "smithconstruction.com", 
        address: "123 Main St, Springfield, IL",
        hours: "Mon-Fri 8AM-6PM",
        verified: true,
      },
      competitors: [
        { name: "Elite Builders", rank: 1, rating: 4.6, reviews: 189 },
        { name: "Premier Home Builders", rank: 2, rating: 4.5, reviews: 203 },
        { name: "Springfield Construction", rank: 4, rating: 4.4, reviews: 156 },
        { name: "Quality Construction Co", rank: 5, rating: 4.3, reviews: 134 },
      ],
    },
    {
      id: "wp_003",
      position: { lat: 39.7617, lng: -89.6701 },
      rank: 2,
      businessProfile: {
        name: "Smith Construction LLC",
        rating: 4.8,
        reviews: 247,
        phone: "(217) 555-0123",
        website: "smithconstruction.com",
        address: "123 Main St, Springfield, IL", 
        hours: "Mon-Fri 8AM-6PM",
        verified: true,
      },
      competitors: [
        { name: "Elite Builders", rank: 1, rating: 4.6, reviews: 189 },
        { name: "Springfield Construction", rank: 3, rating: 4.4, reviews: 156 },
        { name: "Premier Home Builders", rank: 4, rating: 4.5, reviews: 203 },
      ],
    },
    {
      id: "wp_004",
      position: { lat: 39.7817, lng: -89.6301 },
      rank: 5,
      businessProfile: {
        name: "Smith Construction LLC",
        rating: 4.8,
        reviews: 247,
        phone: "(217) 555-0123",
        website: "smithconstruction.com",
        address: "123 Main St, Springfield, IL",
        hours: "Mon-Fri 8AM-6PM",
        verified: true,
      },
      competitors: [
        { name: "Elite Builders", rank: 1, rating: 4.6, reviews: 189 },
        { name: "Premier Home Builders", rank: 2, rating: 4.5, reviews: 203 },
        { name: "Springfield Construction", rank: 3, rating: 4.4, reviews: 156 },
        { name: "Quality Construction Co", rank: 4, rating: 4.3, reviews: 134 },
        { name: "Reliable Builders Inc", rank: 6, rating: 4.2, reviews: 98 },
      ],
    },
    {
      id: "wp_005",
      position: { lat: 39.7517, lng: -89.6601 },
      rank: 7,
      businessProfile: {
        name: "Smith Construction LLC",
        rating: 4.8,
        reviews: 247,
        phone: "(217) 555-0123",
        website: "smithconstruction.com",
        address: "123 Main St, Springfield, IL",
        hours: "Mon-Fri 8AM-6PM",
        verified: true,
      },
      competitors: [
        { name: "Elite Builders", rank: 1, rating: 4.6, reviews: 189 },
        { name: "Premier Home Builders", rank: 2, rating: 4.5, reviews: 203 },
        { name: "Springfield Construction", rank: 3, rating: 4.4, reviews: 156 },
        { name: "Quality Construction Co", rank: 4, rating: 4.3, reviews: 134 },
        { name: "Reliable Builders Inc", rank: 5, rating: 4.2, reviews: 98 },
        { name: "Metro Construction", rank: 6, rating: 4.1, reviews: 87 },
        { name: "City Wide Builders", rank: 8, rating: 4.0, reviews: 76 },
      ],
    },
  ],
  previousScans: [
    { id: "scan_001", date: "2024-12-07", averageRank: 3.2 },
    { id: "scan_002", date: "2024-11-30", averageRank: 3.8 },
    { id: "scan_003", date: "2024-11-23", averageRank: 4.1 },
  ],
};

export default function AuditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState(mockAuditData.selectedKeyword);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonScan, setComparisonScan] = useState<string>("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const selectedWaypointData = selectedWaypoint 
    ? mockAuditData.waypoints.find(wp => wp.id === selectedWaypoint)
    : null;

  const averageRank = mockAuditData.waypoints.reduce((sum, wp) => sum + wp.rank, 0) / mockAuditData.waypoints.length;

  const handleWaypointClick = useCallback((waypointId: string) => {
    setSelectedWaypoint(waypointId);
  }, []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const getRankColor = (rank: number) => {
    if (rank <= 3) return "text-green-600 bg-green-100";
    if (rank <= 10) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank <= 3) return <Award className="h-4 w-4" />;
    if (rank <= 10) return <Shield className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/admin/audits/scan-history")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Scan History
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockAuditData.businessName}</h1>
                <p className="text-sm text-gray-600">
                  Audit Report • {new Date(mockAuditData.scanDate).toLocaleDateString()} • {mockAuditData.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowComparison(!showComparison)}
              >
                <GitCompare className="h-4 w-4" />
                Compare Scans
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-140px)]">
          {/* Left Panel - Controls */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Keyword Selector */}
            <div className="p-6 border-b border-gray-200">
              <Label htmlFor="keyword-select" className="text-sm font-medium text-gray-700 mb-3 block">
                Select Keyword
              </Label>
              <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockAuditData.keywords.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comparison Panel */}
            {showComparison && (
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Compare with Previous Scan
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowComparison(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={comparisonScan} onValueChange={setComparisonScan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAuditData.previousScans.map((scan) => (
                      <SelectItem key={scan.id} value={scan.id}>
                        {new Date(scan.date).toLocaleDateString()} (Avg Rank: {scan.averageRank})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Summary Stats */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Waypoints</span>
                  <Badge variant="outline">{mockAuditData.waypoints.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rank</span>
                  <Badge className={getRankColor(averageRank)}>
                    #{averageRank.toFixed(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top 3 Positions</span>
                  <Badge variant="secondary">
                    {mockAuditData.waypoints.filter(wp => wp.rank <= 3).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top 10 Positions</span>
                  <Badge variant="secondary">
                    {mockAuditData.waypoints.filter(wp => wp.rank <= 10).length}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Waypoint List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waypoints</h3>
              <div className="space-y-3">
                {mockAuditData.waypoints.map((waypoint, index) => (
                  <Card 
                    key={waypoint.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedWaypoint === waypoint.id && "ring-2 ring-blue-500 bg-blue-50"
                    )}
                    onClick={() => handleWaypointClick(waypoint.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Waypoint {index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {waypoint.position.lat.toFixed(4)}, {waypoint.position.lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRankIcon(waypoint.rank)}
                          <Badge className={getRankColor(waypoint.rank)}>
                            #{waypoint.rank}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Google Maps */}
          <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Google Maps</h3>
              <p className="text-gray-500 max-w-md">
                Interactive Google Maps with custom ranking markers will appear here.
                Waypoint markers will show ranking numbers and be color-coded by performance.
              </p>
            </div>
          </div>

          {/* Right Panel - Waypoint Details (slides in when waypoint selected) */}
          {selectedWaypointData && (
            <div className="w-96 bg-white border-l border-gray-200 shadow-lg animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Ranking Details</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedWaypoint(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Business Profile */}
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{selectedWaypointData.businessProfile.name}</CardTitle>
                      {selectedWaypointData.businessProfile.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">
                        {selectedWaypointData.businessProfile.rating} ({selectedWaypointData.businessProfile.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedWaypointData.businessProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedWaypointData.businessProfile.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedWaypointData.businessProfile.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedWaypointData.businessProfile.hours}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Rank */}
                <div className="text-center py-4 mb-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getRankIcon(selectedWaypointData.rank)}
                    <span className="text-2xl font-bold text-gray-900">#{selectedWaypointData.rank}</span>
                  </div>
                  <p className="text-sm text-gray-600">Current Ranking for "{selectedKeyword}"</p>
                </div>

                {/* Competitors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Competitors</h3>
                  <div className="space-y-3">
                    {selectedWaypointData.competitors.map((competitor) => (
                      <Card key={competitor.name} className="border-l-4 border-l-gray-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{competitor.name}</span>
                            <div className="flex items-center gap-2">
                              {getRankIcon(competitor.rank)}
                              <Badge 
                                className={getRankColor(competitor.rank)}
                                variant="outline"
                              >
                                #{competitor.rank}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{competitor.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{competitor.reviews} reviews</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
