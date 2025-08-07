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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/AppLayout";
import { GoogleMapComponent } from "@/components/GoogleMaps/GoogleMapComponent";
import { AddressAutocomplete } from "@/components/GoogleMaps/AddressAutocomplete";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
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
    name: "",
    address: "",
    phone: "",
    website: "",
    keywords: [],
  });
  const [keyword, setKeyword] = useState("");
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [waypoints, setWaypoints] = useState<GeographicWaypoint[]>([]);
  const [rankingResults, setRankingResults] = useState<RankingResult[]>([]);
  
  // UI state
  const [showSetup, setShowSetup] = useState(true);
  const [showApiSetup, setShowApiSetup] = useState(!dataForSEOService.hasCredentials());
  const [currentSession, setCurrentSession] = useState<RankingSession | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<GeographicWaypoint | null>(null);
  
  // Configuration state
  const [waypointOptions, setWaypointOptions] = useState<WaypointGenerationOptions>({
    centerLat: 40.7128,
    centerLng: -74.0060,
    radiusKm: 10,
    pattern: "grid",
    density: "medium",
  });
  
  // API credentials
  const [apiCredentials, setApiCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Load saved business profile
    const savedProfile = localStorage.getItem("ranking_business_profile");
    if (savedProfile) {
      try {
        setBusinessProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error loading saved business profile:", error);
      }
    }
  }, []);

  const saveBusinessProfile = useCallback(() => {
    localStorage.setItem("ranking_business_profile", JSON.stringify(businessProfile));
  }, [businessProfile]);

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
    toast.success(`Generated ${optimizedWaypoints.length} waypoints. Estimated processing time: ${estimatedTime.total}`);
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

  const testApiConnection = useCallback(async () => {
    try {
      const isConnected = await dataForSEOService.testConnection();
      if (isConnected) {
        toast.success("API connection successful!");
      } else {
        toast.error("API connection failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Failed to test API connection");
    }
  }, []);

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
    setShowSetup(false);
    saveBusinessProfile();

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

      toast.success(`Analysis completed! Average rank: ${averageRank.toFixed(1)} (${successfulResults.length}/${results.length} locations)`);
    } catch (error) {
      console.error("Ranking analysis error:", error);
      setCurrentSession(prev => prev ? { ...prev, status: "error" } : null);
      toast.error("Analysis failed. Please try again.");
    }
  }, [businessProfile, keyword, waypoints, saveBusinessProfile]);

  const resetAnalysis = useCallback(() => {
    setCurrentSession(null);
    setRankingResults([]);
    setShowSetup(true);
  }, []);

  const getMapMarkers = useCallback(() => {
    const markers = [];

    // Add waypoint markers
    waypoints.forEach(waypoint => {
      const result = rankingResults.find(r => r.waypoint.id === waypoint.id);
      
      let color = "#gray-500"; // Default: not processed
      let rank = null;
      
      if (result) {
        if (result.error) {
          color = "#red-500"; // Error
        } else if (result.businessRank === null) {
          color = "#orange-500"; // Not ranking
        } else if (result.businessRank <= 3) {
          color = "#green-500"; // Top 3
        } else if (result.businessRank <= 10) {
          color = "#yellow-500"; // Top 10
        } else {
          color = "#red-400"; // Lower ranking
        }
        rank = result.businessRank;
      }

      markers.push({
        id: waypoint.id,
        position: { lat: waypoint.lat, lng: waypoint.lng },
        title: waypoint.name || "Waypoint",
        content: `
          <div class="p-2 min-w-48">
            <h3 class="font-semibold">${waypoint.name || "Waypoint"}</h3>
            <p class="text-sm text-gray-600">Keyword: ${keyword}</p>
            ${rank !== null ? `<p class="text-sm"><strong>Rank: #${rank}</strong></p>` : '<p class="text-sm text-gray-500">Not ranking in top 20</p>'}
            ${result && result.competitors.length > 0 ? `<p class="text-xs mt-1">Top competitor: ${result.competitors[0]?.name}</p>` : ''}
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
          <div class="p-2">
            <h3 class="font-semibold">${businessProfile.name || "Business Location"}</h3>
            <p class="text-sm">${businessProfile.address}</p>
            <p class="text-xs text-blue-600">Primary Business Location</p>
          </div>
        `,
        color: "#blue-600",
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

  const renderSetupDialog = () => (
    <Dialog open={showSetup} onOpenChange={setShowSetup}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Local Ranking Analysis Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Business Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessProfile.name}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <Label htmlFor="businessPhone">Phone Number</Label>
                  <Input
                    id="businessPhone"
                    value={businessProfile.phone || ""}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address *</Label>
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter your business address"
                  initialValue={businessProfile.address}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={businessProfile.website || ""}
                  onChange={(e) => setBusinessProfile(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Search Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyword">Target Keyword *</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., pizza restaurant, dentist, plumber"
                />
              </div>
            </CardContent>
          </Card>

          {/* Waypoint Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Pattern</Label>
                  <Select
                    value={waypointOptions.pattern}
                    onValueChange={(value: "grid" | "circular" | "radial") => 
                      setWaypointOptions(prev => ({ ...prev, pattern: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4" />
                          Grid Pattern
                        </div>
                      </SelectItem>
                      <SelectItem value="circular">
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4" />
                          Circular Pattern
                        </div>
                      </SelectItem>
                      <SelectItem value="radial">
                        <div className="flex items-center gap-2">
                          <Crosshair className="h-4 w-4" />
                          Radial Pattern
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Density</Label>
                  <Select
                    value={waypointOptions.density}
                    onValueChange={(value: "low" | "medium" | "high" | "ultra") => 
                      setWaypointOptions(prev => ({ ...prev, density: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (9 points)</SelectItem>
                      <SelectItem value="medium">Medium (25 points)</SelectItem>
                      <SelectItem value="high">High (49 points)</SelectItem>
                      <SelectItem value="ultra">Ultra (100 points)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Radius (km)</Label>
                  <Input
                    type="number"
                    value={waypointOptions.radiusKm}
                    onChange={(e) => setWaypointOptions(prev => ({ 
                      ...prev, 
                      radiusKm: parseFloat(e.target.value) || 10 
                    }))}
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateWaypoints} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Waypoints
                </Button>
                {waypoints.length > 0 && (
                  <Badge variant="secondary">
                    {waypoints.length} waypoints generated
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowApiSetup(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              API Settings
            </Button>

            <Button
              onClick={startRankingAnalysis}
              disabled={!businessProfile.name || !keyword || waypoints.length === 0}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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
            <Button onClick={testApiConnection} variant="outline" size="sm">
              Test Connection
            </Button>
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
      <div className="w-full px-3 sm:px-4 py-6 max-w-full overflow-x-hidden min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Map className="h-6 w-6" />
              Local Ranking Maps
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Analyze your Google Maps rankings across multiple locations
            </p>
          </div>

          <div className="flex gap-2">
            {currentSession && (
              <>
                <Button
                  onClick={exportResults}
                  variant="outline"
                  size="sm"
                  disabled={rankingResults.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={resetAnalysis} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </>
            )}
            <Button onClick={() => setShowSetup(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </Button>
          </div>
        </div>

        {/* Status Card */}
        {currentSession && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentSession.status === "running" && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                  {currentSession.status === "completed" && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {currentSession.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  
                  <div>
                    <div className="font-medium">
                      {currentSession.businessProfile.name} - "{currentSession.keyword}"
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentSession.waypoints.length} locations • Status: {currentSession.status}
                    </div>
                  </div>
                </div>

                {currentSession.status === "completed" && rankingResults.length > 0 && (
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-green-600">
                        {rankingResults.filter(r => r.businessRank && r.businessRank <= 3).length}
                      </div>
                      <div className="text-muted-foreground">Top 3</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-yellow-600">
                        {rankingResults.filter(r => r.businessRank && r.businessRank <= 10).length}
                      </div>
                      <div className="text-muted-foreground">Top 10</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">
                        {rankingResults.filter(r => r.businessRank === null).length}
                      </div>
                      <div className="text-muted-foreground">Not Ranking</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        <Card>
          <CardContent className="p-0">
            <div style={{ height: "600px" }}>
              <GoogleMapComponent
                center={centerLocation || { lat: 40.7128, lng: -74.0060 }}
                zoom={11}
                markers={getMapMarkers()}
                onMarkerClick={(marker) => {
                  const waypoint = waypoints.find(w => w.id === marker.id);
                  setSelectedWaypoint(waypoint || null);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        {rankingResults.length > 0 && (
          <div className="mt-6">
            <CompetitorAnalysis
              results={rankingResults}
              businessName={businessProfile.name}
              keyword={keyword}
              onWaypointSelect={(waypoint) => {
                setSelectedWaypoint(waypoint);
                // Center map on selected waypoint
                setCenterLocation({ lat: waypoint.lat, lng: waypoint.lng });
              }}
            />
          </div>
        )}
      </div>

      {/* Setup Dialog */}
      {renderSetupDialog()}

      {/* API Setup Dialog */}
      {renderApiSetupDialog()}
    </AppLayout>
  );
}
