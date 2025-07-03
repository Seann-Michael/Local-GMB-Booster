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
import { FolderOpen, Plus, Search, Filter, X, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

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
}

export default function Index() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showFilters, setShowFilters] = useState(false);
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
          keywords: ["kitchen", "renovation", "cabinets", "countertops"],
          photos: ["/placeholder.svg"],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "demo-2",
          name: "Bathroom Upgrade",
          description:
            "Modern bathroom renovation with walk-in shower and new fixtures",
          address: "456 Oak Avenue, Somewhere, USA",
          keywords: ["bathroom", "shower", "fixtures", "modern"],
          photos: ["/placeholder.svg"],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setProjects(demoProjects);
      setFilteredProjects(demoProjects);
      localStorage.setItem("projects", JSON.stringify(demoProjects));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
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
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground">
                Manage and organize your job site photos
              </p>
            </div>
            <Link to="/add-project" className="sm:hidden">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add New Project
              </Button>
            </Link>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {searchQuery ? "No projects found" : "No projects yet"}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground text-center max-w-sm">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Create your first project to start organizing your job site photos"}
                </p>
                {!searchQuery && (
                  <Link to="/add-project">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Project
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Company Gallery Section */}
          {filteredProjects.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Recent Photos</h2>
                  <p className="text-muted-foreground">
                    Latest photos from all projects
                  </p>
                </div>
                <Link to="/gallery">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4">
                {projects
                  .slice(0, 10)
                  .map((project) =>
                    project.photos
                      .map((photo, photoIndex) => {
                        const photoUrl =
                          typeof photo === "string" ? photo : photo.url;
                        return (
                          <Link
                            key={`${project.id}-${photoIndex}`}
                            to={`/project/${project.id}`}
                            className="flex-shrink-0"
                          >
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted hover:shadow-lg transition-shadow">
                              <img
                                src={photoUrl}
                                alt={`Photo from ${project.name}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate w-32">
                              {project.name}
                            </p>
                          </Link>
                        );
                      })
                      .slice(0, 1),
                  )
                  .slice(0, 8)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
