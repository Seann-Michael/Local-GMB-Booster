import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import {
  ArrowLeft,
  Images,
  User,
  Calendar,
  MapPin,
  Download,
  Star,
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
}

export default function Gallery() {
  const [photos, setPhotos] = useState<PhotoWithMetadata[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const allPhotos: PhotoWithMetadata[] = [];

    projects.forEach((project: any) => {
      if (project.photos && project.photos.length > 0) {
        project.photos.forEach((photo: any) => {
          const photoUrl = typeof photo === "string" ? photo : photo.url;
          const photoData = typeof photo === "string" ? {} : photo;

          allPhotos.push({
            url: photoUrl,
            projectId: project.id,
            projectName: project.name,
            projectAddress: project.address,
            uploadedAt: photoData.uploadedAt || project.createdAt,
            uploadedBy: photoData.uploadedBy || "Unknown User",
            tags: photoData.tags || [],
            isPrimary: photoData.isPrimary || false,
          });
        });
      }
    });

    // Sort by most recent first
    allPhotos.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
    setPhotos(allPhotos);
  }, []);

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
            <h1 className="text-2xl font-bold">Photo Gallery</h1>
            <p className="text-muted-foreground">
              Recent photos from all projects
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {photos.length} photos
          </div>
        </div>

        {photos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
              <p className="text-muted-foreground mb-6">
                Start adding photos to your projects to see them here
              </p>
              <Link to="/add-project">
                <Button>Create First Project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="aspect-square relative cursor-pointer group"
                  onClick={() => setSelectedPhoto(photo.url)}
                >
                  <img
                    src={photo.url}
                    alt={`Photo from ${photo.projectName}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo.url, photo.projectName, index);
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <Link
                    to={`/project/${photo.projectId}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {photo.projectName}
                    </h3>
                  </Link>

                  <div className="space-y-2 text-xs text-muted-foreground">
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
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
}
