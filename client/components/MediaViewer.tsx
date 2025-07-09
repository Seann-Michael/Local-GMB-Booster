import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Info,
  Calendar,
  MapPin,
  User,
  Tag,
  Building,
  FileText,
  Video,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { MediaMetadataEnhancer, type MediaMetadata } from "@/lib/mediaMetadata";

interface EnhancedPhoto {
  url: string;
  metadata?: MediaMetadata;
  enhancedFileName?: string;
  // Legacy support
  tags?: string[];
  uploadedAt?: string;
  uploadedBy?: string;
  isPrimary?: boolean;
}

interface MediaViewerProps {
  photos: EnhancedPhoto[];
  selectedPhoto: string | null;
  onPhotoSelect: (url: string | null) => void;
  projectName?: string;
  showMetadata?: boolean;
}

export function MediaViewer({
  photos,
  selectedPhoto,
  onPhotoSelect,
  projectName = "Project",
  showMetadata = true,
}: MediaViewerProps) {
  const [showMetadataPanel, setShowMetadataPanel] = useState(false);

  const downloadPhotoMetadata = (photo: EnhancedPhoto) => {
    if (!photo.metadata) {
      // Create basic metadata for legacy photos
      const basicMetadata = {
        fileName: photo.url.split("/").pop() || "photo",
        uploadedAt: photo.uploadedAt || new Date().toISOString(),
        uploadedBy: photo.uploadedBy || "Unknown",
        tags: photo.tags || [],
        projectName,
        isPrimary: photo.isPrimary || false,
      };

      const blob = new Blob([JSON.stringify(basicMetadata, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}_photo_metadata.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const metadataBlob = MediaMetadataEnhancer.generateMetadataFile(
        photo.metadata,
      );
      const url = URL.createObjectURL(metadataBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${photo.enhancedFileName || "photo"}_metadata.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getFileType = (url: string): "image" | "video" => {
    const videoExtensions = [".mp4", ".mov", ".webm", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext))
      ? "video"
      : "image";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group cursor-pointer">
            <div
              className="aspect-square rounded-lg overflow-hidden bg-muted"
              onClick={() => onPhotoSelect(photo.url)}
            >
              {getFileType(photo.url) === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={photo.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Photo overlay with metadata indicator */}
            {showMetadata && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {photo.metadata && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-500 text-white"
                  >
                    Enhanced
                  </Badge>
                )}
                {photo.isPrimary && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-500 text-white"
                  >
                    Primary
                  </Badge>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {showMetadata && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMetadataPanel(true);
                    onPhotoSelect(photo.url);
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPhotoMetadata(photo);
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-size photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => onPhotoSelect(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPhotoSelect(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            {getFileType(selectedPhoto) === "video" ? (
              <video
                src={selectedPhoto}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedPhoto}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}

      {/* Metadata Panel */}
      {showMetadataPanel && selectedPhoto && (
        <Card className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Media Metadata
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setShowMetadataPanel(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const currentPhoto = photos.find((p) => p.url === selectedPhoto);
              if (!currentPhoto) return null;

              if (currentPhoto.metadata) {
                return (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Business:</span>
                      <span>{currentPhoto.metadata.businessName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{currentPhoto.metadata.cityState}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date:</span>
                      <span>{formatDate(currentPhoto.metadata.timestamp)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Uploaded by:</span>
                      <span>{currentPhoto.metadata.uploadedBy}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Keywords:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentPhoto.metadata.keywords
                          .slice(0, 8)
                          .map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        {currentPhoto.metadata.keywords.length > 8 && (
                          <Badge variant="secondary" className="text-xs">
                            +{currentPhoto.metadata.keywords.length - 8}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>File: {currentPhoto.enhancedFileName}</div>
                        <div>Type: {currentPhoto.metadata.fileType}</div>
                        <div>
                          Size:{" "}
                          {(
                            currentPhoto.metadata.fileSize /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </div>
                      </div>
                    </div>
                  </>
                );
              } else {
                // Legacy photo metadata
                return (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Basic metadata (legacy photo)
                    </div>

                    {currentPhoto.uploadedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                        <span>{formatDate(currentPhoto.uploadedAt)}</span>
                      </div>
                    )}

                    {currentPhoto.uploadedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Uploaded by:</span>
                        <span>{currentPhoto.uploadedBy}</span>
                      </div>
                    )}

                    {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {currentPhoto.tags.map((tag) => (
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
                    )}
                  </>
                );
              }
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
