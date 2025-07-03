import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { FolderOpen, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  keywords: string[];
  photos: string[];
  createdAt: string;
}

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

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
        </div>
      </div>
    </div>
  );
}
