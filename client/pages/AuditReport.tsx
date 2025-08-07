import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Star,
  TrendingUp,
  Globe,
  Smartphone,
} from "lucide-react";

interface GeoGridScanData {
  id: string;
  businessName: string;
  gmbProfileUrl: string;
  scanDate: string;
  scanType: string;
  overallVisibility: number;
  status: "completed" | "in-progress" | "failed";
  scanResults: {
    gridCoverage: {
      totalGridPoints: number;
      scannedPoints: number;
      visibility: number;
      averageRank: number;
    };
    localPack: {
      appearances: number;
      totalSearches: number;
      averagePosition: number;
      visibility: number;
    };
    organicResults: {
      appearances: number;
      totalSearches: number;
      averagePosition: number;
      visibility: number;
    };
    geoDistribution: {
      strongAreas: string[];
      weakAreas: string[];
      noVisibility: string[];
    };
    keywordPerformance: {
      topKeywords: Array<{
        keyword: string;
        rank: number;
        visibility: number;
      }>;
      improvementOpportunities: string[];
    };
  };
}

// Mock data for demonstration
const mockGeoScanData: GeoGridScanData = {
  id: "3",
  businessName: "Local Restaurant & Grill",
  gmbProfileUrl: "https://business.google.com/n/12345678901234567890",
  scanDate: "2024-01-20T10:30:00Z",
  scanType: "5km Grid Scan - Downtown Area",
  overallVisibility: 73,
  status: "completed",
  scanResults: {
    gridCoverage: {
      totalGridPoints: 100,
      scannedPoints: 97,
      visibility: 73,
      averageRank: 2.8,
    },
    localPack: {
      appearances: 68,
      totalSearches: 100,
      averagePosition: 2.3,
      visibility: 68,
    },
    organicResults: {
      appearances: 45,
      totalSearches: 100,
      averagePosition: 4.7,
      visibility: 45,
    },
    geoDistribution: {
      strongAreas: ["Downtown Core", "Business District", "Main Street"],
      weakAreas: ["North Suburbs", "Industrial Zone"],
      noVisibility: ["Airport Area", "Highway Corridor"],
    },
    keywordPerformance: {
      topKeywords: [
        { keyword: "restaurant near me", rank: 1.8, visibility: 85 },
        { keyword: "best local food", rank: 2.4, visibility: 72 },
        { keyword: "downtown dining", rank: 3.1, visibility: 58 },
      ],
      improvementOpportunities: [
        "Target 'lunch specials' keyword in northern areas",
        "Improve visibility for 'family restaurant' searches",
        "Optimize for 'outdoor seating' queries",
      ],
    },
  },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreVariant = (score: number) => {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
};

export default function AuditReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auditData, setAuditData] = useState<AuditReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch audit data
    const fetchAuditData = async () => {
      setLoading(true);
      // In a real implementation, you would fetch data based on the ID
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAuditData(mockAuditData);
      setLoading(false);
    };

    fetchAuditData();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!auditData) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Report Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The audit report with ID "{id}" could not be found.
              </p>
              <Button onClick={() => navigate("/admin/audits")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Audits
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/audits")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Audit Report #{auditData.id}
              </h1>
              <p className="text-muted-foreground">
                Generated on {new Date(auditData.scanDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Business Info & Overall Score */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl">
                  {auditData.businessName}
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{auditData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {auditData.scanType} •{" "}
                    {new Date(auditData.scanDate).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getScoreColor(auditData.overallScore)}`}
                >
                  {auditData.overallScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
                <Badge
                  variant={getScoreVariant(auditData.overallScore)}
                  className="mt-2"
                >
                  {auditData.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Audit Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google My Business */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Google My Business
                </CardTitle>
                <Badge variant={getScoreVariant(auditData.results.gmb.score)}>
                  {auditData.results.gmb.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditData.results.gmb.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Issues Found
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {auditData.results.gmb.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Recommendations
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.gmb.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Citations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Citations
                </CardTitle>
                <Badge
                  variant={getScoreVariant(auditData.results.citations.score)}
                >
                  {auditData.results.citations.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {auditData.results.citations.found}
                  </div>
                  <div className="text-xs text-muted-foreground">Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {auditData.results.citations.total}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Possible
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  Issues Found
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.citations.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews
                </CardTitle>
                <Badge
                  variant={getScoreVariant(auditData.results.reviews.score)}
                >
                  {auditData.results.reviews.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                    {auditData.results.reviews.averageRating}
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average Rating
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {auditData.results.reviews.totalReviews}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Reviews
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  Action Required
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.reviews.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Website */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Website
                </CardTitle>
                <Badge
                  variant={getScoreVariant(auditData.results.website.score)}
                >
                  {auditData.results.website.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Issues Found
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.website.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Recommendations
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.website.recommendations.map(
                    (rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {rec}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media
                </CardTitle>
                <Badge
                  variant={getScoreVariant(auditData.results.social.score)}
                >
                  {auditData.results.social.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Active Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {auditData.results.social.platforms.map((platform, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  Areas for Improvement
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {auditData.results.social.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Audit Summary</CardTitle>
              <CardDescription>
                Key findings and next steps for improving local SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(auditData.results.gmb.score)}`}
                  >
                    {auditData.results.gmb.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">GMB</div>
                </div>
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(auditData.results.citations.score)}`}
                  >
                    {auditData.results.citations.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Citations</div>
                </div>
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(auditData.results.reviews.score)}`}
                  >
                    {auditData.results.reviews.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(auditData.results.website.score)}`}
                  >
                    {auditData.results.website.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Website</div>
                </div>
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(auditData.results.social.score)}`}
                  >
                    {auditData.results.social.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Social</div>
                </div>
              </div>
              <Separator />
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on improving Google My Business profile completeness and
                  website technical SEO issues. Consider implementing a review
                  management strategy to increase response rates and maintain
                  positive online reputation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
