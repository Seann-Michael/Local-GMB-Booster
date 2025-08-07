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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { GoogleMapComponent } from "@/components/GoogleMaps/GoogleMapComponent";
import { AddressAutocomplete } from "@/components/GoogleMaps/AddressAutocomplete";
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
  TrendingDown,
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
  Award,
  Crown,
  Shield,
  Sparkles,
  Filter,
  Search,
  Calendar,
  Clock4,
  MapIcon,
  Layers,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_BUSINESS = {
  name: "Joe's Pizza & More",
  address: "2275 Lejeune Cir, Fairfield, CA 94533",
  phone: "(707) 446-5643",
  website: "https://joespizza.com",
  rating: 4.6,
  reviewCount: 342,
  hours: "Open • Closes at 11PM",
  verified: true,
  categories: ["Pizza Restaurant", "Italian Food", "Takeout"],
};

const MOCK_KEYWORDS = [
  { id: 1, keyword: "pizza restaurant near me", active: true, generated: true },
  { id: 2, keyword: "italian food fairfield", active: false, generated: false },
  { id: 3, keyword: "best pizza delivery", active: false, generated: true },
];

// Generate mock ranking data
const generateMockRankingData = () => {
  const center = { lat: 38.2493, lng: -122.0397 };
  const radius = 0.1; // roughly 10km in degrees
  const results = [];
  
  // Generate circular pattern of waypoints with ranking data
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI;
    const distance = 0.02 + (Math.random() * radius);
    const lat = center.lat + Math.cos(angle) * distance;
    const lng = center.lng + Math.sin(angle) * distance;
    
    // Generate realistic ranking data
    const distanceFromCenter = Math.sqrt(Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2));
    let rank = null;
    
    // Businesses closer to center tend to rank better
    const rankProbability = Math.max(0, 1 - (distanceFromCenter / radius) * 2);
    
    if (Math.random() < rankProbability) {
      if (distanceFromCenter < radius * 0.3) {
        rank = Math.floor(Math.random() * 3) + 1; // Top 3
      } else if (distanceFromCenter < radius * 0.6) {
        rank = Math.floor(Math.random() * 7) + 4; // 4-10
      } else {
        rank = Math.floor(Math.random() * 10) + 11; // 11-20
      }
    }
    
    results.push({
      id: `waypoint-${i}`,
      lat,
      lng,
      rank,
      address: `Location ${i + 1}`,
      competitors: [
        { name: "Tony's Pizza Palace", rank: 1, rating: 4.5, reviews: 89 },
        { name: "Mario's Italian Bistro", rank: 2, rating: 4.3, reviews: 156 },
        { name: "Fairfield Pizza Co", rank: 3, rating: 4.2, reviews: 203 },
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return results;
};

const MOCK_RANKING_DATA = generateMockRankingData();

export default function Maps() {
  const [business] = useState(MOCK_BUSINESS);
  const [activeKeyword, setActiveKeyword] = useState(MOCK_KEYWORDS[0]);
  const [keywords] = useState(MOCK_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"satellite" | "roadmap">("roadmap");
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [gridPattern, setGridPattern] = useState("circular");
  const [gridDensity, setGridDensity] = useState("medium");
  const [gridRadius, setGridRadius] = useState("10");
  
  // Analysis state
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [rankingData] = useState(MOCK_RANKING_DATA);
  
  // Calculated stats
  const totalLocations = rankingData.length;
  const rankingLocations = rankingData.filter(r => r.rank !== null).length;
  const top3Count = rankingData.filter(r => r.rank && r.rank <= 3).length;
  const top10Count = rankingData.filter(r => r.rank && r.rank <= 10).length;
  const averageRank = rankingLocations > 0 
    ? rankingData.filter(r => r.rank).reduce((sum, r) => sum + r.rank!, 0) / rankingLocations 
    : 0;

  const centerLocation = { lat: 38.2493, lng: -122.0397 };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisComplete(false);
    
    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast.success("Ranking analysis completed!");
  };

  const getMapMarkers = useCallback(() => {
    const markers = [];

    // Add ranking waypoint markers
    rankingData.forEach((point, index) => {
      let color = "#9CA3AF"; // Gray for not ranking
      let size = "small";
      
      if (point.rank) {
        if (point.rank <= 3) {
          color = "#10B981"; // Green for top 3
          size = "large";
        } else if (point.rank <= 10) {
          color = "#F59E0B"; // Yellow for top 10
          size = "medium";
        } else {
          color = "#EF4444"; // Red for lower ranking
          size = "small";
        }
      }

      markers.push({
        id: point.id,
        position: { lat: point.lat, lng: point.lng },
        title: point.rank ? `Rank #${point.rank}` : "Not Ranking",
        content: `
          <div class="p-3 min-w-56">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">${point.address}</h3>
              ${point.rank ? 
                `<span class="px-2 py-1 text-xs font-medium rounded-full ${
                  point.rank <= 3 ? 'bg-green-100 text-green-800' :
                  point.rank <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }">#${point.rank}</span>` : 
                '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Not Ranking</span>'
              }
            </div>
            <p class="text-sm text-gray-600 mb-3">Keyword: ${activeKeyword.keyword}</p>
            ${(point.competitors || []).length > 0 ? `
              <div class="border-t pt-2">
                <p class="text-xs font-medium text-gray-700 mb-1">Top Competitors:</p>
                ${(point.competitors || []).slice(0, 2).map(comp => `
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-gray-600">${comp.name}</span>
                    <span class="font-medium">#${comp.rank}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `,
        color,
        rank: point.rank,
        size,
      });
    });

    // Add business center marker
    markers.push({
      id: "business-center",
      position: centerLocation,
      title: business.name,
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-gray-900 mb-1">${business.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${business.address}</p>
          <div class="flex items-center gap-2 mb-2">
            <div class="flex text-yellow-400">
              ${[1,2,3,4,5].map(i => `<svg class="w-3 h-3 fill-current"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('')}
            </div>
            <span class="text-sm text-gray-600">${business.rating} (${business.reviewCount})</span>
          </div>
          <p class="text-xs text-blue-600 font-medium">🎯 Target Business</p>
        </div>
      `,
      color: "#DC2626",
      icon: "business",
      size: "large",
    });

    return markers;
  }, [rankingData, business, activeKeyword, centerLocation]);

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Enhanced Left Sidebar */}
          <div className="w-96 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 overflow-y-auto shadow-lg">
            {/* Target Business Section */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h2 class="font-bold text-slate-900">Target Business</h2>
                {business.verified && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Shield className="h-4 w-4 text-blue-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified Business</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate text-lg">
                        {business.name}
                      </h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Business Info</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{business.rating}</span>
                      <span className="text-xs text-slate-500">({business.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(business.categories || []).map((category, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{business.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{business.website}</span>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">{business.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-slate-600" />
                  <h2 className="font-bold text-slate-900">Keywords</h2>
                  <Badge variant="outline" className="text-xs">
                    {keywords.filter(k => k.active).length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {(keywords || []).map((kw) => (
                  <div
                    key={kw.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      activeKeyword.id === kw.id
                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setActiveKeyword(kw)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {kw.generated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                          Auto
                        </Badge>
                      )}
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {kw.keyword}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add new keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button size="sm" disabled={!newKeyword}>
                  Add
                </Button>
              </div>
            </div>

            {/* Grid Configuration */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Grid3X3 className="h-5 w-5 text-slate-600" />
                <h2 className="font-bold text-slate-900">Analysis Grid</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Pattern
                  </Label>
                  <Select value={gridPattern} onValueChange={setGridPattern}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circular">
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4" />
                          Circular Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4" />
                          Square Grid
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Density
                    </Label>
                    <Select value={gridDensity} onValueChange={setGridDensity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (12 pts)</SelectItem>
                        <SelectItem value="medium">Med (24 pts)</SelectItem>
                        <SelectItem value="high">High (48 pts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Radius
                    </Label>
                    <Select value={gridRadius} onValueChange={setGridRadius}>
                      <SelectTrigger>
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

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Analysis will use <strong>{totalLocations} credits</strong> per keyword
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5">
              <div className="space-y-3">
                <Button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing... {progress}%
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Dashboard */}
            {analysisComplete && (
              <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                    <h2 className="font-bold text-slate-900">Results</h2>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Card className="p-3 border-emerald-200 bg-emerald-50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{top3Count}</div>
                        <div className="text-xs text-emerald-600 flex items-center justify-center gap-1">
                          <Crown className="h-3 w-3" />
                          Top 3
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 border-amber-200 bg-amber-50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-700">{top10Count}</div>
                        <div className="text-xs text-amber-600 flex items-center justify-center gap-1">
                          <Award className="h-3 w-3" />
                          Top 10
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 border-slate-200 bg-slate-50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700">{averageRank.toFixed(1)}</div>
                        <div className="text-xs text-slate-600">Avg Rank</div>
                      </div>
                    </Card>
                    <Card className="p-3 border-blue-200 bg-blue-50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{((rankingLocations/totalLocations)*100).toFixed(0)}%</div>
                        <div className="text-xs text-blue-600">Coverage</div>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Location Results */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(rankingData || []).slice(0, 8).map((result, index) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-sm"
                      >
                        <span className="text-slate-600 flex-1 truncate">
                          {result.address}
                        </span>
                        {result.rank ? (
                          <Badge
                            variant={result.rank <= 3 ? "default" : 
                                    result.rank <= 10 ? "secondary" : "destructive"}
                            className="text-xs ml-2"
                          >
                            #{result.rank}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs ml-2">
                            —
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Map Area */}
          <div className="flex-1 relative bg-slate-100">
            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-10 space-y-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg p-2">
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "roadmap" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("roadmap")}
                        className="h-8"
                      >
                        <MapIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Road Map</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "satellite" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("satellite")}
                        className="h-8"
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Satellite</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showCompetitors ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setShowCompetitors(!showCompetitors)}
                      className="h-8"
                    >
                      {showCompetitors ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showCompetitors ? "Hide" : "Show"} Competitors</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Analysis Progress Overlay */}
            {isAnalyzing && (
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Analyzing Rankings</div>
                          <div className="text-sm text-slate-600">
                            Processing {totalLocations} locations for "{activeKeyword.keyword}"
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Performance Summary Overlay */}
            {analysisComplete && (
              <div className="absolute top-4 left-4 z-10">
                <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">{top3Count}</div>
                        <div className="text-xs text-slate-600">Top 3</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-600">{top10Count}</div>
                        <div className="text-xs text-slate-600">Top 10</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-700">{averageRank.toFixed(1)}</div>
                        <div className="text-xs text-slate-600">Avg</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Google Map */}
            <div className="h-full">
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
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
