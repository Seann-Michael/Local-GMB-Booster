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
  MoreVertical,
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
      id: "projects",
      label: "Projects",
      href: "/admin/projects",
      icon: FolderOpen,
      active:
        location.pathname === "/admin/projects" ||
        location.pathname.startsWith("/project"),
    },
    {
      id: "gallery",
      label: "Gallery",
      href: "/gallery",
      icon: Camera,
      active: location.pathname === "/gallery",
    },
  ];

  const bottomSidebarItems = [
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: location.pathname === "/settings",
    },
    {
      id: "support",
      label: "Support",
      href: "/support",
      icon: MessageSquare,
      active: location.pathname === "/support",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Static Sidebar - Always visible on desktop, collapsible */}
      <div
        className={cn(
          "hidden md:flex bg-card border-r transition-all duration-300 flex-col shadow-sm",
          sidebarCollapsed ? "w-16" : "w-72",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-primary/5">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-base text-foreground">
                    GMB Booster
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Business Dashboard
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 hover:bg-primary/10"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <Link to="/add-project">
            <Button
              className={cn(
                "w-full gap-2 shadow-sm bg-primary hover:bg-primary/90",
                sidebarCollapsed ? "px-3" : "px-4",
              )}
              size={sidebarCollapsed ? "icon" : "sm"}
            >
              <Plus className="h-4 w-4" />
              {!sidebarCollapsed && <span>New Project</span>}
            </Button>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const NavButton = (
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 font-medium",
                    sidebarCollapsed ? "px-3" : "px-4",
                    item.active &&
                      "bg-primary/10 text-primary border-r-2 border-primary",
                    !item.active &&
                      "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    item.comingSoon && "opacity-70",
                  )}
                  size="sm"
                  onClick={
                    item.comingSoon
                      ? (e) => {
                          e.preventDefault();
                          toast.success(`${item.label} feature coming soon!`);
                        }
                      : undefined
                  }
                >
                  <item.icon
                    className={cn("h-5 w-5", item.active && "text-primary")}
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium flex items-center gap-2">
                      {item.label}
                      {item.comingSoon && (
                        <span className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </span>
                  )}
                </Button>
              );

              return item.comingSoon ? (
                <div key={item.id}>{NavButton}</div>
              ) : (
                <Link key={item.id} to={item.href}>
                  {NavButton}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-2 border-t">
          <div className="space-y-1">
            {bottomSidebarItems.map((item) => (
              <Link key={item.id} to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 font-medium",
                    sidebarCollapsed ? "px-3" : "px-4",
                    item.active &&
                      "bg-primary/10 text-primary border-r-2 border-primary",
                    !item.active &&
                      "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                  size="sm"
                >
                  <item.icon
                    className={cn("h-5 w-5", item.active && "text-primary")}
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 border-t bg-muted/20">
          {!sidebarCollapsed && (
            <div className="p-3 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-3">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Business Owner
                  </p>
                </div>
              </div>
            </div>
          )}
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
                        Business Owner
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 shadow-lg">
          <div className="flex items-center justify-around px-1 py-2">
            {sidebarItems.slice(0, 4).map((item) => (
              <Link key={item.id} to={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex flex-col items-center gap-1 h-auto py-2 px-1",
                    item.active && "bg-primary/10 text-primary",
                  )}
                  size="sm"
                >
                  <item.icon
                    className={cn("h-5 w-5", item.active && "text-primary")}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* More Menu for Additional Items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1"
                  size="sm"
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="text-xs font-medium">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sidebarItems.slice(4).map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {bottomSidebarItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/add-project" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </div>
  );
}
