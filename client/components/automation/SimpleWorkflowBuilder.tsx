import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Play,
  Pause,
  Save,
  Settings,
  Trash2,
  ArrowDown,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  Database,
  Webhook,
  GitBranch,
  Clock,
  Filter,
  Bell,
  Edit3,
  ChevronRight,
  FolderPlus,
  CheckCircle,
  MousePointer,
  Star,
  UserMinus,
  Link,
  Share2,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Tag,
  Tags,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  category: string;
  name: string;
  description: string;
  icon: any;
  configured: boolean;
  config: Record<string, any>;
}

interface SimpleWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
  onPublish?: (workflow: any) => void;
}

const stepTemplates = {
  triggers: [
    {
      id: "webhook",
      name: "Webhook",
      description: "Trigger when webhook receives data",
      icon: Webhook,
      category: "trigger",
    },
    {
      id: "project-created",
      name: "Project Created",
      description: "When a new project is created",
      icon: FolderPlus,
      category: "trigger",
    },
    {
      id: "project-completed",
      name: "Project Completed",
      description: "When a project is marked as completed",
      icon: CheckCircle,
      category: "trigger",
    },
    {
      id: "review-link-clicked",
      name: "Review Link Clicked",
      description: "When a customer clicks a review link",
      icon: MousePointer,
      category: "trigger",
    },
    {
      id: "review-received",
      name: "Review Received",
      description: "When a customer submits a review",
      icon: Star,
      category: "trigger",
    },
  ],
  actions: [
    {
      id: "send-email",
      name: "Send Email",
      description: "Send an email to recipients",
      icon: Mail,
      category: "action",
    },
    {
      id: "send-sms",
      name: "Send SMS",
      description: "Send SMS message",
      icon: MessageSquare,
      category: "action",
    },
    {
      id: "send-review-request",
      name: "Send Review Request",
      description: "Send Google review request to customer",
      icon: Star,
      category: "action",
    },
    {
      id: "post-social-media",
      name: "Post on Social Media",
      description: "Post content to social media platforms",
      icon: Share2,
      category: "action",
    },
    {
      id: "post-google-my-business",
      name: "Post on Google My Business",
      description: "Create a post on Google My Business",
      icon: MapPin,
      category: "action",
    },
    {
      id: "webhook-call",
      name: "Webhook",
      description: "Make HTTP request",
      icon: Webhook,
      category: "action",
    },
    {
      id: "add-tag",
      name: "Add Tag",
      description: "Add a tag to contact or project",
      icon: Tag,
      category: "action",
    },
    {
      id: "remove-tag",
      name: "Remove Tag",
      description: "Remove a tag from contact or project",
      icon: Tags,
      category: "action",
    },
    {
      id: "add-to-workflow",
      name: "Add to Workflow",
      description: "Add contact to another automation workflow",
      icon: Workflow,
      category: "action",
    },
    {
      id: "remove-from-automation",
      name: "Remove from Automation",
      description: "Stop running automation for this contact",
      icon: UserMinus,
      category: "action",
    },
  ],
  logic: [
    {
      id: "delay",
      name: "Delay",
      description: "Wait for specified time",
      icon: Clock,
      category: "delay",
    },
    {
      id: "condition",
      name: "Condition",
      description: "Only continue if condition is met",
      icon: GitBranch,
      category: "condition",
    },
    {
      id: "filter",
      name: "Filter",
      description: "Filter data based on criteria",
      icon: Filter,
      category: "condition",
    },
  ],
};

