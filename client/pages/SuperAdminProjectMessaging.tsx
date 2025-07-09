import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  FolderOpen,
  Users,
  Bell,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Eye,
  MessageSquare,
  Settings,
  Play,
  Pause,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  business: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  progress: number;
  startDate: string;
  expectedCompletion: string;
  team: string[];
  priority: "low" | "medium" | "high" | "critical";
  budget: number;
  spent: number;
  lastUpdate: string;
  milestones: Milestone[];
  messages: ProjectMessage[];
}

interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  dueDate: string;
  description: string;
}

interface ProjectMessage {
  id: string;
  type: "milestone" | "status" | "team" | "client" | "system";
  title: string;
  content: string;
  sentAt: string;
  recipients: string[];
  status: "sent" | "delivered" | "read";
  automation?: boolean;
}

interface MessageTemplate {
  id: string;
  name: string;
  type: "milestone" | "status" | "team" | "client";
  subject: string;
  content: string;
  variables: string[];
  triggers: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type:
      | "milestone_complete"
      | "status_change"
      | "deadline_approaching"
      | "budget_threshold"
      | "team_assignment";
    conditions: Record<string, any>;
  };
  action: {
    type: "send_message" | "notify_team" | "create_task" | "update_status";
    template: string;
    recipients: string[];
    delay?: number;
  };
  lastTriggered?: string;
  triggerCount: number;
}

