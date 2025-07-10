import { useState } from "react";
import { NodeType, NodeTemplate } from "@/types/automation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Bell,
  GitBranch,
  Filter,
  Clock,
  Shuffle,
  Merge,
  Search,
  Zap,
  Activity,
  Settings,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: "trigger-webhook",
    category: "trigger",
    label: "Webhook",
    description: "Start workflow when webhook receives data",
    icon: "Webhook",
    color: "blue",
    inputs: 0,
    outputs: 1,
    configSchema: {
      url: "string",
      method: "string",
      headers: "object",
    },
  },
  {
    type: "trigger-schedule",
    category: "trigger",
    label: "Schedule",
    description: "Run workflow on a schedule",
    icon: "Calendar",
    color: "blue",
    inputs: 0,
    outputs: 1,
    configSchema: {
      schedule: "string",
      timezone: "string",
    },
  },
  {
    type: "trigger-form",
    category: "trigger",
    label: "Form Submit",
    description: "Trigger when form is submitted",
    icon: "Mail",
    color: "blue",
    inputs: 0,
    outputs: 1,
    configSchema: {
      formId: "string",
      fields: "array",
    },
  },
  {
    type: "trigger-email",
    category: "trigger",
    label: "Email Received",
    description: "Trigger when email is received",
    icon: "Mail",
    color: "blue",
    inputs: 0,
    outputs: 1,
    configSchema: {
      email: "string",
      filters: "object",
    },
  },

  // Actions
  {
    type: "action-email",
    category: "action",
    label: "Send Email",
    description: "Send email to recipients",
    icon: "Mail",
    color: "green",
    inputs: 1,
    outputs: 1,
    configSchema: {
      to: "string",
      subject: "string",
      body: "string",
      template: "string",
    },
  },
  {
    type: "action-sms",
    category: "action",
    label: "Send SMS",
    description: "Send SMS message",
    icon: "MessageSquare",
    color: "green",
    inputs: 1,
    outputs: 1,
    configSchema: {
      phone: "string",
      message: "string",
    },
  },
  {
    type: "action-webhook",
    category: "action",
    label: "Call Webhook",
    description: "Make HTTP request to external service",
    icon: "Webhook",
    color: "green",
    inputs: 1,
    outputs: 1,
    configSchema: {
      url: "string",
      method: "string",
      headers: "object",
      body: "object",
    },
  },
  {
    type: "action-database",
    category: "action",
    label: "Database Action",
    description: "Create, read, update, or delete data",
    icon: "Database",
    color: "green",
    inputs: 1,
    outputs: 1,
    configSchema: {
      operation: "string",
      table: "string",
      data: "object",
      conditions: "object",
    },
  },
  {
    type: "action-notification",
    category: "action",
    label: "Send Notification",
    description: "Send in-app notification",
    icon: "Bell",
    color: "green",
    inputs: 1,
    outputs: 1,
    configSchema: {
      title: "string",
      message: "string",
      type: "string",
      recipients: "array",
    },
  },

  // Conditions
  {
    type: "condition-if",
    category: "condition",
    label: "If/Then",
    description: "Branch based on conditions",
    icon: "GitBranch",
    color: "yellow",
    inputs: 1,
    outputs: 2,
    configSchema: {
      conditions: "array",
      operator: "string",
    },
  },
  {
    type: "condition-filter",
    category: "condition",
    label: "Filter",
    description: "Filter data based on criteria",
    icon: "Filter",
    color: "yellow",
    inputs: 1,
    outputs: 1,
    configSchema: {
      field: "string",
      operator: "string",
      value: "any",
    },
  },
  {
    type: "condition-branch",
    category: "condition",
    label: "Multi-Branch",
    description: "Create multiple conditional paths",
    icon: "GitBranch",
    color: "yellow",
    inputs: 1,
    outputs: 3,
    configSchema: {
      branches: "array",
    },
  },

  // Utilities
  {
    type: "utility-delay",
    category: "utility",
    label: "Delay",
    description: "Wait for specified time",
    icon: "Clock",
    color: "purple",
    inputs: 1,
    outputs: 1,
    configSchema: {
      duration: "number",
      unit: "string",
    },
  },
  {
    type: "utility-transform",
    category: "utility",
    label: "Transform Data",
    description: "Transform and format data",
    icon: "Shuffle",
    color: "purple",
    inputs: 1,
    outputs: 1,
    configSchema: {
      transformations: "array",
    },
  },
  {
    type: "utility-merge",
    category: "utility",
    label: "Merge Data",
    description: "Combine data from multiple sources",
    icon: "Merge",
    color: "purple",
    inputs: 2,
    outputs: 1,
    configSchema: {
      strategy: "string",
    },
  },
];

const iconMap = {
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Bell,
  GitBranch,
  Filter,
  Clock,
  Shuffle,
  Merge,
};

interface NodeLibraryProps {
  onNodeAdd: (nodeType: NodeType) => void;
  isCollapsed?: boolean;
}

export function NodeLibrary({
  onNodeAdd,
  isCollapsed = false,
}: NodeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates = nodeTemplates.filter((template) => {
    const matchesSearch =
      template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryCounts = {
    all: nodeTemplates.length,
    trigger: nodeTemplates.filter((t) => t.category === "trigger").length,
    action: nodeTemplates.filter((t) => t.category === "action").length,
    condition: nodeTemplates.filter((t) => t.category === "condition").length,
    utility: nodeTemplates.filter((t) => t.category === "utility").length,
  };

  if (isCollapsed) {
    return (
      <div className="w-16 border-r bg-card flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-lg"
          title="Triggers"
        >
          <Zap className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-lg"
          title="Actions"
        >
          <Activity className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-lg"
          title="Conditions"
        >
          <GitBranch className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-lg"
          title="Utilities"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Node Library</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
          <TabsTrigger value="all" className="text-xs">
            All
            <Badge variant="secondary" className="ml-1 text-xs">
              {categoryCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="trigger" className="text-xs">
            <Zap className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="action" className="text-xs">
            <Activity className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="condition" className="text-xs">
            <GitBranch className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="utility" className="text-xs">
            <Settings className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        {/* Node List */}
        <TabsContent value={selectedCategory} className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {filteredTemplates.map((template) => {
                const Icon = iconMap[template.icon as keyof typeof iconMap];

                return (
                  <Card
                    key={template.type}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
                      template.color === "blue" && "border-l-blue-500",
                      template.color === "green" && "border-l-green-500",
                      template.color === "yellow" && "border-l-yellow-500",
                      template.color === "purple" && "border-l-purple-500",
                    )}
                    onClick={() => onNodeAdd(template.type)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          template.color === "blue" &&
                            "bg-blue-100 text-blue-600",
                          template.color === "green" &&
                            "bg-green-100 text-green-600",
                          template.color === "yellow" &&
                            "bg-yellow-100 text-yellow-600",
                          template.color === "purple" &&
                            "bg-purple-100 text-purple-600",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {template.label}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No nodes found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
