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
  businessOwnerVideo?: string;
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
    const loadReviewRequest = () => {
      const mockRequest: ReviewRequest = {
        id: id || "demo",
        businessName: "Smith Construction LLC",
        businessLogo: undefined,
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
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      };
      setReviewRequest(mockRequest);
    };

    loadReviewRequest();
  }, [id]);

  const generateSeoReview = (originalText: string, request: ReviewRequest) => {
    if (!originalText) {
      const templates = [
        `Exceptional ${request.serviceCategory.toLowerCase()} service in ${request.businessCity}, ${request.businessState}! ${request.businessName} delivered outstanding ${request.seoKeywords[0]} work that exceeded our expectations. Their attention to detail and professional approach made this project seamless. Highly recommend their ${request.seoKeywords.slice(0, 2).join(" and ")} services to anyone in the ${request.businessCity} area!`,
      ];
      return templates[0];
    } else {
      const templates = [
        `Exceptional ${request.serviceCategory.toLowerCase()} service in ${request.businessCity}, ${request.businessState}! ${request.businessName} delivered outstanding ${request.seoKeywords[0]} work. ${originalText.replace(/[.!]$/, "")} and exceeded our expectations. Highly recommend their ${request.seoKeywords.slice(0, 2).join(" and ")} services to anyone in the ${request.businessCity} area!`,
      ];
      return templates[0];
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Review copied to clipboard!");
  };

  if (!reviewRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 w-full max-w-md text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
          {redirectToGoogle ? (
            <div className="space-y-3">
              <p className="text-gray-600">
                You'll be redirected to Google to complete your review.
              </p>
              <Badge variant="secondary" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Redirecting to Google...
              </Badge>
            </div>
          ) : (
            <p className="text-gray-600">
              Your feedback has been recorded. We appreciate your input!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-xl mx-auto py-8">
        {/* Business Header */}
        <div className="text-center mb-8">
          {reviewRequest.businessLogo && (
            <img
              src={reviewRequest.businessLogo}
              alt={`${reviewRequest.businessName} logo`}
              className="h-16 w-16 rounded-lg object-cover mx-auto mb-4 ring-2 ring-blue-100"
            />
          )}
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {reviewRequest.businessName}
          </h1>

          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              {reviewRequest.projectName}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {reviewRequest.projectDescription}
            </p>
          </div>
        </div>

        {/* Main Question Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">How did we do?</h2>
        </div>

        {/* Business Owner Video */}
        {reviewRequest.businessOwnerVideo && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <div className="text-center mb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                A Message from {reviewRequest.businessName}
              </h3>
            </div>
            <div className="max-w-lg mx-auto">
              <video
                controls
                className="w-full rounded-lg"
                poster="/api/placeholder/600/400"
              >
                <source
                  src={reviewRequest.businessOwnerVideo}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Review Form */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <StarRating
                rating={rating}
                onRatingChange={handleRatingChange}
                size="lg"
                className="justify-center mb-4"
              />
              {rating > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-gray-700 text-sm">
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
                </div>
              )}
            </div>

            {/* Review Text Input */}
            {rating > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tell us about your experience:
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => handleReviewTextChange(e.target.value)}
                  placeholder="Share details about your experience..."
                  className="min-h-[100px] border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            )}

            {/* Enhanced Review */}
            {showSeoVersion && seoReviewText && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Enhanced Version of Your Review
                  </h4>
                  <p className="text-sm text-gray-600">
                    We've enhanced your review with location details and service
                    keywords that help other customers in{" "}
                    {reviewRequest.businessCity} find{" "}
                    {reviewRequest.businessName}.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border text-sm mb-3">
                  {seoReviewText}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      copyToClipboard(seoReviewText);
                      setTimeout(() => {
                        window.open(reviewRequest.googleReviewUrl, "_blank");
                      }, 500);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Enhanced & Continue to Google
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      copyToClipboard(reviewText);
                      setTimeout(() => {
                        window.open(reviewRequest.googleReviewUrl, "_blank");
                      }, 500);
                    }}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Use Original & Continue to Google
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
