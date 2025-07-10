import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
      id: "schedule",
      name: "Schedule",
      description: "Run on a schedule",
      icon: Calendar,
      category: "trigger",
    },
    {
      id: "form-submit",
      name: "Form Submit",
      description: "When a form is submitted",
      icon: Edit3,
      category: "trigger",
    },
    {
      id: "email-received",
      name: "Email Received",
      description: "When an email is received",
      icon: Mail,
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
      id: "webhook-call",
      name: "Webhook",
      description: "Make HTTP request",
      icon: Webhook,
      category: "action",
    },
    {
      id: "database",
      name: "Database",
      description: "Create, update, or delete data",
      icon: Database,
      category: "action",
    },
    {
      id: "notification",
      name: "Notification",
      description: "Send in-app notification",
      icon: Bell,
      category: "action",
    },
  ],
  logic: [
    {
      id: "condition",
      name: "Condition",
      description: "Only continue if condition is met",
      icon: GitBranch,
      category: "condition",
    },
    {
      id: "delay",
      name: "Delay",
      description: "Wait for specified time",
      icon: Clock,
      category: "delay",
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
        if (step.name === "Webhook") {
          return (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <Input
                  value={config.url || ""}
                  onChange={(e) =>
                    setConfig({ ...config, url: e.target.value })
                  }
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              <div>
                <label className="text-sm font-medium">HTTP Method</label>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        }
        break;

      case "action":
        if (step.name === "Send Email") {
          return (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">To</label>
                <Input
                  value={config.to || ""}
                  onChange={(e) => setConfig({ ...config, to: e.target.value })}
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={config.subject || ""}
                  onChange={(e) =>
                    setConfig({ ...config, subject: e.target.value })
                  }
                  placeholder="Email subject"
                />
              </div>
            </div>
          );
        }
        break;

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
