import { useState } from "react";
import { NodeData } from "@/types/automation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Settings,
  Info,
  Play,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Code,
  Database,
  Mail,
  Clock,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyPanelProps {
  node: NodeData | null;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
  onClose: () => void;
  isVisible: boolean;
}

export function PropertyPanel({
  node,
  onNodeUpdate,
  onClose,
  isVisible,
}: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState("config");
  const [localConfig, setLocalConfig] = useState(node?.data.config || {});
  const [isDirty, setIsDirty] = useState(false);

  if (!isVisible || !node) {
    return null;
  }

  const handleConfigChange = (key: string, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onNodeUpdate(node.id, {
      data: {
        ...node.data,
        config: localConfig,
        isValid: validateConfig(localConfig, node.type),
      },
    });
    setIsDirty(false);
  };

  const handleCancel = () => {
    setLocalConfig(node.data.config || {});
    setIsDirty(false);
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case "trigger-webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={localConfig.url || ""}
                onChange={(e) => handleConfigChange("url", e.target.value)}
                placeholder="https://your-domain.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="webhook-method">HTTP Method</Label>
              <Select
                value={localConfig.method || "POST"}
                onValueChange={(value) => handleConfigChange("method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
              <Input
                id="webhook-secret"
                type="password"
                value={localConfig.secret || ""}
                onChange={(e) => handleConfigChange("secret", e.target.value)}
                placeholder="Enter secret for webhook validation"
              />
            </div>
          </div>
        );

      case "trigger-schedule":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="schedule-type">Schedule Type</Label>
              <Select
                value={localConfig.scheduleType || "cron"}
                onValueChange={(value) =>
                  handleConfigChange("scheduleType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interval">Interval</SelectItem>
                  <SelectItem value="cron">Cron Expression</SelectItem>
                  <SelectItem value="once">One Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {localConfig.scheduleType === "interval" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="interval-value">Every</Label>
                  <Input
                    id="interval-value"
                    type="number"
                    value={localConfig.intervalValue || ""}
                    onChange={(e) =>
                      handleConfigChange(
                        "intervalValue",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="interval-unit">Unit</Label>
                  <Select
                    value={localConfig.intervalUnit || "minutes"}
                    onValueChange={(value) =>
                      handleConfigChange("intervalUnit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {localConfig.scheduleType === "cron" && (
              <div>
                <Label htmlFor="cron-expression">Cron Expression</Label>
                <Input
                  id="cron-expression"
                  value={localConfig.cronExpression || ""}
                  onChange={(e) =>
                    handleConfigChange("cronExpression", e.target.value)
                  }
                  placeholder="0 */5 * * * (every 5 minutes)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: second minute hour day month dayofweek
                </p>
              </div>
            )}
          </div>
        );

      case "action-email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                value={localConfig.to || ""}
                onChange={(e) => handleConfigChange("to", e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={localConfig.subject || ""}
                onChange={(e) => handleConfigChange("subject", e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={localConfig.body || ""}
                onChange={(e) => handleConfigChange("body", e.target.value)}
                placeholder="Email content..."
                rows={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="email-html"
                checked={localConfig.isHtml || false}
                onCheckedChange={(checked) =>
                  handleConfigChange("isHtml", checked)
                }
              />
              <Label htmlFor="email-html">HTML Content</Label>
            </div>
          </div>
        );

      case "action-sms":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sms-phone">Phone Number</Label>
              <Input
                id="sms-phone"
                value={localConfig.phone || ""}
                onChange={(e) => handleConfigChange("phone", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="sms-message">Message</Label>
              <Textarea
                id="sms-message"
                value={localConfig.message || ""}
                onChange={(e) => handleConfigChange("message", e.target.value)}
                placeholder="SMS message content..."
                rows={4}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(localConfig.message || "").length}/160 characters
              </p>
            </div>
          </div>
        );

      case "utility-delay":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="delay-duration">Duration</Label>
                <Input
                  id="delay-duration"
                  type="number"
                  value={localConfig.duration || ""}
                  onChange={(e) =>
                    handleConfigChange("duration", parseInt(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="delay-unit">Unit</Label>
                <Select
                  value={localConfig.unit || "minutes"}
                  onValueChange={(value) => handleConfigChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No configuration available</p>
            <p className="text-xs">
              This node type doesn't require configuration
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 border-l bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Node Properties</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Node Info */}
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{node.type.split("-")[0]}</Badge>
            <span className="text-sm font-medium">{node.data.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {node.data.description || "Configure this node"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="config" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={node.data.label}
                      onChange={(e) =>
                        onNodeUpdate(node.id, {
                          data: { ...node.data, label: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-description">Description</Label>
                    <Textarea
                      id="node-description"
                      value={node.data.description || ""}
                      onChange={(e) =>
                        onNodeUpdate(node.id, {
                          data: { ...node.data, description: e.target.value },
                        })
                      }
                      placeholder="Optional description..."
                      rows={2}
                    />
                  </div>
                </div>

                <hr />

                {/* Node-specific Configuration */}
                {renderConfigFields()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Input Data</Label>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <Code className="h-3 w-3 inline mr-1" />
                      Available variables will appear here when connected
                    </div>
                  </div>
                  <div>
                    <Label>Output Data</Label>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <Database className="h-3 w-3 inline mr-1" />
                      Preview output data structure
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Test Node</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Run Test
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Test this node with sample data
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="logs">
                      <AccordionTrigger className="text-sm">
                        Execution Logs
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs bg-muted p-2 rounded font-mono">
                          No test runs yet
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>

        {/* Footer Actions */}
        {isDirty && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}

function validateConfig(
  config: Record<string, any>,
  nodeType: string,
): boolean {
  switch (nodeType) {
    case "trigger-webhook":
      return !!config.url;
    case "trigger-schedule":
      return !!(
        config.cronExpression ||
        (config.intervalValue && config.intervalUnit)
      );
    case "action-email":
      return !!(config.to && config.subject);
    case "action-sms":
      return !!(config.phone && config.message);
    case "utility-delay":
      return !!(config.duration && config.unit);
    default:
      return true;
  }
}
