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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import { MetadataSettings } from "@/components/MetadataSettings";
import {
  Save,
  Settings,
  User,
  Bell,
  Shield,
  DollarSign,
  Database,
  Mail,
  Server,
  Globe,
  Download,
  BarChart3,
  Building2,
  Camera,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Users,
  Key,
  Webhook,
  Monitor,
  Code,
  Palette,
  Activity,
  Calendar,
  MessageSquare,
  Phone,
  Lock,
  Upload,
  Copy,
  ExternalLink,
  Bot,
  Tag,
  Image,
  Video,
  X,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface BusinessSettings {
  // Business Information
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
  logo: string;

  // Business Settings
  timezone: string;
  currency: string;
  dateFormat: string;

  // Project Settings
  autoPostFacebook: boolean;
  autoPostGoogleMyBusiness: boolean;
  autoPostRssFeed: boolean;
  aiPromptForDescriptions: boolean;

  // Integration Settings
  facebookConnected: boolean;
  googleMyBusinessConnected: boolean;
  goHighLevelApiKey: string;
  webhooks: Array<{
    id: string;
    name: string;
    url: string;
    events: string[];
    active: boolean;
  }>;

  // AI Assistance Settings
  aiPromptTemplate: string;
  aiInstructions: string;
  aiVariables: string[];

  // Tags
  businessTags: Array<{
    id: string;
    name: string;
    color: string;
  }>;

  // Media Settings
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  maxFileSize: number;

  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  passwordRequirements: string;
  sessionTimeout: number;

  // Billing Settings
  billingContact: string;
  billingEmail: string;
  autoRenewal: boolean;
}

const tabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "project", label: "Project Settings", icon: Settings },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "media", label: "Media Settings", icon: Image },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: DollarSign },
];

export default function Settings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    // Business Information
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
    logo: "",

    // Business Settings
    timezone: "America/New_York",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",

    // Project Settings
    autoPostFacebook: false,
    autoPostGoogleMyBusiness: true,
    autoPostRssFeed: false,
    aiPromptForDescriptions: true,

    // Integration Settings
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

    // AI Assistance Settings
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
    allowedVideoTypes: [".mp4", ".mov", ".avi", ".wmv"],
    maxFileSize: 10,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    systemAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    passwordRequirements: "strong",
    sessionTimeout: 30,

    // Billing Settings
    billingContact: "Joe Smith",
    billingEmail: "billing@joespizza.com",
    autoRenewal: true,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("business_settings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem("business_settings", JSON.stringify(settings));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateWebhook = (webhookId: string, updatedWebhook: any) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((webhook) =>
        webhook.id === webhookId ? { ...webhook, ...updatedWebhook } : webhook,
      ),
    }));
  };

  const deleteWebhook = (webhookId: string) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.filter((webhook) => webhook.id !== webhookId),
    }));
  };

  const updateTag = (tagId: string, updatedTag: any) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: prev.businessTags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updatedTag } : tag,
      ),
    }));
  };

  const deleteTag = (tagId: string) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: prev.businessTags.filter((tag) => tag.id !== tagId),
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
            {/* Sidebar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6 min-w-0 overflow-x-hidden">
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

              {/* AI Assistant */}
              {activeTab === "ai" && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>
                      Configure AI-powered project descriptions and prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable AI for Descriptions</Label>
                        <p className="text-sm text-muted-foreground">
                          Use AI to generate professional project descriptions
                        </p>
                      </div>
                      <Switch
                        checked={settings.aiPromptForDescriptions}
                        onCheckedChange={(checked) =>
                          updateSetting("aiPromptForDescriptions", checked)
                        }
                      />
                    </div>

                    <Separator />

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
                      <p className="text-sm text-muted-foreground mt-2">
                        Use variables like {"{PROJECT_TYPE}"}, {"{ADDRESS}"},{" "}
                        {"{SERVICES}"} in your template
                      </p>
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
                      <div className="flex flex-wrap gap-2">
                        {settings.aiVariables.map((variable, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="gap-1"
                          >
                            {variable}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                const newVariables =
                                  settings.aiVariables.filter(
                                    (_, i) => i !== index,
                                  );
                                updateSetting("aiVariables", newVariables);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
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
                      Configure webhooks to receive notifications about project
                      events
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
                      Organize and categorize your projects with custom tags
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTag(tag)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTag(tag.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
                        Configure allowed file types and upload limits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Allowed Image Types</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {settings.allowedImageTypes.map((type, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="gap-1"
                            >
                              {type}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newTypes =
                                    settings.allowedImageTypes.filter(
                                      (_, i) => i !== index,
                                    );
                                  updateSetting("allowedImageTypes", newTypes);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
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
                                updateSetting("allowedImageTypes", [
                                  ...settings.allowedImageTypes,
                                  newType,
                                ]);
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
                        <div className="flex flex-wrap gap-2 mb-2">
                          {settings.allowedVideoTypes.map((type, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="gap-1"
                            >
                              {type}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newTypes =
                                    settings.allowedVideoTypes.filter(
                                      (_, i) => i !== index,
                                    );
                                  updateSetting("allowedVideoTypes", newTypes);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
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
                                updateSetting("allowedVideoTypes", [
                                  ...settings.allowedVideoTypes,
                                  newType,
                                ]);
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

              {/* Notifications */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about important events
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
                  </CardContent>
                </Card>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and privacy
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
                  </CardContent>
                </Card>
              )}

              {/* Billing */}
              {activeTab === "billing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                    <CardDescription>
                      Manage your billing information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>
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
                      id: editingWebhook?.id || Date.now().toString(),
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
                      setSettings((prev) => ({
                        ...prev,
                        webhooks: [...prev.webhooks, webhook],
                      }));
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
          {(showTagForm || editingTag) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingTag ? "Edit Tag" : "Add Tag"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const tag = {
                      id: editingTag?.id || Date.now().toString(),
                      name: formData.get("name") as string,
                      color: formData.get("color") as string,
                    };

                    if (editingTag) {
                      updateTag(editingTag.id, tag);
                    } else {
                      setSettings((prev) => ({
                        ...prev,
                        businessTags: [...prev.businessTags, tag],
                      }));
                    }

                    setShowTagForm(false);
                    setEditingTag(null);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagName">Tag Name</Label>
                      <Input
                        id="tagName"
                        name="name"
                        defaultValue={editingTag?.name}
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
                        defaultValue={editingTag?.color || "#3b82f6"}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTagForm(false);
                        setEditingTag(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTag ? "Update" : "Add"} Tag
                    </Button>
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
