import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Users,
  FolderOpen,
  Camera,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  BarChart3,
  FileText,
  Calendar,
  CreditCard,
  Briefcase,
  Target,
  Workflow,
  Building2,
  UserCircle,
} from "lucide-react";
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut, isSuperAdmin } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const showSuperAdmin = isSuperAdmin();
  const isImpersonated = currentUser?.isImpersonated;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock notification count
  const notificationCount = 3;

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("superadmin_session");
    toast.success("Signed out successfully");
    navigate("/signin", { replace: true });
  };

  const returnToSuperAdmin = () => {
    const superAdminSession = localStorage.getItem("superadmin_session");
    if (superAdminSession) {
      localStorage.setItem("auth_user", superAdminSession);
      localStorage.removeItem("superadmin_session");
      navigate("/super-admin", { replace: true });
      toast.success("Returned to Super Admin");
    }
  };

  const sidebarItems = [
    {
      label: "Projects",
      href: "/",
      icon: FolderOpen,
      active:
        location.pathname === "/" || location.pathname.startsWith("/project"),
    },
    {
      label: "Gallery",
      href: "/gallery",
      icon: Camera,
      active: location.pathname === "/gallery",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Hidden on mobile */}
      <div
        className={cn(
          "hidden md:flex bg-card border-r transition-all duration-300 flex-col",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">Local GMB Booster</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Add Project Button */}
        <div className="p-2">
          <Link to="/add-project">
            <Button
              className={cn("w-full gap-2", sidebarCollapsed && "px-2")}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {!sidebarCollapsed && <span>Add Project</span>}
            </Button>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    sidebarCollapsed && "px-2",
                  )}
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer - Removed settings */}
        <div className="p-2 border-t space-y-1">
          {/* Settings moved to top header */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile app title - only show on mobile */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">GMB Booster</span>
              </div>

              {/* Breadcrumbs - hidden on mobile */}
              <div className="hidden lg:block">
                <Breadcrumbs />
              </div>

              {isImpersonated && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Impersonating User</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={returnToSuperAdmin}
                    className="h-auto p-1 text-yellow-800 hover:text-yellow-900"
                  >
                    Return to Super Admin
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Search - Hide on small mobile */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="text-xs">
                        {currentUser?.name ? (
                          currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin-support" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </Link>
                  </DropdownMenuItem>
                  {showSuperAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/super-admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Super Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile second header row with Add Project button */}
        <div className="md:hidden bg-background border-b p-4">
          <div className="flex justify-center">
            <Link to="/add-project">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Breadcrumbs for mobile */}
        <div className="lg:hidden bg-background border-b p-4">
          <Breadcrumbs />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-24 md:pb-0">{children}</main>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} to={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full flex flex-col items-center gap-1 h-auto py-2 px-1"
                  size="sm"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Add Project Button */}
            <Link to="/add-project" className="flex-1">
              <Button
                variant="ghost"
                className="w-full flex flex-col items-center gap-1 h-auto py-2 px-1"
                size="sm"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs font-medium">Add</span>
              </Button>
            </Link>

            {/* Settings moved to top header gear icon */}
          </div>
        </nav>
      </div>
    </div>
  );
}
