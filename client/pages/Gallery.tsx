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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/AppLayout";
import { MediaViewer } from "@/components/MediaViewer";
import {
  ArrowLeft,
  Images,
  User,
  Calendar,
  MapPin,
  Download,
  Star,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface PhotoWithMetadata {
  url: string;
  projectId: string;
  projectName: string;
  projectAddress: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  isPrimary?: boolean;
  type: "photo" | "video";
  size: "small" | "medium" | "large";
}

interface FilterState {
  startDate: string;
  endDate: string;
  selectedProject: string;
  selectedUser: string;
  selectedTags: string[];
  tagFilterMode: "or" | "and";
  mediaType: "all" | "photos" | "videos";
  photoSize: "all" | "small" | "medium" | "large";
  thumbnailSize: "small" | "medium" | "large";
  sortOrder: "newest" | "oldest";
}

export default function Gallery() {
  const [photos, setPhotos] = useState<PhotoWithMetadata[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoWithMetadata[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [users, setUsers] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    startDate: "",
    endDate: "",
    selectedProject: "all",
    selectedUser: "all",
    selectedTags: [],
    tagFilterMode: "or",
    mediaType: "all",
    photoSize: "all",
    thumbnailSize: "small",
    sortOrder: "newest",
  });

  useEffect(() => {
    const projectsData = JSON.parse(localStorage.getItem("projects") || "[]");
    const allPhotos: PhotoWithMetadata[] = [];
    const projectOptions: Array<{ id: string; name: string }> = [];
    const userSet = new Set<string>();
    const tagSet = new Set<string>();

    projectsData.forEach((project: any) => {
      projectOptions.push({ id: project.id, name: project.name });

      if (project.photos && project.photos.length > 0) {
        project.photos.forEach((photo: any) => {
          const photoUrl = typeof photo === "string" ? photo : photo.url;
          const photoData = typeof photo === "string" ? {} : photo;

          // Determine file type and size based on URL or data
          const isVideo =
            photoUrl.includes(".mp4") ||
            photoUrl.includes(".mov") ||
            photoUrl.includes(".webm");
          const fileSize =
            photoData.size ||
            (Math.random() > 0.6
              ? "large"
              : Math.random() > 0.3
                ? "medium"
                : "small");

          const uploadedBy = photoData.uploadedBy || "John Doe";
          userSet.add(uploadedBy);

          const photoTags = photoData.tags || [];
          photoTags.forEach((tag: string) => tagSet.add(tag));

          allPhotos.push({
            url: photoUrl,
            projectId: project.id,
            projectName: project.name,
            projectAddress: project.address,
            uploadedAt: photoData.uploadedAt || project.createdAt,
            uploadedBy: uploadedBy,
            tags: photoTags,
            isPrimary: photoData.isPrimary || false,
            type: isVideo ? "video" : "photo",
            size: fileSize as "small" | "medium" | "large",
          });
        });
      }
    });

    setProjects(projectOptions);
    setUsers(Array.from(userSet));
    setAllTags(Array.from(tagSet));
    setPhotos(allPhotos);
  }, []);

  // Apply filters whenever photos or filters change
  useEffect(() => {
    let filtered = [...photos];

    // Date filtering
    if (filters.startDate) {
      filtered = filtered.filter(
        (photo) => new Date(photo.uploadedAt) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (photo) => new Date(photo.uploadedAt) <= new Date(filters.endDate),
      );
    }

    // Project filtering
    if (filters.selectedProject !== "all") {
      filtered = filtered.filter(
        (photo) => photo.projectId === filters.selectedProject,
      );
    }

    // User filtering
    if (filters.selectedUser !== "all") {
      filtered = filtered.filter(
        (photo) => photo.uploadedBy === filters.selectedUser,
      );
    }

    // Tag filtering
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((photo) => {
        if (filters.tagFilterMode === "and") {
          return filters.selectedTags.every((tag) => photo.tags.includes(tag));
        } else {
          return filters.selectedTags.some((tag) => photo.tags.includes(tag));
        }
      });
    }

    // Media type filtering
    if (filters.mediaType === "photos") {
      filtered = filtered.filter((photo) => photo.type === "photo");
    } else if (filters.mediaType === "videos") {
      filtered = filtered.filter((photo) => photo.type === "video");
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return filters.sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPhotos(filtered);
  }, [photos, filters]);

  const downloadPhoto = (
    photoUrl: string,
    projectName: string,
    index: number,
  ) => {
    const a = document.createElement("a");
    a.href = photoUrl;
    a.download = `${projectName}-photo-${index}.jpg`;
    a.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      selectedProject: "all",
      selectedUser: "all",
      selectedTags: [],
      tagFilterMode: "or",
      mediaType: "all",
      photoSize: "all",
      thumbnailSize: "small",
      sortOrder: "newest",
    });
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gallery</h1>
            <p className="text-muted-foreground">
              {filteredPhotos.length} of {photos.length} items
            </p>
          </div>

          {/* Sort and Thumbnail Size Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Sort:</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: "newest" | "oldest") =>
                  updateFilter("sortOrder", value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Size:</Label>
              <Select
                value={filters.thumbnailSize}
                onValueChange={(value: "small" | "medium" | "large") =>
                  updateFilter("thumbnailSize", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Top Row - Date and Basic Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => updateFilter("startDate", e.target.value)}
                    className="w-auto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilter("endDate", e.target.value)}
                    className="w-auto"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Projects</Label>
                  <Select
                    value={filters.selectedProject}
                    onValueChange={(value) =>
                      updateFilter("selectedProject", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Users</Label>
                  <Select
                    value={filters.selectedUser}
                    onValueChange={(value) =>
                      updateFilter("selectedUser", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="w-48">
                    <div className="border rounded-md p-2 min-h-[40px] max-h-[120px] overflow-y-auto">
                      {filters.selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {filters.selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="default"
                              className="text-xs cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="space-y-1">
                        {allTags
                          .filter((tag) => !filters.selectedTags.includes(tag))
                          .map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2 p-1 hover:bg-muted rounded cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              <Checkbox
                                id={tag}
                                checked={filters.selectedTags.includes(tag)}
                                onCheckedChange={() => toggleTag(tag)}
                              />
                              <Label
                                htmlFor={tag}
                                className="text-sm cursor-pointer"
                              >
                                {tag}
                              </Label>
                            </div>
                          ))}
                        {allTags.length === 0 && (
                          <div className="text-sm text-muted-foreground p-1">
                            No tags available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>View</Label>
                  <Select value="grid">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Options Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* Tag Filter Mode */}
                {filters.selectedTags.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Filter Tags By
                    </Label>
                    <RadioGroup
                      value={filters.tagFilterMode}
                      onValueChange={(value: "or" | "and") =>
                        updateFilter("tagFilterMode", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="or" id="or" />
                        <Label htmlFor="or" className="text-sm">
                          Or
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="and" id="and" />
                        <Label htmlFor="and" className="text-sm">
                          And
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Media Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Type</Label>
                  <RadioGroup
                    value={filters.mediaType}
                    onValueChange={(value: "all" | "photos" | "videos") =>
                      updateFilter("mediaType", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="text-sm">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="photos" id="photos" />
                      <Label htmlFor="photos" className="text-sm">
                        Photos Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="videos" id="videos" />
                      <Label htmlFor="videos" className="text-sm">
                        Videos Only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </Card>
        )}

        {filteredPhotos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {photos.length === 0
                  ? "No photos yet"
                  : "No photos match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {photos.length === 0
                  ? "Start adding photos to your projects to see them here"
                  : "Try adjusting your filters to see more results"}
              </p>
              {photos.length === 0 ? (
                <Link to="/admin/add-project">
                  <Button>Create First Project</Button>
                </Link>
              ) : (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Enhanced Media Viewer with Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Images className="h-5 w-5" />
                  Media Gallery ({filteredPhotos.length} items)
                  <Badge variant="secondary" className="ml-auto">
                    Enhanced Metadata Available
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MediaViewer
                  photos={filteredPhotos.map((photo) => ({
                    url: photo.url,
                    tags: photo.tags,
                    uploadedAt: photo.uploadedAt,
                    uploadedBy: photo.uploadedBy,
                    isPrimary: photo.isPrimary,
                  }))}
                  selectedPhoto={selectedPhoto}
                  onPhotoSelect={setSelectedPhoto}
                  projectName="Gallery"
                  showMetadata={true}
                />
              </CardContent>
            </Card>

            {/* Group photos by date - Traditional View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline View
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(
                  filteredPhotos.reduce(
                    (groups, photo) => {
                      const date = new Date(
                        photo.uploadedAt,
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      if (!groups[date]) groups[date] = [];
                      groups[date].push(photo);
                      return groups;
                    },
                    {} as Record<string, PhotoWithMetadata[]>,
                  ),
                ).map(([date, datePhotos]) => (
                  <div key={date} className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                      <Checkbox className="rounded" />
                      <h2 className="text-lg font-semibold">{date}</h2>
                      <Badge variant="outline">{datePhotos.length} items</Badge>
                    </div>

                    <div
                      className={`grid gap-6 ${
                        filters.thumbnailSize === "small"
                          ? "sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                          : filters.thumbnailSize === "large"
                            ? "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                            : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
                      {datePhotos.map((photo, index) => (
                        <Card
                          key={`${date}-${index}`}
                          className="overflow-hidden"
                        >
                          <div
                            className={`relative cursor-pointer group ${
                              filters.thumbnailSize === "small"
                                ? "aspect-square"
                                : filters.thumbnailSize === "large"
                                  ? "aspect-[4/3]"
                                  : "aspect-square"
                            }`}
                            onClick={() => setSelectedPhoto(photo.url)}
                          >
                            <img
                              src={photo.url}
                              alt={`${photo.type} from ${photo.projectName}`}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                            {/* Top badges */}
                            <div className="absolute top-2 left-2 flex gap-1">
                              {photo.isPrimary && (
                                <Badge variant="secondary" className="gap-1">
                                  <Star className="h-3 w-3" />
                                  Primary
                                </Badge>
                              )}
                              {photo.type === "video" && (
                                <Badge variant="default" className="gap-1">
                                  Video
                                </Badge>
                              )}
                            </div>

                            {/* Bottom badges */}
                            <div className="absolute bottom-2 left-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-black/50 text-white border-white/20"
                              >
                                {photo.size}
                              </Badge>
                            </div>

                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPhoto(
                                  photo.url,
                                  photo.projectName,
                                  index,
                                );
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                          <CardContent
                            className={`${
                              filters.thumbnailSize === "small"
                                ? "p-2"
                                : filters.thumbnailSize === "large"
                                  ? "p-6"
                                  : "p-4"
                            }`}
                          >
                            <Link
                              to={`/project/${photo.projectId}`}
                              className="block hover:text-primary transition-colors"
                            >
                              <h3
                                className={`font-semibold mb-1 line-clamp-1 ${
                                  filters.thumbnailSize === "small"
                                    ? "text-xs"
                                    : filters.thumbnailSize === "large"
                                      ? "text-base"
                                      : "text-sm"
                                }`}
                              >
                                {photo.projectName}
                              </h3>
                            </Link>

                            <div
                              className={`text-muted-foreground ${
                                filters.thumbnailSize === "small"
                                  ? "space-y-1 text-xs"
                                  : filters.thumbnailSize === "large"
                                    ? "space-y-3 text-sm"
                                    : "space-y-2 text-xs"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="line-clamp-1">
                                  {photo.projectAddress}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{photo.uploadedBy}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(photo.uploadedAt)}</span>
                              </div>
                            </div>

                            {photo.tags.length > 0 && (
                              <div
                                className={`flex flex-wrap gap-1 ${
                                  filters.thumbnailSize === "small"
                                    ? "mt-1"
                                    : "mt-2"
                                }`}
                              >
                                {photo.tags
                                  .slice(
                                    0,
                                    filters.thumbnailSize === "small" ? 1 : 2,
                                  )
                                  .map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className={
                                        filters.thumbnailSize === "small"
                                          ? "text-xs"
                                          : "text-xs"
                                      }
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {photo.tags.length >
                                  (filters.thumbnailSize === "small"
                                    ? 1
                                    : 2) && (
                                  <Badge variant="outline" className="text-xs">
                                    +
                                    {photo.tags.length -
                                      (filters.thumbnailSize === "small"
                                        ? 1
                                        : 2)}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
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
    </AppLayout>
  );
}
