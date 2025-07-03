import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, Settings, Images, Search, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const isAddProject = location.pathname === "/add-project";
  const isSettings = location.pathname === "/settings";
  const isGallery = location.pathname === "/gallery";
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock notification count
  const notificationCount = 3;

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
          {!isAddProject && !isSettings && !isGallery && (
            <Link to="/add-project">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </Link>
          )}

          {/* Search */}
          <div className="relative">
            {showSearch && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64">
                <Input
                  placeholder="Search projects, photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  autoFocus
                  onBlur={() => {
                    setTimeout(() => setShowSearch(false), 200);
                  }}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onMouseEnter={() => setShowSearch(true)}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Notifications */}
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/gallery">
            <Button variant="ghost" size="icon">
              <Images className="h-5 w-5" />
            </Button>
          </Link>

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
