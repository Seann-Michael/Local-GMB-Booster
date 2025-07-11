import { useState } from "react";
import { NodeType, NodeTemplate } from "@/types/workflow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Zap,
  Send,
  Filter,
  Settings,
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Slack,
  MessageCircle,
  GitBranch,
  Clock,
  Code,
} from "lucide-react";

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: "trigger-webhook",
    category: "trigger",
    label: "Webhook",
    description: "Receive data from external services",
    icon: "Webhook",
    color: "#3B82F6",
    configFields: [
      {
        key: "url",
        label: "Webhook URL",
        type: "text",
        required: true,
        placeholder: "https://example.com/webhook",
      },
    ],
  },
  {
    type: "trigger-schedule",
    category: "trigger",
    label: "Schedule",
    description: "Run on a schedule",
    icon: "Calendar",
    color: "#3B82F6",
    configFields: [
      {
        key: "schedule",
        label: "Schedule",
        type: "select",
        required: true,
        options: [
          { label: "Every 5 minutes", value: "*/5 * * * *" },
          { label: "Every hour", value: "0 * * * *" },
          { label: "Daily at 9 AM", value: "0 9 * * *" },
          { label: "Weekly on Monday", value: "0 9 * * 1" },
        ],
      },
    ],
  },
  {
    type: "trigger-email",
    category: "trigger",
    label: "Email Received",
    description: "Trigger when email is received",
    icon: "Mail",
    color: "#3B82F6",
    configFields: [
      {
        key: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "workflow@example.com",
      },
    ],
  },
  {
    type: "trigger-form",
    category: "trigger",
    label: "Form Submit",
    description: "Trigger when form is submitted",
    icon: "MessageSquare",
    color: "#3B82F6",
    configFields: [
      {
        key: "formId",
        label: "Form ID",
        type: "text",
        required: true,
        placeholder: "contact-form",
      },
    ],
  },

  // Actions
  {
    type: "action-email",
    category: "action",
    label: "Send Email",
    description: "Send email to recipients",
    icon: "Mail",
    color: "#10B981",
    configFields: [
      {
        key: "to",
        label: "To",
        type: "email",
        required: true,
        placeholder: "recipient@example.com",
      },
      {
        key: "subject",
        label: "Subject",
        type: "text",
        required: true,
        placeholder: "Email subject",
      },
      {
        key: "body",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Email content...",
      },
    ],
  },
  {
    type: "action-sms",
    category: "action",
    label: "Send SMS",
    description: "Send SMS message",
    icon: "MessageSquare",
    color: "#10B981",
    configFields: [
      {
        key: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
        placeholder: "+1234567890",
      },
      {
        key: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "SMS message...",
      },
    ],
  },
  {
    type: "action-webhook",
    category: "action",
    label: "Call Webhook",
    description: "Send data to external service",
    icon: "Webhook",
    color: "#10B981",
    configFields: [
      {
        key: "url",
        label: "URL",
        type: "text",
        required: true,
        placeholder: "https://api.example.com/webhook",
      },
      {
        key: "method",
        label: "Method",
        type: "select",
        required: true,
        options: [
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "PATCH", value: "PATCH" },
        ],
      },
    ],
  },
  {
    type: "action-database",
    category: "action",
    label: "Database",
    description: "Store or retrieve data",
    icon: "Database",
    color: "#10B981",
    configFields: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        required: true,
        options: [
          { label: "Create Record", value: "create" },
          { label: "Update Record", value: "update" },
          { label: "Find Record", value: "find" },
        ],
      },
    ],
  },
  {
    type: "action-slack",
    category: "action",
    label: "Slack Message",
    description: "Send message to Slack",
    icon: "Slack",
    color: "#10B981",
    configFields: [
      {
        key: "channel",
        label: "Channel",
        type: "text",
        required: true,
        placeholder: "#general",
      },
      {
        key: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Slack message...",
      },
    ],
  },
  {
    type: "action-discord",
    category: "action",
    label: "Discord Message",
    description: "Send message to Discord",
    icon: "MessageCircle",
    color: "#10B981",
    configFields: [
      {
        key: "webhook",
        label: "Webhook URL",
        type: "text",
        required: true,
        placeholder: "Discord webhook URL",
      },
      {
        key: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Discord message...",
      },
    ],
  },

  // Conditions
  {
    type: "condition-if",
    category: "condition",
    label: "If/Else",
    description: "Branch based on conditions",
    icon: "GitBranch",
    color: "#F59E0B",
    configFields: [
      {
        key: "field",
        label: "Field",
        type: "text",
        required: true,
        placeholder: "field_name",
      },
      {
        key: "operator",
        label: "Operator",
        type: "select",
        required: true,
        options: [
          { label: "Equals", value: "equals" },
          { label: "Contains", value: "contains" },
          { label: "Greater than", value: "gt" },
          { label: "Less than", value: "lt" },
        ],
      },
      {
        key: "value",
        label: "Value",
        type: "text",
        required: true,
        placeholder: "comparison value",
      },
    ],
  },
  {
    type: "condition-filter",
    category: "condition",
    label: "Filter",
    description: "Filter data based on criteria",
    icon: "Filter",
    color: "#F59E0B",
    configFields: [
      {
        key: "field",
        label: "Field to Filter",
        type: "text",
        required: true,
        placeholder: "field_name",
      },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: [
          { label: "Is not empty", value: "not_empty" },
          { label: "Contains", value: "contains" },
          { label: "Does not contain", value: "not_contains" },
        ],
      },
    ],
  },

  // Utilities
  {
    type: "utility-delay",
    category: "utility",
    label: "Delay",
    description: "Wait for specified time",
    icon: "Clock",
    color: "#8B5CF6",
    configFields: [
      {
        key: "duration",
        label: "Duration",
        type: "number",
        required: true,
        placeholder: "5",
      },
      {
        key: "unit",
        label: "Unit",
        type: "select",
        required: true,
        options: [
          { label: "Seconds", value: "seconds" },
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
        ],
      },
    ],
  },
  {
    type: "utility-code",
    category: "utility",
    label: "Run Code",
    description: "Execute custom JavaScript",
    icon: "Code",
    color: "#8B5CF6",
    configFields: [
      {
        key: "code",
        label: "JavaScript Code",
        type: "textarea",
        required: true,
        placeholder: "// Your code here\nreturn { result: 'success' };",
      },
    ],
  },
];

const iconMap = {
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Slack,
  MessageCircle,
  GitBranch,
  Filter,
  Clock,
  Code,
};

interface NodeLibraryProps {
  onNodeAdd: (nodeType: NodeType) => void;
}

export function NodeLibrary({ onNodeAdd }: NodeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = nodeTemplates.filter((template) => {
    const matchesSearch =
      template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNodeDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Add to workflow
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search apps and actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="trigger" className="text-xs">
            <Zap className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="action" className="text-xs">
            <Send className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="condition" className="text-xs">
            <Filter className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="utility" className="text-xs">
            <Settings className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {filteredTemplates.map((template) => {
                const Icon = iconMap[template.icon as keyof typeof iconMap];
                return (
                  <Card
                    key={template.type}
                    className="p-3 cursor-move hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: template.color }}
                    draggable
                    onDragStart={(e) => handleNodeDragStart(e, template.type)}
                    onClick={() => onNodeAdd(template.type)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg text-white flex-shrink-0"
                        style={{ backgroundColor: template.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900">
                            {template.label}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { nodeTemplates };
