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
import { Progress } from "@/components/ui/progress";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  TestTube,
  Calendar,
  Globe,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Play,
  Pause,
  Settings,
  Send,
  Eye,
  Copy,
  RefreshCw,
  Languages,
  Zap,
  Brain,
  Shield,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ABTest {
  id: string;
  name: string;
  status: "draft" | "running" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  variants: ABVariant[];
  audienceSize: number;
  confidence: number;
  winner?: string;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

interface ABVariant {
  id: string;
  name: string;
  subject: string;
  content: string;
  allocation: number;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

interface ScheduledMessage {
  id: string;
  title: string;
  content: string;
  scheduledFor: string;
  timezone: string;
  status: "scheduled" | "sent" | "failed" | "cancelled";
  recipients: number;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
  };
}

interface SmartOptimization {
  id: string;
  name: string;
  type: "send_time" | "subject_line" | "content_length" | "personalization";
  enabled: boolean;
  performance: number;
  description: string;
  lastOptimized: string;
}

interface InternationalizationRule {
  id: string;
  language: string;
  region: string;
  templates: Record<string, string>;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  enabled: boolean;
}

export default function SuperAdminAdvancedFeatures() {
  const [activeTab, setActiveTab] = useState("ab-testing");
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<
    ScheduledMessage[]
  >([]);
  const [optimizations, setOptimizations] = useState<SmartOptimization[]>([]);
  const [i18nRules, setI18nRules] = useState<InternationalizationRule[]>([]);
  const [newTest, setNewTest] = useState({
    name: "",
    variantA: { subject: "", content: "" },
    variantB: { subject: "", content: "" },
    audienceSize: 100,
    testDuration: 7,
  });

  useEffect(() => {
    loadABTests();
    loadScheduledMessages();
    loadOptimizations();
    loadI18nRules();
  }, []);

  const loadABTests = () => {
    const mockTests: ABTest[] = [
      {
        id: "test-1",
        name: "Subject Line Optimization - January",
        status: "running",
        startDate: "2024-01-15T10:00:00Z",
        variants: [
          {
            id: "var-a",
            name: "Variant A - Direct",
            subject: "Your Project Update is Ready",
            content: "Hello! Your project update is now available for review.",
            allocation: 50,
            metrics: { sent: 245, opened: 98, clicked: 23, converted: 8 },
          },
          {
            id: "var-b",
            name: "Variant B - Engaging",
            subject: "🚀 Exciting News About Your Project!",
            content:
              "Great news! We have some exciting updates about your project.",
            allocation: 50,
            metrics: { sent: 255, opened: 127, clicked: 34, converted: 15 },
          },
        ],
        audienceSize: 500,
        confidence: 87,
        metrics: { sent: 500, opened: 225, clicked: 57, converted: 23 },
      },
      {
        id: "test-2",
        name: "Content Length Test",
        status: "completed",
        startDate: "2024-01-01T09:00:00Z",
        endDate: "2024-01-08T09:00:00Z",
        variants: [
          {
            id: "var-a",
            name: "Short Content",
            subject: "Quick Project Update",
            content: "Brief update on your project progress.",
            allocation: 50,
            metrics: { sent: 150, opened: 75, clicked: 12, converted: 4 },
          },
          {
            id: "var-b",
            name: "Detailed Content",
            subject: "Comprehensive Project Update",
            content:
              "Detailed breakdown of all project milestones and progress.",
            allocation: 50,
            metrics: { sent: 150, opened: 82, clicked: 18, converted: 9 },
          },
        ],
        audienceSize: 300,
        confidence: 95,
        winner: "var-b",
        metrics: { sent: 300, opened: 157, clicked: 30, converted: 13 },
      },
    ];
    setAbTests(mockTests);
  };

  const loadScheduledMessages = () => {
    const mockScheduled: ScheduledMessage[] = [
      {
        id: "sched-1",
        title: "Weekly Progress Report",
        content: "Automated weekly progress report for all active projects",
        scheduledFor: "2024-01-22T09:00:00Z",
        timezone: "America/New_York",
        status: "scheduled",
        recipients: 245,
        recurring: {
          frequency: "weekly",
          interval: 1,
          endDate: "2024-12-31T23:59:59Z",
        },
      },
      {
        id: "sched-2",
        title: "Monthly Client Survey",
        content: "Monthly satisfaction survey for all clients",
        scheduledFor: "2024-02-01T10:00:00Z",
        timezone: "America/New_York",
        status: "scheduled",
        recipients: 89,
        recurring: {
          frequency: "monthly",
          interval: 1,
        },
      },
      {
        id: "sched-3",
        title: "Holiday Greeting",
        content: "Happy New Year message to all clients",
        scheduledFor: "2024-01-01T00:00:00Z",
        timezone: "America/New_York",
        status: "sent",
        recipients: 456,
      },
    ];
    setScheduledMessages(mockScheduled);
  };

  const loadOptimizations = () => {
    const mockOptimizations: SmartOptimization[] = [
      {
        id: "opt-1",
        name: "Optimal Send Time",
        type: "send_time",
        enabled: true,
        performance: 92,
        description:
          "AI determines best send time based on user engagement patterns",
        lastOptimized: "2024-01-20T14:30:00Z",
      },
      {
        id: "opt-2",
        name: "Subject Line Enhancement",
        type: "subject_line",
        enabled: true,
        performance: 87,
        description: "Automatically suggests improvements to subject lines",
        lastOptimized: "2024-01-19T11:15:00Z",
      },
      {
        id: "opt-3",
        name: "Content Length Optimization",
        type: "content_length",
        enabled: false,
        performance: 78,
        description: "Optimizes message length for maximum engagement",
        lastOptimized: "2024-01-18T16:45:00Z",
      },
      {
        id: "opt-4",
        name: "Smart Personalization",
        type: "personalization",
        enabled: true,
        performance: 94,
        description:
          "Dynamic personalization based on user behavior and preferences",
        lastOptimized: "2024-01-20T09:20:00Z",
      },
    ];
    setOptimizations(mockOptimizations);
  };

  const loadI18nRules = () => {
    const mockI18n: InternationalizationRule[] = [
      {
        id: "i18n-1",
        language: "English",
        region: "US",
        templates: {
          welcome: "Welcome to our platform!",
          project_update: "Your project has been updated",
          milestone_complete: "Milestone completed successfully",
        },
        dateFormat: "MM/dd/yyyy",
        timeFormat: "12h",
        currency: "USD",
        enabled: true,
      },
      {
        id: "i18n-2",
        language: "Spanish",
        region: "ES",
        templates: {
          welcome: "¡Bienvenido a nuestra plataforma!",
          project_update: "Su proyecto ha sido actualizado",
          milestone_complete: "Hito completado exitosamente",
        },
        dateFormat: "dd/MM/yyyy",
        timeFormat: "24h",
        currency: "EUR",
        enabled: true,
      },
      {
        id: "i18n-3",
        language: "French",
        region: "FR",
        templates: {
          welcome: "Bienvenue sur notre plateforme!",
          project_update: "Votre projet a été mis à jour",
          milestone_complete: "Étape franchie avec succès",
        },
        dateFormat: "dd/MM/yyyy",
        timeFormat: "24h",
        currency: "EUR",
        enabled: false,
      },
    ];
    setI18nRules(mockI18n);
  };

  const createABTest = () => {
    if (
      !newTest.name ||
      !newTest.variantA.subject ||
      !newTest.variantB.subject
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const test: ABTest = {
      id: `test-${Date.now()}`,
      name: newTest.name,
      status: "draft",
      startDate: new Date().toISOString(),
      variants: [
        {
          id: "var-a",
          name: "Variant A",
          subject: newTest.variantA.subject,
          content: newTest.variantA.content,
          allocation: 50,
          metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        },
        {
          id: "var-b",
          name: "Variant B",
          subject: newTest.variantB.subject,
          content: newTest.variantB.content,
          allocation: 50,
          metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        },
      ],
      audienceSize: newTest.audienceSize,
      confidence: 0,
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
    };

    setAbTests((prev) => [test, ...prev]);
    setNewTest({
      name: "",
      variantA: { subject: "", content: "" },
      variantB: { subject: "", content: "" },
      audienceSize: 100,
      testDuration: 7,
    });
    toast.success("A/B test created successfully!");
  };

  const toggleOptimization = (optId: string) => {
    setOptimizations((prev) =>
      prev.map((opt) =>
        opt.id === optId ? { ...opt, enabled: !opt.enabled } : opt,
      ),
    );
    toast.success("Optimization setting updated");
  };

  const toggleI18nRule = (ruleId: string) => {
    setI18nRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
    toast.success("Internationalization rule updated");
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Advanced Features
            </h1>
            <p className="text-muted-foreground">
              A/B testing, scheduling, optimization, and internationalization
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Global Settings
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
            <TabsTrigger value="i18n">Internationalization</TabsTrigger>
          </TabsList>

          <TabsContent value="ab-testing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Tests
                  </CardTitle>
                  <TestTube className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {abTests.filter((t) => t.status === "running").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {abTests.filter((t) => t.status === "completed").length}{" "}
                    completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Confidence
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      abTests.reduce((acc, test) => acc + test.confidence, 0) /
                        abTests.length,
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Statistical significance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tested
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {abTests
                      .reduce((acc, test) => acc + test.audienceSize, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recipients in tests
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Improvement
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+23%</div>
                  <p className="text-xs text-muted-foreground">
                    Avg engagement lift
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New A/B Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Test Name</Label>
                    <Input
                      id="test-name"
                      value={newTest.name}
                      onChange={(e) =>
                        setNewTest((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter test name"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="audience-size">Audience Size</Label>
                      <Input
                        id="audience-size"
                        type="number"
                        value={newTest.audienceSize}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            audienceSize: parseInt(e.target.value),
                          }))
                        }
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-duration">Duration (days)</Label>
                      <Input
                        id="test-duration"
                        type="number"
                        value={newTest.testDuration}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            testDuration: parseInt(e.target.value),
                          }))
                        }
                        placeholder="7"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Variant A</Label>
                      <Input
                        value={newTest.variantA.subject}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            variantA: {
                              ...prev.variantA,
                              subject: e.target.value,
                            },
                          }))
                        }
                        placeholder="Subject line for variant A"
                      />
                      <Textarea
                        value={newTest.variantA.content}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            variantA: {
                              ...prev.variantA,
                              content: e.target.value,
                            },
                          }))
                        }
                        placeholder="Content for variant A"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Variant B</Label>
                      <Input
                        value={newTest.variantB.subject}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            variantB: {
                              ...prev.variantB,
                              subject: e.target.value,
                            },
                          }))
                        }
                        placeholder="Subject line for variant B"
                      />
                      <Textarea
                        value={newTest.variantB.content}
                        onChange={(e) =>
                          setNewTest((prev) => ({
                            ...prev,
                            variantB: {
                              ...prev.variantB,
                              content: e.target.value,
                            },
                          }))
                        }
                        placeholder="Content for variant B"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button onClick={createABTest} className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    Create A/B Test
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active A/B Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {abTests.slice(0, 3).map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{test.name}</h4>
                          <Badge
                            variant={
                              test.status === "running"
                                ? "default"
                                : test.status === "completed"
                                  ? "default"
                                  : test.status === "paused"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {test.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confidence</span>
                            <span>{test.confidence}%</span>
                          </div>
                          <Progress value={test.confidence} className="h-2" />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Variant A</div>
                              <div className="text-muted-foreground">
                                {(
                                  (test.variants[0].metrics.opened /
                                    test.variants[0].metrics.sent) *
                                  100
                                ).toFixed(1)}
                                % open rate
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Variant B</div>
                              <div className="text-muted-foreground">
                                {(
                                  (test.variants[1].metrics.opened /
                                    test.variants[1].metrics.sent) *
                                  100
                                ).toFixed(1)}
                                % open rate
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Scheduled
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      scheduledMessages.filter((m) => m.status === "scheduled")
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pending messages
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sent Today
                  </CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recurring
                  </CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {scheduledMessages.filter((m) => m.recurring).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active automations
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.2%</div>
                  <p className="text-xs text-muted-foreground">
                    Delivery success
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Scheduled For</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">
                          {message.title}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(message.scheduledFor).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {message.timezone}
                          </div>
                        </TableCell>
                        <TableCell>
                          {message.recipients.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {message.recurring ? (
                            <Badge variant="outline">
                              {message.recurring.frequency}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              message.status === "scheduled"
                                ? "outline"
                                : message.status === "sent"
                                  ? "default"
                                  : message.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {message.status === "scheduled" && (
                              <Button variant="outline" size="sm">
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    AI Optimizations
                  </CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {optimizations.filter((o) => o.enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {optimizations.length} total available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Performance
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      optimizations.reduce(
                        (acc, opt) => acc + opt.performance,
                        0,
                      ) / optimizations.length,
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Improvement score
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages Optimized
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Time Saved
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42h</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Optimization Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizations.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{opt.name}</h4>
                          <Badge variant="outline">
                            {opt.performance}% effective
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {opt.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Last optimized:{" "}
                          {new Date(opt.lastOptimized).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={opt.enabled}
                          onCheckedChange={() => toggleOptimization(opt.id)}
                        />
                        <span className="text-sm">
                          {opt.enabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="i18n" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Languages
                  </CardTitle>
                  <Languages className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {i18nRules.filter((r) => r.enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {i18nRules.length} total configured
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Regions</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(i18nRules.map((r) => r.region)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique regions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Templates
                  </CardTitle>
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {i18nRules.reduce(
                      (acc, rule) => acc + Object.keys(rule.templates).length,
                      0,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Localized templates
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Coverage
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    User base covered
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Internationalization Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Language</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Templates</TableHead>
                      <TableHead>Date Format</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {i18nRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">
                          {rule.language}
                        </TableCell>
                        <TableCell>{rule.region}</TableCell>
                        <TableCell>
                          {Object.keys(rule.templates).length}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {rule.dateFormat}
                        </TableCell>
                        <TableCell>{rule.currency}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleI18nRule(rule.id)}
                            />
                            <span className="text-sm">
                              {rule.enabled ? "Active" : "Disabled"}
                            </span>
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
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
