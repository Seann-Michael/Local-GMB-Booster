import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb() {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;

      let label = name.charAt(0).toUpperCase() + name.slice(1);

      // Custom labels for specific routes
      switch (name) {
        case "add-project":
          label = "Add Project";
          break;
        case "edit":
          label = "Edit Project";
          break;
        case "super-admin":
          label = "Super Admin";
          break;
        case "project":
          label = "Project";
          break;
        default:
          label = label.replace("-", " ");
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : routeTo,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
