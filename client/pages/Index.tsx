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
import { BroadcastAlert } from "@/components/BroadcastAlert";
import { FolderOpen, Plus, Search, Filter, X, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

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
  status?: string;
  completedDate?: string;
  startDate?: string;
  completionDate?: string;
  assignedUsers?: string[];
  starred?: boolean;
  archived?: boolean;
  createdBy?: string;
}

export default function Index() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [projectSort, setProjectSort] = useState<
    "all" | "starred" | "my-projects" | "archived"
  >("all");
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
  }, [currentUser, navigate]);

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);
      setFilteredProjects(parsedProjects);
    } else {
      // Add some demo projects for first time users
      const demoProjects: Project[] = [
        {
          id: "demo-1",
          name: "Kitchen Renovation",
          description:
            "Complete kitchen remodel with new cabinets, countertops, and appliances",
          address: "123 Main Street, Anytown, USA",
          customerPhone: "(555) 123-4567",
          keywords: ["kitchen", "renovation", "cabinets", "countertops"],
          photos: ["/placeholder.svg"],
          documents: [],
          tasks: [],
          checklist: [],
          notes: [],
          activityLog: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          status: "active",
          assignedUsers: ["1"],
          starred: true,
          archived: false,
          createdBy: currentUser?.id || "1",
        },
        {
          id: "demo-2",
          name: "Bathroom Upgrade",
          description:
            "Modern bathroom renovation with walk-in shower and new fixtures",
          address: "456 Oak Avenue, Somewhere, USA",
          customerPhone: "(555) 987-6543",
          keywords: ["bathroom", "shower", "fixtures", "modern"],
          photos: ["/placeholder.svg"],
          documents: [],
          tasks: [],
          checklist: [],
          notes: [],
          activityLog: [],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
          completedDate: new Date(Date.now() - 86400000).toISOString(),
          assignedUsers: ["2"],
          starred: false,
          archived: false,
          createdBy: "2",
        },
      ];
      setProjects(demoProjects);
      setFilteredProjects(demoProjects);
      localStorage.setItem("projects", JSON.stringify(demoProjects));
    }
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
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? { ...project, status: "active", completedDate: undefined }
        : project,
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project marked as incomplete");
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Broadcast Messages */}
        <BroadcastAlert />

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex">
                <ProjectCard
                  project={project}
                  onDelete={() => {
                    const updatedProjects = projects.filter(
                      (p) => p.id !== project.id,
                    );
                    setProjects(updatedProjects);
                    localStorage.setItem(
                      "projects",
                      JSON.stringify(updatedProjects),
                    );
                  }}
                  onMarkIncomplete={
                    project.status === "completed"
                      ? () => markProjectIncomplete(project.id)
                      : undefined
                  }
                  onToggleStar={(starred) => {
                    const updatedProjects = projects.map((p) =>
                      p.id === project.id ? { ...p, starred } : p,
                    );
                    setProjects(updatedProjects);
                    localStorage.setItem(
                      "projects",
                      JSON.stringify(updatedProjects),
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
