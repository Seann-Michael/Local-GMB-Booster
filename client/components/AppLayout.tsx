import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContextualHeader } from "@/components/ContextualHeader";
import { HeaderSearch } from "@/components/SmartSearch";
import { ThemeToggle } from "@/components/ThemeProvider";
import { AppNotifications } from "@/components/UpdateNotification";
import { NotificationDropdown } from "@/components/NotificationDropdown";
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
  Star,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Home,
  MessageSquare,
  BarChart3,
  FileText,
  Calendar,
  CreditCard,
  Briefcase,
  Lightbulb,
  Target,
  Workflow,
  Building2,
  UserCircle,
  MoreVertical,
  BookOpen,
  Menu,
  X,
  DollarSign,
  Zap,
  Monitor,
} from "lucide-react";
import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  signOut,
  isSuperAdmin,
  getCurrentBusiness,
  getUserBusinesses,
  switchToBusiness,
  canSwitchBusinesses,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Function to generate breadcrumbs based on current path
function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const baseBreadcrumb: BreadcrumbItem = {
    label: "Dashboard",
    href: "/admin/projects",
  };

  switch (pathname) {
    case "/admin/projects":
      return [{ label: "Projects" }];

    case "/admin/add-project":
      return [
        baseBreadcrumb,
        { label: "Projects", href: "/admin/projects" },
        { label: "New Project" },
      ];

    case "/admin/gallery":
      return [baseBreadcrumb, { label: "Gallery" }];

    case "/admin/reviews":
      return [baseBreadcrumb, { label: "Reviews" }];

    case "/admin/settings":
      return [baseBreadcrumb, { label: "Settings" }];

    case "/admin/automations":
      return [baseBreadcrumb, { label: "Automations" }];

    case "/admin/reports":
      return [baseBreadcrumb, { label: "Reports" }];

    case "/admin/profile":
      return [baseBreadcrumb, { label: "Profile" }];

    case "/admin/help":
      return [baseBreadcrumb, { label: "Help Center" }];

    case "/admin/workflow-builder":
      return [
        baseBreadcrumb,
        { label: "Automations", href: "/admin/automations" },
        { label: "Workflow Builder" },
      ];

    default:
      // Handle dynamic routes like /project/:id
      if (pathname.startsWith("/project/") && pathname.endsWith("/edit")) {
        return [
          baseBreadcrumb,
          { label: "Projects", href: "/admin/projects" },
          { label: "Edit Project" },
        ];
      } else if (pathname.startsWith("/project/")) {
        return [
          baseBreadcrumb,
          { label: "Projects", href: "/admin/projects" },
          { label: "Project Details" },
        ];
      } else if (pathname.startsWith("/admin/workflow-builder/")) {
        return [
          baseBreadcrumb,
          { label: "Automations", href: "/admin/automations" },
          { label: "Edit Workflow" },
        ];
      }

      // For unmatched routes, return empty array (no breadcrumbs)
      return [];
  }
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const showSuperAdmin = isSuperAdmin();
  const isImpersonated = currentUser?.isImpersonated;
  const currentBusiness = getCurrentBusiness();
  const userBusinesses = getUserBusinesses();
  const canSwitch = canSwitchBusinesses();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileSearchQuery, setProfileSearchQuery] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Zoom functions
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 10, 150);
    setZoomLevel(newZoom);
    document.body.style.zoom = `${newZoom}%`;
    localStorage.setItem("system_zoom", newZoom.toString());
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 10, 50);
    setZoomLevel(newZoom);
    document.body.style.zoom = `${newZoom}%`;
    localStorage.setItem("system_zoom", newZoom.toString());
  };

  const resetZoom = () => {
    setZoomLevel(100);
    document.body.style.zoom = "100%";
    localStorage.setItem("system_zoom", "100");
  };

  // Load business name and zoom level on mount and listen for changes
  useEffect(() => {
    const loadBusinessName = () => {
      const name = localStorage.getItem("business_name") || "My Business";
      console.log("Loading business name:", name);
      setBusinessName(name);
    };

    const loadZoomLevel = () => {
      const savedZoom = localStorage.getItem("system_zoom");
      if (savedZoom) {
        const zoom = parseInt(savedZoom);
        setZoomLevel(zoom);
        document.body.style.zoom = `${zoom}%`;
      }
    };

    // Load initially
    loadBusinessName();
    loadZoomLevel();

    // Listen for storage changes (in case updated from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "business_name") {
        setBusinessName(e.newValue || "My Business");
      }
    };

    // Listen for custom business name change events (same tab updates)
    const handleBusinessNameChange = (e: CustomEvent) => {
      setBusinessName(e.detail || "My Business");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "businessNameChanged",
      handleBusinessNameChange as EventListener,
    );

    // Clean up listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "businessNameChanged",
        handleBusinessNameChange as EventListener,
      );
    };
  }, []);

  const handleBusinessSwitch = (businessId: string) => {
    if (switchToBusiness(businessId)) {
      toast.success(
        `Switched to ${userBusinesses.find((b) => b.id === businessId)?.name}`,
      );
      window.location.reload(); // Reload to update all components
    } else {
      toast.error("Failed to switch business profile");
    }
  };

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
      comingSoon: false,
    },
    {
      id: "gallery",
      label: "Gallery",
      href: "/admin/gallery",
      icon: Camera,
      active: location.pathname === "/admin/gallery",
      comingSoon: false,
    },
    {
      id: "reviews",
      label: "Reviews",
      href: "/admin/reviews",
      icon: Star,
      active: location.pathname === "/admin/reviews",
      comingSoon: false,
    },
    {
      id: "automations",
      label: "Automations",
      href: "/admin/automations",
      icon: Workflow,
      active: location.pathname === "/admin/automations",
      comingSoon: false,
    },
    {
      id: "reports",
      label: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      active: location.pathname === "/admin/reports",
      comingSoon: false,
    },
    {
      id: "maps",
      label: "Maps",
      href: "/admin/maps",
      icon: Target,
      active: location.pathname === "/admin/maps",
      comingSoon: true,
    },
  ];

  const bottomSidebarItems = [
    {
      id: "help",
      label: "Help Center",
      href: "/admin/help",
      icon: BookOpen,
      active: location.pathname === "/admin/help",
    },
    {
      id: "settings",
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: location.pathname === "/admin/settings",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-background flex max-w-full overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-60 bg-card border-r shadow-lg transform transition-transform duration-300 flex flex-col",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-base text-foreground">
                  GMB Booster
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(false)}
              className="h-10 w-10 min-h-[44px] min-w-[44px] hover:bg-muted text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Quick Action Button */}
        <div className="p-3">
          <Link
            to="/admin/add-project"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Button
              className="w-full gap-2 shadow-sm bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Main Navigation */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const NavButton = (
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 font-medium px-4",
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
                          setMobileSidebarOpen(false);
                          navigate("/coming-soon");
                        }
                      : undefined
                  }
                >
                  <item.icon
                    className={cn("h-5 w-5", item.active && "text-primary")}
                  />
                  <span className="font-medium flex items-center gap-2">
                    {item.label}
                    {item.comingSoon && (
                      <span className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </span>
                </Button>
              );

              return item.comingSoon ? (
                <div key={item.id} onClick={() => setMobileSidebarOpen(false)}>
                  {NavButton}
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  {NavButton}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="px-3 py-2 border-t">
          <div className="space-y-1">
            {bottomSidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 font-medium px-4",
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
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile User Info */}
        <div className="p-3 border-t bg-muted/20">
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
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : "Business Owner"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static Sidebar - Always visible on desktop, collapsible */}
      <div
        className={cn(
          "hidden md:flex bg-card border-r transition-all duration-300 flex-col shadow-sm fixed left-0 h-screen",
          sidebarCollapsed ? "w-16" : "w-60",
        )}
        style={{ top: "73px", height: "calc(100vh - 73px)" }}
      >
        {/* Business Selector - Now at top */}
        <div className="px-4 pt-6 pb-4 border-b bg-background">
          {!sidebarCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto bg-white border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 w-full">
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
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">
                        {businessName || "My Business"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {/* Search Bar */}
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search profiles..."
                      value={profileSearchQuery}
                      onChange={(e) => setProfileSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />

                {/* Current Business Owner Profile */}
                {(!profileSearchQuery ||
                  `${currentUser?.name || "User"} Business Owner`
                    .toLowerCase()
                    .includes(profileSearchQuery.toLowerCase())) && (
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-center gap-3 w-full">
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
                      <div className="flex-1">
                        <div className="font-medium">
                          {currentUser?.name || "User"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Business Owner
                        </div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  </DropdownMenuItem>
                )}

                {/* Super Admin Profile */}
                {showSuperAdmin &&
                  (!profileSearchQuery ||
                    "Super Admin System Administrator"
                      .toLowerCase()
                      .includes(profileSearchQuery.toLowerCase())) && (
                    <DropdownMenuItem
                      className="flex flex-col items-start p-3"
                      onClick={() => navigate("/super-admin")}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-purple-100">
                            <Shield className="h-4 w-4 text-purple-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">Super Admin</div>
                          <div className="text-xs text-muted-foreground">
                            System Administrator
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )}

                {/* Business Profiles */}
                {(userBusinesses || [])
                  .filter(
                    (business) =>
                      !profileSearchQuery ||
                      business.name
                        .toLowerCase()
                        .includes(profileSearchQuery.toLowerCase()) ||
                      business.description
                        ?.toLowerCase()
                        .includes(profileSearchQuery.toLowerCase()),
                  )
                  .map((business) => (
                    <DropdownMenuItem
                      key={business.id}
                      className="flex flex-col items-start p-3"
                      onClick={() => handleBusinessSwitch(business.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-blue-100">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{business.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {business.description || "Business Profile"}
                          </div>
                        </div>
                        {business.id === currentBusiness?.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Collapsed state - show just avatar */}
          {sidebarCollapsed && (
            <div className="flex justify-center">
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
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <Link to="/admin/add-project">
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
                          navigate("/coming-soon");
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

          {/* Sidebar Collapse Toggle */}
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "w-full gap-3 h-10 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50",
                sidebarCollapsed ? "px-3 justify-center" : "px-4 justify-start",
              )}
              size="sm"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span className="font-medium">Collapse Menu</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-[73px]">
        {/* Top Header */}
        <header className="bg-background border-b p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:bg-muted"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* GMB Booster branding - show on all screen sizes */}
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">GMB Booster</span>
              </div>

              {/* Breadcrumbs */}
              {getBreadcrumbs(location.pathname).length > 0 && (
                <div className="hidden sm:flex items-center ml-6 pl-6 border-l border-border">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {getBreadcrumbs(location.pathname).map((crumb, index) => (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
                            {crumb.href &&
                            index <
                              getBreadcrumbs(location.pathname).length - 1 ? (
                              <BreadcrumbLink
                                href={crumb.href}
                                className="text-sm"
                              >
                                {crumb.label}
                              </BreadcrumbLink>
                            ) : (
                              <BreadcrumbPage className="text-sm">
                                {crumb.label}
                              </BreadcrumbPage>
                            )}
                          </BreadcrumbItem>
                          {index <
                            getBreadcrumbs(location.pathname).length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              )}

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
              {/* Functional Search */}
              <div className="hidden sm:block">
                <HeaderSearch />
              </div>

              {/* Zoom Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Monitor className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-primary text-primary-foreground rounded px-1">
                      {zoomLevel}%
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>System Zoom</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomOut}
                      >
                        <span className="text-lg">-</span>
                      </Button>
                      <span className="text-sm font-medium">{zoomLevel}%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomIn}
                      >
                        <span className="text-lg">+</span>
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetZoom}
                      className="w-full"
                    >
                      Reset to 100%
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle - Now visible on mobile too */}
              <ThemeToggle />

              {/* Notifications Dropdown */}
              <NotificationDropdown />

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
                    <Link to="/admin/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ideas" className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <span>Ideas & Roadmap</span>
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
            <Link to="/admin/add-project">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Contextual Header */}
        <div
          className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "md:ml-16" : "md:ml-60",
          )}
        >
          <ContextualHeader />
        </div>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-auto pb-28 md:pb-0 transition-all duration-300 max-w-full overflow-x-hidden",
            sidebarCollapsed ? "md:ml-16" : "md:ml-60",
          )}
          style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
          {children}
          {/* Quick Action Bar */}
        </main>

        {/* Mobile Bottom Navigation - Fixed with safe area support */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 shadow-lg"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center justify-around px-1 py-3 pb-1">
            {sidebarItems.slice(0, 4).map((item) => (
              <Link key={item.id} to={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex flex-col items-center gap-1 h-auto py-3 px-1 min-h-[58px]",
                    item.active && "bg-primary/10 text-primary",
                  )}
                  size="sm"
                >
                  <item.icon
                    className={cn("h-5 w-5", item.active && "text-primary")}
                  />
                  <span className="text-xs font-medium leading-tight">
                    {item.label}
                  </span>
                </Button>
              </Link>
            ))}

            {/* More Menu for Additional Items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col items-center gap-1 h-auto py-3 px-1 min-h-[58px]"
                  size="sm"
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="text-xs font-medium leading-tight">
                    More
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mb-3">
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
                  <Link
                    to="/admin/add-project"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>

      {/* App Notifications (PWA updates, install prompts) */}
      <AppNotifications />
    </div>
  );
}