export function SimpleWorkflowBuilder({
  workflowId,
  onSave,
  onPublish,
}: SimpleWorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showStepSelector, setShowStepSelector] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(
    null,
  );
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configStep, setConfigStep] = useState<WorkflowStep | null>(null);

  const addStep = (template: any, index: number) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type: template.category,
      category: template.category,
      name: template.name,
      description: template.description,
      icon: template.icon,
      configured: false,
      config: {},
    };

    const newSteps = [...steps];
    newSteps.splice(index, 0, newStep);
    setSteps(newSteps);
    setShowStepSelector(false);
    setSelectedStepIndex(null);

    // Open config dialog
    setConfigStep(newStep);
    setShowConfigDialog(true);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const configureStep = (step: WorkflowStep) => {
    setConfigStep(step);
    setShowConfigDialog(true);
  };

  const saveStepConfig = (stepId: string, config: Record<string, any>) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, config, configured: Object.keys(config).length > 0 }
          : step,
      ),
    );
    setShowConfigDialog(false);
    setConfigStep(null);
  };

  const getStepIcon = (step: WorkflowStep) => {
    const Icon = step.icon;
    return <Icon className="h-5 w-5" />;
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "action":
        return "bg-green-50 border-green-200 text-green-700";
      case "condition":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "delay":
        return "bg-purple-50 border-purple-200 text-purple-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
            />
            <Badge variant="secondary">Draft</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onSave?.({})}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={() => onPublish?.({})}>
              <Play className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Workflow Steps */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-2xl mx-auto py-8 px-6">
              {steps.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Start Building</h3>
                  <p className="text-muted-foreground mb-6">
                    Add a trigger to start your automation
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedStepIndex(0);
                      setShowStepSelector(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Trigger
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id}>
                      {/* Step Card */}
                      <Card
                        className={cn(
                          "border-2 transition-all cursor-pointer hover:shadow-md",
                          getStepColor(step.type),
                          !step.configured && "border-dashed opacity-75",
                        )}
                        onClick={() => configureStep(step)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white shadow-sm">
                                {getStepIcon(step)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{step.name}</h3>
                                  <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {step.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {step.configured
                                    ? "Configured"
                                    : "Click to configure"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  configureStep(step);
                                }}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeStep(index);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {step.configured && (
                          <CardContent className="pt-0">
                            <div className="text-sm bg-white/50 rounded p-2">
                              <span className="text-muted-foreground">
                                Configuration saved
                              </span>
                            </div>
                          </CardContent>
                        )}
                      </Card>

                      {/* Add Step Button */}
                      {index < steps.length - 1 && (
                        <div className="flex justify-center py-4">
                          <ArrowDown className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}

                      {/* Add Next Step */}
                      <div className="flex justify-center py-4">
                        <Button
                          variant="outline"
                          className="rounded-full h-10 w-10 p-0"
                          onClick={() => {
                            setSelectedStepIndex(index + 1);
                            setShowStepSelector(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Selector Dialog */}
      <Dialog open={showStepSelector} onOpenChange={setShowStepSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedStepIndex === 0
                ? "Choose a Trigger"
                : "Choose an Action"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-96">
            <div className="space-y-6">
              {selectedStepIndex === 0 ? (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Triggers
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {stepTemplates.triggers.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                        onClick={() =>
                          addStep(template, selectedStepIndex || 0)
                        }
                      >
                        <div className="p-2 rounded-lg bg-blue-50">
                          <template.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {stepTemplates.actions.map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                          onClick={() =>
                            addStep(template, selectedStepIndex || 0)
                          }
                        >
                          <div className="p-2 rounded-lg bg-green-50">
                            <template.icon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-yellow-600" />
                      Logic & Flow
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {stepTemplates.logic.map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                          onClick={() =>
                            addStep(template, selectedStepIndex || 0)
                          }
                        >
                          <div className="p-2 rounded-lg bg-yellow-50">
                            <template.icon className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Step Configuration Dialog */}
      {configStep && (
        <StepConfigDialog
          step={configStep}
          open={showConfigDialog}
          onOpenChange={setShowConfigDialog}
          onSave={(config) => saveStepConfig(configStep.id, config)}
        />
      )}
    </div>
  );
}

// Step Configuration Dialog Component
interface StepConfigDialogProps {
  step: WorkflowStep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: Record<string, any>) => void;
}

function StepConfigDialog({
  step,
  open,
  onOpenChange,
  onSave,
}: StepConfigDialogProps) {
  const [config, setConfig] = useState(step.config || {});

  const handleSave = () => {
    onSave(config);
  };

  const renderConfigFields = () => {
    switch (step.category) {
      case "trigger":
        switch (step.name) {
          case "Webhook":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Webhook URL</Label>
                  <Input
                    value={config.url || ""}
                    onChange={(e) =>
                      setConfig({ ...config, url: e.target.value })
                    }
                    placeholder="https://your-domain.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This URL will receive webhook data
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">HTTP Method</Label>
                  <Select
                    value={config.method || "POST"}
                    onValueChange={(value) =>
                      setConfig({ ...config, method: value })
                    }
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
                  <Label className="text-sm font-medium">Headers (JSON)</Label>
                  <Textarea
                    value={
                      config.headers ||
                      '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer your-token"\n}'
                    }
                    onChange={(e) =>
                      setConfig({ ...config, headers: e.target.value })
                    }
                    placeholder='{"Authorization": "Bearer token"}'
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Request Body (JSON)
                  </Label>
                  <Textarea
                    value={
                      config.body ||
                      '{\n  "event": "automation_triggered",\n  "data": {}\n}'
                    }
                    onChange={(e) =>
                      setConfig({ ...config, body: e.target.value })
                    }
                    placeholder='{"key": "value"}'
                    rows={6}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Secret Key (Optional)
                  </Label>
                  <Input
                    type="password"
                    value={config.secret || ""}
                    onChange={(e) =>
                      setConfig({ ...config, secret: e.target.value })
                    }
                    placeholder="Webhook secret for verification"
                  />
                </div>
              </div>
            );

          case "Project Created":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Project Filters</Label>
                  <Select
                    value={config.projectFilter || "all"}
                    onValueChange={(value) =>
                      setConfig({ ...config, projectFilter: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="with-customer">
                        Projects with Customer Info
                      </SelectItem>
                      <SelectItem value="with-phone">
                        Projects with Phone Number
                      </SelectItem>
                      <SelectItem value="with-email">
                        Projects with Email
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="immediate"
                    checked={config.immediate || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, immediate: checked })
                    }
                  />
                  <Label htmlFor="immediate">
                    Trigger immediately on creation
                  </Label>
                </div>
              </div>
            );

          case "Project Completed":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Trigger Condition
                  </Label>
                  <Select
                    value={config.condition || "marked-complete"}
                    onValueChange={(value) =>
                      setConfig({ ...config, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marked-complete">
                        When marked as complete
                      </SelectItem>
                      <SelectItem value="all-tasks-done">
                        When all tasks are completed
                      </SelectItem>
                      <SelectItem value="checklist-done">
                        When checklist is completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="require-customer"
                    checked={config.requireCustomer || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, requireCustomer: checked })
                    }
                  />
                  <Label htmlFor="require-customer">
                    Only trigger if customer info exists
                  </Label>
                </div>
              </div>
            );

          case "Review Link Clicked":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Review Platform</Label>
                  <Select
                    value={config.platform || "google"}
                    onValueChange={(value) =>
                      setConfig({ ...config, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Reviews</SelectItem>
                      <SelectItem value="facebook">Facebook Reviews</SelectItem>
                      <SelectItem value="yelp">Yelp Reviews</SelectItem>
                      <SelectItem value="any">Any Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tracking Method</Label>
                  <Select
                    value={config.tracking || "utm"}
                    onValueChange={(value) =>
                      setConfig({ ...config, tracking: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utm">UTM Parameters</SelectItem>
                      <SelectItem value="pixel">Tracking Pixel</SelectItem>
                      <SelectItem value="redirect">
                        Redirect Tracking
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );

          case "Review Received":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Minimum Rating</Label>
                  <Select
                    value={config.minRating || "1"}
                    onValueChange={(value) =>
                      setConfig({ ...config, minRating: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star or Higher</SelectItem>
                      <SelectItem value="2">2 Stars or Higher</SelectItem>
                      <SelectItem value="3">3 Stars or Higher</SelectItem>
                      <SelectItem value="4">4 Stars or Higher</SelectItem>
                      <SelectItem value="5">5 Stars Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Review Platform</Label>
                  <Select
                    value={config.platform || "google"}
                    onValueChange={(value) =>
                      setConfig({ ...config, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Reviews</SelectItem>
                      <SelectItem value="facebook">Facebook Reviews</SelectItem>
                      <SelectItem value="yelp">Yelp Reviews</SelectItem>
                      <SelectItem value="any">Any Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-text"
                    checked={config.requireText || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, requireText: checked })
                    }
                  />
                  <Label htmlFor="has-text">
                    Only trigger if review has text
                  </Label>
                </div>
              </div>
            );

          default:
            return (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Configuration saved automatically</p>
              </div>
            );
        }

      case "action":
        switch (step.name) {
          case "Send Email":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">To</Label>
                  <Input
                    value={config.to || "{{customer.email}}"}
                    onChange={(e) =>
                      setConfig({ ...config, to: e.target.value })
                    }
                    placeholder="{{customer.email}} or specific email"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">From Name</Label>
                  <Input
                    value={config.fromName || ""}
                    onChange={(e) =>
                      setConfig({ ...config, fromName: e.target.value })
                    }
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <Input
                    value={config.subject || ""}
                    onChange={(e) =>
                      setConfig({ ...config, subject: e.target.value })
                    }
                    placeholder="Thank you for your project!"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Email Body</Label>
                  <Textarea
                    value={
                      config.body ||
                      "Hi {{customer.name}},\n\nThank you for choosing us for your project: {{project.name}}\n\nBest regards,\nYour Team"
                    }
                    onChange={(e) =>
                      setConfig({ ...config, body: e.target.value })
                    }
                    placeholder="Email content with variables like {{customer.name}}"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variables:{" "}
                    {`{{customer.name}}, {{customer.email}}, {{project.name}}, {{project.address}}`}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="html"
                    checked={config.isHtml || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, isHtml: checked })
                    }
                  />
                  <Label htmlFor="html">Send as HTML email</Label>
                </div>
              </div>
            );

          case "Send SMS":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">To</Label>
                  <Input
                    value={config.to || "{{customer.phone}}"}
                    onChange={(e) =>
                      setConfig({ ...config, to: e.target.value })
                    }
                    placeholder="{{customer.phone}} or +1234567890"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Message</Label>
                  <Textarea
                    value={
                      config.message ||
                      "Hi {{customer.name}}, your project {{project.name}} has been completed! Thanks for choosing us."
                    }
                    onChange={(e) =>
                      setConfig({ ...config, message: e.target.value })
                    }
                    placeholder="SMS message with variables"
                    rows={4}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(config.message || "").length}/160 characters. Variables:{" "}
                    {`{{customer.name}}, {{project.name}}`}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-link"
                    checked={config.includeLink || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeLink: checked })
                    }
                  />
                  <Label htmlFor="include-link">Include project link</Label>
                </div>
              </div>
            );

          case "Send Review Request":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Review Platform</Label>
                  <Select
                    value={config.platform || "google"}
                    onValueChange={(value) =>
                      setConfig({ ...config, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google My Business</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="yelp">Yelp</SelectItem>
                      <SelectItem value="custom">Custom Review Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Request Method</Label>
                  <Select
                    value={config.method || "email"}
                    onValueChange={(value) =>
                      setConfig({ ...config, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both Email & SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Message Template
                  </Label>
                  <Select
                    value={config.template || "friendly"}
                    onValueChange={(value) =>
                      setConfig({ ...config, template: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly Request</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="gratitude">Thank You Style</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.template === "custom" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Custom Message
                    </Label>
                    <Textarea
                      value={config.customMessage || ""}
                      onChange={(e) =>
                        setConfig({ ...config, customMessage: e.target.value })
                      }
                      placeholder="Custom review request message"
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-photos"
                    checked={config.includePhotos || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includePhotos: checked })
                    }
                  />
                  <Label htmlFor="include-photos">
                    Include project photos in request
                  </Label>
                </div>
              </div>
            );

          case "Webhook":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Webhook URL</Label>
                  <Input
                    value={config.url || ""}
                    onChange={(e) =>
                      setConfig({ ...config, url: e.target.value })
                    }
                    placeholder="https://api.example.com/webhook"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">HTTP Method</Label>
                  <Select
                    value={config.method || "POST"}
                    onValueChange={(value) =>
                      setConfig({ ...config, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Headers (JSON)</Label>
                  <Textarea
                    value={
                      config.headers ||
                      '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer your-token"\n}'
                    }
                    onChange={(e) =>
                      setConfig({ ...config, headers: e.target.value })
                    }
                    placeholder='{"Authorization": "Bearer token"}'
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Request Body (JSON)
                  </Label>
                  <Textarea
                    value={
                      config.body ||
                      '{\n  "customer": "{{customer.name}}",\n  "project": "{{project.name}}",\n  "status": "{{project.status}}"\n}'
                    }
                    onChange={(e) =>
                      setConfig({ ...config, body: e.target.value })
                    }
                    placeholder='{"key": "value"}'
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variables:{" "}
                    {`{{customer.name}}, {{project.name}}, {{project.status}}`}
                  </p>
                </div>
              </div>
            );

          case "Post on Social Media":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Social Media Platforms
                  </Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="facebook"
                        checked={config.platforms?.facebook || false}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            platforms: {
                              ...config.platforms,
                              facebook: checked,
                            },
                          })
                        }
                      />
                      <Label
                        htmlFor="facebook"
                        className="flex items-center gap-2"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="instagram"
                        checked={config.platforms?.instagram || false}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            platforms: {
                              ...config.platforms,
                              instagram: checked,
                            },
                          })
                        }
                      />
                      <Label
                        htmlFor="instagram"
                        className="flex items-center gap-2"
                      >
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="twitter"
                        checked={config.platforms?.twitter || false}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            platforms: {
                              ...config.platforms,
                              twitter: checked,
                            },
                          })
                        }
                      />
                      <Label
                        htmlFor="twitter"
                        className="flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4 text-blue-400" />
                        Twitter / X
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="linkedin"
                        checked={config.platforms?.linkedin || false}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            platforms: {
                              ...config.platforms,
                              linkedin: checked,
                            },
                          })
                        }
                      />
                      <Label
                        htmlFor="linkedin"
                        className="flex items-center gap-2"
                      >
                        <Link className="h-4 w-4 text-blue-700" />
                        LinkedIn
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Post Content</Label>
                  <Textarea
                    value={
                      config.content ||
                      "🎉 Project completed for {{customer.name}}!\n\nWe just finished an amazing {{project.name}} project. Check out the results!\n\n#ProjectComplete #Quality #{{business.name}}"
                    }
                    onChange={(e) =>
                      setConfig({ ...config, content: e.target.value })
                    }
                    placeholder="Post content with variables..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variables:{" "}
                    {`{{customer.name}}, {{project.name}}, {{business.name}}, {{project.address}}`}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Post Type</Label>
                  <Select
                    value={config.postType || "text"}
                    onValueChange={(value) =>
                      setConfig({ ...config, postType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Only</SelectItem>
                      <SelectItem value="image">Text with Images</SelectItem>
                      <SelectItem value="carousel">Image Carousel</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(config.postType === "image" ||
                  config.postType === "carousel" ||
                  config.postType === "video") && (
                  <div>
                    <Label className="text-sm font-medium">Media Source</Label>
                    <Select
                      value={config.mediaSource || "project-photos"}
                      onValueChange={(value) =>
                        setConfig({ ...config, mediaSource: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project-photos">
                          Use Project Photos
                        </SelectItem>
                        <SelectItem value="business-photos">
                          Use Business Photos
                        </SelectItem>
                        <SelectItem value="template-images">
                          Use Template Images
                        </SelectItem>
                        <SelectItem value="custom-url">
                          Custom Image URL
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {config.mediaSource === "custom-url" && (
                  <div>
                    <Label className="text-sm font-medium">Image URL</Label>
                    <Input
                      value={config.customImageUrl || ""}
                      onChange={(e) =>
                        setConfig({ ...config, customImageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Hashtags</Label>
                  <Input
                    value={
                      config.hashtags || "#ProjectComplete #Quality #Business"
                    }
                    onChange={(e) =>
                      setConfig({ ...config, hashtags: e.target.value })
                    }
                    placeholder="#tag1 #tag2 #tag3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate hashtags with spaces. Variables supported.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Post Timing</Label>
                  <Select
                    value={config.timing || "immediate"}
                    onValueChange={(value) =>
                      setConfig({ ...config, timing: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        Post Immediately
                      </SelectItem>
                      <SelectItem value="optimal">
                        Optimal Time (AI-suggested)
                      </SelectItem>
                      <SelectItem value="business-hours">
                        Next Business Hours
                      </SelectItem>
                      <SelectItem value="specific-time">
                        Specific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.timing === "specific-time" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium">Date</Label>
                      <Input
                        type="date"
                        value={config.postDate || ""}
                        onChange={(e) =>
                          setConfig({ ...config, postDate: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Time</Label>
                      <Input
                        type="time"
                        value={config.postTime || ""}
                        onChange={(e) =>
                          setConfig({ ...config, postTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );

          case "Post on Google My Business":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">GMB Location</Label>
                  <Select
                    value={config.location || "primary"}
                    onValueChange={(value) =>
                      setConfig({ ...config, location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">
                        Primary Business Location
                      </SelectItem>
                      <SelectItem value="project-location">
                        Near Project Location
                      </SelectItem>
                      <SelectItem value="all-locations">
                        All Business Locations
                      </SelectItem>
                      <SelectItem value="custom">Specific Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.location === "custom" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Business Location ID
                    </Label>
                    <Input
                      value={config.customLocationId || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          customLocationId: e.target.value,
                        })
                      }
                      placeholder="accounts/123/locations/456"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Post Type</Label>
                  <Select
                    value={config.gmbPostType || "update"}
                    onValueChange={(value) =>
                      setConfig({ ...config, gmbPostType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">What's New</SelectItem>
                      <SelectItem value="offer">Special Offer</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="product">Product Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Post Content</Label>
                  <Textarea
                    value={
                      config.content ||
                      "✅ Another successful project completed!\n\nWe just wrapped up {{project.name}} for {{customer.name}}. Our team delivered exceptional results!\n\n📞 Contact us for your next project!"
                    }
                    onChange={(e) =>
                      setConfig({ ...config, content: e.target.value })
                    }
                    placeholder="GMB post content..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variables:{" "}
                    {`{{customer.name}}, {{project.name}}, {{business.name}}, {{business.phone}}`}
                  </p>
                </div>

                {config.gmbPostType === "offer" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Offer Title</Label>
                      <Input
                        value={config.offerTitle || "Special Discount"}
                        onChange={(e) =>
                          setConfig({ ...config, offerTitle: e.target.value })
                        }
                        placeholder="20% Off Your Next Project"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm font-medium">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          value={config.offerStartDate || ""}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              offerStartDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">End Date</Label>
                        <Input
                          type="date"
                          value={config.offerEndDate || ""}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              offerEndDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        Coupon Code (Optional)
                      </Label>
                      <Input
                        value={config.couponCode || ""}
                        onChange={(e) =>
                          setConfig({ ...config, couponCode: e.target.value })
                        }
                        placeholder="SAVE20"
                      />
                    </div>
                  </div>
                )}

                {config.gmbPostType === "event" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Event Title</Label>
                      <Input
                        value={config.eventTitle || "Open House Event"}
                        onChange={(e) =>
                          setConfig({ ...config, eventTitle: e.target.value })
                        }
                        placeholder="Free Consultation Day"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm font-medium">
                          Event Date
                        </Label>
                        <Input
                          type="date"
                          value={config.eventDate || ""}
                          onChange={(e) =>
                            setConfig({ ...config, eventDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Event Time
                        </Label>
                        <Input
                          type="time"
                          value={config.eventTime || ""}
                          onChange={(e) =>
                            setConfig({ ...config, eventTime: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Call-to-Action</Label>
                  <Select
                    value={config.cta || "contact"}
                    onValueChange={(value) =>
                      setConfig({ ...config, cta: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Contact Us</SelectItem>
                      <SelectItem value="book">Book Now</SelectItem>
                      <SelectItem value="call">Call Now</SelectItem>
                      <SelectItem value="website">Visit Website</SelectItem>
                      <SelectItem value="directions">Get Directions</SelectItem>
                      <SelectItem value="none">No CTA Button</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Include Media</Label>
                  <Select
                    value={config.includeMedia || "project-photos"}
                    onValueChange={(value) =>
                      setConfig({ ...config, includeMedia: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Media</SelectItem>
                      <SelectItem value="project-photos">
                        Project Photos
                      </SelectItem>
                      <SelectItem value="business-photos">
                        Business Photos
                      </SelectItem>
                      <SelectItem value="before-after">
                        Before/After Photos
                      </SelectItem>
                      <SelectItem value="custom">Custom Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.includeMedia === "custom" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Custom Image URL
                    </Label>
                    <Input
                      value={config.customImage || ""}
                      onChange={(e) =>
                        setConfig({ ...config, customImage: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-approve"
                    checked={config.autoApprove || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, autoApprove: checked })
                    }
                  />
                  <Label htmlFor="auto-approve">
                    Auto-approve and publish immediately
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-location"
                    checked={config.includeLocation || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeLocation: checked })
                    }
                  />
                  <Label htmlFor="include-location">
                    Include business location in post
                  </Label>
                </div>
              </div>
            );

          case "Add Tag":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tag Target</Label>
                  <Select
                    value={config.target || "contact"}
                    onValueChange={(value) =>
                      setConfig({ ...config, target: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Customer Contact</SelectItem>
                      <SelectItem value="project">Current Project</SelectItem>
                      <SelectItem value="both">
                        Both Contact & Project
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tag Selection</Label>
                  <Select
                    value={config.tagSelection || "existing"}
                    onValueChange={(value) =>
                      setConfig({ ...config, tagSelection: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="existing">
                        Select Existing Tag
                      </SelectItem>
                      <SelectItem value="new">Create New Tag</SelectItem>
                      <SelectItem value="dynamic">
                        Dynamic Tag (from data)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.tagSelection === "existing" && (
                  <div>
                    <Label className="text-sm font-medium">Existing Tags</Label>
                    <Select
                      value={config.existingTag || ""}
                      onValueChange={(value) =>
                        setConfig({ ...config, existingTag: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed-customer">
                          Completed Customer
                        </SelectItem>
                        <SelectItem value="review-requested">
                          Review Requested
                        </SelectItem>
                        <SelectItem value="high-value">High Value</SelectItem>
                        <SelectItem value="repeat-customer">
                          Repeat Customer
                        </SelectItem>
                        <SelectItem value="referral-source">
                          Referral Source
                        </SelectItem>
                        <SelectItem value="vip">VIP Customer</SelectItem>
                        <SelectItem value="follow-up-needed">
                          Follow-up Needed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {config.tagSelection === "new" && (
                  <div>
                    <Label className="text-sm font-medium">New Tag Name</Label>
                    <Input
                      value={config.newTagName || ""}
                      onChange={(e) =>
                        setConfig({ ...config, newTagName: e.target.value })
                      }
                      placeholder="Enter new tag name"
                    />
                  </div>
                )}

                {config.tagSelection === "dynamic" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Dynamic Tag Template
                    </Label>
                    <Input
                      value={config.dynamicTag || ""}
                      onChange={(e) =>
                        setConfig({ ...config, dynamicTag: e.target.value })
                      }
                      placeholder="{{project.type}}-completed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use variables:{" "}
                      {`{{project.name}}, {{project.type}}, {{customer.name}}, {{date.month}}`}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Tag Color</Label>
                  <Select
                    value={config.tagColor || "blue"}
                    onValueChange={(value) =>
                      setConfig({ ...config, tagColor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-if-not-exists"
                    checked={config.createIfNotExists || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, createIfNotExists: checked })
                    }
                  />
                  <Label htmlFor="create-if-not-exists">
                    Create tag if it doesn't exist
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="log-tag-addition"
                    checked={config.logActivity || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, logActivity: checked })
                    }
                  />
                  <Label htmlFor="log-tag-addition">
                    Log tag addition in activity feed
                  </Label>
                </div>
              </div>
            );

          case "Remove Tag":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Remove From</Label>
                  <Select
                    value={config.target || "contact"}
                    onValueChange={(value) =>
                      setConfig({ ...config, target: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Customer Contact</SelectItem>
                      <SelectItem value="project">Current Project</SelectItem>
                      <SelectItem value="both">
                        Both Contact & Project
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Tag Removal Method
                  </Label>
                  <Select
                    value={config.removalMethod || "specific"}
                    onValueChange={(value) =>
                      setConfig({ ...config, removalMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="specific">
                        Remove Specific Tag
                      </SelectItem>
                      <SelectItem value="pattern">Remove by Pattern</SelectItem>
                      <SelectItem value="category">
                        Remove by Category
                      </SelectItem>
                      <SelectItem value="all">Remove All Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.removalMethod === "specific" && (
                  <div>
                    <Label className="text-sm font-medium">Tag to Remove</Label>
                    <Select
                      value={config.tagToRemove || ""}
                      onValueChange={(value) =>
                        setConfig({ ...config, tagToRemove: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag to remove" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow-up-needed">
                          Follow-up Needed
                        </SelectItem>
                        <SelectItem value="pending-review">
                          Pending Review
                        </SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="new-customer">
                          New Customer
                        </SelectItem>
                        <SelectItem value="requires-attention">
                          Requires Attention
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {config.removalMethod === "pattern" && (
                  <div>
                    <Label className="text-sm font-medium">Tag Pattern</Label>
                    <Input
                      value={config.tagPattern || ""}
                      onChange={(e) =>
                        setConfig({ ...config, tagPattern: e.target.value })
                      }
                      placeholder="temp-*, pending-*, in-progress"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use * for wildcards, comma-separated for multiple patterns
                    </p>
                  </div>
                )}

                {config.removalMethod === "category" && (
                  <div>
                    <Label className="text-sm font-medium">Tag Category</Label>
                    <Select
                      value={config.tagCategory || ""}
                      onValueChange={(value) =>
                        setConfig({ ...config, tagCategory: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status Tags</SelectItem>
                        <SelectItem value="priority">Priority Tags</SelectItem>
                        <SelectItem value="source">Source Tags</SelectItem>
                        <SelectItem value="temporary">
                          Temporary Tags
                        </SelectItem>
                        <SelectItem value="workflow">Workflow Tags</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ignore-if-not-exists"
                    checked={config.ignoreIfNotExists || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, ignoreIfNotExists: checked })
                    }
                  />
                  <Label htmlFor="ignore-if-not-exists">
                    Don't error if tag doesn't exist
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="log-tag-removal"
                    checked={config.logActivity || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, logActivity: checked })
                    }
                  />
                  <Label htmlFor="log-tag-removal">
                    Log tag removal in activity feed
                  </Label>
                </div>
              </div>
            );

          case "Add to Workflow":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Target Workflow</Label>
                  <Select
                    value={config.targetWorkflow || ""}
                    onValueChange={(value) =>
                      setConfig({ ...config, targetWorkflow: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow-up-sequence">
                        Follow-up Sequence
                      </SelectItem>
                      <SelectItem value="review-request-flow">
                        Review Request Flow
                      </SelectItem>
                      <SelectItem value="upsell-campaign">
                        Upsell Campaign
                      </SelectItem>
                      <SelectItem value="customer-onboarding">
                        Customer Onboarding
                      </SelectItem>
                      <SelectItem value="referral-program">
                        Referral Program
                      </SelectItem>
                      <SelectItem value="maintenance-reminders">
                        Maintenance Reminders
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Entry Point</Label>
                  <Select
                    value={config.entryPoint || "beginning"}
                    onValueChange={(value) =>
                      setConfig({ ...config, entryPoint: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginning">
                        Start at Beginning
                      </SelectItem>
                      <SelectItem value="specific-step">
                        Specific Step
                      </SelectItem>
                      <SelectItem value="after-delay">After Delay</SelectItem>
                      <SelectItem value="conditional">
                        Conditional Entry
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.entryPoint === "specific-step" && (
                  <div>
                    <Label className="text-sm font-medium">Step Number</Label>
                    <Input
                      type="number"
                      value={config.stepNumber || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          stepNumber: parseInt(e.target.value),
                        })
                      }
                      placeholder="2"
                      min="1"
                    />
                  </div>
                )}

                {config.entryPoint === "after-delay" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium">Delay</Label>
                      <Input
                        type="number"
                        value={config.delayDuration || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            delayDuration: parseInt(e.target.value),
                          })
                        }
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Unit</Label>
                      <Select
                        value={config.delayUnit || "minutes"}
                        onValueChange={(value) =>
                          setConfig({ ...config, delayUnit: value })
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

                {config.entryPoint === "conditional" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Entry Condition
                    </Label>
                    <Select
                      value={config.entryCondition || ""}
                      onValueChange={(value) =>
                        setConfig({ ...config, entryCondition: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="has-email">
                          Contact has email
                        </SelectItem>
                        <SelectItem value="has-phone">
                          Contact has phone
                        </SelectItem>
                        <SelectItem value="high-value">
                          High value customer
                        </SelectItem>
                        <SelectItem value="repeat-customer">
                          Repeat customer
                        </SelectItem>
                        <SelectItem value="project-type">
                          Specific project type
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Data to Pass</Label>
                  <Select
                    value={config.dataToPass || "all"}
                    onValueChange={(value) =>
                      setConfig({ ...config, dataToPass: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Current Data</SelectItem>
                      <SelectItem value="contact-only">
                        Contact Info Only
                      </SelectItem>
                      <SelectItem value="project-only">
                        Project Info Only
                      </SelectItem>
                      <SelectItem value="custom">Custom Data Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.dataToPass === "custom" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Custom Data (JSON)
                    </Label>
                    <Textarea
                      value={
                        config.customData ||
                        '{\n  "source": "automation",\n  "trigger": "{{current.workflow.name}}"\n}'
                      }
                      onChange={(e) =>
                        setConfig({ ...config, customData: e.target.value })
                      }
                      placeholder='{"key": "value"}'
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="skip-if-already-in"
                    checked={config.skipIfAlreadyIn || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, skipIfAlreadyIn: checked })
                    }
                  />
                  <Label htmlFor="skip-if-already-in">
                    Skip if already in workflow
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-from-current"
                    checked={config.removeFromCurrent || false}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, removeFromCurrent: checked })
                    }
                  />
                  <Label htmlFor="remove-from-current">
                    Remove from current workflow
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="log-workflow-addition"
                    checked={config.logActivity || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, logActivity: checked })
                    }
                  />
                  <Label htmlFor="log-workflow-addition">
                    Log workflow addition in activity
                  </Label>
                </div>
              </div>
            );

          case "Remove from Automation":
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Remove Scope</Label>
                  <Select
                    value={config.scope || "this-automation"}
                    onValueChange={(value) =>
                      setConfig({ ...config, scope: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-automation">
                        Only this automation
                      </SelectItem>
                      <SelectItem value="all-automations">
                        All automations
                      </SelectItem>
                      <SelectItem value="by-tag">
                        Automations with specific tag
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.scope === "by-tag" && (
                  <div>
                    <Label className="text-sm font-medium">Tag</Label>
                    <Input
                      value={config.tag || ""}
                      onChange={(e) =>
                        setConfig({ ...config, tag: e.target.value })
                      }
                      placeholder="automation-tag"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">
                    Reason (Optional)
                  </Label>
                  <Input
                    value={config.reason || ""}
                    onChange={(e) =>
                      setConfig({ ...config, reason: e.target.value })
                    }
                    placeholder="Customer completed review process"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="log-removal"
                    checked={config.logRemoval || true}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, logRemoval: checked })
                    }
                  />
                  <Label htmlFor="log-removal">Log removal in activity</Label>
                </div>
              </div>
            );

          default:
            return (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Configuration saved automatically</p>
              </div>
            );
        }

      case "delay":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <Input
                  type="number"
                  value={config.duration || ""}
                  onChange={(e) =>
                    setConfig({ ...config, duration: parseInt(e.target.value) })
                  }
                  placeholder="5"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Unit</Label>
                <Select
                  value={config.unit || "minutes"}
                  onValueChange={(value) =>
                    setConfig({ ...config, unit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Schedule Type</Label>
              <Select
                value={config.scheduleType || "delay"}
                onValueChange={(value) =>
                  setConfig({ ...config, scheduleType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delay">Simple Delay</SelectItem>
                  <SelectItem value="business-hours">
                    Only During Business Hours
                  </SelectItem>
                  <SelectItem value="specific-time">
                    Specific Time of Day
                  </SelectItem>
                  <SelectItem value="weekdays">Weekdays Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.scheduleType === "specific-time" && (
              <div>
                <Label className="text-sm font-medium">Time</Label>
                <Input
                  type="time"
                  value={config.time || "09:00"}
                  onChange={(e) =>
                    setConfig({ ...config, time: e.target.value })
                  }
                />
              </div>
            )}

            {config.scheduleType === "business-hours" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm font-medium">Start Time</Label>
                    <Input
                      type="time"
                      value={config.startTime || "09:00"}
                      onChange={(e) =>
                        setConfig({ ...config, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Time</Label>
                    <Input
                      type="time"
                      value={config.endTime || "17:00"}
                      onChange={(e) =>
                        setConfig({ ...config, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Configuration options coming soon</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {step.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {renderConfigFields()}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
