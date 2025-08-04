import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  MapPin,
  Images,
  MoreVertical,
  RotateCcw,
  CheckCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { MockProject } from "@/lib/mockData";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// Use MockProject interface for consistency
type Project = MockProject;

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
  onMarkIncomplete?: () => void;
  onToggleStar?: (starred: boolean) => void;
}

export function ProjectCard({
  project,
  onDelete,
  onMarkIncomplete,
  onToggleStar,
}: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(project.starred || false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStarred = !isStarred;
    setIsStarred(newStarred);
    onToggleStar?.(newStarred);
    toast.success(newStarred ? "Project starred" : "Project unstarred");
  };
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
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
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

          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-2 left-2">
              <Badge
                variant={
                  project.status === "completed"
                    ? "default"
                    : project.status === "active"
                      ? "secondary"
                      : "outline"
                }
                className="flex items-center gap-1"
              >
                {project.status === "completed" && (
                  <CheckCircle className="h-3 w-3" />
                )}
                {project.status}
              </Badge>
            </div>
          )}

          {/* Star and Actions */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {/* Star Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 bg-black/50 hover:bg-black/70 text-white min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]"
              onClick={handleStarClick}
            >
              <Star
                className={`h-4 w-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
            </Button>

            {/* Actions Menu */}
            {(onDelete || onMarkIncomplete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 sm:h-8 sm:w-8 p-0 bg-black/50 hover:bg-black/70 text-white min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {onMarkIncomplete && (
                    <DropdownMenuItem onClick={onMarkIncomplete}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Mark Incomplete
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive"
                    >
                      Delete Project
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2 leading-tight">
              {project.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2 min-h-[2rem] leading-tight">
              {project.description || "No description available"}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 sm:mb-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1 leading-tight">
                {project.address || "No address provided"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <CalendarDays className="h-3 w-3 flex-shrink-0" />
              <span className="leading-tight">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <div className="flex flex-wrap gap-1 w-full">
              {project.keywords && project.keywords.length > 0 ? (
                <>
                  {project.keywords.slice(0, 2).map((keyword, index) => (
                    <Badge
                      key={`${keyword}-${index}`}
                      variant="secondary"
                      className="text-xs h-5 px-1.5 flex items-center leading-none"
                    >
                      {keyword}
                    </Badge>
                  ))}
                  {project.keywords.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 px-1.5 flex items-center leading-none"
                    >
                      +{project.keywords.length - 2}
                    </Badge>
                  )}
                </>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs h-5 px-1.5 flex items-center opacity-50 leading-none"
                >
                  No keywords
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
