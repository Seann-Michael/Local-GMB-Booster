import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import { GoogleMapComponent } from "@/components/GoogleMaps/GoogleMapComponent";
import { AddressAutocomplete } from "@/components/GoogleMaps/AddressAutocomplete";
import { 
  dataForSEOService, 
  type BusinessProfile, 
  type GeographicWaypoint, 
  type RankingResult 
} from "@/lib/dataForSEO";
import { 
  WaypointGenerator, 
  WAYPOINT_PATTERNS, 
  type WaypointGenerationOptions 
} from "@/lib/waypointGenerator";
import {
  MapPin,
  Target,
  Play,
  Pause,
  Square,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
  Grid3X3,
  Circle,
  Crosshair,
  Map,
  Zap,
  BarChart3,
  Info,
  Loader2,
  Building2,
  Phone,
  Globe,
  Edit,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface RankingSession {
  id: string;
  businessProfile: BusinessProfile;
  keyword: string;
  waypoints: GeographicWaypoint[];
  results: RankingResult[];
  status: "pending" | "running" | "completed" | "error" | "paused";
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTimeRemaining?: string;
}

export default function Maps() {
  // Core state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: "Joe's Pizza & More",
    address: "2275 Lejeune Cir, Fairfield, CA 94533",
    phone: "(707) 446-5643",
    website: "https://joespizza.com",
    keywords: ["pizza restaurant", "italian food"],
  });
  const [keyword, setKeyword] = useState("junk removal services near me");
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number }>({
    lat: 38.2493,
    lng: -122.0397
  });
  const [waypoints, setWaypoints] = useState<GeographicWaypoint[]>([]);
  const [rankingResults, setRankingResults] = useState<RankingResult[]>([]);
  
  // UI state
  const [showApiSetup, setShowApiSetup] = useState(!dataForSEOService.hasCredentials());
  const [currentSession, setCurrentSession] = useState<RankingSession | null>(null);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [resultsExpanded, setResultsExpanded] = useState(false);
  
  // Configuration state
  const [waypointOptions, setWaypointOptions] = useState<WaypointGenerationOptions>({
    centerLat: 38.2493,
    centerLng: -122.0397,
    radiusKm: 10,
    pattern: "circular",
    density: "medium",
  });
  
  // API credentials
  const [apiCredentials, setApiCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Auto-generate waypoints on load
    generateWaypoints();
  }, []);

  const handleAddressSelect = useCallback((address: string, placeId: string, location: { lat: number; lng: number }) => {
    setBusinessProfile(prev => ({
      ...prev,
      address,
      placeId,
    }));
    setCenterLocation(location);
    setWaypointOptions(prev => ({
      ...prev,
      centerLat: location.lat,
      centerLng: location.lng,
    }));
  }, []);

  const generateWaypoints = useCallback(() => {
    if (!centerLocation) {
      toast.error("Please select a business address first");
      return;
    }

    const pattern = WAYPOINT_PATTERNS.find(p => p.name.toLowerCase().includes(waypointOptions.pattern));
    if (!pattern) {
      toast.error("Invalid waypoint pattern selected");
      return;
    }

    const generatedWaypoints = pattern.generate(waypointOptions);
    const optimizedWaypoints = WaypointGenerator.optimizeWaypoints(generatedWaypoints, waypointOptions);
    
    setWaypoints(optimizedWaypoints);
    
    const estimatedTime = WaypointGenerator.estimateProcessingTime(optimizedWaypoints.length);
    toast.success(`Generated ${optimizedWaypoints.length} waypoints`);
  }, [centerLocation, waypointOptions]);

  const setupApiCredentials = useCallback(() => {
    if (!apiCredentials.username || !apiCredentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    dataForSEOService.setCredentials(apiCredentials.username, apiCredentials.password);
    toast.success("API credentials saved successfully");
    setShowApiSetup(false);
  }, [apiCredentials]);

  const startRankingAnalysis = useCallback(async () => {
    if (!businessProfile.name || !keyword || waypoints.length === 0) {
      toast.error("Please complete the setup before starting analysis");
      return;
    }

    if (!dataForSEOService.hasCredentials()) {
      toast.error("Please configure DataForSEO API credentials first");
      setShowApiSetup(true);
      return;
    }

    const session: RankingSession = {
      id: Date.now().toString(),
      businessProfile: { ...businessProfile },
      keyword,
      waypoints: [...waypoints],
      results: [],
      status: "running",
      progress: 0,
      startedAt: new Date(),
    };

    setCurrentSession(session);
    setResultsExpanded(true);

    try {
      toast.info("Starting ranking analysis...");
      
      const results = await dataForSEOService.batchCheckRankings(
        businessProfile,
        waypoints,
        keyword,
        {
          device: "desktop",
          language: "en",
          depth: 20,
        }
      );

      setRankingResults(results);
      setCurrentSession(prev => prev ? {
        ...prev,
        results,
        status: "completed",
        progress: 100,
        completedAt: new Date(),
      } : null);

      const successfulResults = results.filter(r => r.businessRank !== null);
      const averageRank = successfulResults.length > 0 
        ? successfulResults.reduce((sum, r) => sum + (r.businessRank || 0), 0) / successfulResults.length
        : 0;

      toast.success(`Analysis completed! Average rank: ${averageRank.toFixed(1)}`);
    } catch (error) {
      console.error("Ranking analysis error:", error);
      setCurrentSession(prev => prev ? { ...prev, status: "error" } : null);
      toast.error("Analysis failed. Please try again.");
    }
  }, [businessProfile, keyword, waypoints]);

  const getMapMarkers = useCallback(() => {
    const markers = [];

    // Add waypoint markers
    waypoints.forEach(waypoint => {
      const result = rankingResults.find(r => r.waypoint.id === waypoint.id);
      
      let color = "#6B7280"; // Default: not processed
      let rank = null;
      
      if (result) {
        if (result.error) {
          color = "#EF4444"; // Error
        } else if (result.businessRank === null) {
          color = "#F97316"; // Not ranking
        } else if (result.businessRank <= 3) {
          color = "#10B981"; // Top 3
        } else if (result.businessRank <= 10) {
          color = "#F59E0B"; // Top 10
        } else {
          color = "#EF4444"; // Lower ranking
        }
        rank = result.businessRank;
      }

      markers.push({
        id: waypoint.id,
        position: { lat: waypoint.lat, lng: waypoint.lng },
        title: waypoint.name || "Waypoint",
        content: `
          <div class="p-3 min-w-48">
            <h3 class="font-semibold">${waypoint.name || "Waypoint"}</h3>
            <p class="text-sm text-gray-600 mt-1">Keyword: ${keyword}</p>
            ${rank !== null ? `<p class="text-sm mt-2"><strong>Rank: #${rank}</strong></p>` : '<p class="text-sm text-gray-500 mt-2">Not ranking in top 20</p>'}
            ${result && result.competitors.length > 0 ? `<p class="text-xs mt-2 text-gray-600">Top competitor: ${result.competitors[0]?.name}</p>` : ''}
          </div>
        `,
        color,
        rank,
      });
    });

    // Add center location marker
    if (centerLocation) {
      markers.push({
        id: "center",
        position: centerLocation,
        title: businessProfile.name || "Business Location",
        content: `
          <div class="p-3">
            <h3 class="font-semibold">${businessProfile.name || "Business Location"}</h3>
            <p class="text-sm mt-1">${businessProfile.address}</p>
            <p class="text-xs text-blue-600 mt-2">Target Business</p>
          </div>
        `,
        color: "#DC2626",
        icon: "business",
      });
    }

    return markers;
  }, [waypoints, rankingResults, centerLocation, businessProfile, keyword]);

  const exportResults = useCallback(() => {
    if (rankingResults.length === 0) {
      toast.error("No results to export");
      return;
    }

    const csvData = rankingResults.map(result => ({
      waypoint_id: result.waypoint.id,
      waypoint_name: result.waypoint.name,
      latitude: result.waypoint.lat,
      longitude: result.waypoint.lng,
      business_rank: result.businessRank || "Not ranking",
      keyword: result.searchedKeyword,
      total_results: result.totalResults,
      top_competitor: result.competitors[0]?.name || "N/A",
      timestamp: result.timestamp.toISOString(),
      error: result.error || "",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranking-analysis-${businessProfile.name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Results exported successfully");
  }, [rankingResults, businessProfile.name]);

  const renderApiSetupDialog = () => (
    <Dialog open={showApiSetup} onOpenChange={setShowApiSetup}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DataForSEO API Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  DataForSEO API Required
                </p>
                <p className="text-sm text-blue-700">
                  To use the ranking analysis feature, you need DataForSEO API credentials.
                  Sign up at{" "}
                  <a 
                    href="https://dataforseo.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    dataforseo.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="apiUsername">API Username</Label>
            <Input
              id="apiUsername"
              value={apiCredentials.username}
              onChange={(e) => setApiCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Your DataForSEO username"
            />
          </div>

          <div>
            <Label htmlFor="apiPassword">API Password</Label>
            <Input
              id="apiPassword"
              type="password"
              value={apiCredentials.password}
              onChange={(e) => setApiCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Your DataForSEO password"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={setupApiCredentials}>
              Save Credentials
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppLayout>
      <div className="flex h-screen pt-16 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Target Business Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Target Business</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {businessProfile.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">285</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{businessProfile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{businessProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{businessProfile.website}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-green-50 border border-green-200 rounded p-2">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Open • Closes at 11PM
                </span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Settings</h2>
              </div>
              {settingsExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              )}
            </button>

            {settingsExpanded && (
              <div className="space-y-4">
                {/* Keywords */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Keywords (1)
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded">
                      <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                        Auto Generated
                      </Badge>
                      <span className="text-sm flex-1">{keyword}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        ×
                      </Button>
                    </div>
                    <Input
                      placeholder="Add keyword..."
                      value=""
                      onChange={() => {}}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Map Grid */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Map Grid
                  </Label>
                  <div className="space-y-3">
                    <Select
                      value={waypointOptions.pattern}
                      onValueChange={(value: "grid" | "circular" | "radial") => {
                        setWaypointOptions(prev => ({ ...prev, pattern: value }));
                        setTimeout(generateWaypoints, 100);
                      }}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circular">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            Circle
                          </div>
                        </SelectItem>
                        <SelectItem value="grid">
                          <div className="flex items-center gap-2">
                            <Grid3X3 className="h-4 w-4" />
                            Grid
                          </div>
                        </SelectItem>
                        <SelectItem value="radial">
                          <div className="flex items-center gap-2">
                            <Crosshair className="h-4 w-4" />
                            Radial
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Distance</Label>
                        <Select
                          value={waypointOptions.density}
                          onValueChange={(value: "low" | "medium" | "high") => {
                            setWaypointOptions(prev => ({ ...prev, density: value }));
                            setTimeout(generateWaypoints, 100);
                          }}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">1mi Pts</SelectItem>
                            <SelectItem value="medium">0.5mi Pts</SelectItem>
                            <SelectItem value="high">0.25mi Pts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Radius</Label>
                        <Select
                          value={waypointOptions.radiusKm.toString()}
                          onValueChange={(value) => {
                            setWaypointOptions(prev => ({ ...prev, radiusKm: parseInt(value) }));
                            setTimeout(generateWaypoints, 100);
                          }}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                            <SelectItem value="15">15 km</SelectItem>
                            <SelectItem value="20">20 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
                      Analyse over {waypoints.length} credits per keyword
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={startRankingAnalysis}
                disabled={!businessProfile.name || !keyword || waypoints.length === 0 || currentSession?.status === "running"}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {currentSession?.status === "running" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowApiSetup(true)}
                className="px-3"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {rankingResults.length > 0 && (
              <Button
                variant="outline"
                onClick={exportResults}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>

          {/* Results Section */}
          {currentSession && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => setResultsExpanded(!resultsExpanded)}
                className="flex items-center justify-between w-full p-4"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900">Results</h2>
                  {currentSession.status === "completed" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  )}
                </div>
                {resultsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </button>

              {resultsExpanded && currentSession.status === "completed" && rankingResults.length > 0 && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">
                        {rankingResults.filter(r => r.businessRank && r.businessRank <= 3).length}
                      </div>
                      <div className="text-xs text-green-600">Top 3</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-600">
                        {rankingResults.filter(r => r.businessRank && r.businessRank <= 10).length}
                      </div>
                      <div className="text-xs text-yellow-600">Top 10</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">
                        {rankingResults.filter(r => r.businessRank === null).length}
                      </div>
                      <div className="text-xs text-red-600">Not Ranking</div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {rankingResults.slice(0, 10).map((result, index) => (
                      <div
                        key={result.waypoint.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <span className="text-gray-600">{result.waypoint.name}</span>
                        {result.businessRank ? (
                          <Badge
                            variant={result.businessRank <= 3 ? "default" : 
                                    result.businessRank <= 10 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            #{result.businessRank}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            —
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <GoogleMapComponent
              center={centerLocation}
              zoom={12}
              markers={getMapMarkers()}
              height="100%"
              showControls={true}
              showDirectionsButton={false}
              className="h-full border-0 rounded-none"
            />
          </div>

          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              Satellite
            </Button>
          </div>

          {/* Status Overlay */}
          {currentSession?.status === "running" && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">Analyzing Rankings...</div>
                      <div className="text-sm text-gray-600">
                        Processing {waypoints.length} locations for "{keyword}"
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* API Setup Dialog */}
      {renderApiSetupDialog()}
    </AppLayout>
  );
}
