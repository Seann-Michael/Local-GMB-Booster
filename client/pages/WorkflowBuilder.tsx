import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  Settings,
  Play,
  Save,
  Trash2,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  Webhook,
  Database,
  Clock,
  GitBranch,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  type: "trigger" | "action";
  app: string;
  action: string;
  configured: boolean;
  config: Record<string, any>;
}

const availableApps = [
  // Triggers
  {
    type: "trigger",
    app: "webhook",
    name: "Webhook",
    icon: Webhook,
    color: "bg-blue-500",
    actions: [
      {
        id: "receive",
        name: "Catch Hook",
        description: "Receive webhook data",
      },
    ],
  },
  {
    type: "trigger",
    app: "schedule",
    name: "Schedule",
    icon: Calendar,
    color: "bg-purple-500",
    actions: [{ id: "cron", name: "Every", description: "Run on schedule" }],
  },
  {
    type: "trigger",
    app: "email",
    name: "Email",
    icon: Mail,
    color: "bg-green-500",
    actions: [
      { id: "received", name: "New Email", description: "When email received" },
    ],
  },

  // Actions
  {
    type: "action",
    app: "email",
    name: "Email",
    icon: Mail,
    color: "bg-green-500",
    actions: [{ id: "send", name: "Send Email", description: "Send an email" }],
  },
  {
    type: "action",
    app: "sms",
    name: "SMS",
    icon: MessageSquare,
    color: "bg-orange-500",
    actions: [
      { id: "send", name: "Send SMS", description: "Send text message" },
    ],
  },
  {
    type: "action",
    app: "webhook",
    name: "Webhook",
    icon: Webhook,
    color: "bg-blue-500",
    actions: [
      { id: "post", name: "POST", description: "Send HTTP POST request" },
    ],
  },
  {
    type: "action",
    app: "database",
    name: "Database",
    icon: Database,
    color: "bg-gray-500",
    actions: [
      { id: "create", name: "Create Record", description: "Insert new record" },
      {
        id: "update",
        name: "Update Record",
        description: "Update existing record",
      },
    ],
  },
  {
    type: "action",
    app: "delay",
    name: "Delay",
    icon: Clock,
    color: "bg-yellow-500",
    actions: [
      { id: "wait", name: "Delay For", description: "Wait for specified time" },
    ],
  },
];

export default function WorkflowBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState(
    id ? `Workflow ${id}` : "New Workflow",
  );
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<"trigger" | "action">(
    "trigger",
  );

  const addStep = (app: any, actionData: any) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type: app.type,
      app: app.app,
      action: actionData.id,
      configured: false,
      config: {},
    };
    setSteps([...steps, newStep]);
    setShowAppSelector(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const getStepIcon = (app: string) => {
    const appData = availableApps.find((a) => a.app === app);
    return appData?.icon || Settings;
  };

  const getStepColor = (app: string) => {
    const appData = availableApps.find((a) => a.app === app);
    return appData?.color || "bg-gray-500";
  };

  const getStepName = (app: string, action: string) => {
    const appData = availableApps.find((a) => a.app === app);
    const actionData = appData?.actions.find((act) => act.id === action);
    return actionData?.name || "Unknown Action";
  };

  const canAddTrigger = steps.filter((s) => s.type === "trigger").length === 0;
  const hasTrigger = steps.some((s) => s.type === "trigger");

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/automations")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Workflow Builder</h1>
              <p className="text-muted-foreground">
                {id ? `Editing workflow ${id}` : "Create a new workflow"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button size="sm" disabled={!hasTrigger}>
              <Play className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {/* Workflow Name */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                className="text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {/* Empty State */}
          {steps.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Start building your workflow
                </h3>
                <p className="text-muted-foreground mb-4">
                  Every workflow starts with a trigger. Choose when your
                  workflow should run.
                </p>
                <Button
                  onClick={() => {
                    setSelectorType("trigger");
                    setShowAppSelector(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Choose a Trigger
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Workflow Steps */}
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.app);
            const stepColor = getStepColor(step.app);
            const stepName = getStepName(step.app, step.action);

            return (
              <div key={step.id} className="relative">
                <Card
                  className="border-l-4"
                  style={{ borderLeftColor: stepColor.replace("bg-", "#") }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${stepColor} text-white`}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {step.type}
                            </Badge>
                            <span className="font-medium">{stepName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">
                            {step.app}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.configured ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Configured</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Setup required</span>
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-3 w-3" />
                        </Button>
                        {steps.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {!step.configured && (
                    <CardContent className="pt-0">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Configuration required
                          </span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          Click the settings icon to configure this step.
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-6 bg-border"></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Step Button */}
          {hasTrigger && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-dashed border-2"
                onClick={() => {
                  setSelectorType("action");
                  setShowAppSelector(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Action
              </Button>
            </div>
          )}
        </div>

        {/* App Selector Modal */}
        {showAppSelector && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Choose{" "}
                    {selectorType === "trigger" ? "a Trigger" : "an Action"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAppSelector(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <div className="grid gap-3">
                  {availableApps
                    .filter((app) =>
                      selectorType === "trigger"
                        ? app.type === "trigger"
                        : app.type === "action",
                    )
                    .map((app) => (
                      <div key={app.app} className="space-y-2">
                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                          <div
                            className={`p-1 rounded ${app.color} text-white`}
                          >
                            <app.icon className="h-3 w-3" />
                          </div>
                          {app.name}
                        </div>
                        {app.actions.map((action) => (
                          <Card
                            key={action.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => addStep(app, action)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${app.color} text-white`}
                                >
                                  <app.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{action.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {action.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {app !== availableApps[availableApps.length - 1] && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
