import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, X, Upload, Tag, Info, Download } from "lucide-react";
import { useRef, useState } from "react";
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
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Add Photos</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop photos here, or click to select files
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
