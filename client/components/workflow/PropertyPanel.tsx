import { useState, useEffect } from "react";
import { WorkflowNode } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Save, Settings, Play } from "lucide-react";
import { nodeTemplates } from "./NodeLibrary";

interface PropertyPanelProps {
  node: WorkflowNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onClose: () => void;
}

export function PropertyPanel({
  node,
  onUpdateNode,
  onClose,
}: PropertyPanelProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const template = node
    ? nodeTemplates.find((t) => t.type === node.type)
    : null;

  useEffect(() => {
    if (node) {
      setLocalConfig(node.data.config);
      setHasChanges(false);
    }
  }, [node]);

  if (!node || !template) {
    return null;
  }

  const handleConfigChange = (key: string, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const isConfigured = template.configFields.every((field) => {
      if (field.required) {
        const value = localConfig[field.key];
        return value !== undefined && value !== "" && value !== null;
      }
      return true;
    });

    onUpdateNode(node.id, {
      data: {
        ...node.data,
        config: localConfig,
        isConfigured,
      },
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(node.data.config);
    setHasChanges(false);
  };

  const renderConfigField = (field: any) => {
    const value = localConfig[field.key] || field.defaultValue || "";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input
            value={value}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            type={field.type}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              handleConfigChange(field.key, parseInt(e.target.value))
            }
            placeholder={field.placeholder}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(newValue) =>
              handleConfigChange(field.key, newValue)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={(checked) =>
                handleConfigChange(field.key, checked)
              }
            />
            <Label className="text-sm">{field.label}</Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Configure Node
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Node Info */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">
              {template.category}
            </Badge>
            <span className="text-sm font-medium text-gray-900">
              {node.data.label}
            </span>
          </div>
          <p className="text-xs text-gray-600">{template.description}</p>
        </div>
      </div>

      {/* Configuration Form */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="node-label">Display Name</Label>
                <Input
                  id="node-label"
                  value={node.data.label}
                  onChange={(e) =>
                    onUpdateNode(node.id, {
                      data: { ...node.data, label: e.target.value },
                    })
                  }
                  placeholder="Enter a name for this step"
                />
              </div>
              <div>
                <Label htmlFor="node-description">Description</Label>
                <Textarea
                  id="node-description"
                  value={node.data.description || ""}
                  onChange={(e) =>
                    onUpdateNode(node.id, {
                      data: { ...node.data, description: e.target.value },
                    })
                  }
                  placeholder="Optional description"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Node Configuration */}
          {template.configFields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.configFields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    {renderConfigField(field)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Test Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Play className="mr-2 h-4 w-4" />
                Test Step
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Test this step with sample data
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer */}
      {hasChanges && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
