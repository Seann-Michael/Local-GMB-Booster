import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Info,
  Shield,
  Upload,
  RefreshCw,
  RotateCcw,
  Webhook,
  Palette,
  FileImage,
  Video,
  HardDrive,
  Archive,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

// Comprehensive Types
interface SettingsData {
  // Business Info
  businessName: string;
  businessType: string;
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

  // Project Settings
  autoPostFacebook: boolean;
  autoPostGoogleMyBusiness: boolean;
  autoPostRssFeed: boolean;
  aiPromptForDescriptions: boolean;
  aiProjectRewritePrompt: string;
  autoArchiveDays: number;

  // Integrations
  facebookConnected: boolean;
  googleMyBusinessConnected: boolean;
  goHighLevelApiKey: string;
  webhooks: WebhookItem[];
  rssIncludeImages: boolean;

  // AI Assistant
  aiPromptTemplate: string;
  aiInstructions: string;
  aiVariables: string[];

  // Tags
  businessTags: TagItem[];

  // Media Settings
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  maxFileSize: number;

  // Review Settings
  reviewReminderEnabled: boolean;
  reviewReminderDays: number;
  autoRequestReviews: boolean;
  reviewEmailTemplate: string;
  reviewSmsTemplate: string;
  minimumProjectValue: number;
  reviewAiPrompt: string;
  reviewGateTitle: string;
  reviewGateDescription: string;
  reviewGateVideoUrl: string;

  // Notifications
  enableNotifications: boolean;
  enableSounds: boolean;
  desktopNotifications: boolean;
  messageTypes: {
    info: boolean;
    warning: boolean;
    success: boolean;
    error: boolean;
  };
  categories: {
    system: boolean;
    marketing: boolean;
    support: boolean;
    emergency: boolean;
  };
  deliveryMethods: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  notificationFrequency: string;
  digestTime: string;
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    weekendsOnly: boolean;
  };
  autoMarkAsRead: boolean;
  showPreviews: boolean;
  groupSimilar: boolean;

  // File Optimization
  autoOptimization: boolean;
  compressionLevel: number;
  allowedFileTypes: string[];
  totalSpaceSaved: number;

  // Users
  users: UserItem[];

  // Billing
  billingContact: string;
  billingEmail: string;
  autoRenewal: boolean;
  currentPlan: string;
  planFeatures: string[];
  creditCard: CreditCardInfo;
  invoices: InvoiceItem[];
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

// Navigation Tabs
const navigationTabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "project", label: "Project Settings", icon: SettingsIcon },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "media", label: "Media Settings", icon: Image },
  { id: "reviews", label: "Review Settings", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },

  { id: "users", label: "Users", icon: Users },
  { id: "billing", label: "Billing", icon: DollarSign },
];

// Safe Default Settings
const createDefaultSettings = (): SettingsData => ({
  // Business Info
  businessName: "Joe's Pizza",
  businessType: "restaurant",
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

  // Project Settings
  autoPostFacebook: false,
  autoPostGoogleMyBusiness: true,
  autoPostRssFeed: false,
  aiPromptForDescriptions: true,
  aiProjectRewritePrompt:
    "Rewrite this project description to be more engaging and professional. Highlight the key benefits and quality of work while maintaining the original facts and details.",
  autoArchiveDays: 30,

  // Integrations
  facebookConnected: false,
  googleMyBusinessConnected: true,
  goHighLevelApiKey: "",
  webhooks: [],
  rssIncludeImages: true,

  // AI Assistant
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

  // Tags
  businessTags: [
    { id: "1", name: "Pizza", color: "#ef4444" },
    { id: "2", name: "Italian", color: "#3b82f6" },
    { id: "3", name: "Delivery", color: "#10b981" },
  ],

  // Media Settings
  allowedImageTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  allowedVideoTypes: [".mp4", ".mov", ".avi"],
  maxFileSize: 10,

  // Review Settings
  reviewReminderEnabled: true,
  reviewReminderDays: 7,
  autoRequestReviews: true,
  reviewEmailTemplate:
    "Hi {CUSTOMER_NAME}, we'd love to hear about your experience with our {PROJECT_TYPE} project!",
  reviewSmsTemplate:
    "Hi {CUSTOMER_NAME}! How was your experience with {BUSINESS_NAME}? Leave a review: {REVIEW_LINK}",
  minimumProjectValue: 500,
  reviewAiPrompt: "",
  reviewGateTitle: "",
  reviewGateDescription: "",
  reviewGateVideoUrl: "",

  // Notifications
  enableNotifications: true,
  enableSounds: true,
  desktopNotifications: true,
  messageTypes: { info: true, warning: true, success: true, error: true },
  categories: { system: true, marketing: true, support: true, emergency: true },
  deliveryMethods: { inApp: true, email: true, sms: false, push: true },
  notificationFrequency: "immediate",
  digestTime: "09:00",
  doNotDisturb: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
    weekendsOnly: false,
  },
  autoMarkAsRead: false,
  showPreviews: true,
  groupSimilar: true,

  // File Optimization
  autoOptimization: true,
  compressionLevel: 80,
  allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov"],
  totalSpaceSaved: 2.4,

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
  ],

  // Billing
  billingContact: "Joe Smith",
  billingEmail: "billing@joespizza.com",
  autoRenewal: true,
  currentPlan: "pro",
  planFeatures: [
    "Unlimited Projects",
    "Advanced Analytics",
    "Priority Support",
  ],
  creditCard: { last4: "4242", brand: "Visa", expMonth: 12, expYear: 2025 },
  invoices: [
    {
      id: "inv_001",
      date: "2024-01-01",
      amount: 49.0,
      status: "paid",
      downloadUrl: "/api/invoices/inv_001/download",
    },
  ],
});

