import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { PhotoCapture } from "@/components/PhotoCapture";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TaggedPhoto {
  url: string;
  tags: string[];
}

export default function AddProject() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<TaggedPhoto[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    gpsLat: "",
    gpsLng: "",
    customerName: "",
    mobilePhone: "",
    additionalPhones: [""],
    keywords: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdditionalPhoneChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newPhones = [...prev.additionalPhones];
      newPhones[index] = value;
      return {
        ...prev,
        additionalPhones: newPhones,
      };
    });
  };

  const addPhoneField = () => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: [...prev.additionalPhones, ""],
    }));
  };

  const removePhoneField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.filter((_, i) => i !== index),
    }));
  };

  const handleAddressSelect = (address: string, lat?: number, lng?: number) => {
    setFormData((prev) => ({
      ...prev,
      address,
      gpsLat: lat ? lat.toString() : "",
      gpsLng: lng ? lng.toString() : "",
    }));
  };

  // Simulate Google Places API (in production, use actual Google Places API)
  const simulateGooglePlaces = (input: string) => {
    if (input.length > 3) {
      // Simulate API response with coordinates
      const mockCoordinates = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
      };

      if (input.toLowerCase().includes("main")) {
        mockCoordinates.lat = 40.7589;
        mockCoordinates.lng = -73.9851;
      }

      setFormData((prev) => ({
        ...prev,
        gpsLat: mockCoordinates.lat.toFixed(6),
        gpsLng: mockCoordinates.lng.toFixed(6),
      }));
    }
  };

  const handlePhotosChange = (photoUrls: string[]) => {
    const newPhotos = photoUrls.map((url) => ({
      url,
      tags: [],
    }));
    setPhotos(newPhotos);
  };

  const enhanceDescription = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsEnhancingDescription(true);
    try {
      // Simulate AI enhancement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const enhanced = generateEnhancedDescription(
        formData.description,
        formData.name,
      );
      setFormData((prev) => ({ ...prev, description: enhanced }));
      toast.success("Description enhanced!");
    } catch (error) {
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  const generateKeywordSuggestions = async () => {
    if (!formData.name && !formData.description) {
      toast.error("Please enter project name or description first");
      return;
    }

    try {
      // Simulate AI keyword generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const suggestions = generateKeywords(formData.name, formData.description);
      setSuggestedKeywords(suggestions);
      toast.success("Keywords suggested!");
    } catch (error) {
      toast.error("Failed to generate keywords");
    }
  };

  const addKeywordFromSuggestion = (keyword: string) => {
    const currentKeywords = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (!currentKeywords.includes(keyword)) {
      const newKeywords = [...currentKeywords, keyword].join(", ");
      setFormData((prev) => ({ ...prev, keywords: newKeywords }));
    }
    setSuggestedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const generateEnhancedDescription = (
    original: string,
    projectName: string,
  ): string => {
    // Simple AI simulation - in production, this would call an actual AI service
    const templates = [
      `Professional ${projectName.toLowerCase()} featuring ${original}. This comprehensive project showcases exceptional craftsmanship and attention to detail, delivering outstanding results that exceed client expectations.`,
      `Expert ${projectName.toLowerCase()} project completed with precision and care. ${original} The work demonstrates superior quality construction techniques and modern design principles.`,
      `High-quality ${projectName.toLowerCase()} transformation including ${original}. This project represents our commitment to excellence and delivers lasting value through skilled workmanship.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateKeywords = (name: string, description: string): string[] => {
    // Simple keyword generation simulation
    const commonKeywords = [
      "renovation",
      "remodel",
      "construction",
      "professional",
      "quality",
    ];
    const contextKeywords = [];

    const text = (name + " " + description).toLowerCase();
    if (text.includes("kitchen"))
      contextKeywords.push("kitchen", "cabinets", "countertops");
    if (text.includes("bathroom"))
      contextKeywords.push("bathroom", "tiles", "fixtures");
    if (text.includes("floor"))
      contextKeywords.push("flooring", "hardwood", "installation");
    if (text.includes("paint"))
      contextKeywords.push("painting", "interior", "exterior");
    if (text.includes("roof"))
      contextKeywords.push("roofing", "shingles", "repair");

    return [...commonKeywords, ...contextKeywords].slice(0, 6);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (photos.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const project = {
        id: Date.now().toString(),
        ...formData,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        photos,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo
      const existingProjects = JSON.parse(
        localStorage.getItem("projects") || "[]",
      );
      localStorage.setItem(
        "projects",
        JSON.stringify([project, ...existingProjects]),
      );

      toast.success("Project created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Describe the project"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                  {formData.description && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 gap-2"
                      onClick={enhanceDescription}
                      disabled={isEnhancingDescription}
                    >
                      {isEnhancingDescription ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {isEnhancingDescription ? "Enhancing..." : "AI Enhance"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Start typing address..."
                    value={formData.address}
                    onChange={(e) => {
                      handleInputChange("address", e.target.value);
                      simulateGooglePlaces(e.target.value);
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Address will auto-complete using Google Places API
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpsLat">GPS Latitude</Label>
                    <Input
                      id="gpsLat"
                      placeholder="40.7128"
                      value={formData.gpsLat}
                      onChange={(e) =>
                        handleInputChange("gpsLat", e.target.value)
                      }
                      className="bg-muted"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpsLng">GPS Longitude</Label>
                    <Input
                      id="gpsLng"
                      placeholder="-74.0060"
                      value={formData.gpsLng}
                      onChange={(e) =>
                        handleInputChange("gpsLng", e.target.value)
                      }
                      className="bg-muted"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer full name"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone</Label>
                  <Input
                    id="mobilePhone"
                    placeholder="(555) 123-4567"
                    value={formData.mobilePhone}
                    onChange={(e) =>
                      handleInputChange("mobilePhone", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Additional Phone Numbers</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPhoneField}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Phone
                    </Button>
                  </div>
                  {formData.additionalPhones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) =>
                          handleAdditionalPhoneChange(index, e.target.value)
                        }
                      />
                      {formData.additionalPhones.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePhoneField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={generateKeywordSuggestions}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Suggest Keywords
                  </Button>
                </div>
                <Input
                  id="keywords"
                  placeholder="renovation, bathroom, kitchen (comma separated)"
                  value={formData.keywords}
                  onChange={(e) =>
                    handleInputChange("keywords", e.target.value)
                  }
                />
                {suggestedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-sm text-muted-foreground mr-2">
                      Suggestions:
                    </span>
                    {suggestedKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addKeywordFromSuggestion(keyword)}
                      >
                        + {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Separate keywords with commas to help organize your projects
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoCapture
                photos={photos.map((p) => p.url)}
                onPhotosChange={handlePhotosChange}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
