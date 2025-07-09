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
} from "lucide-react";
import { toast } from "sonner";

// Types
interface SettingsData {
  businessName: string;
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

// Navigation tabs
const navigationTabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "project", label: "Project Settings", icon: SettingsIcon },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "media", label: "Media Settings", icon: Image },
  { id: "reviews", label: "Review Settings", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "users", label: "Users", icon: Users },
  { id: "billing", label: "Billing", icon: DollarSign },
];

// Default settings
const defaultSettings: SettingsData = {
  businessName: "Joe's Pizza",
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
                  <CardContent className="space-y-4">
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
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="phone">Phone</Label>
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
                        {settings.aiVariables.map((variable, index) => (
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
                        ))}
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
                      {settings.webhooks.map((webhook) => (
                        <div key={webhook.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{webhook.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {webhook.url}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {webhook.events.map((event) => (
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
                      {settings.businessTags.map((tag) => (
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
                          {settings.allowedImageTypes.map((type) => (
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
                                !settings.allowedImageTypes.includes(newType)
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
                          {settings.allowedVideoTypes.map((type) => (
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
                                !settings.allowedVideoTypes.includes(newType)
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

                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Review Statistics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Total Reviews</div>
                          <div className="text-2xl font-bold text-primary">
                            47
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Average Rating</div>
                          <div className="text-2xl font-bold text-primary">
                            4.8
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Response Rate</div>
                          <div className="text-2xl font-bold text-primary">
                            73%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">This Month</div>
                          <div className="text-2xl font-bold text-primary">
                            12
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your projects
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("emailNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive text message updates
                        </p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("smsNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing and promotional emails
                        </p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) =>
                          updateSetting("marketingEmails", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important system notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting("systemAlerts", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          updateSetting("twoFactorAuth", checked)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordRequirements">
                        Password Requirements
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
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                          <SelectItem value="very-strong">
                            Very Strong
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                        className="w-32"
                      />
                    </div>
                  </CardContent>
                </Card>
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
                            {settings.planFeatures.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Plans</CardTitle>
                      <CardDescription>
                        Choose the plan that best fits your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Basic Plan */}
                        <div
                          className={`p-4 border rounded-lg ${settings.currentPlan === "basic" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold">Basic</h3>
                            <div className="text-2xl font-bold mt-2">
                              $19
                              <span className="text-sm text-muted-foreground">
                                /mo
                              </span>
                            </div>
                            <ul className="text-sm text-left mt-4 space-y-2">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Up to 10 projects
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Basic reporting
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Email support
                              </li>
                            </ul>
                            <Button
                              variant={
                                settings.currentPlan === "basic"
                                  ? "outline"
                                  : "default"
                              }
                              className="w-full mt-4"
                              disabled={settings.currentPlan === "basic"}
                              onClick={() =>
                                updateSetting("currentPlan", "basic")
                              }
                            >
                              {settings.currentPlan === "basic"
                                ? "Current Plan"
                                : "Select Basic"}
                            </Button>
                          </div>
                        </div>

                        {/* Pro Plan */}
                        <div
                          className={`p-4 border rounded-lg ${settings.currentPlan === "pro" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold">Pro</h3>
                            <div className="text-2xl font-bold mt-2">
                              $49
                              <span className="text-sm text-muted-foreground">
                                /mo
                              </span>
                            </div>
                            <ul className="text-sm text-left mt-4 space-y-2">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Unlimited projects
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Advanced analytics
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Priority support
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                AI features
                              </li>
                            </ul>
                            <Button
                              variant={
                                settings.currentPlan === "pro"
                                  ? "outline"
                                  : "default"
                              }
                              className="w-full mt-4"
                              disabled={settings.currentPlan === "pro"}
                              onClick={() =>
                                updateSetting("currentPlan", "pro")
                              }
                            >
                              {settings.currentPlan === "pro"
                                ? "Current Plan"
                                : "Select Pro"}
                            </Button>
                          </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div
                          className={`p-4 border rounded-lg ${settings.currentPlan === "enterprise" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold">Enterprise</h3>
                            <div className="text-2xl font-bold mt-2">
                              $99
                              <span className="text-sm text-muted-foreground">
                                /mo
                              </span>
                            </div>
                            <ul className="text-sm text-left mt-4 space-y-2">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Everything in Pro
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Custom integrations
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Dedicated support
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                White-label options
                              </li>
                            </ul>
                            <Button
                              variant={
                                settings.currentPlan === "enterprise"
                                  ? "outline"
                                  : "default"
                              }
                              className="w-full mt-4"
                              disabled={settings.currentPlan === "enterprise"}
                              onClick={() =>
                                updateSetting("currentPlan", "enterprise")
                              }
                            >
                              {settings.currentPlan === "enterprise"
                                ? "Current Plan"
                                : "Select Enterprise"}
                            </Button>
                          </div>
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
                            <AlertCircle className="h-4 w-4" />
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
                                toast.success(
                                  "Subscription canceled. Access continues until end of billing period.",
                                );
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
