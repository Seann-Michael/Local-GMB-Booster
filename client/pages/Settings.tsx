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
import { MetadataSettings } from "@/components/MetadataSettings";
import {
  Save,
  Building2,
  Settings as SettingsIcon,
  Globe,
  Bot,
  Webhook,
  Tag,
  Image,
  Bell,
  Shield,
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
  Shield as ShieldIcon,
  Zap,
  Archive,
  TrendingDown,
  HardDrive,
  BarChart3,
  FileImage,
  Video,
  FileText,
  Activity,
  Volume2,
  VolumeX,
  MessageSquare,
  Smartphone,
  Monitor,
  Info,
  Ban,
  XCircle,
  RefreshCw,
  Moon,
  Clock,
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
  // Review Settings
  reviewReminderEnabled: boolean;
  reviewReminderDays: number;
  autoRequestReviews: boolean;
  reviewEmailTemplate: string;
  minimumProjectValue: number;
  reviewAiPrompt: string;
  reviewGateTitle: string;
  reviewGateDescription: string;
  reviewGateVideoUrl: string;
  // Users
  users: UserItem[];
  // Enhanced Billing
  creditCard: CreditCardInfo;
  invoices: InvoiceItem[];
  // Comprehensive Notification Preferences
  enableNotifications: boolean;
  enableSounds: boolean;
  messageTypes: {
    info: boolean;
    warning: boolean;
    error: boolean;
    success: boolean;
  };
  deliveryMethods: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  notificationFrequency: string;
  digestTime: string;
  doNotDisturbEnabled: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  doNotDisturbWeekendsOnly: boolean;
  autoMarkAsRead: boolean;
  showPreviews: boolean;
  groupSimilar: boolean;
  // File Optimization
  autoOptimization: boolean;
  compressionLevel: number;
  maxFileSize: number;
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
  { id: "security", label: "Security", icon: Shield },
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
  facebookConnected: false,
  googleMyBusinessConnected: true,
  goHighLevelApiKey: "",
  webhooks: [
    {
      id: "1",
      name: "Project Completion",
      url: "https://example.com/webhook",
      events: ["project.completed", "project.created"],
      active: true,
    },
  ],
  aiPromptTemplate:
    "Create a professional description for a {PROJECT_TYPE} project at {ADDRESS}. Include details about {SERVICES} and highlight the quality of work.",
  aiInstructions:
    "Write engaging, professional descriptions that highlight the benefits and quality of the work. Use a friendly but professional tone.",
  aiVariables: [
    "PROJECT_TYPE",
    "ADDRESS",
    "SERVICES",
    "CUSTOMER_NAME",
    "COMPLETION_DATE",
  ],
  businessTags: [
    { id: "1", name: "Pizza", color: "#ef4444" },
    { id: "2", name: "Italian", color: "#3b82f6" },
    { id: "3", name: "Delivery", color: "#10b981" },
  ],
  allowedImageTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  allowedVideoTypes: [".mp4", ".mov", ".avi", ".wmv"],
  maxFileSize: 10,
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: true,
  systemAlerts: true,
  twoFactorAuth: false,
  passwordRequirements: "strong",
  sessionTimeout: 30,
  billingContact: "Joe Smith",
  billingEmail: "billing@joespizza.com",
  autoRenewal: true,
  currentPlan: "pro",
  planFeatures: [
    "Unlimited Projects",
    "Advanced Analytics",
    "Priority Support",
  ],
  // Review Settings
  reviewReminderEnabled: true,
  reviewReminderDays: 7,
  autoRequestReviews: true,
  reviewEmailTemplate:
    "Hi {CUSTOMER_NAME}, we'd love to hear about your experience with our {PROJECT_TYPE} project!",
  minimumProjectValue: 500,
  reviewAiPrompt:
    "Generate a personalized review request message based on the project details. Make it friendly, professional, and specific to the work completed.",
  reviewGateTitle: "We'd Love Your Feedback!",
  reviewGateDescription:
    "Your review helps us improve and helps other customers make informed decisions. Thank you for taking the time to share your experience.",
  reviewGateVideoUrl: "",
  // Users
  users: [
    {
      id: "1",
      name: "Joe Smith",
      email: "joe@joespizza.com",
      role: "owner",
      status: "active",
      lastLogin: "2024-01-15",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria@joespizza.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-14",
      permissions: ["manage_projects", "manage_billing", "manage_users"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@joespizza.com",
      role: "editor",
      status: "active",
      lastLogin: "2024-01-13",
      permissions: ["manage_projects", "view_reports"],
    },
  ],
  // Enhanced Billing
  creditCard: {
    last4: "4242",
    brand: "Visa",
    expMonth: 12,
    expYear: 2025,
  },
  invoices: [
    {
      id: "inv_001",
      date: "2024-01-01",
      amount: 49.0,
      status: "paid",
      downloadUrl: "/api/invoices/inv_001/download",
    },
    {
      id: "inv_002",
      date: "2023-12-01",
      amount: 49.0,
      status: "paid",
      downloadUrl: "/api/invoices/inv_002/download",
    },
    {
      id: "inv_003",
      date: "2023-11-01",
      amount: 49.0,
      status: "paid",
      downloadUrl: "/api/invoices/inv_003/download",
    },
  ],
  // Comprehensive Notification Preferences
  enableNotifications: true,
  enableSounds: true,
  messageTypes: {
    info: true,
    warning: true,
    error: true,
    success: true,
  },
  deliveryMethods: {
    email: true,
    sms: false,
    push: true,
    inApp: true,
  },
  notificationFrequency: "immediate",
  digestTime: "09:00",
  doNotDisturbEnabled: false,
  doNotDisturbStart: "22:00",
  doNotDisturbEnd: "08:00",
  doNotDisturbWeekendsOnly: false,
  autoMarkAsRead: false,
  showPreviews: true,
  groupSimilar: true,
  // File Optimization
  autoOptimization: true,
  compressionLevel: 80,
  maxFileSize: 10,
  allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov"],
  totalSpaceSaved: 2.4,
};

export default function Settings() {
  // State
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookItem | null>(
    null,
  );
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("business_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Update setting helper
  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Save settings
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

  // Webhook operations
  const addWebhook = (webhook: Omit<WebhookItem, "id">) => {
    const newWebhook: WebhookItem = {
      ...webhook,
      id: Date.now().toString(),
    };
    setSettings((prev) => ({
      ...prev,
      webhooks: [...prev.webhooks, newWebhook],
    }));
  };

  const updateWebhook = (id: string, updates: Partial<WebhookItem>) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      ),
    }));
  };

  const deleteWebhook = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.filter((w) => w.id !== id),
    }));
  };

  // Tag operations
  const addTag = (tag: Omit<TagItem, "id">) => {
    const newTag: TagItem = {
      ...tag,
      id: Date.now().toString(),
    };
    setSettings((prev) => ({
      ...prev,
      businessTags: [...prev.businessTags, newTag],
    }));
  };

  const deleteTag = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: prev.businessTags.filter((t) => t.id !== id),
    }));
  };

  // File type operations
  const addFileType = (type: "image" | "video", extension: string) => {
    const key = type === "image" ? "allowedImageTypes" : "allowedVideoTypes";
    setSettings((prev) => ({
      ...prev,
      [key]: [...prev[key], extension],
    }));
  };

  const removeFileType = (type: "image" | "video", extension: string) => {
    const key = type === "image" ? "allowedImageTypes" : "allowedVideoTypes";
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key].filter((t) => t !== extension),
    }));
  };

  const removeAIVariable = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      aiVariables: prev.aiVariables.filter((_, i) => i !== index),
    }));
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Business Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your business profile, preferences, and configurations
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="gap-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {navigationTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setActiveTab(tab.id);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </div>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>
                      Basic information about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sub Account ID */}
                    <div>
                      <Label htmlFor="subAccountId">Sub Account ID</Label>
                      <Input
                        id="subAccountId"
                        value={settings.subAccountId}
                        readOnly
                        className="bg-muted"
                        title="This is your unique sub account identifier"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This is your unique sub account identifier
                      </p>
                    </div>

                    {/* Business Logo */}
                    <div>
                      <Label htmlFor="businessLogo">Business Logo</Label>
                      <div className="space-y-2">
                        {settings.businessLogo && (
                          <div className="w-20 h-20 border rounded-lg overflow-hidden">
                            <img
                              src={settings.businessLogo}
                              alt="Business Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <FileImage className="h-4 w-4" />
                            Upload Logo
                          </Button>
                          {settings.businessLogo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSetting("businessLogo", "")}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload your business logo (recommended: 200x200px)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={settings.businessName}
                          onChange={(e) =>
                            updateSetting("businessName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={settings.contactName}
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
                          value={settings.email}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Business Phone</Label>
                        <Input
                          id="phone"
                          value={settings.phone}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={settings.website}
                          onChange={(e) =>
                            updateSetting("website", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={settings.address}
                          onChange={(e) =>
                            updateSetting("address", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={settings.city}
                          onChange={(e) =>
                            updateSetting("city", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={settings.state}
                          onChange={(e) =>
                            updateSetting("state", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Settings */}
              {activeTab === "project" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>
                      Configure how projects are handled
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-post to Facebook</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically post completed projects to Facebook
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPostFacebook}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostFacebook", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-post to Google My Business</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically post completed projects to Google My
                          Business
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPostGoogleMyBusiness}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostGoogleMyBusiness", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>AI-generated descriptions</Label>
                        <p className="text-sm text-muted-foreground">
                          Use AI to generate project descriptions
                        </p>
                      </div>
                      <Switch
                        checked={settings.aiPromptForDescriptions}
                        onCheckedChange={(checked) =>
                          updateSetting("aiPromptForDescriptions", checked)
                        }
                      />
                    </div>

                    {settings.aiPromptForDescriptions && (
                      <div className="pt-4 border-t">
                        <Label htmlFor="aiProjectRewritePrompt">
                          AI Project Rewrite Prompt
                        </Label>
                        <Textarea
                          id="aiProjectRewritePrompt"
                          value={settings.aiProjectRewritePrompt}
                          onChange={(e) =>
                            updateSetting(
                              "aiProjectRewritePrompt",
                              e.target.value,
                            )
                          }
                          rows={4}
                          className="mt-2"
                          placeholder="Enter the AI prompt for rewriting project descriptions..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This prompt will be used when AI rewrites existing
                          project descriptions
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Integrations */}
              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                    <CardDescription>
                      Connect with external services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Facebook Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              f
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Facebook</h3>
                            <p className="text-sm text-muted-foreground">
                              {settings.facebookConnected
                                ? "Connected to your Facebook account"
                                : "Connect to automatically post completed projects"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings.facebookConnected && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Connected
                            </Badge>
                          )}
                          <Button
                            variant={
                              settings.facebookConnected ? "outline" : "default"
                            }
                            onClick={() => {
                              if (settings.facebookConnected) {
                                updateSetting("facebookConnected", false);
                                toast.success("Facebook disconnected");
                              } else {
                                updateSetting("facebookConnected", true);
                                toast.success("Facebook connected");
                              }
                            }}
                            className="gap-2"
                          >
                            {settings.facebookConnected ? (
                              <>
                                <X className="h-4 w-4" />
                                Disconnect
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                Connect Facebook
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Google My Business Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              G
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Google My Business</h3>
                            <p className="text-sm text-muted-foreground">
                              {settings.googleMyBusinessConnected
                                ? "Connected to your Google My Business account"
                                : "Connect to automatically post completed projects"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings.googleMyBusinessConnected && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Connected
                            </Badge>
                          )}
                          <Button
                            variant={
                              settings.googleMyBusinessConnected
                                ? "outline"
                                : "default"
                            }
                            onClick={() => {
                              if (settings.googleMyBusinessConnected) {
                                updateSetting(
                                  "googleMyBusinessConnected",
                                  false,
                                );
                                toast.success(
                                  "Google My Business disconnected",
                                );
                              } else {
                                updateSetting(
                                  "googleMyBusinessConnected",
                                  true,
                                );
                                toast.success("Google My Business connected");
                              }
                            }}
                            className="gap-2"
                          >
                            {settings.googleMyBusinessConnected ? (
                              <>
                                <X className="h-4 w-4" />
                                Disconnect
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                Connect Google
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* GoHighLevel Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              GH
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">GoHighLevel</h3>
                            <p className="text-sm text-muted-foreground">
                              Connect your GoHighLevel CRM for lead management
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="goHighLevelApiKey">API Key</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="goHighLevelApiKey"
                              type="password"
                              value={settings.goHighLevelApiKey}
                              onChange={(e) =>
                                updateSetting(
                                  "goHighLevelApiKey",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter your GoHighLevel API key"
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              disabled={!settings.goHighLevelApiKey}
                              onClick={() =>
                                toast.success("Connection tested successfully")
                              }
                            >
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Webhooks */}
                    <div className="pt-6 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Webhooks</h3>
                          <p className="text-sm text-muted-foreground">
                            Configure webhook notifications
                          </p>
                        </div>
                        <Button
                          onClick={() => setShowWebhookForm(true)}
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Webhook
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(settings?.webhooks || []).map((webhook) => (
                          <div
                            key={webhook.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">{webhook.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {webhook.url}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {(webhook?.events || []).map((event) => (
                                  <Badge
                                    key={event}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingWebhook(webhook)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeWebhook(webhook.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Assistant */}
              {activeTab === "ai" && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>
                      Configure AI-powered features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="aiPromptTemplate">Prompt Template</Label>
                      <Textarea
                        id="aiPromptTemplate"
                        value={settings.aiPromptTemplate}
                        onChange={(e) =>
                          updateSetting("aiPromptTemplate", e.target.value)
                        }
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="aiInstructions">AI Instructions</Label>
                      <Textarea
                        id="aiInstructions"
                        value={settings.aiInstructions}
                        onChange={(e) =>
                          updateSetting("aiInstructions", e.target.value)
                        }
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(settings?.aiVariables || []).map(
                          (variable, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="gap-1"
                            >
                              {variable}
                              <span
                                className="cursor-pointer hover:bg-muted rounded-sm p-0.5 ml-1"
                                onClick={() => removeAIVariable(index)}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Webhooks */}
              {activeTab === "webhooks" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>
                      Configure webhook notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => setShowWebhookForm(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Webhook
                    </Button>

                    <div className="space-y-3">
                      {(settings?.webhooks || []).map((webhook) => (
                        <div key={webhook.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{webhook.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {webhook.url}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {(webhook?.events || []).map((event) => (
                                  <Badge
                                    key={event}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  webhook.active ? "default" : "secondary"
                                }
                              >
                                {webhook.active ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingWebhook(webhook)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteWebhook(webhook.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {activeTab === "tags" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Business Tags</CardTitle>
                    <CardDescription>
                      Organize projects with custom tags
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => setShowTagForm(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Tag
                    </Button>

                    <div className="grid gap-3">
                      {(settings?.businessTags || []).map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="font-medium">{tag.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTag(tag.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media Settings */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>File Type Management</CardTitle>
                      <CardDescription>
                        Configure allowed file types and sizes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Allowed Image Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(settings?.allowedImageTypes || []).map((type) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="gap-1"
                            >
                              {type}
                              <span
                                className="cursor-pointer hover:bg-muted rounded-sm p-0.5 ml-1"
                                onClick={() => removeFileType("image", type)}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newType = prompt(
                                "Enter image file extension (e.g., .webp):",
                              );
                              if (
                                newType &&
                                !(settings?.allowedImageTypes || []).includes(
                                  newType,
                                )
                              ) {
                                addFileType("image", newType);
                              }
                            }}
                            className="gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Type
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Allowed Video Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(settings?.allowedVideoTypes || []).map((type) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="gap-1"
                            >
                              {type}
                              <span
                                className="cursor-pointer hover:bg-muted rounded-sm p-0.5 ml-1"
                                onClick={() => removeFileType("video", type)}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newType = prompt(
                                "Enter video file extension (e.g., .mp4):",
                              );
                              if (
                                newType &&
                                !(settings?.allowedVideoTypes || []).includes(
                                  newType,
                                )
                              ) {
                                addFileType("video", newType);
                              }
                            }}
                            className="gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Type
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="maxFileSize">
                          Maximum File Size (MB)
                        </Label>
                        <Input
                          id="maxFileSize"
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) =>
                            updateSetting(
                              "maxFileSize",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-32"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Metadata Settings</CardTitle>
                      <CardDescription>
                        Configure automatic metadata for uploaded media
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MetadataSettings />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Review Settings */}
              {activeTab === "reviews" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Settings</CardTitle>
                    <CardDescription>
                      Configure automatic review requests and management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Review Requests</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically request reviews after project completion
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoRequestReviews}
                        onCheckedChange={(checked) =>
                          updateSetting("autoRequestReviews", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Review Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Send reminder emails if no review is received
                        </p>
                      </div>
                      <Switch
                        checked={settings.reviewReminderEnabled}
                        onCheckedChange={(checked) =>
                          updateSetting("reviewReminderEnabled", checked)
                        }
                      />
                    </div>

                    {settings.reviewReminderEnabled && (
                      <div>
                        <Label htmlFor="reviewReminderDays">
                          Reminder Frequency (days)
                        </Label>
                        <Input
                          id="reviewReminderDays"
                          type="number"
                          value={settings.reviewReminderDays}
                          onChange={(e) =>
                            updateSetting(
                              "reviewReminderDays",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-32"
                          min="1"
                          max="30"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Send reminders every {settings.reviewReminderDays}{" "}
                          days
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="minimumProjectValue">
                        Minimum Project Value for Reviews ($)
                      </Label>
                      <Input
                        id="minimumProjectValue"
                        type="number"
                        value={settings.minimumProjectValue}
                        onChange={(e) =>
                          updateSetting(
                            "minimumProjectValue",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-40"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Only request reviews for projects above this value
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="reviewEmailTemplate">
                        Review Request Email Template
                      </Label>
                      <Textarea
                        id="reviewEmailTemplate"
                        value={settings.reviewEmailTemplate}
                        onChange={(e) =>
                          updateSetting("reviewEmailTemplate", e.target.value)
                        }
                        rows={4}
                        className="mt-2"
                        placeholder="Hi {CUSTOMER_NAME}, we'd love to hear about your experience..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Available variables: {"{CUSTOMER_NAME}"},{" "}
                        {"{PROJECT_TYPE}"}, {"{COMPLETION_DATE}"}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <Label htmlFor="reviewAiPrompt">
                        AI Review Request Prompt
                      </Label>
                      <Textarea
                        id="reviewAiPrompt"
                        value={settings.reviewAiPrompt}
                        onChange={(e) =>
                          updateSetting("reviewAiPrompt", e.target.value)
                        }
                        rows={3}
                        className="mt-2"
                        placeholder="Enter AI prompt for generating personalized review requests..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        AI will use this prompt to generate personalized review
                        request messages
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">
                        Review Gate Customization
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reviewGateTitle">
                            Review Gate Title
                          </Label>
                          <Input
                            id="reviewGateTitle"
                            value={settings.reviewGateTitle}
                            onChange={(e) =>
                              updateSetting("reviewGateTitle", e.target.value)
                            }
                            className="mt-1"
                            placeholder="We'd Love Your Feedback!"
                          />
                        </div>

                        <div>
                          <Label htmlFor="reviewGateDescription">
                            Review Gate Description
                          </Label>
                          <Textarea
                            id="reviewGateDescription"
                            value={settings.reviewGateDescription}
                            onChange={(e) =>
                              updateSetting(
                                "reviewGateDescription",
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="mt-1"
                            placeholder="Your review helps us improve and helps other customers make informed decisions..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="reviewGateVideo">
                            Review Gate Video
                          </Label>
                          <div className="space-y-2 mt-1">
                            <Input
                              id="reviewGateVideo"
                              type="url"
                              value={settings.reviewGateVideoUrl}
                              onChange={(e) =>
                                updateSetting(
                                  "reviewGateVideoUrl",
                                  e.target.value,
                                )
                              }
                              placeholder="https://example.com/video.mp4 or paste YouTube URL"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <FileImage className="h-4 w-4" />
                                Upload Video
                              </Button>
                              {settings.reviewGateVideoUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateSetting("reviewGateVideoUrl", "")
                                  }
                                >
                                  Remove Video
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Upload a video or provide a URL to show on the
                              review gate page
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  {/* Global Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Global Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Enable Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Turn on/off all notifications globally
                          </p>
                        </div>
                        <Switch
                          checked={settings.enableNotifications}
                          onCheckedChange={(checked) =>
                            updateSetting("enableNotifications", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base flex items-center gap-2">
                            {settings.enableSounds ? (
                              <Volume2 className="h-4 w-4" />
                            ) : (
                              <VolumeX className="h-4 w-4" />
                            )}
                            Notification Sounds
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Play sound when notifications arrive
                          </p>
                        </div>
                        <Switch
                          checked={settings.enableSounds}
                          onCheckedChange={(checked) =>
                            updateSetting("enableSounds", checked)
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Message Types</CardTitle>
                      <CardDescription>
                        Choose which types of messages you want to receive
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Info className="h-4 w-4 text-blue-500" />
                            <div>
                              <Label className="text-base">Information</Label>
                              <p className="text-xs text-muted-foreground">
                                General information and updates
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.messageTypes?.info || false}
                            onCheckedChange={(checked) => {
                              const newMessageTypes = {
                                ...(settings?.messageTypes || {}),
                                info: checked,
                              };
                              updateSetting("messageTypes", newMessageTypes);
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <div>
                              <Label className="text-base">Warning</Label>
                              <p className="text-xs text-muted-foreground">
                                Important warnings and alerts
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.messageTypes?.warning || false}
                            onCheckedChange={(checked) => {
                              const newMessageTypes = {
                                ...(settings?.messageTypes || {}),
                                warning: checked,
                              };
                              updateSetting("messageTypes", newMessageTypes);
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                              <Label className="text-base">Success</Label>
                              <p className="text-xs text-muted-foreground">
                                Success confirmations
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.messageTypes?.success || false}
                            onCheckedChange={(checked) => {
                              const newMessageTypes = {
                                ...(settings?.messageTypes || {}),
                                success: checked,
                              };
                              updateSetting("messageTypes", newMessageTypes);
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <div>
                              <Label className="text-base">Error</Label>
                              <p className="text-xs text-muted-foreground">
                                Error notifications and issues
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.messageTypes?.error || false}
                            onCheckedChange={(checked) => {
                              const newMessageTypes = {
                                ...(settings?.messageTypes || {}),
                                error: checked,
                              };
                              updateSetting("messageTypes", newMessageTypes);
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Message Categories</CardTitle>
                      <CardDescription>
                        Select categories of messages you're interested in
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Settings className="h-4 w-4 text-gray-500" />
                            <div>
                              <Label className="text-base">System</Label>
                              <p className="text-xs text-muted-foreground">
                                System updates and maintenance
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.systemAlerts}
                            onCheckedChange={(checked) =>
                              updateSetting("systemAlerts", checked)
                            }
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-purple-500" />
                            <div>
                              <Label className="text-base">Marketing</Label>
                              <p className="text-xs text-muted-foreground">
                                Feature announcements and promotions
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.marketingEmails}
                            onCheckedChange={(checked) =>
                              updateSetting("marketingEmails", checked)
                            }
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-blue-500" />
                            <div>
                              <Label className="text-base">Support</Label>
                              <p className="text-xs text-muted-foreground">
                                Support updates and help
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) =>
                              updateSetting("emailNotifications", checked)
                            }
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <div>
                              <Label className="text-base">Emergency</Label>
                              <p className="text-xs text-muted-foreground">
                                Critical alerts and security
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.systemAlerts}
                            onCheckedChange={(checked) =>
                              updateSetting("systemAlerts", checked)
                            }
                            disabled={!settings.enableNotifications}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Methods</CardTitle>
                      <CardDescription>
                        Choose how you want to receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-primary" />
                            <div>
                              <Label className="text-base">
                                In-App Notifications
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Show notifications in the app
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.inApp || false}
                            onCheckedChange={(checked) => {
                              const newDeliveryMethods = {
                                ...(settings?.deliveryMethods || {}),
                                inApp: checked,
                              };
                              updateSetting(
                                "deliveryMethods",
                                newDeliveryMethods,
                              );
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <div>
                              <Label className="text-base">
                                Email Notifications
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Send notifications to your email
                              </p>
                              {settings?.deliveryMethods?.email && (
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  Contact info required
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.email || false}
                            onCheckedChange={(checked) => {
                              const newDeliveryMethods = {
                                ...(settings?.deliveryMethods || {}),
                                email: checked,
                              };
                              updateSetting(
                                "deliveryMethods",
                                newDeliveryMethods,
                              );
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <div>
                              <Label className="text-base">
                                SMS Notifications
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Send text messages to your phone
                              </p>
                              {settings?.deliveryMethods?.sms && (
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  Contact info required
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.sms || false}
                            onCheckedChange={(checked) => {
                              const newDeliveryMethods = {
                                ...(settings?.deliveryMethods || {}),
                                sms: checked,
                              };
                              updateSetting(
                                "deliveryMethods",
                                newDeliveryMethods,
                              );
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-primary" />
                            <div>
                              <Label className="text-base">
                                Push Notifications
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Send push notifications to your device
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings?.deliveryMethods?.push || false}
                            onCheckedChange={(checked) => {
                              const newDeliveryMethods = {
                                ...(settings?.deliveryMethods || {}),
                                push: checked,
                              };
                              updateSetting(
                                "deliveryMethods",
                                newDeliveryMethods,
                              );
                            }}
                            disabled={!settings.enableNotifications}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Frequency & Timing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Frequency & Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">
                          Notification Frequency
                        </Label>
                        <Select
                          value={settings.notificationFrequency || "immediate"}
                          onValueChange={(value) =>
                            updateSetting("notificationFrequency", value)
                          }
                          disabled={!settings.enableNotifications}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Immediate - Receive notifications as they happen
                              </div>
                            </SelectItem>
                            <SelectItem value="hourly">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Hourly Digest - Batch notifications every hour
                              </div>
                            </SelectItem>
                            <SelectItem value="daily">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Daily Digest - One summary per day
                              </div>
                            </SelectItem>
                            <SelectItem value="weekly">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Weekly Digest - One summary per week
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {settings?.notificationFrequency &&
                        settings.notificationFrequency !== "immediate" && (
                          <div className="grid gap-2">
                            <Label htmlFor="digestTime">Digest Time</Label>
                            <Input
                              id="digestTime"
                              type="time"
                              value={settings.digestTime || "09:00"}
                              onChange={(e) =>
                                updateSetting("digestTime", e.target.value)
                              }
                              disabled={!settings.enableNotifications}
                            />
                            <p className="text-xs text-muted-foreground">
                              Time when you want to receive your digest
                            </p>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  {/* Do Not Disturb */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Moon className="h-5 w-5" />
                        Do Not Disturb
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Enable Do Not Disturb
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Silence notifications during specific hours
                          </p>
                        </div>
                        <Switch
                          checked={settings.doNotDisturbEnabled || false}
                          onCheckedChange={(checked) =>
                            updateSetting("doNotDisturbEnabled", checked)
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>

                      {settings?.doNotDisturbEnabled && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="startTime">Start Time</Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={settings.doNotDisturbStart || "22:00"}
                                onChange={(e) =>
                                  updateSetting(
                                    "doNotDisturbStart",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="endTime">End Time</Label>
                              <Input
                                id="endTime"
                                type="time"
                                value={settings.doNotDisturbEnd || "08:00"}
                                onChange={(e) =>
                                  updateSetting(
                                    "doNotDisturbEnd",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Weekends Only</Label>
                              <p className="text-sm text-muted-foreground">
                                Apply Do Not Disturb only on weekends
                              </p>
                            </div>
                            <Switch
                              checked={
                                settings.doNotDisturbWeekendsOnly || false
                              }
                              onCheckedChange={(checked) =>
                                updateSetting(
                                  "doNotDisturbWeekendsOnly",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Advanced Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Auto-mark as Read</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically mark notifications as read after
                            viewing
                          </p>
                        </div>
                        <Switch
                          checked={settings.autoMarkAsRead || false}
                          onCheckedChange={(checked) =>
                            updateSetting("autoMarkAsRead", checked)
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Show Message Previews
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Display message content in notification previews
                          </p>
                        </div>
                        <Switch
                          checked={settings.showPreviews || true}
                          onCheckedChange={(checked) =>
                            updateSetting("showPreviews", checked)
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Group Similar Messages
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Combine similar notifications into groups
                          </p>
                        </div>
                        <Switch
                          checked={settings.groupSimilar || true}
                          onCheckedChange={(checked) =>
                            updateSetting("groupSimilar", checked)
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                      <CardDescription>
                        Required for email and SMS notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={settings.email}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={settings.phone}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Account Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>
                        Protect your admin account with security features
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={settings.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            updateSetting("twoFactorAuth", checked)
                          }
                        />
                      </div>

                      {settings.twoFactorAuth && (
                        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Two-Factor Authentication Enabled
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mb-3">
                            Your account is protected with 2FA using your mobile
                            device.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Recovery Codes
                            </Button>
                            <Button variant="outline" size="sm">
                              Change Device
                            </Button>
                          </div>
                        </div>
                      )}

                      {!settings.twoFactorAuth && (
                        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                              Two-Factor Authentication Disabled
                            </span>
                          </div>
                          <p className="text-sm text-yellow-700 mb-3">
                            Your account is vulnerable. Enable 2FA for better
                            security.
                          </p>
                          <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Enable 2FA
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Password Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Password Security</CardTitle>
                      <CardDescription>
                        Manage your password and security requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Current Password Strength</Label>
                        <div className="mt-2 space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Strong password • Last changed 45 days ago
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button variant="outline" className="gap-2">
                          <Shield className="h-4 w-4" />
                          Change Password
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="passwordRequirements">
                          Password Requirements for Team
                        </Label>
                        <Select
                          value={settings.passwordRequirements}
                          onValueChange={(value) =>
                            updateSetting("passwordRequirements", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              Basic (8+ characters)
                            </SelectItem>
                            <SelectItem value="strong">
                              Strong (12+ chars, mixed case, numbers)
                            </SelectItem>
                            <SelectItem value="very-strong">
                              Very Strong (16+ chars, special characters)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Applies to all team members you invite
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Session Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Management</CardTitle>
                      <CardDescription>
                        Control how long you stay logged in
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="sessionTimeout">
                          Session Timeout (minutes)
                        </Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) =>
                            updateSetting(
                              "sessionTimeout",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-32 mt-1"
                          min="5"
                          max="480"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          You'll be automatically logged out after this time
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Active Sessions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Monitor className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">Current Session</p>
                                <p className="text-sm text-muted-foreground">
                                  Chrome on Windows • New York, NY
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Started 2 hours ago
                                </p>
                              </div>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Smartphone className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">Mobile Session</p>
                                <p className="text-sm text-muted-foreground">
                                  Safari on iPhone • Last active 1 hour ago
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Started yesterday
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* API Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle>API Security</CardTitle>
                      <CardDescription>
                        Manage API keys and access tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">
                              Personal Access Token
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              For API access and integrations
                            </p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                          sk_live_51J...abc123 • Created Jan 15, 2024
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            Regenerate Token
                          </Button>
                          <Button variant="outline" size="sm">
                            Revoke Access
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create New API Key
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Audit Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Activity</CardTitle>
                      <CardDescription>
                        Recent security events for your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Successful login
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Chrome on Windows from New York, NY • 2 hours ago
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Password changed
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Password updated successfully • 45 days ago
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Failed login attempt
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Incorrect password from unknown IP • 3 days ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download Security Log
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* File Optimization */}
              {activeTab === "file-optimization" && (
                <div className="space-y-6">
                  {/* Optimization Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>File Optimization Settings</CardTitle>
                      <CardDescription>
                        Configure how files are optimized and compressed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-primary" />
                          <div>
                            <Label>Auto Optimization</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically optimize uploaded files
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.autoOptimization}
                          onCheckedChange={(checked) =>
                            updateSetting("autoOptimization", checked)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Compression Level: {settings.compressionLevel}%
                        </Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.compressionLevel}
                          onChange={(e) =>
                            updateSetting(
                              "compressionLevel",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>No compression</span>
                          <span>Maximum compression</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="maxFileSizeOpt">
                          Maximum File Size (MB)
                        </Label>
                        <Input
                          id="maxFileSizeOpt"
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) =>
                            updateSetting(
                              "maxFileSize",
                              parseInt(e.target.value),
                            )
                          }
                          min="1"
                          max="100"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Files larger than this will be compressed
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* File Type Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Supported File Types</CardTitle>
                      <CardDescription>
                        Manage which file types can be optimized
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {[
                          ".jpg",
                          ".jpeg",
                          ".png",
                          ".gif",
                          ".webp",
                          ".mp4",
                          ".mov",
                          ".avi",
                        ].map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`filetype-${type}`}
                              checked={(
                                settings?.allowedFileTypes || []
                              ).includes(type)}
                              onChange={(e) => {
                                const newTypes = e.target.checked
                                  ? [
                                      ...(settings?.allowedFileTypes || []),
                                      type,
                                    ]
                                  : (settings?.allowedFileTypes || []).filter(
                                      (t) => t !== type,
                                    );
                                updateSetting("allowedFileTypes", newTypes);
                              }}
                              className="rounded"
                            />
                            <Label
                              htmlFor={`filetype-${type}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimization Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Statistics</CardTitle>
                      <CardDescription>
                        View storage savings and optimization performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <HardDrive className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold text-primary">
                            {(settings?.totalSpaceSaved || 0).toFixed(1)} GB
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Space Saved
                          </p>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                          <TrendingDown className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <div className="text-2xl font-bold text-green-600">
                            {settings.compressionLevel}%
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Avg Compression
                          </p>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                          <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <div className="text-2xl font-bold text-blue-600">
                            {settings.allowedFileTypes.length}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            File Types
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button
                          className="gap-2"
                          disabled={!settings.autoOptimization}
                        >
                          <Archive className="h-4 w-4" />
                          Optimize All Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Users */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  {/* Current Users */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Manage user access and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(settings?.users || []).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Last login:{" "}
                                  {new Date(
                                    user.lastLogin,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <Badge
                                  variant={
                                    user.role === "owner"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="mb-1"
                                >
                                  {user.role}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {user.status}
                                </p>
                              </div>
                              {user.role !== "owner" && (
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add User
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Roles & Permissions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Roles & Permissions</CardTitle>
                      <CardDescription>
                        Configure what each role can access
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Owner Role */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">Owner</h4>
                              <p className="text-sm text-muted-foreground">
                                Full access to everything
                              </p>
                            </div>
                            <Badge>System Role</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              All Permissions
                            </Badge>
                          </div>
                        </div>

                        {/* Admin Role */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">Admin</h4>
                              <p className="text-sm text-muted-foreground">
                                Manage projects, users, and billing
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              Manage Projects
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Manage Users
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Manage Billing
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              View Reports
                            </Badge>
                          </div>
                        </div>

                        {/* Editor Role */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">Editor</h4>
                              <p className="text-sm text-muted-foreground">
                                Create and edit projects
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              Manage Projects
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              View Reports
                            </Badge>
                          </div>
                        </div>

                        {/* Viewer Role */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">Viewer</h4>
                              <p className="text-sm text-muted-foreground">
                                Read-only access to projects
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              View Projects
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Invite Users */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Invite New User</CardTitle>
                      <CardDescription>
                        Send an invitation to add a new team member
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inviteRole">Role</Label>
                          <Select defaultValue="viewer">
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="inviteMessage">
                          Personal Message (Optional)
                        </Label>
                        <Textarea
                          id="inviteMessage"
                          placeholder="Welcome to the team! Looking forward to working with you."
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <Button className="gap-2">
                        <Mail className="h-4 w-4" />
                        Send Invitation
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Billing */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>
                        Manage your subscription and billing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg capitalize">
                              {settings.currentPlan} Plan
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              $49/month • Billed monthly
                            </p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">
                            Plan Features:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {(settings?.planFeatures || []).map(
                              (feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Information</CardTitle>
                      <CardDescription>
                        Manage your payment details and billing preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingContact">
                            Billing Contact
                          </Label>
                          <Input
                            id="billingContact"
                            value={settings.billingContact}
                            onChange={(e) =>
                              updateSetting("billingContact", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingEmail">Billing Email</Label>
                          <Input
                            id="billingEmail"
                            type="email"
                            value={settings.billingEmail}
                            onChange={(e) =>
                              updateSetting("billingEmail", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Renewal</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically renew your subscription
                          </p>
                        </div>
                        <Switch
                          checked={settings.autoRenewal}
                          onCheckedChange={(checked) =>
                            updateSetting("autoRenewal", checked)
                          }
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button variant="outline" className="gap-2">
                            <CreditCard className="h-4 w-4" />
                            Update Payment Method
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download Invoice
                          </Button>
                          <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to cancel your subscription?",
                                )
                              ) {
                                // Handle cancellation
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Webhook Form Modal */}
          {(showWebhookForm || editingWebhook) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingWebhook ? "Edit Webhook" : "Add Webhook"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const webhook = {
                      name: formData.get("name") as string,
                      url: formData.get("url") as string,
                      events: (formData.get("events") as string)
                        .split(",")
                        .map((e) => e.trim()),
                      active: formData.get("active") === "on",
                    };

                    if (editingWebhook) {
                      updateWebhook(editingWebhook.id, webhook);
                    } else {
                      addWebhook(webhook);
                    }

                    setShowWebhookForm(false);
                    setEditingWebhook(null);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookName">Name</Label>
                      <Input
                        id="webhookName"
                        name="name"
                        defaultValue={editingWebhook?.name}
                        placeholder="Webhook Name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhookUrl">URL</Label>
                      <Input
                        id="webhookUrl"
                        name="url"
                        type="url"
                        defaultValue={editingWebhook?.url}
                        placeholder="https://example.com/webhook"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhookEvents">
                        Events (comma-separated)
                      </Label>
                      <Input
                        id="webhookEvents"
                        name="events"
                        defaultValue={editingWebhook?.events?.join(", ")}
                        placeholder="project.created, project.completed"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="webhookActive"
                        name="active"
                        defaultChecked={editingWebhook?.active !== false}
                      />
                      <Label htmlFor="webhookActive">Active</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowWebhookForm(false);
                        setEditingWebhook(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingWebhook ? "Update" : "Add"} Webhook
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tag Form Modal */}
          {showTagForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Add Tag</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const tag = {
                      name: formData.get("name") as string,
                      color: formData.get("color") as string,
                    };
                    addTag(tag);
                    setShowTagForm(false);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagName">Tag Name</Label>
                      <Input
                        id="tagName"
                        name="name"
                        placeholder="Tag Name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagColor">Color</Label>
                      <Input
                        id="tagColor"
                        name="color"
                        type="color"
                        defaultValue="#3b82f6"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTagForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Tag</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
