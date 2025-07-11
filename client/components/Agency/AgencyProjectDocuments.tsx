import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  File,
  Image,
  Download,
  MoreHorizontal,
  Eye,
  EyeOff,
  Users,
  Trash,
  Edit,
  FileText,
  FileImage,
  Archive,
  Video,
  Music,
  X,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { AgencyProjectDocument, AgencyProjectImage } from "@/types/agency";

interface AgencyProjectDocumentsProps {
  projectId: string;
  documents: AgencyProjectDocument[];
  images: AgencyProjectImage[];
  onDocumentsChange: (documents: AgencyProjectDocument[]) => void;
  onImagesChange: (images: AgencyProjectImage[]) => void;
}

export function AgencyProjectDocuments({
  projectId,
  documents,
  images,
  onDocumentsChange,
  onImagesChange,
}: AgencyProjectDocumentsProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"document" | "image">(
    "document",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<{
    visibility?: string;
    category?: string;
    type?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [uploadData, setUploadData] = useState({
    name: "",
    description: "",
    visibility: "internal" as "internal" | "client" | "team",
    category: "",
    tags: [] as string[],
    newTag: "",
  });

  const handleFileUpload = async (
    files: FileList | null,
    type: "document" | "image",
  ) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (type === "document" && file.type.startsWith("image/")) {
      toast.error("Please use the image upload for image files");
      return;
    }

    try {
      // In a real app, you would upload to a file storage service
      const mockUrl = URL.createObjectURL(file);

      if (type === "document") {
        const newDocument: AgencyProjectDocument = {
          id: `doc-${Date.now()}`,
          projectId,
          name: uploadData.name || file.name,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: mockUrl,
          visibility: uploadData.visibility,
          uploadedBy: "current-user",
          uploadedByName: "Current User",
          uploadedAt: new Date().toISOString(),
          description: uploadData.description || undefined,
          category: uploadData.category || undefined,
          tags: uploadData.tags.filter((tag) => tag.trim() !== ""),
        };

        onDocumentsChange([...documents, newDocument]);
      } else {
        const newImage: AgencyProjectImage = {
          id: `img-${Date.now()}`,
          projectId,
          url: mockUrl,
          fileName: file.name,
          fileSize: file.size,
          alt: uploadData.description || file.name,
          caption: uploadData.name || undefined,
          visibility: uploadData.visibility,
          uploadedBy: "current-user",
          uploadedByName: "Current User",
          uploadedAt: new Date().toISOString(),
          category: uploadData.category || undefined,
          tags: uploadData.tags.filter((tag) => tag.trim() !== ""),
        };

        onImagesChange([...images, newImage]);
      }

      // Reset form
      setUploadData({
        name: "",
        description: "",
        visibility: "internal",
        category: "",
        tags: [],
        newTag: "",
      });

      setIsUploadDialogOpen(false);
      toast.success(
        `${type === "document" ? "Document" : "Image"} uploaded successfully`,
      );
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleDeleteDocument = (docId: string) => {
    onDocumentsChange(documents.filter((doc) => doc.id !== docId));
    toast.success("Document deleted");
  };

  const handleDeleteImage = (imgId: string) => {
    onImagesChange(images.filter((img) => img.id !== imgId));
    toast.success("Image deleted");
  };

  const handleAddTag = () => {
    if (
      uploadData.newTag.trim() &&
      !uploadData.tags.includes(uploadData.newTag.trim())
    ) {
      setUploadData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setUploadData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <File className="h-5 w-5 text-red-600" />;
    if (fileType.includes("image"))
      return <FileImage className="h-5 w-5 text-blue-600" />;
    if (fileType.includes("video"))
      return <Video className="h-5 w-5 text-purple-600" />;
    if (fileType.includes("audio"))
      return <Music className="h-5 w-5 text-green-600" />;
    if (fileType.includes("zip") || fileType.includes("rar"))
      return <Archive className="h-5 w-5 text-yellow-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "client":
        return <Eye className="h-4 w-4 text-green-600" />;
      case "team":
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <EyeOff className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "client":
        return "Client Visible";
      case "team":
        return "Team Only";
      default:
        return "Internal";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter files
  const filteredDocuments = documents.filter((doc) => {
    if (
      searchQuery &&
      !doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filter.visibility && doc.visibility !== filter.visibility) return false;
    if (filter.category && doc.category !== filter.category) return false;
    return true;
  });

  const filteredImages = images.filter((img) => {
    if (
      searchQuery &&
      !img.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filter.visibility && img.visibility !== filter.visibility) return false;
    if (filter.category && img.category !== filter.category) return false;
    return true;
  });

  // Get categories for filter
  const documentCategories = [
    ...new Set(documents.map((d) => d.category).filter(Boolean)),
  ];
  const imageCategories = [
    ...new Set(images.map((i) => i.category).filter(Boolean)),
  ];
  const allCategories = [
    ...new Set([...documentCategories, ...imageCategories]),
  ];

  return (
    <div className="space-y-4">
      {/* Header with search and upload */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filter.visibility || "all"}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                visibility: value === "all" ? undefined : value,
              }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="team">Team Only</SelectItem>
              <SelectItem value="client">Client Visible</SelectItem>
            </SelectContent>
          </Select>

          {allCategories.length > 0 && (
            <Select
              value={filter.category || ""}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, category: value || undefined }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs
                value={uploadType}
                onValueChange={(value: any) => setUploadType(value)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="document">
                    <File className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <Image className="h-4 w-4 mr-2" />
                    Images
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="document" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Document</Label>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) =>
                        handleFileUpload(e.target.files, "document")
                      }
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Image</Label>
                    <Input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) =>
                        handleFileUpload(e.target.files, "image")
                      }
                      accept="image/*"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="file-name">Name (optional)</Label>
                <Input
                  id="file-name"
                  value={uploadData.name}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Custom file name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-description">Description</Label>
                <Textarea
                  id="file-description"
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="File description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select
                    value={uploadData.visibility}
                    onValueChange={(value: any) =>
                      setUploadData((prev) => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Only</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="client">Client Visible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-category">Category</Label>
                  <Input
                    id="file-category"
                    value={uploadData.category}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="e.g., contract, design..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={uploadData.newTag}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        newTag: e.target.value,
                      }))
                    }
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!uploadData.newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {uploadData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (uploadType === "document") {
                      fileInputRef.current?.click();
                    } else {
                      imageInputRef.current?.click();
                    }
                  }}
                >
                  Select & Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <File className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
              <Image className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Client Visible</p>
                <p className="text-2xl font-bold">
                  {
                    [...documents, ...images].filter(
                      (f) => f.visibility === "client",
                    ).length
                  }
                </p>
              </div>
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(
                    [...documents, ...images].reduce(
                      (sum, f) => sum + f.fileSize,
                      0,
                    ),
                  )}
                </p>
              </div>
              <Archive className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">
            Documents ({filteredDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="images">
            Images ({filteredImages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No documents found</p>
                <Button
                  onClick={() => {
                    setUploadType("document");
                    setIsUploadDialogOpen(true);
                  }}
                  className="mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload your first document
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(doc.fileType)}
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                          <span>by {doc.uploadedByName}</span>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {doc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {getVisibilityIcon(doc.visibility)}
                            {getVisibilityLabel(doc.visibility)}
                          </Badge>
                          {doc.category && (
                            <Badge variant="secondary">{doc.category}</Badge>
                          )}
                          {doc.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-3">
          {filteredImages.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No images found</p>
                <Button
                  onClick={() => {
                    setUploadType("image");
                    setIsUploadDialogOpen(true);
                  }}
                  className="mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload your first image
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map((img) => (
                <Card key={img.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={img.url}
                      alt={img.alt || img.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Size
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">
                      {img.caption || img.fileName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(img.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(img.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        {getVisibilityIcon(img.visibility)}
                        {getVisibilityLabel(img.visibility)}
                      </Badge>
                      {img.category && (
                        <Badge variant="secondary" className="text-xs">
                          {img.category}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
