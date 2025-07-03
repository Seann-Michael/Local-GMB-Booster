import { Button } from "@/components/ui/button";
import { Camera, Plus, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isAddProject = location.pathname === "/add-project";
  const isSettings = location.pathname === "/settings";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Camera className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">ProjectLens</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAddProject && !isSettings && (
            <Link to="/add-project">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </Link>
          )}

          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
