import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/AppLayout";
import {
  Save,
  Building2,
  Settings as SettingsIcon,
  Globe,
  Bot,
  Tag,
  Image,
  Bell,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  X,
  Star,
  CreditCard,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Users,
  Download,
  Calendar,
  Mail,
  Zap,
  Activity,
  Volume2,
  VolumeX,
  MessageSquare,
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface SettingsData {
  businessName: string;
  subAccountId: string;
  businessLogo: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  autoPostFacebook: boolean;
  autoPostGoogleMyBusiness: boolean;
  autoPostRssFeed: boolean;
  aiPromptForDescriptions: boolean;
  aiProjectRewritePrompt: string;
  autoArchiveDays: number;
  facebookConnected: boolean;
  googleMyBusinessConnected: boolean;
  goHighLevelApiKey: string;
  webhooks: WebhookItem[];
  aiPromptTemplate: string;
  aiInstructions: string;
  aiVariables: string[];
  businessTags: TagItem[];
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  maxFileSize: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
  twoFactorAuth: boolean;
  passwordRequirements: string;
  sessionTimeout: number;
  billingContact: string;
  billingEmail: string;
  autoRenewal: boolean;
  currentPlan: string;
  planFeatures: string[];
  reviewReminderEnabled: boolean;
  reviewReminderDays: number;
  autoRequestReviews: boolean;
  reviewEmailTemplate: string;
  minimumProjectValue: number;
  reviewAiPrompt: string;
  reviewGateTitle: string;
  reviewGateDescription: string;
  reviewGateVideoUrl: string;
  users: UserItem[];
  creditCard: CreditCardInfo;
  invoices: InvoiceItem[];
  enableNotifications: boolean;
  enableSounds: boolean;
  desktopNotifications: boolean;
  projectNotifications: {
    newProjects: boolean;
    completions: boolean;
    deadlines: boolean;
  };
  systemNotifications: {
    alerts: boolean;
    updates: boolean;
    security: boolean;
  };
  deliveryMethods: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    push: boolean;
  };
  notificationFrequency: string;
  digestTime: string;
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  autoOptimization: boolean;
  compressionLevel: number;
  allowedFileTypes: string[];
  totalSpaceSaved: number;
}

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

interface TagItem {
  id: string;
  name: string;
  color: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "pending" | "suspended";
  lastLogin: string;
  permissions: string[];
}

interface CreditCardInfo {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

interface InvoiceItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}

// Navigation tabs
const navigationTabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "project", label: "Project Settings", icon: SettingsIcon },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "media", label: "Media Settings", icon: Image },
  { id: "reviews", label: "Review Settings", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "file-optimization", label: "File Optimization", icon: Zap },
  { id: "users", label: "Users", icon: Users },
  { id: "billing", label: "Billing", icon: DollarSign },
];

