import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  X,
  Upload,
  Tag,
  Info,
  Download,
  Zap,
  FileImage,
  Video,
  FileText,
  Settings,
  TrendingDown,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  MediaMetadataEnhancer,
  type EnhancedMediaFile,
  type ProjectInfo,
  type MediaMetadata,
} from "@/lib/mediaMetadata";
import {
  FileOptimizer,
  formatFileSize,
  calculateCompressionRatio,
  type OptimizedFile,
} from "@/lib/fileOptimization";
import { FileProcessingErrorBoundary } from "@/components/FileProcessingErrorBoundary";

interface OptimizedEnhancedPhoto {
  url: string;
  metadata: MediaMetadata;
  enhancedFileName: string;
  optimized: OptimizedFile;
  thumbnail?: string;
}

interface OptimizedPhotoCaptureProps {
  photos: OptimizedEnhancedPhoto[];
  onPhotosChange: (photos: OptimizedEnhancedPhoto[]) => void;
  projectInfo?: ProjectInfo;
}

interface OptimizationSettings {
  enableOptimization: boolean;
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: "auto" | "webp" | "jpeg" | "avif";
  generateThumbnails: boolean;
}

export function OptimizedPhotoCapture({
  photos,
  onPhotosChange,
  projectInfo,
}: OptimizedPhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalTags, setAdditionalTags] = useState("");
  const [showMetadataPreview, setShowMetadataPreview] = useState(false);
  const [showOptimizationSettings, setShowOptimizationSettings] =
    useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState("");

  const [optimizationSettings, setOptimizationSettings] =
    useState<OptimizationSettings>({
      enableOptimization: true,
      quality: 0.85,
      maxWidth: 1920,
      maxHeight: 1080,
      format: "auto",
      generateThumbnails: true,
    });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    if (!projectInfo) {
      toast.error("Project information is required for metadata enhancement");
      return;
    }

    // Check storage quota first
    const storageCheck = FileOptimizer.checkStorageQuota();
    if (!storageCheck.available) {
      toast.error(storageCheck.error || "Storage quota exceeded");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    const processedFiles: OptimizedEnhancedPhoto[] = [];
    const failedFiles: string[] = [];

    try {
      const tagArray = additionalTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const fileArray = Array.from(files);
      const totalFiles = fileArray.length;

      // Process files with proper error handling for each
      const results = await Promise.allSettled(
        fileArray.map(async (file, index) => {
          setCurrentlyProcessing(file.name);
          setProcessingProgress(((index + 1) / totalFiles) * 100);

          // Validate file first
          const validation = FileOptimizer.validateFile(file);
          if (!validation.valid) {
            throw new Error(`${file.name}: ${validation.error}`);
          }

          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            // First, enhance with metadata
            const enhancedFile = await MediaMetadataEnhancer.enhanceMediaFile(
              file,
              projectInfo,
              tagArray,
            );

            let optimizedFile: OptimizedFile;

            // Then optimize the file if enabled
            if (optimizationSettings.enableOptimization) {
              if (file.type.startsWith("image/")) {
                const format = optimizationSettings.format === "auto"
                  ? await FileOptimizer.detectOptimalImageFormat()
                  : optimizationSettings.format;

                optimizedFile = await FileOptimizer.optimizeImage(file, {
                  quality: optimizationSettings.quality,
                  maxWidth: optimizationSettings.maxWidth,
                  maxHeight: optimizationSettings.maxHeight,
                  format: format as any,
                  generateThumbnail: optimizationSettings.generateThumbnails,
                });
              } else if (file.type.startsWith("video/")) {
                optimizedFile = await FileOptimizer.optimizeVideo(file, {
                  maxWidth: optimizationSettings.maxWidth,
                  maxHeight: optimizationSettings.maxHeight,
                  generateThumbnail: optimizationSettings.generateThumbnails,
                  compressionLevel: "medium",
                });
              } else {
                optimizedFile = await FileOptimizer.optimizeDocument(file);
              }
            } else {
              // No optimization, just pass through
              optimizedFile = {
                original: file,
                optimized: new Blob([file], { type: file.type }),
                compressionRatio: 1,
                originalSize: file.size,
                optimizedSize: file.size,
                format: file.type,
                metadata: {},
              };
            }

            // Create data URL for display
            const optimizedUrl = URL.createObjectURL(optimizedFile.optimized);
            const thumbnailUrl = optimizedFile.thumbnail
              ? URL.createObjectURL(optimizedFile.thumbnail)
              : undefined;

            return {
              url: optimizedUrl,
              metadata: enhancedFile.metadata,
              enhancedFileName: enhancedFile.enhancedFileName,
              optimized: optimizedFile,
              thumbnail: thumbnailUrl,
            };
          }

          throw new Error(`${file.name}: Unsupported file type`);
        })
      );

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          processedFiles.push(result.value);
        } else {
          failedFiles.push(fileArray[index].name);
          console.error(`Failed to process ${fileArray[index].name}:`, result.reason);
        }
      });

      if (processedFiles.length > 0) {
        onPhotosChange([...photos, ...processedFiles]);

        // Calculate and show savings
        const totalSavings = FileOptimizer.getStorageSavings(
          processedFiles.map((p) => p.optimized),
        );

        const successMessage = `${processedFiles.length} file(s) processed. Saved ${formatFileSize(totalSavings.savings)} (${totalSavings.savingsPercentage.toFixed(1)}%)`;

        if (failedFiles.length > 0) {
          toast.warning(`${successMessage}. ${failedFiles.length} file(s) failed to process.`);
        } else {
          toast.success(successMessage);
        }

        setAdditionalTags("");
      } else if (failedFiles.length > 0) {
        toast.error(`Failed to process ${failedFiles.length} file(s). Check file sizes and formats.`);
      }
    } catch (error) {
      toast.error("Failed to process files");
      console.error("File processing error:", error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setCurrentlyProcessing("");
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const downloadOptimizedFile = (photo: OptimizedEnhancedPhoto) => {
    const url = URL.createObjectURL(photo.optimized.optimized);
    const a = document.createElement("a");
    a.href = url;
    a.download = photo.enhancedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Optimized file downloaded");
  };

  const downloadMetadata = (photo: OptimizedEnhancedPhoto) => {
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

  const totalOriginalSize = photos.reduce(
    (sum, photo) => sum + photo.optimized.originalSize,
    0,
  );
  const totalOptimizedSize = photos.reduce(
    (sum, photo) => sum + photo.optimized.optimizedSize,
    0,
  );
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const savingsPercentage = totalOriginalSize
    ? (totalSavings / totalOriginalSize) * 100
    : 0;

  return (
    <FileProcessingErrorBoundary>
      <div className="space-y-6">
      {/* Optimization Statistics */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{photos.length}</div>
              <div className="text-sm text-muted-foreground">Files</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {formatFileSize(totalOriginalSize)}
              </div>
              <div className="text-sm text-muted-foreground">Original Size</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(totalOptimizedSize)}
              </div>
              <div className="text-sm text-muted-foreground">
                Optimized Size
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {savingsPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Space Saved</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              File Optimization Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setShowOptimizationSettings(!showOptimizationSettings)
              }
            >
              <Settings className="h-4 w-4" />
              {showOptimizationSettings ? "Hide" : "Show"} Settings
            </Button>
          </div>
        </CardHeader>
        {showOptimizationSettings && (
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-optimization"
                checked={optimizationSettings.enableOptimization}
                onCheckedChange={(checked) =>
                  setOptimizationSettings((prev) => ({
                    ...prev,
                    enableOptimization: checked,
                  }))
                }
              />
              <Label htmlFor="enable-optimization">
                Enable file optimization
              </Label>
            </div>

            {optimizationSettings.enableOptimization && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quality (0.1 - 1.0)</Label>
                  <Input
                    type="number"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={optimizationSettings.quality}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        quality: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={optimizationSettings.format}
                    onValueChange={(value: any) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        format: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Best)</SelectItem>
                      <SelectItem value="avif">AVIF (Smallest)</SelectItem>
                      <SelectItem value="webp">WebP (Compatible)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Universal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Width (px)</Label>
                  <Select
                    value={optimizationSettings.maxWidth.toString()}
                    onValueChange={(value) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        maxWidth: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1280">1280px (HD)</SelectItem>
                      <SelectItem value="1920">1920px (Full HD)</SelectItem>
                      <SelectItem value="2560">2560px (2K)</SelectItem>
                      <SelectItem value="3840">3840px (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Height (px)</Label>
                  <Select
                    value={optimizationSettings.maxHeight.toString()}
                    onValueChange={(value) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        maxHeight: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720">720px (HD)</SelectItem>
                      <SelectItem value="1080">1080px (Full HD)</SelectItem>
                      <SelectItem value="1440">1440px (2K)</SelectItem>
                      <SelectItem value="2160">2160px (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

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
            {isProcessing ? "Processing Files..." : "Add Optimized Media Files"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {isProcessing
              ? `Processing: ${currentlyProcessing}`
              : "Drag and drop media files here, or click to select files"}
          </p>

          {isProcessing && (
            <div className="w-full max-w-xs space-y-2">
              <Progress value={processingProgress} />
              <p className="text-xs text-center text-muted-foreground">
                {processingProgress.toFixed(0)}% complete
              </p>
            </div>
          )}

          {!isProcessing && (
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Choose Files
            </Button>
          )}
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

      {/* Enhanced Photo Grid with Optimization Info */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Optimized Media ({photos.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetadataPreview(!showMetadataPreview)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              {showMetadataPreview ? "Hide" : "Show"} Details
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
                      src={photo.thumbnail || photo.url}
                      alt={`Photo ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  )}

                  {/* Compression badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white text-xs"
                    >
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {calculateCompressionRatio(
                        photo.optimized.originalSize,
                        photo.optimized.optimizedSize,
                      )}
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => downloadOptimizedFile(photo)}
                      title="Download optimized file"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => downloadMetadata(photo)}
                      title="Download metadata"
                    >
                      <FileText className="h-3 w-3" />
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

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Original:</span>{" "}
                          {formatFileSize(photo.optimized.originalSize)}
                        </div>
                        <div>
                          <span className="font-medium">Optimized:</span>{" "}
                          {formatFileSize(photo.optimized.optimizedSize)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {photo.metadata.keywords.slice(0, 3).map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {photo.metadata.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{photo.metadata.keywords.length - 3}
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