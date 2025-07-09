import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, CheckCircle, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ReviewRequest {
  id: string;
  businessName: string;
  businessLogo?: string;
  businessAddress: string;
  customerName: string;
  projectName: string;
  projectDescription: string;
  threshold: number;
  googleReviewUrl: string;
  seoKeywords: string[];
  businessCity: string;
  businessState: string;
  serviceCategory: string;
  businessOwnerVideo?: string; // Optional video URL
}

export default function ReviewGate() {
  const { id } = useParams<{ id: string }>();
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [seoReviewText, setSeoReviewText] = useState("");
  const [showSeoVersion, setShowSeoVersion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [redirectToGoogle, setRedirectToGoogle] = useState(false);

  useEffect(() => {
    // Load review request data (normally from API)
    const loadReviewRequest = () => {
      // Simulate loading from API based on ID
      const mockRequest: ReviewRequest = {
        id: id || "demo",
        businessName: "Smith Construction LLC",
        businessLogo: undefined, // Only show if uploaded in admin settings
        businessAddress: "123 Main St, Springfield, IL 62701",
        customerName: "John",
        projectName: "Kitchen Renovation",
        projectDescription:
          "Complete kitchen remodel with custom cabinets and granite countertops",
        threshold: 4,
        googleReviewUrl: "https://g.page/r/CdWWUaI_IBAoEBM/review",
        seoKeywords: [
          "kitchen renovation",
          "custom cabinets",
          "home remodeling",
          "Springfield contractor",
        ],
        businessCity: "Springfield",
        businessState: "Illinois",
        serviceCategory: "Home Renovation",
        businessOwnerVideo:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Demo video
      };
      setReviewRequest(mockRequest);
    };

    // Always load the review request (demo data if no ID)
    loadReviewRequest();
  }, [id]);

  const generateSeoReview = (originalText: string, request: ReviewRequest) => {
    // Generate template for immediate display or enhance user's text
    if (!originalText) {
      // For immediate display when rating is high
      const templates = [
        `Exceptional ${request.serviceCategory.toLowerCase()} service in ${request.businessCity}, ${request.businessState}! ${request.businessName} delivered outstanding ${request.seoKeywords[0]} work that exceeded our expectations. Their attention to detail and professional approach made this project seamless. Highly recommend their ${request.seoKeywords.slice(0, 2).join(" and ")} services to anyone in the ${request.businessCity} area!`,

        `Outstanding experience with ${request.businessName} in ${request.businessCity}! Their ${request.serviceCategory.toLowerCase()} expertise is unmatched. The team's professionalism and ${request.seoKeywords[0]} skills made this project a complete success. Perfect choice for ${request.seoKeywords.slice(0, 2).join(" or ")} in ${request.businessState}!`,

        `Five stars for ${request.businessName}! Their ${request.serviceCategory.toLowerCase()} work in ${request.businessCity}, ${request.businessState} is top-notch. Excellent ${request.seoKeywords[0]} and professional ${request.seoKeywords[1] || "service"}. The quality of work and customer service was exceptional. Would definitely recommend to neighbors in the ${request.businessCity} area!`,
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    } else {
      // Enhance user's existing text
      const templates = [
        `Exceptional ${request.serviceCategory.toLowerCase()} service in ${request.businessCity}, ${request.businessState}! ${request.businessName} delivered outstanding ${request.seoKeywords[0]} work. ${originalText.replace(/[.!]$/, "")} and exceeded our expectations. Highly recommend their ${request.seoKeywords.slice(0, 2).join(" and ")} services to anyone in the ${request.businessCity} area!`,

        `Outstanding experience with ${request.businessName} in ${request.businessCity}! Their ${request.serviceCategory.toLowerCase()} expertise is unmatched. ${originalText} The team's attention to detail and ${request.seoKeywords[0]} skills made this project seamless. Perfect choice for ${request.seoKeywords.slice(0, 2).join(" or ")} in ${request.businessState}!`,

        `Five stars for ${request.businessName}! ${originalText.replace(/[.!]$/, "")} - their ${request.serviceCategory.toLowerCase()} work in ${request.businessCity}, ${request.businessState} is top-notch. Excellent ${request.seoKeywords[0]} and professional ${request.seoKeywords[1] || "service"}. Would definitely recommend to neighbors in the ${request.businessCity} area!`,
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (newRating >= (reviewRequest?.threshold || 4)) {
      setRedirectToGoogle(true);
    } else {
      setRedirectToGoogle(false);
      setShowSeoVersion(false);
      setSeoReviewText("");
    }
  };

  const handleReviewTextChange = (text: string) => {
    setReviewText(text);
    if (redirectToGoogle && text.trim() && reviewRequest) {
      const seoVersion = generateSeoReview(text, reviewRequest);
      setSeoReviewText(seoVersion);
      setShowSeoVersion(true);
    } else {
      setShowSeoVersion(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewRequest || rating === 0) return;

    setIsSubmitting(true);

    // Track the review submission
    const reviewData = {
      requestId: reviewRequest.id,
      businessName: reviewRequest.businessName,
      customerName: reviewRequest.customerName,
      rating,
      reviewText: redirectToGoogle ? seoReviewText || reviewText : reviewText,
      redirectedToGoogle: redirectToGoogle,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage (in real app, send to API)
    const existingReviews = JSON.parse(
      localStorage.getItem("reviewSubmissions") || "[]",
    );
    existingReviews.push(reviewData);
    localStorage.setItem("reviewSubmissions", JSON.stringify(existingReviews));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    if (redirectToGoogle) {
      // Copy SEO review to clipboard if user wants to use it
      if (seoReviewText) {
        navigator.clipboard.writeText(seoReviewText);
        toast.success("Optimized review copied to clipboard!");
      }

      // Wait a moment then redirect to Google
      setTimeout(() => {
        window.open(reviewRequest.googleReviewUrl, "_blank");
      }, 2000);
    } else {
      toast.success("Thank you for your feedback!");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Review copied to clipboard!");
  };

  if (!reviewRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading review form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            {redirectToGoogle ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  You'll be redirected to Google to complete your review.
                </p>
                <Badge variant="secondary" className="gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Redirecting to Google...
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Your feedback has been recorded. We appreciate your input!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto py-6 relative z-10">
        {/* Business Header */}
        <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              {reviewRequest.businessLogo && (
                <div className="relative inline-block mb-4">
                  <img
                    src={reviewRequest.businessLogo}
                    alt={`${reviewRequest.businessName} logo`}
                    className="h-24 w-24 rounded-2xl object-cover mx-auto shadow-lg"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                </div>
              )}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {reviewRequest.businessName}
              </h1>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                📋 Project: {reviewRequest.projectName}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reviewRequest.projectDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Question Heading */}
        <div className="text-center my-8">
          <div className="relative inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
              How did we do?
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Business Owner Video */}
        {reviewRequest.businessOwnerVideo && (
          <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">
                  💬 A Message from {reviewRequest.businessName}
                </h3>
                <p className="text-gray-600">
                  Personal thank you message from the business owner
                </p>
              </div>
              <div className="relative max-w-lg mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                <video
                  controls
                  className="relative w-full rounded-xl shadow-2xl"
                  poster="/api/placeholder/600/400"
                >
                  <source
                    src={reviewRequest.businessOwnerVideo}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Form */}
        <Card>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <p className="mb-4 font-medium">Please rate your experience:</p>
              <StarRating
                rating={rating}
                onRatingChange={handleRatingChange}
                size="lg"
                className="justify-center mb-2"
              />
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating === 1 &&
                    "We're sorry to hear that. We'd love to make this right."}
                  {rating === 2 &&
                    "Thank you for the feedback. How can we improve?"}
                  {rating === 3 &&
                    "Thanks for your feedback. Tell us more about your experience."}
                  {rating === 4 &&
                    "Great! We're glad you had a good experience."}
                  {rating === 5 &&
                    "Excellent! We're thrilled you loved our service."}
                </p>
              )}
            </div>

            {/* Review Text Input */}
            {rating > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tell us about your experience:
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => handleReviewTextChange(e.target.value)}
                  placeholder="Share details about your experience..."
                  className="min-h-[100px]"
                />
              </div>
            )}

            {/* Enhanced Review - Show after user types their review */}
            {showSeoVersion && seoReviewText && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    🎉 Enhanced Version of Your Review
                  </CardTitle>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    We've enhanced your review with location details and service
                    keywords that help other customers in{" "}
                    {reviewRequest.businessCity} find{" "}
                    {reviewRequest.businessName} when they need similar work.
                    This version is more likely to be discovered by people
                    searching for {reviewRequest.serviceCategory.toLowerCase()}{" "}
                    services in your area.
                  </p>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                    {seoReviewText}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        copyToClipboard(seoReviewText);
                        setTimeout(() => {
                          window.open(reviewRequest.googleReviewUrl, "_blank");
                        }, 500);
                      }}
                      className="gap-2 w-full"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Enhanced & Continue to Google
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        copyToClipboard(reviewText);
                        setTimeout(() => {
                          window.open(reviewRequest.googleReviewUrl, "_blank");
                        }, 500);
                      }}
                      className="gap-2 w-full"
                    >
                      Use Original & Continue to Google
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600 text-center">
                    💡 Enhanced reviews help local customers discover quality
                    businesses like this one
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
