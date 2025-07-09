import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoCapture } from "@/components/PhotoCapture";
import { MediaViewer } from "@/components/MediaViewer";
import { Plus, Upload, Download, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProjectInfo } from "@/lib/mediaMetadata";

interface EnhancedPhoto {
  url: string;
  metadata?: any;
  enhancedFileName?: string;
  tags?: string[];
  uploadedAt?: string;
  uploadedBy?: string;
  isPrimary?: boolean;
}

interface MediaUploadManagerProps {
  projectInfo: ProjectInfo;
  photos: EnhancedPhoto[];
  onPhotosUpdate: (photos: EnhancedPhoto[]) => void;
  isEditing?: boolean;
}

export function MediaUploadManager({
  projectInfo,
  photos,
  onPhotosUpdate,
  isEditing = false,
}: MediaUploadManagerProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const handlePhotosChange = (newPhotos: EnhancedPhoto[]) => {
    onPhotosUpdate(newPhotos);
    toast.success(
      `${newPhotos.length - photos.length} file(s) added with enhanced metadata`,
    );
  };

  const downloadAllMetadata = () => {
    const allMetadata = photos.map((photo, index) => ({
      index: index + 1,
      fileName: photo.enhancedFileName || `photo_${index + 1}`,
      metadata: photo.metadata || {
        uploadedAt: photo.uploadedAt,
        uploadedBy: photo.uploadedBy,
        tags: photo.tags,
        isPrimary: photo.isPrimary,
      },
    }));

    const blob = new Blob([JSON.stringify(allMetadata, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectInfo.name}_all_media_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("All metadata downloaded");
  };

  const enhancedPhotosCount = photos.filter((p) => p.metadata).length;
  const legacyPhotosCount = photos.length - enhancedPhotosCount;

  return (
    <div className="space-y-6">
      {/* Media Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{photos.length}</div>
            <div className="text-sm text-muted-foreground">
              Total Media Files
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {enhancedPhotosCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Enhanced with Metadata
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {legacyPhotosCount}
            </div>
            <div className="text-sm text-muted-foreground">Legacy Photos</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {isEditing && (
          <Button
            onClick={() => setShowUploader(!showUploader)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showUploader ? "Hide" : "Add"} Media Files
          </Button>
        )}

        {photos.length > 0 && (
          <Button
            variant="outline"
            onClick={downloadAllMetadata}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download All Metadata
          </Button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="secondary" className="gap-1">
            <Info className="h-3 w-3" />
            Metadata-Enhanced Gallery
          </Badge>
        </div>
      </div>

      {/* Photo Uploader */}
      {showUploader && isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Media with Enhanced Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoCapture
              photos={[]}
              onPhotosChange={(newPhotos) => {
                handlePhotosChange([...photos, ...newPhotos]);
                setShowUploader(false);
              }}
              projectInfo={projectInfo}
            />
          </CardContent>
        </Card>
      )}

      {/* Media Viewer */}
      {photos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Project Media Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaViewer
              photos={photos}
              selectedPhoto={selectedPhoto}
              onPhotoSelect={setSelectedPhoto}
              projectName={projectInfo.name}
              showMetadata={true}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No media files yet</h3>
            <p className="text-muted-foreground mb-6">
              Start adding photos and videos with enhanced metadata to document
              your project progress
            </p>
            {isEditing && (
              <Button onClick={() => setShowUploader(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Media File
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