export default function SuperAdminProjectMessaging() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<ProjectMessage[]>([]);
  const [newMessage, setNewMessage] = useState({
    type: "team" as const,
    title: "",
    content: "",
    recipients: [] as string[],
    template: "",
  });

  useEffect(() => {
    loadProjectData();
    loadTemplates();
    loadAutomationRules();
  }, []);

  const loadProjectData = () => {
    const mockProjects: Project[] = [
      {
        id: "proj-1",
        name: "Downtown Office Renovation",
        business: "Smith Construction LLC",
        status: "active",
        progress: 65,
        startDate: "2024-01-15",
        expectedCompletion: "2024-04-30",
        team: ["John Smith", "Mike Johnson", "Sarah Wilson"],
        priority: "high",
        budget: 75000,
        spent: 48750,
        lastUpdate: "2024-01-20T10:30:00Z",
        milestones: [
          {
            id: "m1",
            name: "Foundation Complete",
            completed: true,
            dueDate: "2024-02-01",
            description: "Foundation and structural work",
          },
          {
            id: "m2",
            name: "Framing Complete",
            completed: true,
            dueDate: "2024-02-15",
            description: "Wall framing and roofing",
          },
          {
            id: "m3",
            name: "Electrical & Plumbing",
            completed: false,
            dueDate: "2024-03-01",
            description: "Install electrical and plumbing systems",
          },
          {
            id: "m4",
            name: "Finishing Work",
            completed: false,
            dueDate: "2024-04-15",
            description: "Drywall, painting, and finishing",
          },
        ],
        messages: [
          {
            id: "msg-1",
            type: "milestone",
            title: "Foundation Milestone Completed",
            content:
              "Great news! The foundation work has been completed ahead of schedule.",
            sentAt: "2024-02-02T09:00:00Z",
            recipients: ["client", "team"],
            status: "read",
            automation: true,
          },
          {
            id: "msg-2",
            type: "status",
            title: "Weekly Progress Update",
            content:
              "Project is 65% complete and on track for April completion.",
            sentAt: "2024-01-20T10:30:00Z",
            recipients: ["client"],
            status: "delivered",
            automation: false,
          },
        ],
      },
      {
        id: "proj-2",
        name: "Kitchen Remodel - Johnson Residence",
        business: "Premier Renovations",
        status: "active",
        progress: 35,
        startDate: "2024-01-01",
        expectedCompletion: "2024-03-15",
        team: ["Sarah Johnson", "Tom Wilson"],
        priority: "medium",
        budget: 25000,
        spent: 8750,
        lastUpdate: "2024-01-19T16:45:00Z",
        milestones: [
          {
            id: "m1",
            name: "Demolition",
            completed: true,
            dueDate: "2024-01-05",
            description: "Remove old kitchen fixtures",
          },
          {
            id: "m2",
            name: "Electrical Update",
            completed: false,
            dueDate: "2024-01-25",
            description: "Update electrical for new appliances",
          },
          {
            id: "m3",
            name: "Cabinets Installation",
            completed: false,
            dueDate: "2024-02-15",
            description: "Install new cabinets and countertops",
          },
        ],
        messages: [],
      },
    ];
    setProjects(mockProjects);
  };

  const loadTemplates = () => {
    const mockTemplates: MessageTemplate[] = [
      {
        id: "temp-1",
        name: "Milestone Completion",
        type: "milestone",
        subject: "🎉 Milestone Achieved: {{milestone_name}}",
        content:
          "Great news! We've successfully completed the {{milestone_name}} milestone for your {{project_name}} project.\n\nCompleted on: {{completion_date}}\nNext milestone: {{next_milestone}}\n\nYour project is now {{progress}}% complete.",
        variables: [
          "milestone_name",
          "project_name",
          "completion_date",
          "next_milestone",
          "progress",
        ],
        triggers: ["milestone_complete"],
      },
      {
        id: "temp-2",
        name: "Weekly Status Update",
        type: "status",
        subject: "📊 Weekly Update: {{project_name}}",
        content:
          "Here's your weekly update for {{project_name}}:\n\nProgress: {{progress}}%\nBudget Used: ${{spent}} of ${{budget}}\nNext Milestone: {{next_milestone}}\n\nEverything is {{status_message}}.",
        variables: [
          "project_name",
          "progress",
          "spent",
          "budget",
          "next_milestone",
          "status_message",
        ],
        triggers: ["weekly_schedule"],
      },
      {
        id: "temp-3",
        name: "Deadline Reminder",
        type: "team",
        subject: "⏰ Upcoming Deadline: {{milestone_name}}",
        content:
          "Reminder: {{milestone_name}} is due in {{days_remaining}} days.\n\nDue Date: {{due_date}}\nProject: {{project_name}}\n\nPlease ensure all tasks are completed on time.",
        variables: [
          "milestone_name",
          "days_remaining",
          "due_date",
          "project_name",
        ],
        triggers: ["deadline_approaching"],
      },
    ];
    setTemplates(mockTemplates);
  };

  const loadAutomationRules = () => {
    const mockRules: AutomationRule[] = [
      {
        id: "rule-1",
        name: "Milestone Completion Notification",
        enabled: true,
        trigger: {
          type: "milestone_complete",
          conditions: { notify_client: true },
        },
        action: {
          type: "send_message",
          template: "temp-1",
          recipients: ["client", "team"],
        },
        triggerCount: 12,
        lastTriggered: "2024-01-20T10:30:00Z",
      },
      {
        id: "rule-2",
        name: "Weekly Progress Reports",
        enabled: true,
        trigger: {
          type: "deadline_approaching",
          conditions: { days_before: 7, recurring: "weekly" },
        },
        action: {
          type: "send_message",
          template: "temp-2",
          recipients: ["client"],
        },
        triggerCount: 8,
        lastTriggered: "2024-01-19T09:00:00Z",
      },
      {
        id: "rule-3",
        name: "Budget Threshold Alert",
        enabled: true,
        trigger: {
          type: "budget_threshold",
          conditions: { percentage: 80 },
        },
        action: {
          type: "notify_team",
          template: "budget-alert",
          recipients: ["team", "admin"],
        },
        triggerCount: 3,
        lastTriggered: "2024-01-18T14:20:00Z",
      },
    ];
    setAutomationRules(mockRules);
  };

  const sendProjectMessage = () => {
    if (!newMessage.title || !newMessage.content || !selectedProject) {
      toast.error("Please fill in all required fields");
      return;
    }

    const message: ProjectMessage = {
      id: `msg-${Date.now()}`,
      type: newMessage.type,
      title: newMessage.title,
      content: newMessage.content,
      sentAt: new Date().toISOString(),
      recipients: newMessage.recipients,
      status: "sent",
      automation: false,
    };

    // Update project messages
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProject) {
          return { ...project, messages: [...project.messages, message] };
        }
        return project;
      }),
    );

    // Reset form
    setNewMessage({
      type: "team",
      title: "",
      content: "",
      recipients: [],
      template: "",
    });

    toast.success("Message sent successfully!");
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
    toast.success("Automation rule updated");
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Messaging
            </h1>
            <p className="text-muted-foreground">
              Manage project communications and automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="send">Send Message</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.filter((p) => p.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages Sent
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Automation Rules
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {automationRules.filter((r) => r.enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {automationRules.length} total rules
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2h</div>
                  <p className="text-xs text-muted-foreground">
                    -30min from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Project Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Message</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.business}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : project.status === "completed"
                                  ? "default"
                                  : project.status === "on-hold"
                                    ? "secondary"
                                    : "destructive"
                            }
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {project.messages.length > 0
                              ? new Date(
                                  project.messages[
                                    project.messages.length - 1
                                  ].sentAt,
                                ).toLocaleDateString()
                              : "No messages"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProject(project.id);
                              setActiveTab("send");
                            }}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Project Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project">Select Project</Label>
                    <Select
                      value={selectedProject}
                      onValueChange={setSelectedProject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} - {project.business}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Message Type</Label>
                    <Select
                      value={newMessage.type}
                      onValueChange={(value: any) =>
                        setNewMessage((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milestone">
                          Milestone Update
                        </SelectItem>
                        <SelectItem value="status">Status Update</SelectItem>
                        <SelectItem value="team">Team Communication</SelectItem>
                        <SelectItem value="client">Client Update</SelectItem>
                        <SelectItem value="system">
                          System Notification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Use Template (Optional)</Label>
                  <Select
                    value={newMessage.template}
                    onValueChange={(value) => {
                      const template = templates.find((t) => t.id === value);
                      if (template) {
                        setNewMessage((prev) => ({
                          ...prev,
                          template: value,
                          title: template.subject,
                          content: template.content,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Message Title</Label>
                  <Input
                    id="title"
                    value={newMessage.title}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter message title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter your message content..."
                    rows={6}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={sendProjectMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Variables</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.slice(0, 3).map((variable) => (
                              <Badge
                                key={variable}
                                variant="secondary"
                                className="text-xs"
                              >
                                {variable}
                              </Badge>
                            ))}
                            {template.variables.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.variables.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automationRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">
                          {rule.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {rule.trigger.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() =>
                                toggleAutomationRule(rule.id)
                              }
                            />
                            <span className="text-sm">
                              {rule.enabled ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{rule.triggerCount} times</div>
                            {rule.lastTriggered && (
                              <div className="text-muted-foreground">
                                Last:{" "}
                                {new Date(
                                  rule.lastTriggered,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Message Delivery Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Automation Success
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.7%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Read Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4min</div>
                  <p className="text-xs text-muted-foreground">
                    +15s from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Client Satisfaction
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <p className="text-xs text-muted-foreground">
                    +0.2 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Messaging Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Advanced analytics charts would be implemented here</p>
                  <p className="text-sm">
                    Integration with real analytics service recommended
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
