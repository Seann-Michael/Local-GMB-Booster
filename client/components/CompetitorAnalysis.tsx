import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  MapPin,
  Phone,
  Globe,
  Users,
  Target,
  Award,
  Eye,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { RankingResult, GeographicWaypoint } from "@/lib/dataForSEO";

interface CompetitorAnalysisProps {
  results: RankingResult[];
  businessName: string;
  keyword: string;
  onWaypointSelect?: (waypoint: GeographicWaypoint) => void;
}

interface CompetitorSummary {
  name: string;
  averageRank: number;
  appearanceCount: number;
  totalLocations: number;
  dominancePercentage: number;
  bestRank: number;
  worstRank: number;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  placeId?: string;
}

interface LocationPerformance {
  waypoint: GeographicWaypoint;
  businessRank: number | null;
  topCompetitors: Array<{
    rank: number;
    name: string;
    rating?: number;
    reviewsCount?: number;
  }>;
  totalCompetitors: number;
  dominatingCompetitor?: string;
}

export function CompetitorAnalysis({
  results,
  businessName,
  keyword,
  onWaypointSelect,
}: CompetitorAnalysisProps) {
  const [selectedView, setSelectedView] = useState<
    "overview" | "locations" | "competitors"
  >("overview");
  const [selectedCompetitor, setSelectedCompetitor] =
    useState<CompetitorSummary | null>(null);
  const [filterBy, setFilterBy] = useState<"all" | "ranking" | "not-ranking">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"rank" | "dominance" | "appearances">(
    "dominance",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate competitor summaries
  const competitorSummaries = useMemo(() => {
    const competitorMap = new Map<
      string,
      {
        ranks: number[];
        appearances: number;
        details: any;
      }
    >();

    results.forEach((result) => {
      result.competitors.forEach((competitor) => {
        const key = competitor.name.toLowerCase().trim();
        if (!competitorMap.has(key)) {
          competitorMap.set(key, {
            ranks: [],
            appearances: 0,
            details: competitor,
          });
        }

        const competitorData = competitorMap.get(key)!;
        competitorData.ranks.push(competitor.rank);
        competitorData.appearances++;
      });
    });

    const summaries: CompetitorSummary[] = [];

    competitorMap.forEach((data, name) => {
      const averageRank =
        data.ranks.reduce((sum, rank) => sum + rank, 0) / data.ranks.length;
      const dominancePercentage = (data.appearances / results.length) * 100;

      summaries.push({
        name: data.details.name,
        averageRank,
        appearanceCount: data.appearances,
        totalLocations: results.length,
        dominancePercentage,
        bestRank: Math.min(...data.ranks),
        worstRank: Math.max(...data.ranks),
        phoneNumber: data.details.phone,
        website: data.details.website,
        rating: data.details.rating,
        reviewsCount: data.details.reviewsCount,
        placeId: data.details.placeId,
      });
    });

    return summaries.sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return a.averageRank - b.averageRank;
        case "dominance":
          return b.dominancePercentage - a.dominancePercentage;
        case "appearances":
          return b.appearanceCount - a.appearanceCount;
        default:
          return b.dominancePercentage - a.dominancePercentage;
      }
    });
  }, [results, sortBy]);

  // Calculate location performance
  const locationPerformance = useMemo(() => {
    return results.map((result) => {
      const topCompetitors = result.competitors.slice(0, 3).map((comp) => ({
        rank: comp.rank,
        name: comp.name,
        rating: comp.rating,
        reviewsCount: comp.reviewsCount,
      }));

      return {
        waypoint: result.waypoint,
        businessRank: result.businessRank,
        topCompetitors,
        totalCompetitors: result.competitors.length,
        dominatingCompetitor: result.competitors[0]?.name,
      } as LocationPerformance;
    });
  }, [results]);

  // Filter results based on current filters
  const filteredLocationPerformance = useMemo(() => {
    let filtered = locationPerformance;

    // Filter by ranking status
    switch (filterBy) {
      case "ranking":
        filtered = filtered.filter((loc) => loc.businessRank !== null);
        break;
      case "not-ranking":
        filtered = filtered.filter((loc) => loc.businessRank === null);
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (loc) =>
          loc.waypoint.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          loc.dominatingCompetitor
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [locationPerformance, filterBy, searchQuery]);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const totalLocations = results.length;
    const rankingLocations = results.filter(
      (r) => r.businessRank !== null,
    ).length;
    const notRankingLocations = totalLocations - rankingLocations;
    const top3Rankings = results.filter(
      (r) => r.businessRank && r.businessRank <= 3,
    ).length;
    const top10Rankings = results.filter(
      (r) => r.businessRank && r.businessRank <= 10,
    ).length;

    const allRanks = results
      .filter((r) => r.businessRank !== null)
      .map((r) => r.businessRank!);
    const averageRank =
      allRanks.length > 0
        ? allRanks.reduce((sum, rank) => sum + rank, 0) / allRanks.length
        : 0;

    return {
      totalLocations,
      rankingLocations,
      notRankingLocations,
      top3Rankings,
      top10Rankings,
      averageRank,
      rankingPercentage: (rankingLocations / totalLocations) * 100,
      top3Percentage: (top3Rankings / totalLocations) * 100,
      top10Percentage: (top10Rankings / totalLocations) * 100,
    };
  }, [results]);

  const exportCompetitorData = () => {
    const csvData = competitorSummaries.map((comp) => ({
      competitor_name: comp.name,
      average_rank: comp.averageRank.toFixed(2),
      appearances: comp.appearanceCount,
      dominance_percentage: comp.dominancePercentage.toFixed(2),
      best_rank: comp.bestRank,
      worst_rank: comp.worstRank,
      rating: comp.rating || "",
      reviews_count: comp.reviewsCount || "",
      phone: comp.phoneNumber || "",
      website: comp.website || "",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `competitor-analysis-${keyword}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Competitor Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Analysis for "{keyword}" - {businessName}
          </p>
        </div>
        <Button onClick={exportCompetitorData} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={selectedView}
        onValueChange={(value: any) => setSelectedView(value)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {overviewStats.rankingPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ranking Locations
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {overviewStats.top3Percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Top 3 Rankings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {overviewStats.averageRank.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Rank
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {competitorSummaries.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unique Competitors
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Competitors Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Competitors by Market Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitorSummaries.slice(0, 10).map((competitor, index) => (
                  <div
                    key={competitor.name}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 text-sm font-medium text-center">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {competitor.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Avg: #{competitor.averageRank.toFixed(1)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {competitor.dominancePercentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${competitor.dominancePercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Locations</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by location or competitor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>Filter By</Label>
                  <Select
                    value={filterBy}
                    onValueChange={(value: any) => setFilterBy(value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="ranking">Ranking Only</SelectItem>
                      <SelectItem value="not-ranking">Not Ranking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Locations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Your Rank</TableHead>
                    <TableHead>Top Competitor</TableHead>
                    <TableHead>Competition Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocationPerformance.map((location) => (
                    <TableRow key={location.waypoint.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {location.waypoint.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {location.waypoint.lat.toFixed(4)},{" "}
                            {location.waypoint.lng.toFixed(4)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {location.businessRank ? (
                          <Badge
                            variant={
                              location.businessRank <= 3
                                ? "default"
                                : location.businessRank <= 10
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            #{location.businessRank}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not ranking</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {location.dominatingCompetitor ? (
                          <div>
                            <div className="font-medium text-sm">
                              {location.dominatingCompetitor}
                            </div>
                            {location.topCompetitors[0]?.rating && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {location.topCompetitors[0].rating.toFixed(1)}
                                {location.topCompetitors[0]?.reviewsCount && (
                                  <span>
                                    ({location.topCompetitors[0].reviewsCount})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {location.totalCompetitors} competitors
                          </span>
                          <Badge
                            variant={
                              location.totalCompetitors > 15
                                ? "destructive"
                                : location.totalCompetitors > 10
                                  ? "secondary"
                                  : "default"
                            }
                            className="text-xs"
                          >
                            {location.totalCompetitors > 15
                              ? "High"
                              : location.totalCompetitors > 10
                                ? "Medium"
                                : "Low"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onWaypointSelect?.(location.waypoint)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-4">
          {/* Sort Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Label>Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dominance">Market Dominance</SelectItem>
                    <SelectItem value="rank">Average Rank</SelectItem>
                    <SelectItem value="appearances">Appearances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Competitors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitor Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Avg Rank</TableHead>
                    <TableHead>Best/Worst</TableHead>
                    <TableHead>Appearances</TableHead>
                    <TableHead>Market Share</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorSummaries.map((competitor) => (
                    <TableRow
                      key={competitor.name}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedCompetitor(competitor)}
                    >
                      <TableCell>
                        <div className="font-medium">{competitor.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          #{competitor.averageRank.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="text-green-600">
                            #{competitor.bestRank}
                          </span>
                          {" / "}
                          <span className="text-red-600">
                            #{competitor.worstRank}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {competitor.appearanceCount} /{" "}
                          {competitor.totalLocations}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${competitor.dominancePercentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {competitor.dominancePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {competitor.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                              {competitor.rating.toFixed(1)}
                            </span>
                            {competitor.reviewsCount && (
                              <span className="text-xs text-muted-foreground">
                                ({competitor.reviewsCount})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No rating
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {competitor.phoneNumber && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                          )}
                          {competitor.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Globe className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Competitor Detail Modal */}
      {selectedCompetitor && (
        <Dialog
          open={!!selectedCompetitor}
          onOpenChange={() => setSelectedCompetitor(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCompetitor.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Average Rank</Label>
                  <div className="text-2xl font-bold">
                    #{selectedCompetitor.averageRank.toFixed(1)}
                  </div>
                </div>
                <div>
                  <Label>Market Dominance</Label>
                  <div className="text-2xl font-bold">
                    {selectedCompetitor.dominancePercentage.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <Label>Best Rank</Label>
                  <div className="text-lg font-semibold text-green-600">
                    #{selectedCompetitor.bestRank}
                  </div>
                </div>
                <div>
                  <Label>Worst Rank</Label>
                  <div className="text-lg font-semibold text-red-600">
                    #{selectedCompetitor.worstRank}
                  </div>
                </div>
              </div>

              {(selectedCompetitor.rating ||
                selectedCompetitor.phoneNumber ||
                selectedCompetitor.website) && (
                <div className="border-t pt-4">
                  <Label>Business Information</Label>
                  <div className="space-y-2 mt-2">
                    {selectedCompetitor.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {selectedCompetitor.rating.toFixed(1)} stars
                        </span>
                        {selectedCompetitor.reviewsCount && (
                          <span className="text-muted-foreground">
                            ({selectedCompetitor.reviewsCount} reviews)
                          </span>
                        )}
                      </div>
                    )}
                    {selectedCompetitor.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedCompetitor.phoneNumber}</span>
                      </div>
                    )}
                    {selectedCompetitor.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a
                          href={selectedCompetitor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedCompetitor.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
