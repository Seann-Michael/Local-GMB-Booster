import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { EnhancedBroadcastAlert } from "@/components/EnhancedBroadcastAlert";
import { FolderOpen, Plus, Search, Filter, X, RotateCcw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { VirtualProjectList } from "@/components/VirtualScroll";
import { ProjectGridSkeleton } from "@/components/SkeletonLoader";
import { useAnalytics } from "@/lib/analytics";
import { ThemeToggle } from "@/components/ThemeProvider";
import { mockDataService, MockProject } from "@/lib/mockData";

// Use MockProject interface from mockData
type Project = MockProject;

export default function Index() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const { track, trackPageView, trackFeatureUsage } = useAnalytics();
  const [projectSort, setProjectSort] = useState<
    "all" | "starred" | "my-projects" | "archived"
  >("all");
  const [cardSize, setCardSize] = useState<"small" | "medium" | "large">(
    "small",
  );
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
    assignedUser: "all",
    tags: "",
  });

  // Mock users for filtering
  const users = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "Mike Johnson" },
  ];

  // Redirect super admin users to super admin dashboard
  useEffect(() => {
    if (currentUser?.role === "superadmin" && !currentUser?.isImpersonated) {
      navigate("/super-admin", { replace: true });
      return;
    }

    // Track page view
    trackPageView();
    track("dashboard_loaded", {
      userRole: currentUser?.role,
      projectCount: projects.length,
    });
  }, [currentUser, navigate, trackPageView, track, projects.length]);

  useEffect(() => {
    // Load projects from mock data service
    try {
      const mockProjects = mockDataService.getProjects();
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to empty array
      setProjects([]);
      setFilteredProjects([]);
    }
    setIsLoading(false);
  }, []);

  const applyFilters = () => {
    let filtered = projects;

    // Project sort filter (applied first)
    switch (projectSort) {
      case "starred":
        filtered = filtered.filter((project) => project.starred === true);
        break;
      case "my-projects":
        filtered = filtered.filter(
          (project) => project.createdBy === currentUser?.id,
        );
        break;
      case "archived":
        filtered = filtered.filter((project) => project.archived === true);
        break;
      case "all":
      default:
        // Show all non-archived projects by default
        filtered = filtered.filter((project) => project.archived !== true);
        break;
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (project) =>
          new Date(project.startDate || project.createdAt) >=
          new Date(filters.startDate),
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (project) =>
          new Date(project.completionDate || project.createdAt) <=
          new Date(filters.endDate),
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (project) => (project.status || "active") === filters.status,
      );
    }

    // Assigned user filter
    if (filters.assignedUser !== "all") {
      filtered = filtered.filter((project) =>
        project.assignedUsers?.includes(filters.assignedUser),
      );
    }

    // Tags filter
    if (filters.tags.trim() !== "") {
      const searchTags = filters.tags
        .toLowerCase()
        .split(",")
        .map((t) => t.trim());
      filtered = filtered.filter((project) =>
        searchTags.some((tag) =>
          project.keywords.some((keyword) =>
            keyword.toLowerCase().includes(tag),
          ),
        ),
      );
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filters, projectSort]);

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "all",
      assignedUser: "all",
      tags: "",
    });
    setSearchQuery("");
  };

  const markProjectIncomplete = (projectId: string) => {
    mockDataService.updateProject(projectId, {
      status: "active",
      completedDate: undefined
    });
    const updatedProjects = mockDataService.getProjects();
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects.filter(p => !p.archived));
    toast.success("Project marked as incomplete");
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Broadcast Messages */}
        <EnhancedBroadcastAlert />

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Projects</h1>
          <div className="flex items-center justify-between">
            {/* Project Sort Buttons */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={projectSort === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setProjectSort("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={projectSort === "starred" ? "default" : "ghost"}
                size="sm"
                onClick={() => setProjectSort("starred")}
                className="text-xs"
              >
                Starred
              </Button>
              <Button
                variant={projectSort === "my-projects" ? "default" : "ghost"}
                size="sm"
                onClick={() => setProjectSort("my-projects")}
                className="text-xs"
              >
                My Projects
              </Button>
              <Button
                variant={projectSort === "archived" ? "default" : "ghost"}
                size="sm"
                onClick={() => setProjectSort("archived")}
                className="text-xs"
              >
                Archived
              </Button>
            </div>

            <div className="flex gap-2">
              {/* Card Size Controls */}
              <div className="flex border rounded-lg p-1 bg-muted/30">
                <Button
                  variant={cardSize === "small" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCardSize("small")}
                  className="px-3 h-8 text-xs"
                >
                  Small
                </Button>
                <Button
                  variant={cardSize === "medium" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCardSize("medium")}
                  className="px-3 h-8 text-xs"
                >
                  Medium
                </Button>
                <Button
                  variant={cardSize === "large" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCardSize("large")}
                  className="px-3 h-8 text-xs"
                >
                  Large
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filter Projects</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned User</Label>
                  <Select
                    value={filters.assignedUser}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, assignedUser: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="kitchen, bathroom..."
                    value={filters.tags}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, tags: e.target.value }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery.trim() ||
                Object.values(filters).some((v) => v !== "" && v !== "all")
                  ? "No projects match your search or filters."
                  : "Get started by creating your first project."}
              </p>
              <Link to="/admin/add-project">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile horizontal scroll layout */}
            <div className="block md:hidden">
              <div
                className="overflow-x-auto mobile-projects-scroll mobile-hide-scrollbar pb-4 -mx-4"
                style={{
                  overflowX: 'scroll',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                <div
                  className="flex gap-3 pl-4 pr-4"
                  style={{
                    width: `${Math.max(filteredProjects.length * 336, (typeof window !== 'undefined' ? window.innerWidth : 400) + 100)}px`,
                    minWidth: 'max-content'
                  }}
                >
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="w-80 flex-shrink-0">
                      <ProjectCard
                        project={project}
                        onDelete={() => {
                          mockDataService.deleteProject(project.id);
                          const updatedProjects = mockDataService.getProjects();
                          setProjects(updatedProjects);
                          setFilteredProjects(updatedProjects.filter(p => !p.archived));
                        }}
                        onMarkIncomplete={
                          project.status === "completed"
                            ? () => markProjectIncomplete(project.id)
                            : undefined
                        }
                        onToggleStar={(starred) => {
                          mockDataService.updateProject(project.id, { starred });
                          const updatedProjects = mockDataService.getProjects();
                          setProjects(updatedProjects);
                          setFilteredProjects(updatedProjects.filter(p => !p.archived));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop grid layout */}
            <div
              className={`hidden md:grid gap-4 auto-rows-fr ${
                cardSize === "small"
                  ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : cardSize === "medium"
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "md:grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex">
                  <ProjectCard
                    project={project}
                    onDelete={() => {
                      mockDataService.deleteProject(project.id);
                      const updatedProjects = mockDataService.getProjects();
                      setProjects(updatedProjects);
                      setFilteredProjects(updatedProjects.filter(p => !p.archived));
                    }}
                    onMarkIncomplete={
                      project.status === "completed"
                        ? () => markProjectIncomplete(project.id)
                        : undefined
                    }
                    onToggleStar={(starred) => {
                      mockDataService.updateProject(project.id, { starred });
                      const updatedProjects = mockDataService.getProjects();
                      setProjects(updatedProjects);
                      setFilteredProjects(updatedProjects.filter(p => !p.archived));
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