export default function Settings() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") || "general",
  );
  const [settings, setSettings] = useState<SettingsData>(
    createDefaultSettings(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookItem | null>(
    null,
  );
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);

  // Safe data loading
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("business_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure all fields exist
          const loadedSettings = { ...createDefaultSettings(), ...parsed };
          setSettings(loadedSettings);
          // Also save business name to separate localStorage key
          localStorage.setItem(
            "business_name",
            loadedSettings.businessName || "",
          );
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error instanceof Error ? error.message : String(error),
        );
        toast.error("Failed to load settings, using defaults");
      }
    };
    loadSettings();
  }, []);

  // Safe setting updates
  const updateSetting = (key: keyof SettingsData, value: any) => {
    try {
      setSettings((prev) => ({ ...prev, [key]: value }));

      // Special handling for business name - save to localStorage immediately
      if (key === "businessName") {
        localStorage.setItem("business_name", value || "");
        // Dispatch custom event to update UI immediately
        window.dispatchEvent(
          new CustomEvent("businessNameChanged", { detail: value || "" }),
        );
      }
    } catch (error) {
      console.error(
        "Failed to update setting:",
        error instanceof Error ? error.message : String(error),
      );
      toast.error("Failed to update setting");
    }
  };

  // Safe save operation
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("business_settings", JSON.stringify(settings));
      localStorage.setItem("business_name", settings.businessName || "");
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error instanceof Error ? error.message : String(error),
      );
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Webhook management
  const addWebhook = (webhook: Omit<WebhookItem, "id">) => {
    try {
      const newWebhook = { ...webhook, id: Date.now().toString() };
      updateSetting("webhooks", [...(settings.webhooks || []), newWebhook]);
      setShowWebhookForm(false);
      setEditingWebhook(null);
      toast.success("Webhook added successfully");
    } catch (error) {
      toast.error("Failed to add webhook");
    }
  };

  const updateWebhook = (id: string, updates: Partial<WebhookItem>) => {
    try {
      const updatedWebhooks = (settings.webhooks || []).map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      );
      updateSetting("webhooks", updatedWebhooks);
      setEditingWebhook(null);
      setShowWebhookForm(false);
      toast.success("Webhook updated successfully");
    } catch (error) {
      toast.error("Failed to update webhook");
    }
  };

  const deleteWebhook = (id: string) => {
    try {
      const updatedWebhooks = (settings.webhooks || []).filter(
        (w) => w.id !== id,
      );
      updateSetting("webhooks", updatedWebhooks);
      toast.success("Webhook deleted successfully");
    } catch (error) {
      toast.error("Failed to delete webhook");
    }
  };

  // Tag management
  const addTag = (tag: Omit<TagItem, "id">) => {
    try {
      const newTag = { ...tag, id: Date.now().toString() };
      updateSetting("businessTags", [...(settings.businessTags || []), newTag]);
      setShowTagForm(false);
      setEditingTag(null);
      toast.success("Tag added successfully");
    } catch (error) {
      toast.error("Failed to add tag");
    }
  };

  const deleteTag = (id: string) => {
    try {
      const updatedTags = (settings.businessTags || []).filter(
        (t) => t.id !== id,
      );
      updateSetting("businessTags", updatedTags);
      toast.success("Tag deleted successfully");
    } catch (error) {
      toast.error("Failed to delete tag");
    }
  };

  const addAiVariable = (variable: string) => {
    try {
      if (variable && !(settings.aiVariables || []).includes(variable)) {
        updateSetting("aiVariables", [
          ...(settings.aiVariables || []),
          variable,
        ]);
      }
    } catch (error) {
      toast.error("Failed to add AI variable");
    }
  };

  const removeAiVariable = (index: number) => {
    try {
      const updated = (settings.aiVariables || []).filter(
        (_, i) => i !== index,
      );
      updateSetting("aiVariables", updated);
    } catch (error) {
      toast.error("Failed to remove AI variable");
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
                    <CardTitle className="flex items-center justify-between">
                      <span>Business Information</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Sub Account ID:</span>
                        <code className="bg-muted px-3 py-1.5 rounded font-mono text-sm border">
                          {settings.subAccountId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              settings.subAccountId,
                            );
                            toast.success("Sub Account ID copied to clipboard");
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Basic information about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Business Logo</Label>
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
                            <Upload className="h-4 w-4" />
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
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={settings.businessName || ""}
                          onChange={(e) =>
                            updateSetting("businessName", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This name will appear in the business selector
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select
                          value={settings.businessType || ""}
                          onValueChange={(value) =>
                            updateSetting("businessType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="restaurant">
                              Restaurant
                            </SelectItem>
                            <SelectItem value="retail">Retail Store</SelectItem>
                            <SelectItem value="automotive">
                              Automotive
                            </SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="beauty">Beauty & Spa</SelectItem>
                            <SelectItem value="fitness">
                              Fitness & Gym
                            </SelectItem>
                            <SelectItem value="real-estate">
                              Real Estate
                            </SelectItem>
                            <SelectItem value="legal">
                              Legal Services
                            </SelectItem>
                            <SelectItem value="financial">
                              Financial Services
                            </SelectItem>
                            <SelectItem value="home-services">
                              Home Services
                            </SelectItem>
                            <SelectItem value="professional">
                              Professional Services
                            </SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="entertainment">
                              Entertainment
                            </SelectItem>
                            <SelectItem value="nonprofit">
                              Non-Profit
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={settings.contactName || ""}
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
                          value={settings.email || ""}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Business Phone</Label>
                        <Input
                          id="phone"
                          value={settings.phone || ""}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={settings.website || ""}
                          onChange={(e) =>
                            updateSetting("website", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Business Address</Label>
                        <div className="relative">
                          <Input
                            id="address"
                            value={settings.address || ""}
                            onChange={(e) =>
                              updateSetting("address", e.target.value)
                            }
                            placeholder="Start typing address for Google autocomplete..."
                            className="pr-10"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Badge variant="outline" className="text-xs">
                              Google
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Address with Google autocomplete integration
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={settings.city || ""}
                          onChange={(e) =>
                            updateSetting("city", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={settings.state || ""}
                          onChange={(e) =>
                            updateSetting("state", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={settings.zipCode || ""}
                          onChange={(e) =>
                            updateSetting("zipCode", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.timezone || "America/New_York"}
                          onValueChange={(value) =>
                            updateSetting("timezone", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">
                              Eastern Time
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={settings.currency || "USD"}
                          onValueChange={(value) =>
                            updateSetting("currency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="CAD">CAD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                          value={settings.dateFormat || "MM/DD/YYYY"}
                          onValueChange={(value) =>
                            updateSetting("dateFormat", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="DD/MM/YYYY">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="YYYY-MM-DD">
                              YYYY-MM-DD
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Project Settings */}
            {activeTab === "project" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Settings</CardTitle>
                    <CardDescription>
                      Configure automatic actions for your projects
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
                        checked={settings.autoPostFacebook || false}
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
                        checked={settings.autoPostGoogleMyBusiness || false}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostGoogleMyBusiness", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-post via RSS Feed</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically publish completed projects to RSS feed
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPostRssFeed || false}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostRssFeed", checked)
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
                        checked={settings.aiPromptForDescriptions || false}
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
                          value={settings.aiProjectRewritePrompt || ""}
                          onChange={(e) =>
                            updateSetting(
                              "aiProjectRewritePrompt",
                              e.target.value,
                            )
                          }
                          placeholder="Enter your custom AI prompt for rewriting project descriptions..."
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-archive projects after completion</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically archive completed projects after
                          specified days
                        </p>
                      </div>
                      <div className="w-24">
                        <Select
                          value={(settings.autoArchiveDays || 30).toString()}
                          onValueChange={(value) =>
                            updateSetting("autoArchiveDays", parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">365 days</SelectItem>
                            <SelectItem value="0">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Integrations */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">f</span>
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
                        >
                          {settings.facebookConnected ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Disconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Connect Facebook
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold">G</span>
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
                              updateSetting("googleMyBusinessConnected", false);
                              toast.success("Google My Business disconnected");
                            } else {
                              updateSetting("googleMyBusinessConnected", true);
                              toast.success("Google My Business connected");
                            }
                          }}
                        >
                          {settings.googleMyBusinessConnected ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Disconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Connect Google
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>RSS Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-bold">
                              RSS
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">RSS Feed</h3>
                            <p className="text-sm text-muted-foreground">
                              Generate and manage RSS feed for your projects
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                          <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Feed
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="rssFeedUrl">RSS Feed URL</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="rssFeedUrl"
                            value={`${window.location.origin}/api/rss/${settings.subAccountId}`}
                            readOnly
                            className="bg-muted"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/api/rss/${settings.subAccountId}`,
                              );
                              toast.success("RSS URL copied to clipboard");
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Include Project Images</Label>
                          <p className="text-sm text-muted-foreground">
                            Include project images in RSS feed
                          </p>
                        </div>
                        <Switch
                          checked={settings.rssIncludeImages !== false}
                          onCheckedChange={(checked) =>
                            updateSetting("rssIncludeImages", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GoHighLevel Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="goHighLevelApiKey">API Key</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="goHighLevelApiKey"
                          type="password"
                          value={settings.goHighLevelApiKey || ""}
                          onChange={(e) =>
                            updateSetting("goHighLevelApiKey", e.target.value)
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Webhooks</span>
                      <Button
                        size="sm"
                        onClick={() => setShowWebhookForm(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Webhook
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(settings.webhooks || []).map((webhook) => (
                        <div key={webhook.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{webhook.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {webhook.url}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {(webhook.events || []).map((event) => (
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
                            <div className="flex items-center gap-2">
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
                                onClick={() => {
                                  setEditingWebhook(webhook);
                                  setShowWebhookForm(true);
                                }}
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
                      {(settings.webhooks || []).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No webhooks configured yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Webhook Form Modal */}
                {showWebhookForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        {editingWebhook ? "Edit Webhook" : "Add Webhook"}
                      </h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const selectedEvents = formData.getAll(
                            "selectedEvents",
                          ) as string[];
                          const webhook = {
                            name: (formData.get("name") as string) || "",
                            url: (formData.get("url") as string) || "",
                            events: selectedEvents,
                            active: formData.get("active") === "on",
                          };
                          if (editingWebhook) {
                            updateWebhook(editingWebhook.id, webhook);
                          } else {
                            addWebhook(webhook);
                          }
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="webhookName">Name</Label>
                            <Input
                              id="webhookName"
                              name="name"
                              defaultValue={editingWebhook?.name || ""}
                              placeholder="Webhook name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="webhookUrl">URL</Label>
                            <Input
                              id="webhookUrl"
                              name="url"
                              type="url"
                              defaultValue={editingWebhook?.url || ""}
                              placeholder="https://example.com/webhook"
                              required
                            />
                          </div>
                          <div>
                            <Label>Select Events</Label>
                            <div className="mt-2 space-y-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                {[
                                  {
                                    id: "project.created",
                                    label: "Project Created",
                                    description:
                                      "When a new project is created",
                                    icon: "🆕",
                                  },
                                  {
                                    id: "project.completed",
                                    label: "Project Completed",
                                    description:
                                      "When a project is marked complete",
                                    icon: "✅",
                                  },
                                  {
                                    id: "project.updated",
                                    label: "Project Updated",
                                    description:
                                      "When project details are modified",
                                    icon: "📝",
                                  },
                                  {
                                    id: "project.archived",
                                    label: "Project Archived",
                                    description: "When a project is archived",
                                    icon: "📦",
                                  },
                                  {
                                    id: "photo.uploaded",
                                    label: "Photo Uploaded",
                                    description: "When new photos are added",
                                    icon: "📸",
                                  },
                                  {
                                    id: "review.received",
                                    label: "Review Received",
                                    description:
                                      "When a new review is submitted",
                                    icon: "⭐",
                                  },
                                ].map((event) => (
                                  <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`event-${event.id}`}
                                      name="selectedEvents"
                                      value={event.id}
                                      defaultChecked={
                                        editingWebhook?.events?.includes(
                                          event.id,
                                        ) || false
                                      }
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                          {event.icon}
                                        </span>
                                        <Label
                                          htmlFor={`event-${event.id}`}
                                          className="font-medium"
                                        >
                                          {event.label}
                                        </Label>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {event.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
              </div>
            )}

            {/* AI Assistant */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Template Configuration</CardTitle>
                    <CardDescription>
                      Configure AI prompts and templates for generating content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="aiPromptTemplate">
                        AI Prompt Template
                      </Label>
                      <Textarea
                        id="aiPromptTemplate"
                        value={settings.aiPromptTemplate || ""}
                        onChange={(e) =>
                          updateSetting("aiPromptTemplate", e.target.value)
                        }
                        placeholder="Create a professional description for a {PROJECT_TYPE} project..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aiInstructions">AI Instructions</Label>
                      <Textarea
                        id="aiInstructions"
                        value={settings.aiInstructions || ""}
                        onChange={(e) =>
                          updateSetting("aiInstructions", e.target.value)
                        }
                        placeholder="Write engaging, professional descriptions..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>AI Variables</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(settings.aiVariables || []).map((variable, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-1 pr-1"
                          >
                            {variable}
                            <button
                              onClick={() => removeAiVariable(index)}
                              className="hover:bg-red-100 rounded p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Add new variable"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.target as HTMLInputElement;
                              if (input.value) {
                                addAiVariable(input.value);
                                input.value = "";
                              }
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement)
                              .previousElementSibling as HTMLInputElement;
                            if (input?.value) {
                              addAiVariable(input.value);
                              input.value = "";
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tags */}
            {activeTab === "tags" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Business Tags</span>
                      <Button
                        size="sm"
                        onClick={() => setShowTagForm(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Tag
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {(settings.businessTags || []).map((tag) => (
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
                      {(settings.businessTags || []).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No tags created yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

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
                            name: (formData.get("name") as string) || "",
                            color:
                              (formData.get("color") as string) || "#000000",
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
                              placeholder="Enter tag name"
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
            )}

            {/* Media Settings */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="h-5 w-5" />
                      Image Settings
                    </CardTitle>
                    <CardDescription>
                      Configure supported image formats and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Supported File Types
                      </Label>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {[
                          { ext: ".jpg", desc: "JPEG Image", platform: "all" },
                          { ext: ".jpeg", desc: "JPEG Image", platform: "all" },
                          { ext: ".png", desc: "PNG Image", platform: "all" },
                          { ext: ".gif", desc: "GIF Image", platform: "all" },
                          { ext: ".webp", desc: "WebP Image", platform: "all" },
                          {
                            ext: ".heic",
                            desc: "HEIC Image (iPhone)",
                            platform: "apple",
                          },
                          {
                            ext: ".heif",
                            desc: "HEIF Image (iPhone)",
                            platform: "apple",
                          },
                          { ext: ".tiff", desc: "TIFF Image", platform: "all" },
                          {
                            ext: ".bmp",
                            desc: "Bitmap Image",
                            platform: "all",
                          },
                          { ext: ".svg", desc: "SVG Vector", platform: "all" },
                        ].map((format) => (
                          <div
                            key={format.ext}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <FileImage className="h-4 w-4 text-blue-600" />
                                <code className="bg-muted px-2 py-1 rounded text-sm">
                                  {format.ext}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium">
                                  {format.desc}
                                </span>
                                {format.platform === "apple" && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    🍎 Apple
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Switch
                              checked={(
                                settings.allowedImageTypes || []
                              ).includes(format.ext)}
                              onCheckedChange={(checked) => {
                                const current =
                                  settings.allowedImageTypes || [];
                                const updated = checked
                                  ? [...current, format.ext]
                                  : current.filter((t) => t !== format.ext);
                                updateSetting("allowedImageTypes", updated);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Video Settings
                    </CardTitle>
                    <CardDescription>
                      Configure supported video formats and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Supported File Types
                      </Label>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {[
                          { ext: ".mp4", desc: "MP4 Video", platform: "all" },
                          {
                            ext: ".mov",
                            desc: "QuickTime Video",
                            platform: "apple",
                          },
                          {
                            ext: ".avi",
                            desc: "AVI Video",
                            platform: "windows",
                          },
                          {
                            ext: ".wmv",
                            desc: "Windows Media Video",
                            platform: "windows",
                          },
                          { ext: ".webm", desc: "WebM Video", platform: "all" },
                          {
                            ext: ".m4v",
                            desc: "iTunes Video",
                            platform: "apple",
                          },
                          { ext: ".3gp", desc: "3GPP Video", platform: "all" },
                          {
                            ext: ".mkv",
                            desc: "Matroska Video",
                            platform: "all",
                          },
                        ].map((format) => (
                          <div
                            key={format.ext}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-purple-600" />
                                <code className="bg-muted px-2 py-1 rounded text-sm">
                                  {format.ext}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium">
                                  {format.desc}
                                </span>
                                {format.platform === "apple" && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    🍎 Apple
                                  </Badge>
                                )}
                                {format.platform === "windows" && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    🪟 Windows
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Switch
                              checked={(
                                settings.allowedVideoTypes || []
                              ).includes(format.ext)}
                              onCheckedChange={(checked) => {
                                const current =
                                  settings.allowedVideoTypes || [];
                                const updated = checked
                                  ? [...current, format.ext]
                                  : current.filter((t) => t !== format.ext);
                                updateSetting("allowedVideoTypes", updated);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Label
                        htmlFor="maxFileSize"
                        className="text-base font-medium"
                      >
                        Maximum File Size
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="maxFileSize"
                            type="number"
                            value={settings.maxFileSize || 10}
                            onChange={(e) =>
                              updateSetting(
                                "maxFileSize",
                                parseInt(e.target.value),
                              )
                            }
                            min="1"
                            max="500"
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">
                            MB
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Recommended: 50MB for videos, 10MB for images
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* File Optimization (moved from separate tab) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      File Optimization
                    </CardTitle>
                    <CardDescription>
                      Automatically optimize and compress uploaded files to save
                      storage space
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary" />
                        <div>
                          <Label className="text-base">Auto Optimization</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically optimize uploaded files for better
                            performance
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.autoOptimization !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("autoOptimization", checked)
                        }
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="compressionLevel"
                          className="text-base font-medium"
                        >
                          Compression Level
                        </Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Input
                            id="compressionLevel"
                            type="range"
                            min="10"
                            max="100"
                            value={settings.compressionLevel || 80}
                            onChange={(e) =>
                              updateSetting(
                                "compressionLevel",
                                parseInt(e.target.value),
                              )
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">
                            {settings.compressionLevel || 80}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Higher values = better quality, larger files
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                          <HardDrive className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-900">
                            Storage Saved
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {settings.totalSpaceSaved || 0} GB
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Through file optimization
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        Optimization Settings by File Type
                      </Label>
                      <div className="mt-3 space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileImage className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Images</span>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Convert to WebP format, resize large images, remove
                            metadata
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">Videos</span>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Compress videos, optimize bitrate, generate
                            thumbnails
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Schema Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      Automated Media Schema
                    </CardTitle>
                    <CardDescription>
                      Configure the metadata schema that will be automatically
                      generated for uploaded media files
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Schema Template Editor */}
                    <div>
                      <Label
                        htmlFor="mediaSchema"
                        className="text-base font-medium"
                      >
                        Schema Template
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Define the JSON schema structure for automated media
                        metadata. Use variables in double curly braces.
                      </p>
                      <Textarea
                        id="mediaSchema"
                        value={
                          settings.mediaSchemaTemplate ||
                          `{
  "title": "{{fileName}}",
  "description": "{{description}}",
  "project": {
    "id": "{{projectId}}",
    "name": "{{projectName}}",
    "address": "{{projectAddress}}",
    "customer": "{{customerName}}"
  },
  "upload": {
    "timestamp": "{{uploadTimestamp}}",
    "user": "{{uploadedBy}}",
    "userEmail": "{{uploaderEmail}}"
  },
  "media": {
    "type": "{{mediaType}}",
    "format": "{{fileFormat}}",
    "size": "{{fileSize}}",
    "dimensions": "{{dimensions}}",
    "duration": "{{duration}}"
  },
  "metadata": {
    "tags": [{{tags}}],
    "keywords": [{{keywords}}],
    "location": "{{gpsLocation}}",
    "device": "{{deviceInfo}}",
    "camera": "{{cameraModel}}"
  },
  "business": {
    "name": "{{businessName}}",
    "address": "{{businessAddress}}",
    "contact": "{{businessContact}}"
  },
  "seo": {
    "altText": "{{altText}}",
    "caption": "{{caption}}",
    "slug": "{{slug}}"
  }
}`
                        }
                        onChange={(e) =>
                          updateSetting("mediaSchemaTemplate", e.target.value)
                        }
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Enter your custom schema template..."
                      />
                    </div>

                    {/* Available Variables */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          System Variables
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              fileName
                            </code>
                            <span className="text-muted-foreground">
                              Original filename
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              fileSize
                            </code>
                            <span className="text-muted-foreground">
                              File size in bytes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              fileFormat
                            </code>
                            <span className="text-muted-foreground">
                              File extension
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              mediaType
                            </code>
                            <span className="text-muted-foreground">
                              image/video
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              uploadTimestamp
                            </code>
                            <span className="text-muted-foreground">
                              Upload date/time
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              dimensions
                            </code>
                            <span className="text-muted-foreground">
                              Width x Height
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              duration
                            </code>
                            <span className="text-muted-foreground">
                              Video length
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              gpsLocation
                            </code>
                            <span className="text-muted-foreground">
                              GPS coordinates
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              deviceInfo
                            </code>
                            <span className="text-muted-foreground">
                              Device/browser
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              cameraModel
                            </code>
                            <span className="text-muted-foreground">
                              Camera make/model
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User & Project Variables
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              uploadedBy
                            </code>
                            <span className="text-muted-foreground">
                              User full name
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              uploaderEmail
                            </code>
                            <span className="text-muted-foreground">
                              User email
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              projectId
                            </code>
                            <span className="text-muted-foreground">
                              Project ID
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              projectName
                            </code>
                            <span className="text-muted-foreground">
                              Project title
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              projectAddress
                            </code>
                            <span className="text-muted-foreground">
                              Project location
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              customerName
                            </code>
                            <span className="text-muted-foreground">
                              Customer name
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              businessName
                            </code>
                            <span className="text-muted-foreground">
                              Company name
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              businessAddress
                            </code>
                            <span className="text-muted-foreground">
                              Company address
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <code className="bg-muted px-2 py-1 rounded">
                              businessContact
                            </code>
                            <span className="text-muted-foreground">
                              Company contact
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* User-Defined Variables */}
                    <div>
                      <Label className="text-base font-medium">
                        Custom Variables
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Define your own variables that users can fill when
                        uploading media
                      </p>
                      <div className="space-y-3">
                        {(settings.customSchemaVariables || []).map(
                          (variable, index) => (
                            <div
                              key={index}
                              className="flex gap-3 items-center p-3 border rounded-lg"
                            >
                              <Input
                                placeholder="Variable name (e.g., category)"
                                value={variable.name || ""}
                                onChange={(e) => {
                                  const updated = [
                                    ...(settings.customSchemaVariables || []),
                                  ];
                                  updated[index] = {
                                    ...updated[index],
                                    name: e.target.value,
                                  };
                                  updateSetting(
                                    "customSchemaVariables",
                                    updated,
                                  );
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Description"
                                value={variable.description || ""}
                                onChange={(e) => {
                                  const updated = [
                                    ...(settings.customSchemaVariables || []),
                                  ];
                                  updated[index] = {
                                    ...updated[index],
                                    description: e.target.value,
                                  };
                                  updateSetting(
                                    "customSchemaVariables",
                                    updated,
                                  );
                                }}
                                className="flex-1"
                              />
                              <Select
                                value={variable.type || "text"}
                                onValueChange={(value) => {
                                  const updated = [
                                    ...(settings.customSchemaVariables || []),
                                  ];
                                  updated[index] = {
                                    ...updated[index],
                                    type: value,
                                  };
                                  updateSetting(
                                    "customSchemaVariables",
                                    updated,
                                  );
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="boolean">
                                    Yes/No
                                  </SelectItem>
                                  <SelectItem value="select">
                                    Dropdown
                                  </SelectItem>
                                  <SelectItem value="tags">Tags</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [
                                    ...(settings.customSchemaVariables || []),
                                  ];
                                  updated.splice(index, 1);
                                  updateSetting(
                                    "customSchemaVariables",
                                    updated,
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const updated = [
                              ...(settings.customSchemaVariables || []),
                            ];
                            updated.push({
                              name: "",
                              description: "",
                              type: "text",
                            });
                            updateSetting("customSchemaVariables", updated);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Variable
                        </Button>
                      </div>
                    </div>

                    {/* Schema Validation & Preview */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-base font-medium">
                          Schema Validation
                        </Label>
                        <div className="mt-2 p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">
                              Valid JSON Schema
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Schema syntax is correct and ready to use
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">
                          Settings
                        </Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto-apply schema</span>
                            <Switch
                              checked={settings.autoApplySchema !== false}
                              onCheckedChange={(checked) =>
                                updateSetting("autoApplySchema", checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Allow user edits</span>
                            <Switch
                              checked={settings.allowSchemaEdits !== false}
                              onCheckedChange={(checked) =>
                                updateSetting("allowSchemaEdits", checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Include EXIF data</span>
                            <Switch
                              checked={settings.includeExifData !== false}
                              onCheckedChange={(checked) =>
                                updateSetting("includeExifData", checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => {
                          // Preview functionality
                          alert(
                            "Schema preview functionality would show a sample generated metadata object here",
                          );
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Preview Schema
                      </Button>
                      <Button
                        onClick={() => {
                          // Reset to default
                          updateSetting(
                            "mediaSchemaTemplate",
                            `{
  "title": "{{fileName}}",
  "description": "{{description}}",
  "project": {
    "id": "{{projectId}}",
    "name": "{{projectName}}",
    "address": "{{projectAddress}}",
    "customer": "{{customerName}}"
  },
  "upload": {
    "timestamp": "{{uploadTimestamp}}",
    "user": "{{uploadedBy}}",
    "userEmail": "{{uploaderEmail}}"
  },
  "media": {
    "type": "{{mediaType}}",
    "format": "{{fileFormat}}",
    "size": "{{fileSize}}",
    "dimensions": "{{dimensions}}",
    "duration": "{{duration}}"
  },
  "metadata": {
    "tags": [{{tags}}],
    "keywords": [{{keywords}}],
    "location": "{{gpsLocation}}",
    "device": "{{deviceInfo}}",
    "camera": "{{cameraModel}}"
  },
  "business": {
    "name": "{{businessName}}",
    "address": "{{businessAddress}}",
    "contact": "{{businessContact}}"
  },
  "seo": {
    "altText": "{{altText}}",
    "caption": "{{caption}}",
    "slug": "{{slug}}"
  }
}`,
                          );
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Default
                      </Button>
                      <Button
                        onClick={() => {
                          // Export schema
                          const schema = settings.mediaSchemaTemplate || "";
                          const blob = new Blob([schema], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "media-schema-template.json";
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Schema
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Communication Settings</CardTitle>
                    <CardDescription>
                      Configure how review requests are sent to customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Review Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Send automatic review request reminders
                        </p>
                      </div>
                      <Switch
                        checked={settings.reviewReminderEnabled || false}
                        onCheckedChange={(checked) =>
                          updateSetting("reviewReminderEnabled", checked)
                        }
                      />
                    </div>

                    {settings.reviewReminderEnabled && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="reviewReminderDays">
                            Reminder Frequency (days)
                          </Label>
                          <Input
                            id="reviewReminderDays"
                            type="number"
                            value={settings.reviewReminderDays || 7}
                            onChange={(e) =>
                              updateSetting(
                                "reviewReminderDays",
                                parseInt(e.target.value),
                              )
                            }
                            min="1"
                            max="30"
                            className="mt-1"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Send reminders every{" "}
                            {settings.reviewReminderDays || 7} days after
                            project completion
                          </p>
                        </div>

                        <div>
                          <Label>Communication Methods</Label>
                          <div className="flex flex-col gap-3 mt-1">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Email</span>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-green-600" />
                                <span className="font-medium">SMS</span>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reviewEmailTemplate">
                          Email Template
                        </Label>
                        <Textarea
                          id="reviewEmailTemplate"
                          value={settings.reviewEmailTemplate || ""}
                          onChange={(e) =>
                            updateSetting("reviewEmailTemplate", e.target.value)
                          }
                          placeholder="Hi {CUSTOMER_NAME}, we'd love to hear about your experience with {PROJECT_NAME}..."
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewSmsTemplate">SMS Template</Label>
                        <Textarea
                          id="reviewSmsTemplate"
                          value={settings.reviewSmsTemplate || ""}
                          onChange={(e) =>
                            updateSetting("reviewSmsTemplate", e.target.value)
                          }
                          placeholder="Hi {CUSTOMER_NAME}! How was your experience with {BUSINESS_NAME}? Leave a review: {REVIEW_LINK}"
                          className="mt-1"
                          maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          SMS messages are limited to 160 characters
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Follow-up System Configuration</Label>
                      <div className="grid gap-3 mt-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">Auto Follow-up</span>
                            <p className="text-sm text-muted-foreground">
                              Send follow-up if no response within 7 days
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">
                              Escalation System
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Switch to SMS after 2 email attempts
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">Smart Timing</span>
                            <p className="text-sm text-muted-foreground">
                              Send during optimal hours based on customer
                              timezone
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reviewAiPrompt">
                        AI Review Request Prompt
                      </Label>
                      <Textarea
                        id="reviewAiPrompt"
                        value={settings.reviewAiPrompt || ""}
                        onChange={(e) =>
                          updateSetting("reviewAiPrompt", e.target.value)
                        }
                        placeholder="Generate a personalized review request for this project..."
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Review Gate Customization</CardTitle>
                    <CardDescription>
                      Customize the review gate page that clients see
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="reviewGateTitle">Title</Label>
                      <Input
                        id="reviewGateTitle"
                        value={settings.reviewGateTitle || ""}
                        onChange={(e) =>
                          updateSetting("reviewGateTitle", e.target.value)
                        }
                        placeholder="We'd Love Your Feedback!"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reviewGateDescription">Description</Label>
                      <Textarea
                        id="reviewGateDescription"
                        value={settings.reviewGateDescription || ""}
                        onChange={(e) =>
                          updateSetting("reviewGateDescription", e.target.value)
                        }
                        placeholder="Your feedback helps us improve..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Review Gate Video</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex gap-2">
                          <Input
                            id="reviewGateVideoUrl"
                            value={settings.reviewGateVideoUrl || ""}
                            onChange={(e) =>
                              updateSetting(
                                "reviewGateVideoUrl",
                                e.target.value,
                              )
                            }
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                          />
                          {settings.reviewGateVideoUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateSetting("reviewGateVideoUrl", "")
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Or upload your own video file
                          </p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Video File
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Supports MP4, MOV, AVI up to 50MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications - Comprehensive System */}
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
                        <CheckCircle className="h-3 w-3" />
                        Active
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
                          <Info className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            System Updates
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          System alerts and maintenance notifications
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            3 Today
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
                            12 This Week
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
                        checked={settings.enableNotifications !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("enableNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {settings.enableSounds ? (
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
                        checked={settings.enableSounds !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("enableSounds", checked)
                        }
                        disabled={!settings.enableNotifications}
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
                        checked={settings.desktopNotifications !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("desktopNotifications", checked)
                        }
                        disabled={!settings.enableNotifications}
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
                        <h4 className="font-medium text-sm">Message Types</h4>
                        <div className="space-y-3">
                          {Object.entries(settings.messageTypes || {}).map(
                            ([type, enabled]) => (
                              <div
                                key={type}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {type === "info" && (
                                    <Info className="h-4 w-4 text-blue-600" />
                                  )}
                                  {type === "warning" && (
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  )}
                                  {type === "success" && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {type === "error" && (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm capitalize">
                                    {type}
                                  </span>
                                </div>
                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(checked) => {
                                    const newMessageTypes = {
                                      ...(settings.messageTypes || {}),
                                      [type]: checked,
                                    };
                                    updateSetting(
                                      "messageTypes",
                                      newMessageTypes,
                                    );
                                  }}
                                  disabled={!settings.enableNotifications}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Categories</h4>
                        <div className="space-y-3">
                          {Object.entries(settings.categories || {}).map(
                            ([category, enabled]) => (
                              <div
                                key={category}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {category === "system" && (
                                    <SettingsIcon className="h-4 w-4 text-gray-600" />
                                  )}
                                  {category === "marketing" && (
                                    <MessageSquare className="h-4 w-4 text-purple-600" />
                                  )}
                                  {category === "support" && (
                                    <Users className="h-4 w-4 text-blue-600" />
                                  )}
                                  {category === "emergency" && (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm capitalize">
                                    {category}
                                  </span>
                                </div>
                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(checked) => {
                                    const newCategories = {
                                      ...(settings.categories || {}),
                                      [category]: checked,
                                    };
                                    updateSetting("categories", newCategories);
                                  }}
                                  disabled={!settings.enableNotifications}
                                />
                              </div>
                            ),
                          )}
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
                      {Object.entries(settings.deliveryMethods || {}).map(
                        ([method, enabled]) => (
                          <div
                            key={method}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {method === "email" && (
                                <Mail className="h-4 w-4 text-blue-600" />
                              )}
                              {method === "sms" && (
                                <Smartphone className="h-4 w-4 text-green-600" />
                              )}
                              {method === "inApp" && (
                                <Monitor className="h-4 w-4 text-purple-600" />
                              )}
                              {method === "push" && (
                                <Bell className="h-4 w-4 text-orange-600" />
                              )}
                              <div>
                                <span className="font-medium capitalize">
                                  {method === "inApp" ? "In-App" : method}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {method === "email" &&
                                    "Get notifications via email"}
                                  {method === "sms" &&
                                    "Urgent notifications via text"}
                                  {method === "inApp" &&
                                    "Notifications within the app"}
                                  {method === "push" &&
                                    "Browser push notifications"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => {
                                const newDeliveryMethods = {
                                  ...(settings.deliveryMethods || {}),
                                  [method]: checked,
                                };
                                updateSetting(
                                  "deliveryMethods",
                                  newDeliveryMethods,
                                );
                              }}
                              disabled={!settings.enableNotifications}
                            />
                          </div>
                        ),
                      )}
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
                        <Label>Digest Time</Label>
                        <Input
                          type="time"
                          value={settings.digestTime || "09:00"}
                          onChange={(e) =>
                            updateSetting("digestTime", e.target.value)
                          }
                          disabled={
                            !settings.enableNotifications ||
                            settings.notificationFrequency === "immediate"
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
                          checked={settings.doNotDisturb?.enabled !== false}
                          onCheckedChange={(checked) =>
                            updateSetting("doNotDisturb", {
                              ...(settings.doNotDisturb || {}),
                              enabled: checked,
                            })
                          }
                          disabled={!settings.enableNotifications}
                        />
                      </div>

                      {settings.doNotDisturb?.enabled && (
                        <div className="grid gap-4 md:grid-cols-2 pl-6">
                          <div>
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={
                                settings.doNotDisturb?.startTime || "22:00"
                              }
                              onChange={(e) =>
                                updateSetting("doNotDisturb", {
                                  ...(settings.doNotDisturb || {}),
                                  startTime: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={settings.doNotDisturb?.endTime || "08:00"}
                              onChange={(e) =>
                                updateSetting("doNotDisturb", {
                                  ...(settings.doNotDisturb || {}),
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

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Auto Mark as Read</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically mark notifications as read after viewing
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
                      <div>
                        <Label className="text-base">Show Previews</Label>
                        <p className="text-sm text-muted-foreground">
                          Show notification content in previews
                        </p>
                      </div>
                      <Switch
                        checked={settings.showPreviews !== false}
                        onCheckedChange={(checked) =>
                          updateSetting("showPreviews", checked)
                        }
                        disabled={!settings.enableNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">
                          Group Similar Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Combine similar notifications into groups
                        </p>
                      </div>
                      <Switch
                        checked={settings.groupSimilar !== false}
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
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={settings.email || ""}
                          onChange={(e) =>
                            updateSetting("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={settings.phone || ""}
                          onChange={(e) =>
                            updateSetting("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Team Members</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Users className="h-4 w-4" />
                          Groups
                        </Button>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Invite User
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Manage team members, permissions, and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* User Management Controls */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">User Management</h4>
                          <p className="text-sm text-muted-foreground">
                            {(settings.users || []).length} active users across
                            3 groups
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Export Users
                          </Button>
                          <Button variant="outline" size="sm">
                            Bulk Actions
                          </Button>
                        </div>
                      </div>

                      {/* User Groups */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">User Groups</h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Administrators
                              </span>
                              <Badge variant="default">2 users</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Full system access and user management
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Project Managers
                              </span>
                              <Badge variant="secondary">5 users</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Project creation and client communication
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Field Workers</span>
                              <Badge variant="outline">8 users</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Photo uploads and project updates
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Clients</span>
                              <Badge variant="outline">12 users</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              View-only access to their projects
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Individual Users */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Individual Users</h4>
                        {(settings.users || []).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary">{user.role}</Badge>
                                  <Badge
                                    variant={
                                      user.status === "active"
                                        ? "default"
                                        : user.status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {user.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Last login: {user.lastLogin}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                title="Edit Permissions"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                title="Remove User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Granular Permissions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Permission Templates
                          </CardTitle>
                          <CardDescription>
                            Predefined permission sets for different user roles
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <h5 className="font-medium">
                                Project Permissions
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>Create Projects</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Edit Projects</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Delete Projects</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Archive Projects</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="font-medium">Media Permissions</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>Upload Photos</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Delete Photos</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Download Media</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Bulk Operations</span>
                                  <Switch size="sm" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="font-medium">
                                Client Permissions
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>View Client Info</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Edit Client Info</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Send Messages</span>
                                  <Switch size="sm" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Access Reports</span>
                                  <Switch size="sm" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="font-medium">
                                System Permissions
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>User Management</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>System Settings</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Billing Access</span>
                                  <Switch size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>API Access</span>
                                  <Switch size="sm" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Current Plan</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Upgrade Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          Downgrade Plan
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold capitalize">
                          {settings.currentPlan || "Pro"} Plan
                        </h3>
                        <p className="text-muted-foreground">
                          $49/month • Renews monthly
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <Button variant="destructive" size="sm">
                          Cancel Service
                        </Button>
                      </div>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {(settings.planFeatures || []).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Plan Comparison */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Available Plans
                      </h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="p-3 bg-white rounded border">
                          <div className="font-medium">Basic</div>
                          <div className="text-sm text-muted-foreground">
                            $19/month
                          </div>
                          <div className="text-xs mt-1">
                            5 projects, 2 users
                          </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded border border-blue-300">
                          <div className="font-medium text-blue-900">
                            Pro (Current)
                          </div>
                          <div className="text-sm text-blue-700">$49/month</div>
                          <div className="text-xs mt-1">
                            50 projects, 10 users
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <div className="font-medium">Enterprise</div>
                          <div className="text-sm text-muted-foreground">
                            $99/month
                          </div>
                          <div className="text-xs mt-1">
                            Unlimited everything
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {settings.creditCard?.brand || "Visa"} ending in{" "}
                            {settings.creditCard?.last4 || "4242"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {settings.creditCard?.expMonth || 12}/
                            {settings.creditCard?.expYear || 2025}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Add Card</Button>
                        <Button variant="outline">Update</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Separate Invoices Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Invoices</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export All
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Download and manage your billing invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">
                              Invoice #
                            </th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">
                              Amount
                            </th>
                            <th className="text-left p-3 font-medium">
                              Status
                            </th>
                            <th className="text-left p-3 font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(settings.invoices || []).map((invoice) => (
                            <tr
                              key={invoice.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-mono text-sm">
                                {invoice.id}
                              </td>
                              <td className="p-3">{invoice.date}</td>
                              <td className="p-3 font-medium">
                                ${invoice.amount.toFixed(2)}
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant={
                                    invoice.status === "paid"
                                      ? "default"
                                      : invoice.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {invoice.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Separate Payments Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Payment History</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Payments
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Track all payments and transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">
                              Transaction ID
                            </th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">
                              Amount
                            </th>
                            <th className="text-left p-3 font-medium">
                              Method
                            </th>
                            <th className="text-left p-3 font-medium">
                              Status
                            </th>
                            <th className="text-left p-3 font-medium">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3 font-mono text-sm">
                              txn_1234567890
                            </td>
                            <td className="p-3">2024-01-15</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">Visa •••• 4242</td>
                            <td className="p-3">
                              <Badge variant="default">Completed</Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3 font-mono text-sm">
                              txn_0987654321
                            </td>
                            <td className="p-3">2024-01-01</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">Visa •••• 4242</td>
                            <td className="p-3">
                              <Badge variant="default">Completed</Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3 font-mono text-sm">
                              txn_1122334455
                            </td>
                            <td className="p-3">2023-12-15</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">Visa •••��� 4242</td>
                            <td className="p-3">
                              <Badge variant="secondary">Refunded</Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Management */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-900">
                      Service Management
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription and service settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">
                        Cancel Service
                      </h4>
                      <p className="text-sm text-red-700 mb-3">
                        Canceling will disable your account at the end of the
                        current billing period. Your data will be retained for
                        30 days.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </Button>
                        <Button variant="outline" size="sm">
                          Pause Instead
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Auto-Renewal</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Automatically renew subscription
                        </p>
                        <Switch defaultChecked />
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Billing Alerts</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Email notifications for payments
                        </p>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
