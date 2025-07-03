import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import {
  ArrowLeft,
  Edit,
  Share,
  Trash2,
  MapPin,
  CalendarDays,
  Tag,
  Download,
  ExternalLink,
  Images,
  MoreVertical,
  Plus,
  Phone,
  Star,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface TaggedPhoto {
  url: string;
  tags: string[];
  uploadedAt: string;
  uploadedBy: string;
  isPrimary?: boolean;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  gpsLat?: string;
  gpsLng?: string;
  customerName?: string;
  customerPhone?: string;
  mobilePhone?: string;
  additionalPhones?: string[];
  keywords: string[];
  photos: TaggedPhoto[] | string[];
  documents: Document[];
  tasks: Task[];
  checklist: ChecklistItem[];
  primaryPhotoId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: Project) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    }
  }, [id]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = projects.filter((p: Project) => p.id !== id);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      toast.success("Project deleted successfully");
      navigate("/");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.name,
        text: project?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Project link copied to clipboard");
    }
  };

  const downloadPhoto = (photoUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = photoUrl;
    a.download = `${project?.name}-photo-${index + 1}.jpg`;
    a.click();
  };

  const requestGoogleReview = () => {
    const phone = project?.mobilePhone || project?.customerPhone;
    if (!phone) {
      toast.error(
        "Customer mobile phone number is required to request a review",
      );
      return;
    }

    const customerName = project?.customerName || "Customer";
    const message = `Hi ${customerName}! We've completed your ${project.name} project. We'd greatly appreciate if you could leave us a Google review. Here's the link: [Your Google Business Link]`;
    const phoneUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.open(phoneUrl);
    toast.success("Review request message prepared!");
  };

  const addMorePhotos = (files: FileList | null) => {
    if (!files || !project) return;

    const newPhotos: TaggedPhoto[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push({
              url: e.target.result as string,
              tags: [],
            });

            if (newPhotos.length === files.length) {
              const updatedProject = {
                ...project,
                photos: [...(project.photos || []), ...newPhotos],
              };

              // Update localStorage
              const projects = JSON.parse(
                localStorage.getItem("projects") || "[]",
              );
              const updatedProjects = projects.map((p: Project) =>
                p.id === project.id ? updatedProject : p,
              );
              localStorage.setItem("projects", JSON.stringify(updatedProjects));
              setProject(updatedProject);
              toast.success(`Added ${newPhotos.length} new photo(s)`);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const getPhotoUrl = (photo: TaggedPhoto | string): string => {
    return typeof photo === "string" ? photo : photo.url;
  };

  const getPhotoTags = (photo: TaggedPhoto | string): string[] => {
    return typeof photo === "string" ? [] : photo.tags;
  };

  const removePhoto = (index: number) => {
    if (!project) return;

    if (confirm("Are you sure you want to remove this photo?")) {
      const updatedPhotos = project.photos.filter((_, i) => i !== index);
      const updatedProject = {
        ...project,
        photos: updatedPhotos,
      };

      // Update localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = projects.map((p: Project) =>
        p.id === project.id ? updatedProject : p,
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      setProject(updatedProject);
      toast.success("Photo removed successfully");
    }
  };

  if (!project) {
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
            <h1 className="text-2xl font-bold">Project Not Found</h1>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Project not found</p>
              <Link to="/">
                <Button className="mt-4">Back to Projects</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{project.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/project/${id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Upload to Website
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Post to Google My Business
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Photos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Images className="h-5 w-5" />
                  Photos ({project.photos.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Photos
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => addMorePhotos(e.target.files)}
                />
                {project.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {project.photos.map((photo, index) => {
                      const photoUrl = getPhotoUrl(photo);
                      const photoTags = getPhotoTags(photo);
                      return (
                        <div
                          key={index}
                          className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
                          onClick={() => setSelectedPhoto(photoUrl)}
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${index + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          {photoTags.length > 0 && (
                            <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
                              {photoTags.slice(0, 2).map((tag, tagIndex) => (
                                <Badge
                                  key={tagIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {photoTags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{photoTags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPhoto(photoUrl, index);
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePhoto(index);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No photos uploaded yet</p>
                    <Button
                      variant="outline"
                      className="mt-4 gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4" />
                      Add First Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Created
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {project.address}
                  </p>
                </div>

                {(project.customerName ||
                  project.mobilePhone ||
                  project.customerPhone ||
                  (project.additionalPhones &&
                    project.additionalPhones.length > 0)) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Customer Information
                      </h4>

                      {project.customerName && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="text-sm font-medium">
                            {project.customerName}
                          </p>
                        </div>
                      )}

                      {(project.mobilePhone || project.customerPhone) && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground">
                            Mobile Phone
                          </p>
                          <p className="text-sm">
                            {project.mobilePhone || project.customerPhone}
                          </p>
                        </div>
                      )}

                      {project.additionalPhones &&
                        project.additionalPhones.filter((phone) => phone.trim())
                          .length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground">
                              Additional Numbers
                            </p>
                            {project.additionalPhones
                              .filter((phone) => phone.trim())
                              .map((phone, index) => (
                                <p key={index} className="text-sm">
                                  {phone}
                                </p>
                              ))}
                          </div>
                        )}

                      {project.gpsLat && project.gpsLng && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground">
                            GPS Coordinates
                          </p>
                          <p className="text-sm font-mono text-xs">
                            {project.gpsLat}, {project.gpsLng}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={requestGoogleReview}
                        disabled={
                          !project.mobilePhone && !project.customerPhone
                        }
                      >
                        <Star className="h-4 w-4" />
                        Request Google Review
                      </Button>
                    </div>
                  </>
                )}

                {project.keywords.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {project.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Photos
                  </span>
                  <span className="font-medium">{project.photos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Keywords
                  </span>
                  <span className="font-medium">{project.keywords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Project Age
                  </span>
                  <span className="font-medium">
                    {Math.ceil(
                      (Date.now() - new Date(project.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
