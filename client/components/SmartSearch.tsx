import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Users,
  DollarSign,
  FolderOpen,
  Star,
  Camera,
  Settings,
  Plus,
  Clock,
  TrendingUp,
  Target,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "project" | "lead" | "contact" | "action" | "page";
  icon: any;
  href?: string;
  action?: () => void;
  metadata?: Record<string, any>;
}

interface SearchProps {
  trigger?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function SmartSearch({
  trigger,
  placeholder = "Search everything...",
  className,
}: SearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  // Mock data - in real app, this would come from your APIs
  const searchData = useMemo(
    () => ({
      projects: [
        {
          id: "proj-1",
          name: "Downtown Office Renovation",
          client: "Johnson Corp",
          status: "In Progress",
          value: "$75,000",
          type: "Commercial",
        },
        {
          id: "proj-2",
          name: "Kitchen Remodel - Wilson",
          client: "Mike Wilson",
          status: "Completed",
          value: "$26,800",
          type: "Residential",
        },
      ],
      leads: [
        {
          id: "lead-1",
          name: "Sarah Johnson",
          company: "Johnson Corp",
          status: "Qualified",
          value: "$15,000",
          source: "Website",
        },
        {
          id: "lead-2",
          name: "David Chen",
          company: "TechStartup Inc",
          status: "New",
          value: "$25,000",
          source: "Advertising",
        },
      ],
      quickActions: [
        { label: "New Project", href: "/admin/add-project", icon: Plus },
        { label: "Add Lead", href: "/admin/leads?action=add", icon: Users },
        {
          label: "View Pipeline",
          href: "/admin/leads?tab=pipeline",
          icon: Target,
        },
        {
          label: "Revenue Report",
          href: "/admin/project-value?tab=analytics",
          icon: DollarSign,
        },
      ],
      pages: [
        { label: "Projects", href: "/admin/projects", icon: FolderOpen },
        { label: "Lead Management", href: "/admin/leads", icon: Users },
        {
          label: "Project Value",
          href: "/admin/project-value",
          icon: DollarSign,
        },
        { label: "Gallery", href: "/admin/gallery", icon: Camera },
        { label: "Reviews", href: "/admin/reviews", icon: Star },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    }),
    [],
  );

  useEffect(() => {
    if (!query) {
      // Show recent/popular items when no query
      setResults([
        ...searchData.quickActions.map((action) => ({
          id: `action-${action.label}`,
          title: action.label,
          subtitle: "Quick Action",
          type: "action" as const,
          icon: action.icon,
          href: action.href,
        })),
        ...searchData.pages.slice(0, 4).map((page) => ({
          id: `page-${page.label}`,
          title: page.label,
          subtitle: "Page",
          type: "page" as const,
          icon: page.icon,
          href: page.href,
        })),
      ]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered: SearchResult[] = [];

    // Search projects
    searchData.projects.forEach((project) => {
      if (
        project.name.toLowerCase().includes(lowerQuery) ||
        project.client.toLowerCase().includes(lowerQuery) ||
        project.type.toLowerCase().includes(lowerQuery)
      ) {
        filtered.push({
          id: project.id,
          title: project.name,
          subtitle: `${project.client} • ${project.status} • ${project.value}`,
          type: "project",
          icon: FolderOpen,
          href: `/project/${project.id}`,
          metadata: project,
        });
      }
    });

    // Search leads
    searchData.leads.forEach((lead) => {
      if (
        lead.name.toLowerCase().includes(lowerQuery) ||
        lead.company?.toLowerCase().includes(lowerQuery) ||
        lead.source.toLowerCase().includes(lowerQuery)
      ) {
        filtered.push({
          id: lead.id,
          title: lead.name,
          subtitle: `${lead.company || "Individual"} • ${lead.status} • ${lead.value}`,
          type: "lead",
          icon: Users,
          href: `/admin/leads?leadId=${lead.id}`,
          metadata: lead,
        });
      }
    });

    // Search actions
    searchData.quickActions.forEach((action) => {
      if (action.label.toLowerCase().includes(lowerQuery)) {
        filtered.push({
          id: `action-${action.label}`,
          title: action.label,
          subtitle: "Quick Action",
          type: "action",
          icon: action.icon,
          href: action.href,
        });
      }
    });

    // Search pages
    searchData.pages.forEach((page) => {
      if (page.label.toLowerCase().includes(lowerQuery)) {
        filtered.push({
          id: `page-${page.label}`,
          title: page.label,
          subtitle: "Page",
          type: "page",
          icon: page.icon,
          href: page.href,
        });
      }
    });

    setResults(filtered);
  }, [query, searchData]);

  const handleSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.href) {
      navigate(result.href);
    }
    setOpen(false);
    setQuery("");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project":
        return "Projects";
      case "lead":
        return "Leads";
      case "contact":
        return "Contacts";
      case "action":
        return "Quick Actions";
      case "page":
        return "Pages";
      default:
        return "Results";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-800";
      case "lead":
        return "bg-green-100 text-green-800";
      case "contact":
        return "bg-purple-100 text-purple-800";
      case "action":
        return "bg-orange-100 text-orange-800";
      case "page":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          className={`relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 ${className}`}
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">{placeholder}</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <DialogHeader className="px-4 pb-0 pt-4">
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search projects, leads, and more. Use{" "}
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>{" "}
              to open anytime.
            </DialogDescription>
          </DialogHeader>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput
              placeholder="Type to search..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px] overflow-y-auto">
              {results.length === 0 && query ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                Object.entries(groupedResults).map(([type, items]) => (
                  <div key={type}>
                    <CommandGroup heading={getTypeLabel(type)}>
                      {items.map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <result.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="font-medium">{result.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {result.subtitle}
                            </div>
                          </div>
                          <Badge
                            className={`text-xs ${getTypeColor(result.type)}`}
                            variant="secondary"
                          >
                            {result.type}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </div>
                ))
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compact version for header
export function HeaderSearch() {
  return (
    <SmartSearch className="w-32 md:w-40 lg:w-64" placeholder="Search..." />
  );
}

// Button trigger version
export function SearchButton() {
  return (
    <SmartSearch
      trigger={
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      }
    />
  );
}
