import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, X, Upload, Tag, Info, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  MediaMetadataEnhancer,
  type EnhancedMediaFile,
  type ProjectInfo,
  type MediaMetadata,
} from "@/lib/mediaMetadata";

interface EnhancedPhoto {
  url: string;
  metadata: MediaMetadata;
  enhancedFileName: string;
}

interface PhotoCaptureProps {
  photos: EnhancedPhoto[];
  onPhotosChange: (photos: EnhancedPhoto[]) => void;
  projectInfo?: ProjectInfo;
}

export function PhotoCapture({
  photos,
  onPhotosChange,
  projectInfo,
}: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalTags, setAdditionalTags] = useState("");
  const [showMetadataPreview, setShowMetadataPreview] = useState(false);
  const objectUrls = useRef<Set<string>>(new Set());

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectUrls.current.clear();
    };
  }, []);

  const createObjectUrl = (blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    objectUrls.current.add(url);
    return url;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    if (!projectInfo) {
      toast.error("Project information is required for metadata enhancement");
      return;
    }

    setIsProcessing(true);

    try {
      const newPhotos: EnhancedPhoto[] = [];
      const tagArray = additionalTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          const enhancedFile = await MediaMetadataEnhancer.enhanceMediaFile(
            file,
            projectInfo,
            tagArray,
          );

          newPhotos.push({
            url: enhancedFile.dataUrl,
            metadata: enhancedFile.metadata,
            enhancedFileName: enhancedFile.enhancedFileName,
          });
        }
      }

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos]);
        toast.success(
          `${newPhotos.length} file(s) processed with enhanced metadata`,
        );
        setAdditionalTags("");
      }
    } catch (error) {
      toast.error("Failed to process files with metadata");
      console.error("Metadata enhancement error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const downloadMetadata = (photo: EnhancedPhoto) => {
    const metadataBlob = MediaMetadataEnhancer.generateMetadataFile(
      photo.metadata,
    );
    const url = URL.createObjectURL(metadataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${photo.enhancedFileName}_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Metadata file downloaded");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Metadata Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Media Metadata Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additional-tags">
              Additional Tags (comma-separated)
            </Label>
            <Input
              id="additional-tags"
              placeholder="e.g., before, bathroom, renovation"
              value={additionalTags}
              onChange={(e) => setAdditionalTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              These tags will be added to all uploaded files along with project
              keywords
            </p>
          </div>

          {projectInfo && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Auto-generated Metadata</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Business:</span>{" "}
                  {MediaMetadataEnhancer.getBusinessInfo().businessName}
                </div>
                <div>
                  <span className="font-medium">Project Location:</span>{" "}
                  {MediaMetadataEnhancer.extractCityStateFromAddress(
                    projectInfo.address,
                  )}
                </div>
                <div>
                  <span className="font-medium">Project:</span>{" "}
                  {projectInfo.name}
                </div>
                <div>
                  <span className="font-medium">Customer:</span>{" "}
                  {projectInfo.customerName}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isProcessing ? "Processing Files..." : "Add Photos & Videos"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {isProcessing
              ? "Adding metadata and processing files"
              : "Drag and drop media files here, or click to select files"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isProcessing}
            >
              <Upload className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Choose Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Enhanced Photo Grid with Metadata */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Uploaded Media ({photos.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetadataPreview(!showMetadataPreview)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              {showMetadataPreview ? "Hide" : "Show"} Metadata
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative group">
                  {photo.metadata.fileType.startsWith("video/") ? (
                    <video
                      src={photo.url}
                      className="aspect-square w-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => downloadMetadata(photo)}
                      title="Download metadata"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {showMetadataPreview && (
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        {photo.enhancedFileName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {photo.metadata.keywords.slice(0, 4).map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {photo.metadata.keywords.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{photo.metadata.keywords.length - 4}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(
                          photo.metadata.timestamp,
                        ).toLocaleDateString()}{" "}
                        • {photo.metadata.cityState}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
