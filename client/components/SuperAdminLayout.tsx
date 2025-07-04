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
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Shield,
  BarChart3,
  Users,
  Building2,
  Settings,
  DollarSign,
  Database,
  LogOut,
  User,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuperAdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function SuperAdminLayout({
  children,
  title,
  breadcrumbs,
}: SuperAdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock notification count
  const notificationCount = 2;

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    navigate("/signin", { replace: true });
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      href: "/super-admin",
      icon: BarChart3,
      active: location.pathname === "/super-admin",
    },
    {
      label: "User Management",
      href: "/super-admin/users",
      icon: Users,
      active: location.pathname.startsWith("/super-admin/users"),
    },
    {
      label: "Business Management",
      href: "/super-admin/businesses",
      icon: Building2,
      active: location.pathname.startsWith("/super-admin/business"),
    },
    {
      label: "Agency Management",
      href: "/super-admin/agencies",
      icon: Shield,
      active: location.pathname.startsWith("/super-admin/agencies"),
    },
    {
      label: "Super Admin Staff",
      href: "/super-admin/staff",
      icon: User,
      active: location.pathname.startsWith("/super-admin/staff"),
    },
    {
      label: "Financial Dashboard",
      href: "/super-admin/financial",
      icon: DollarSign,
      active: location.pathname === "/super-admin/financial",
    },
    {
      label: "Support",
      href: "/support",
      icon: MessageSquare,
      active: location.pathname === "/support",
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
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">Super Admin</span>
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

        {/* Sidebar Footer - Settings moved to header */}
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
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">Super Admin</span>
              </div>

              {/* Super Admin Badge */}
              <Badge variant="destructive" className="hidden md:flex">
                <Shield className="h-3 w-3 mr-1" />
                Super Administrator
              </Badge>

              {/* Breadcrumbs */}
              <div className="hidden lg:block">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Search - Hide on small mobile */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>

              {/* Settings */}
              <Link to="/super-admin/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt={currentUser?.name || "User"}
                      />
                      <AvatarFallback>
                        {currentUser?.name?.charAt(0) || "SA"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.name || "Super Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email || "admin@system.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Settings moved to gear icon in header */}
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

        {/* Page Title */}
        {title && (
          <div className="bg-background border-b p-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}

        {/* Breadcrumbs for mobile */}
        <div className="lg:hidden bg-background border-b p-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden bg-background border-t">
          <div className="flex items-center justify-around px-2 py-2">
            {sidebarItems.slice(0, 4).map((item) => (
              <Link key={item.href} to={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full flex flex-col items-center gap-1 h-12 px-2"
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs truncate">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
