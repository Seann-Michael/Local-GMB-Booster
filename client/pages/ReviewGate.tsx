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
        id: id || "1",
        businessName: "Smith Construction LLC",
        businessLogo: "/api/placeholder/120/120",
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
      };
      setReviewRequest(mockRequest);
    };

    if (id) {
      loadReviewRequest();
    }
  }, [id]);

  const generateSeoReview = (originalText: string, request: ReviewRequest) => {
    // Simulate AI-powered SEO optimization
    const templates = [
      `Exceptional ${request.serviceCategory.toLowerCase()} service in ${request.businessCity}, ${request.businessState}! ${request.businessName} delivered outstanding ${request.seoKeywords[0]} work. ${originalText.replace(/[.!]$/, "")} and exceeded our expectations. Highly recommend their ${request.seoKeywords.slice(0, 2).join(" and ")} services to anyone in the ${request.businessCity} area!`,

      `Outstanding experience with ${request.businessName} in ${request.businessCity}! Their ${request.serviceCategory.toLowerCase()} expertise is unmatched. ${originalText} The team's attention to detail and ${request.seoKeywords[0]} skills made this project seamless. Perfect choice for ${request.seoKeywords.slice(0, 2).join(" or ")} in ${request.businessState}!`,

      `Five stars for ${request.businessName}! ${originalText.replace(/[.!]$/, "")} - their ${request.serviceCategory.toLowerCase()} work in ${request.businessCity}, ${request.businessState} is top-notch. Excellent ${request.seoKeywords[0]} and professional ${request.seoKeywords[1] || "service"}. Would definitely recommend to neighbors in the ${request.businessCity} area!`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (newRating >= (reviewRequest?.threshold || 4)) {
      setRedirectToGoogle(true);
    } else {
      setRedirectToGoogle(false);
      setShowSeoVersion(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Business Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {reviewRequest.businessLogo && (
                <img
                  src={reviewRequest.businessLogo}
                  alt={`${reviewRequest.businessName} logo`}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {reviewRequest.businessName}
                </h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {reviewRequest.businessAddress}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium mb-1">
                Project: {reviewRequest.projectName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {reviewRequest.projectDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Review Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              How was your experience, {reviewRequest.customerName}?
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Your feedback helps us serve you better
            </p>
          </CardHeader>
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

            {/* Review Text */}
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

            {/* SEO Optimized Version */}
            {showSeoVersion && seoReviewText && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    Enhanced Review (Recommended)
                  </CardTitle>
                  <p className="text-xs text-green-700">
                    We've enhanced your review to help other customers find{" "}
                    {reviewRequest.businessName} more easily
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-white p-3 rounded border text-sm mb-3">
                    {seoReviewText}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(seoReviewText)}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Enhanced Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {rating > 0 && reviewText.trim() && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : redirectToGoogle ? (
                  <>
                    Submit & Continue to Google
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            )}

            {redirectToGoogle && rating >= (reviewRequest.threshold || 4) && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">
                  🎉 Thank you for the {rating}-star review!
                </p>
                <p className="text-xs text-blue-600">
                  We'd love if you could share this experience on Google to help
                  other customers discover {reviewRequest.businessName}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
