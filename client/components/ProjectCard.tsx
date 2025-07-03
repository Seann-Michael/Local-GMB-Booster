import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Images } from "lucide-react";
import { Link } from "react-router-dom";

interface TaggedPhoto {
  url: string;
  tags: string[];
  uploadedAt: string;
  uploadedBy: string;
  isPrimary?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  customerPhone: string;
  keywords: string[];
  photos: TaggedPhoto[] | string[];
  documents?: any[];
  tasks?: any[];
  checklist?: any[];
  primaryPhotoId?: string;
  createdAt: string;
  updatedAt?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getPrimaryPhoto = () => {
    if (project.photos.length === 0) return null;

    // Find primary photo or use first photo
    const primaryPhoto = project.photos.find(
      (photo: any) => typeof photo === "object" && photo.isPrimary,
    );

    if (primaryPhoto && typeof primaryPhoto === "object") {
      return primaryPhoto;
    }

    // Return first photo
    const firstPhoto = project.photos[0];
    return typeof firstPhoto === "string"
      ? {
          url: firstPhoto,
          uploadedAt: project.createdAt,
          uploadedBy: "Unknown",
        }
      : firstPhoto;
  };

  const getPhotoUrl = (photo: any) => {
    return typeof photo === "string" ? photo : photo?.url;
  };

  const primaryPhoto = getPrimaryPhoto();

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {primaryPhoto ? (
            <>
              <img
                src={getPhotoUrl(primaryPhoto)}
                alt={project.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              {/* Photo metadata overlay */}
              <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                {typeof primaryPhoto === "object" &&
                  primaryPhoto.uploadedAt && (
                    <div className="rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                      {new Date(primaryPhoto.uploadedAt).toLocaleDateString()}
                    </div>
                  )}
                {typeof primaryPhoto === "object" &&
                  primaryPhoto.uploadedBy && (
                    <div className="rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                      By {primaryPhoto.uploadedBy}
                    </div>
                  )}
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Images className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          {project.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
              <Images className="h-3 w-3" />
              {project.photos.length}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{project.address}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <CalendarDays className="h-4 w-4" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>

          {project.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.keywords.slice(0, 3).map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {project.keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.keywords.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
