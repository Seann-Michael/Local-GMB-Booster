import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Archive,
  HardDrive,
  TrendingDown,
  Clock,
  FolderArchive,
  Download,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FileOptimizer,
  formatFileSize,
  calculateCompressionRatio,
  type OptimizedFile,
} from "@/lib/fileOptimization";

interface ProjectArchiveData {
  id: string;
  name: string;
  createdAt: string;
  lastUpdated: string;
  fileCount: number;
  totalSize: number;
  archived: boolean;
  archiveDate?: string;
  compressionLevel?: "standard" | "aggressive";
}

interface ArchiveSettings {
  compressionLevel: "standard" | "aggressive";
  generateThumbnailsOnly: boolean;
  removeOriginals: boolean;
  autoArchiveAfterDays: number;
  minProjectAgeForArchive: number;
}

export function ArchiveManager() {
  const [projects, setProjects] = useState<ProjectArchiveData[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(),
  );
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [archiveSettings, setArchiveSettings] = useState<ArchiveSettings>({
    compressionLevel: "standard",
    generateThumbnailsOnly: false,
    removeOriginals: false,
    autoArchiveAfterDays: 90,
    minProjectAgeForArchive: 30,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const projectsData = JSON.parse(localStorage.getItem("projects") || "[]");
    const archiveData: ProjectArchiveData[] = projectsData.map(
      (project: any) => {
        const fileCount =
          (project.photos?.length || 0) + (project.documents?.length || 0);

        // Estimate total size (in real app, this would be stored)
        const estimatedSize = fileCount * 2 * 1024 * 1024; // 2MB per file average

        return {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
          lastUpdated: project.updatedAt || project.createdAt,
          fileCount,
          totalSize: estimatedSize,
          archived: project.archived || false,
          archiveDate: project.archiveDate,
          compressionLevel: project.compressionLevel,
        };
      },
    );

    setProjects(archiveData);
  };

  const getProjectAge = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getArchiveCandidates = (): ProjectArchiveData[] => {
    return projects.filter(
      (project) =>
        !project.archived &&
        getProjectAge(project.createdAt) >=
          archiveSettings.minProjectAgeForArchive,
    );
  };

  const getStorageStats = () => {
    const totalSize = projects.reduce(
      (sum, project) => sum + project.totalSize,
      0,
    );
    const archivedSize = projects
      .filter((p) => p.archived)
      .reduce((sum, project) => sum + project.totalSize, 0);
    const unarchivedSize = totalSize - archivedSize;

    // Estimate potential savings with compression
    const compressionRatio =
      archiveSettings.compressionLevel === "aggressive" ? 0.4 : 0.6;
    const potentialSavings = unarchivedSize * (1 - compressionRatio);

    return {
      totalSize,
      archivedSize,
      unarchivedSize,
      potentialSavings,
    };
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
  };

  const selectAllCandidates = () => {
    const candidates = getArchiveCandidates();
    setSelectedProjects(new Set(candidates.map((p) => p.id)));
  };

  const clearSelection = () => {
    setSelectedProjects(new Set());
  };

  const archiveSelectedProjects = async () => {
    if (selectedProjects.size === 0) {
      toast.error("No projects selected for archiving");
      return;
    }

    setIsArchiving(true);
    setArchiveProgress(0);

    try {
      const projectsToArchive = projects.filter((p) =>
        selectedProjects.has(p.id),
      );
      const totalProjects = projectsToArchive.length;

      for (let i = 0; i < projectsToArchive.length; i++) {
        const project = projectsToArchive[i];
        setCurrentlyProcessing(project.name);

        // In a real implementation with server-side storage, you would:
        // 1. Fetch all project files from storage
        // 2. Optimize them using FileOptimizer.archiveProjectFiles
        // 3. Store optimized versions and remove originals
        // 4. Update project metadata

        // For demo with localStorage, we'll simulate the process
        // and update the project's archive status
        try {
          const projectData = JSON.parse(
            localStorage.getItem("projects") || "[]",
          ).find((p: any) => p.id === project.id);

          if (projectData && projectData.photos) {
            // Simulate file optimization process
            console.log(
              `Archiving ${projectData.photos.length} files for project ${project.name}`,
            );

            // In a real implementation, you would optimize each file:
            // const optimizedFiles = await FileOptimizer.archiveProjectFiles(
            //   projectData.photos.map(photo => photo.file),
            //   {
            //     compressionLevel: archiveSettings.compressionLevel,
            //     generateThumbnailsOnly: archiveSettings.generateThumbnailsOnly,
            //     removeOriginals: archiveSettings.removeOriginals,
            //     archiveDate: new Date().toISOString(),
            //   }
            // );
          }

          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (error) {
          console.error(`Failed to archive project ${project.name}:`, error);
          throw error;
        }

        // Update project as archived
        const updatedProjects = projects.map((p) =>
          p.id === project.id
            ? {
                ...p,
                archived: true,
                archiveDate: new Date().toISOString(),
                compressionLevel: archiveSettings.compressionLevel,
              }
            : p,
        );

        // Save to localStorage
        const originalProjects = JSON.parse(
          localStorage.getItem("projects") || "[]",
        );
        const updatedOriginalProjects = originalProjects.map((p: any) =>
          p.id === project.id
            ? {
                ...p,
                archived: true,
                archiveDate: new Date().toISOString(),
                compressionLevel: archiveSettings.compressionLevel,
              }
            : p,
        );

        localStorage.setItem(
          "projects",
          JSON.stringify(updatedOriginalProjects),
        );

        setProjects(updatedProjects);
        setArchiveProgress(((i + 1) / totalProjects) * 100);
      }

      toast.success(
        `Successfully archived ${selectedProjects.size} project(s)`,
      );
      setSelectedProjects(new Set());
    } catch (error) {
      toast.error("Failed to archive projects");
      console.error("Archive error:", error);
    } finally {
      setIsArchiving(false);
      setArchiveProgress(0);
      setCurrentlyProcessing("");
    }
  };

  const restoreProject = async (projectId: string) => {
    const updatedProjects = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            archived: false,
            archiveDate: undefined,
            compressionLevel: undefined,
          }
        : p,
    );

    // Update localStorage
    const originalProjects = JSON.parse(
      localStorage.getItem("projects") || "[]",
    );
    const updatedOriginalProjects = originalProjects.map((p: any) =>
      p.id === projectId
        ? {
            ...p,
            archived: false,
            archiveDate: undefined,
            compressionLevel: undefined,
          }
        : p,
    );

    localStorage.setItem("projects", JSON.stringify(updatedOriginalProjects));
    setProjects(updatedProjects);
    toast.success("Project restored from archive");
  };

  const stats = getStorageStats();
  const archiveCandidates = getArchiveCandidates();

  return (
    <div className="space-y-6">
      {/* Storage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Storage
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatFileSize(stats.archivedSize)}
                </div>
                <div className="text-sm text-muted-foreground">Archived</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatFileSize(stats.unarchivedSize)}
                </div>
                <div className="text-sm text-muted-foreground">Unarchived</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(stats.potentialSavings)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Potential Savings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archive Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Archive Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide" : "Show"} Settings
            </Button>
          </div>
        </CardHeader>
        {showSettings && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Compression Level</Label>
                <Select
                  value={archiveSettings.compressionLevel}
                  onValueChange={(value: "standard" | "aggressive") =>
                    setArchiveSettings((prev) => ({
                      ...prev,
                      compressionLevel: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (Better Quality)
                    </SelectItem>
                    <SelectItem value="aggressive">
                      Aggressive (Smaller Size)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Project Age (days)</Label>
                <Select
                  value={archiveSettings.minProjectAgeForArchive.toString()}
                  onValueChange={(value) =>
                    setArchiveSettings((prev) => ({
                      ...prev,
                      minProjectAgeForArchive: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="thumbnail-only"
                checked={archiveSettings.generateThumbnailsOnly}
                onCheckedChange={(checked) =>
                  setArchiveSettings((prev) => ({
                    ...prev,
                    generateThumbnailsOnly: checked,
                  }))
                }
              />
              <Label htmlFor="thumbnail-only">
                Archive as thumbnails only (maximum compression)
              </Label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Archive Candidates */}
      {archiveCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Archive Candidates ({archiveCandidates.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={selectAllCandidates}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={clearSelection}>
                Clear Selection
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {archiveCandidates.map((project) => (
                <div
                  key={project.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProjects.has(project.id)
                      ? "bg-primary/5 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleProjectSelection(project.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProjects.has(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="rounded"
                    />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getProjectAge(project.createdAt)} days old •{" "}
                        {project.fileCount} files •{" "}
                        {formatFileSize(project.totalSize)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getProjectAge(project.createdAt)} days
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archive Controls */}
      {selectedProjects.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {selectedProjects.size} project(s) selected for archiving
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated savings:{" "}
                  {formatFileSize(
                    projects
                      .filter((p) => selectedProjects.has(p.id))
                      .reduce((sum, p) => sum + p.totalSize, 0) *
                      (archiveSettings.compressionLevel === "aggressive"
                        ? 0.6
                        : 0.4),
                  )}
                </div>
              </div>
              <Button
                onClick={archiveSelectedProjects}
                disabled={isArchiving}
                className="gap-2"
              >
                <Archive className="h-4 w-4" />
                {isArchiving ? "Archiving..." : "Archive Selected"}
              </Button>
            </div>

            {isArchiving && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing: {currentlyProcessing}</span>
                  <span>{archiveProgress.toFixed(0)}%</span>
                </div>
                <Progress value={archiveProgress} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Archived Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderArchive className="h-5 w-5" />
            Archived Projects ({projects.filter((p) => p.archived).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {projects
              .filter((p) => p.archived)
              .map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Archive className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Archived{" "}
                        {project.archiveDate &&
                          new Date(
                            project.archiveDate,
                          ).toLocaleDateString()}{" "}
                        • {project.fileCount} files •{" "}
                        {formatFileSize(project.totalSize)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {project.compressionLevel || "standard"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreProject(project.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}

            {projects.filter((p) => p.archived).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No archived projects yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
