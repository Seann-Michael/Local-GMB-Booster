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
  Share,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaMetadataEnhancer, type MediaMetadata } from "@/lib/mediaMetadata";
import { 
  SecureMediaUrlGenerator, 
  MediaUrlUtils, 
  type SecureMediaFile 
} from "@/lib/secureMediaUrls";

interface EnhancedPhoto {
  url: string;
  secureUrl?: string;
  publicUrl?: string;
  thumbnailUrl?: string;
  metadata?: MediaMetadata;
  enhancedFileName?: string;
  // Legacy support
  tags?: string[];
  uploadedAt?: string;
  uploadedBy?: string;
  isPrimary?: boolean;
  // New secure media properties
  secureMediaFile?: SecureMediaFile;
}

interface EnhancedMediaViewerProps {
  photos: EnhancedPhoto[];
  selectedPhoto: string | null;
  onPhotoSelect: (url: string | null) => void;
  projectName?: string;
  projectId?: string;
  showMetadata?: boolean;
  allowPublicSharing?: boolean;
  context?: 'project' | 'gallery' | 'public';
}

export function EnhancedMediaViewer({
  photos,
  selectedPhoto,
  onPhotoSelect,
  projectName = "Project",
  projectId,
  showMetadata = true,
  allowPublicSharing = true,
  context = 'project'
}: EnhancedMediaViewerProps) {
  const [showMetadataPanel, setShowMetadataPanel] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState<string | null>(null);

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

  const downloadPhoto = (photo: EnhancedPhoto) => {
    if (photo.secureMediaFile) {
      // Use secure download URL
      const downloadUrl = MediaUrlUtils.generateDownloadUrl(photo.secureMediaFile);
      window.open(downloadUrl, '_blank');
    } else {
      // Fallback to direct URL
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = photo.enhancedFileName || 'photo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("Download started");
  };

  const sharePhoto = (photo: EnhancedPhoto) => {
    setShareModalOpen(photo.url);
  };

  const copyPublicUrl = (photo: EnhancedPhoto) => {
    let urlToCopy = photo.url;
    
    if (photo.secureMediaFile) {
      urlToCopy = MediaUrlUtils.getDisplayUrl(photo.secureMediaFile, 'public');
    } else if (photo.publicUrl) {
      urlToCopy = photo.publicUrl;
    }

    // Make URL absolute
    const absoluteUrl = new URL(urlToCopy, window.location.origin).toString();
    
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      toast.success("Public URL copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy URL");
    });
  };

  const generateRSSUrl = (photo: EnhancedPhoto) => {
    if (photo.secureMediaFile) {
      const rssUrl = MediaUrlUtils.getDisplayUrl(photo.secureMediaFile, 'rss');
      const absoluteUrl = new URL(rssUrl, window.location.origin).toString();
      
      navigator.clipboard.writeText(absoluteUrl).then(() => {
        toast.success("RSS-compatible URL copied to clipboard");
      }).catch(() => {
        toast.error("Failed to copy RSS URL");
      });
    } else {
      toast.error("RSS URL not available for this photo");
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

  const getDisplayUrl = (photo: EnhancedPhoto): string => {
    if (photo.secureMediaFile) {
      return MediaUrlUtils.getDisplayUrl(photo.secureMediaFile, context === 'public' ? 'public' : 'internal');
    }
    return photo.url;
  };

  const getThumbnailUrl = (photo: EnhancedPhoto): string => {
    if (photo.secureMediaFile) {
      return MediaUrlUtils.getThumbnailUrl(photo.secureMediaFile, 'medium');
    }
    return photo.thumbnailUrl || photo.url;
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setFailedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageError = (index: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setFailedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const handleImageLoadStart = (index: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
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
              onClick={() => onPhotoSelect(getDisplayUrl(photo))}
            >
              {/* Loading State */}
              {loadingImages.has(index) && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">Loading...</div>
                </div>
              )}

              {/* Error State */}
              {failedImages.has(index) && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-4">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-xs">Image unavailable</div>
                  </div>
                </div>
              )}

              {/* Media Content */}
              {!failedImages.has(index) && (
                <>
                  {getFileType(photo.url) === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        src={getDisplayUrl(photo)}
                        className="w-full h-full object-cover"
                        muted
                        onLoadStart={() => handleImageLoadStart(index)}
                        onLoadedData={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getThumbnailUrl(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoadStart={() => handleImageLoadStart(index)}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                </>
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
                {photo.secureMediaFile && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-500 text-white"
                  >
                    Secure
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
                    onPhotoSelect(getDisplayUrl(photo));
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              )}
              
              {allowPublicSharing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    sharePhoto(photo);
                  }}
                >
                  <Share className="h-3 w-3" />
                </Button>
              )}

              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPhoto(photo);
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

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Share Media
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShareModalOpen(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const photo = photos.find(p => getDisplayUrl(p) === shareModalOpen);
                return photo && (
                  <>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => copyPublicUrl(photo)}
                      >
                        <Copy className="h-4 w-4" />
                        Copy Public URL
                      </Button>
                      
                      {photo.secureMediaFile && (
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => generateRSSUrl(photo)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Copy RSS URL (30 days)
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => downloadPhotoMetadata(photo)}
                      >
                        <FileText className="h-4 w-4" />
                        Download Metadata
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
                      <strong>Public URLs</strong> can be shared freely and are optimized for RSS feeds and external integrations.
                      <br />
                      <strong>RSS URLs</strong> include expiration and are perfect for temporary sharing.
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
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
              const currentPhoto = photos.find((p) => getDisplayUrl(p) === selectedPhoto);
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
                        {currentPhoto.secureMediaFile && (
                          <div className="text-green-600">
                            ✓ Secure URLs enabled
                          </div>
                        )}
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
