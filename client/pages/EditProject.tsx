import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ArrowLeft, Save, Sparkles, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  customerPhone: string;
  keywords: string[];
  photos: any[];
  documents: any[];
  tasks: any[];
  checklist: any[];
  primaryPhotoId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    customerPhone: "",
    keywords: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const project = projects.find((p: Project) => p.id === id);
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        address: project.address,
        customerPhone: project.customerPhone || "",
        keywords: project.keywords.join(", "),
      });
    }
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const enhanceDescription = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsEnhancingDescription(true);
    try {
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
    const templates = [
      `Professional ${projectName.toLowerCase()} featuring ${original}. This comprehensive project showcases exceptional craftsmanship and attention to detail, delivering outstanding results that exceed client expectations.`,
      `Expert ${projectName.toLowerCase()} project completed with precision and care. ${original} The work demonstrates superior quality construction techniques and modern design principles.`,
      `High-quality ${projectName.toLowerCase()} transformation including ${original}. This project represents our commitment to excellence and delivers lasting value through skilled workmanship.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateKeywords = (name: string, description: string): string[] => {
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

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = projects.map((project: Project) => {
        if (project.id === id) {
          return {
            ...project,
            ...formData,
            keywords: formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean),
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      });

      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      toast.success("Project updated successfully!");
      navigate(`/project/${id}`);
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/project/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Project</h1>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter project address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    placeholder="(555) 123-4567"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      handleInputChange("customerPhone", e.target.value)
                    }
                  />
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

          <div className="flex justify-end gap-4">
            <Link to={`/project/${id}`}>
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