// Default settings
const defaultSettings: SettingsData = {
  businessName: "Joe's Pizza",
  subAccountId: "SUB_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  businessLogo: "",
  contactName: "Joe Smith",
  email: "joe@joespizza.com",
  phone: "(555) 123-4567",
  website: "https://joespizza.com",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  timezone: "America/New_York",
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
  autoPostFacebook: false,
  autoPostGoogleMyBusiness: true,
  autoPostRssFeed: false,
  aiPromptForDescriptions: true,
  aiProjectRewritePrompt:
    "Rewrite this project description to be more engaging and professional. Highlight the key benefits and quality of work while maintaining the original facts and details.",
  autoArchiveDays: 30,
  facebookConnected: false,
  googleMyBusinessConnected: true,
  goHighLevelApiKey: "",
  webhooks: [],
  aiPromptTemplate: "",
  aiInstructions: "",
  aiVariables: [],
  businessTags: [],
  allowedImageTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  allowedVideoTypes: [".mp4", ".mov", ".avi"],
  maxFileSize: 10,
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: true,
  systemAlerts: true,
  twoFactorAuth: false,
  passwordRequirements: "strong",
  sessionTimeout: 60,
  billingContact: "Joe Smith",
  billingEmail: "joe@joespizza.com",
  autoRenewal: true,
  currentPlan: "pro",
  planFeatures: [
    "Unlimited Projects",
    "Advanced Analytics",
    "Priority Support",
  ],
  reviewReminderEnabled: true,
  reviewReminderDays: 7,
  autoRequestReviews: true,
  reviewEmailTemplate: "",
  minimumProjectValue: 100,
  reviewAiPrompt: "",
  reviewGateTitle: "",
  reviewGateDescription: "",
  reviewGateVideoUrl: "",
  users: [],
  creditCard: { last4: "4242", brand: "Visa", expMonth: 12, expYear: 2025 },
  invoices: [],
  enableNotifications: true,
  enableSounds: true,
  desktopNotifications: true,
  projectNotifications: {
    newProjects: true,
    completions: true,
    deadlines: true,
  },
  systemNotifications: { alerts: true, updates: true, security: true },
  deliveryMethods: { email: true, sms: false, inApp: true, push: true },
  notificationFrequency: "immediate",
  digestTime: "09:00",
  doNotDisturb: { enabled: false, startTime: "22:00", endTime: "08:00" },
  autoOptimization: true,
  compressionLevel: 80,
  allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov"],
  totalSpaceSaved: 2.4,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookItem | null>(
    null,
  );

  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("business_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error instanceof Error ? error.message : String(error),
        );
      }
    };
    loadSettings();
  }, []);

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("business_settings", JSON.stringify(settings));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your business settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-1">
            <nav className="space-y-1">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                      Basic information about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={settings?.businessName || ""}
                          onChange={(e) =>
                            updateSetting("businessName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={settings?.contactName || ""}
                          onChange={(e) =>
                            updateSetting("contactName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Business Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings?.email || ""}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Business Phone</Label>
                        <Input
                          id="phone"
                          value={settings?.phone || ""}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Comprehensive Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                {/* Notification Center Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Center
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" />3 Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Manage all notifications, alerts and communication
                      preferences from this central hub
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            System Alerts
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Real-time system notifications and updates
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            12 Today
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-900">
                            Project Updates
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          Updates on project status and milestones
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            5 Pending
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-900">
                            Communications
                          </span>
                        </div>
                        <p className="text-sm text-purple-700">
                          Client messages and team communications
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            2 Unread
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Master Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      Master Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-primary" />
                        <div>
                          <Label className="text-base">
                            Enable All Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Master switch for all notification types
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings?.enableNotifications !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("enableNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {settings?.enableSounds ? (
                          <Volume2 className="h-4 w-4 text-primary" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <Label className="text-base">
                            Notification Sounds
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Play audio alerts for notifications
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings?.enableSounds !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("enableSounds", checked)
                        }
                        disabled={!settings?.enableNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-4 w-4 text-primary" />
                        <div>
                          <Label className="text-base">
                            Desktop Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Show browser notifications
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings?.desktopNotifications !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("desktopNotifications", checked)
                        }
                        disabled={!settings?.enableNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Notification Categories
                    </CardTitle>
                    <CardDescription>
                      Control which types of notifications you receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          Project Notifications
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">New Projects</span>
                            </div>
                            <Switch
                              checked={
                                settings?.projectNotifications?.newProjects !==
                                false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("projectNotifications", {
                                  ...(settings?.projectNotifications || {}),
                                  newProjects: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Project Completed</span>
                            </div>
                            <Switch
                              checked={
                                settings?.projectNotifications?.completions !==
                                false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("projectNotifications", {
                                  ...(settings?.projectNotifications || {}),
                                  completions: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <span className="text-sm">
                                Deadline Reminders
                              </span>
                            </div>
                            <Switch
                              checked={
                                settings?.projectNotifications?.deadlines !==
                                false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("projectNotifications", {
                                  ...(settings?.projectNotifications || {}),
                                  deadlines: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          System Notifications
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm">System Alerts</span>
                            </div>
                            <Switch
                              checked={
                                settings?.systemNotifications?.alerts !== false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("systemNotifications", {
                                  ...(settings?.systemNotifications || {}),
                                  alerts: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Updates Available</span>
                            </div>
                            <Switch
                              checked={
                                settings?.systemNotifications?.updates !== false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("systemNotifications", {
                                  ...(settings?.systemNotifications || {}),
                                  updates: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm">Security Alerts</span>
                            </div>
                            <Switch
                              checked={
                                settings?.systemNotifications?.security !==
                                false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting("systemNotifications", {
                                  ...(settings?.systemNotifications || {}),
                                  security: checked,
                                })
                              }
                              disabled={!settings?.enableNotifications}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Delivery Methods
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <div>
                              <span className="font-medium">Email</span>
                              <p className="text-xs text-muted-foreground">
                                Get notifications via email
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.email !== false}
                            onCheckedChange={(checked) =>
                              updateSetting("deliveryMethods", {
                                ...(settings?.deliveryMethods || {}),
                                email: checked,
                              })
                            }
                            disabled={!settings?.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <div>
                              <span className="font-medium">SMS</span>
                              <p className="text-xs text-muted-foreground">
                                Urgent notifications via text
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.sms !== false}
                            onCheckedChange={(checked) =>
                              updateSetting("deliveryMethods", {
                                ...(settings?.deliveryMethods || {}),
                                sms: checked,
                              })
                            }
                            disabled={!settings?.enableNotifications}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="h-4 w-4 text-purple-600" />
                            <div>
                              <span className="font-medium">In-App</span>
                              <p className="text-xs text-muted-foreground">
                                Notifications within the app
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.inApp !== false}
                            onCheckedChange={(checked) =>
                              updateSetting("deliveryMethods", {
                                ...(settings?.deliveryMethods || {}),
                                inApp: checked,
                              })
                            }
                            disabled={!settings?.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-orange-600" />
                            <div>
                              <span className="font-medium">Push</span>
                              <p className="text-xs text-muted-foreground">
                                Browser push notifications
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.push !== false}
                            onCheckedChange={(checked) =>
                              updateSetting("deliveryMethods", {
                                ...(settings?.deliveryMethods || {}),
                                push: checked,
                              })
                            }
                            disabled={!settings?.enableNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timing & Frequency */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timing & Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label>Notification Frequency</Label>
                        <Select
                          value={settings?.notificationFrequency || "immediate"}
                          onValueChange={(value) =>
                            updateSetting("notificationFrequency", value)
                          }
                          disabled={!settings?.enableNotifications}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">
                              Hourly Digest
                            </SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">
                              Weekly Summary
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Digest Time (for batched notifications)</Label>
                        <Input
                          type="time"
                          value={settings?.digestTime || "09:00"}
                          onChange={(e) =>
                            updateSetting("digestTime", e.target.value)
                          }
                          disabled={
                            !settings?.enableNotifications ||
                            settings?.notificationFrequency === "immediate"
                          }
                        />
                      </div>
                    </div>

                    {/* Do Not Disturb */}
                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Do Not Disturb</Label>
                          <p className="text-sm text-muted-foreground">
                            Set quiet hours for notifications
                          </p>
                        </div>
                        <Switch
                          checked={settings?.doNotDisturb?.enabled !== false}
                          onCheckedChange={(checked) =>
                            updateSetting("doNotDisturb", {
                              ...(settings?.doNotDisturb || {}),
                              enabled: checked,
                            })
                          }
                          disabled={!settings?.enableNotifications}
                        />
                      </div>

                      {settings?.doNotDisturb?.enabled && (
                        <div className="grid gap-4 md:grid-cols-2 pl-6">
                          <div>
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={
                                settings?.doNotDisturb?.startTime || "22:00"
                              }
                              onChange={(e) =>
                                updateSetting("doNotDisturb", {
                                  ...(settings?.doNotDisturb || {}),
                                  startTime: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={settings?.doNotDisturb?.endTime || "08:00"}
                              onChange={(e) =>
                                updateSetting("doNotDisturb", {
                                  ...(settings?.doNotDisturb || {}),
                                  endTime: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Required for email and SMS notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="notificationEmail">Email Address</Label>
                        <Input
                          id="notificationEmail"
                          type="email"
                          value={settings?.email || ""}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notificationPhone">Phone Number</Label>
                        <Input
                          id="notificationPhone"
                          type="tel"
                          value={settings?.phone || ""}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Notifications
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Project "Kitchen Renovation" completed
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 hours ago • Project Updates
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      </div>

                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            System maintenance scheduled
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 day ago • System Alerts
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New message from John Smith
                          </p>
                          <p className="text-xs text-muted-foreground">
                            3 days ago • Communications
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== "general" && activeTab !== "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    This section is currently under development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The{" "}
                    {navigationTabs.find((tab) => tab.id === activeTab)?.label}{" "}
                    section will be available soon.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
