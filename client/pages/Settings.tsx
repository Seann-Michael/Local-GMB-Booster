import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { MetadataSettings } from "@/components/MetadataSettings";
import {
  Save,
  Building2,
  User,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Bot,
  Webhook,
  Tag,
  Plus,
  X,
  Image,
  Video,
  Globe,
  Key,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "media", label: "Media Settings", icon: Image },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
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

    // Project Settings
    autoPostFacebook: false,
    autoPostGoogleMyBusiness: true,
    autoPostRssFeed: false,
    aiPromptForDescriptions: true,

    // Integration Settings
    facebookConnected: false,
    googleMyBusinessConnected: true,
    goHighLevelApiKey: "",
    webhooks: [],

    // AI Assistance Settings
    aiPromptTemplate: "Create a professional description for a {PROJECT_TYPE} project at {ADDRESS}. Include details about {SERVICES} and highlight the quality of work.",
    aiInstructions: "Write engaging, professional descriptions that highlight the benefits and quality of the work. Use a friendly but professional tone.",
    aiVariables: ["PROJECT_TYPE", "ADDRESS", "SERVICES", "CUSTOMER_NAME", "COMPLETION_DATE"],

    // Tags
    businessTags: [],

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

  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("business_settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          // Ensure arrays are always arrays
          webhooks: Array.isArray(parsedSettings.webhooks) ? parsedSettings.webhooks : [],
          aiVariables: Array.isArray(parsedSettings.aiVariables) ? parsedSettings.aiVariables : prev.aiVariables,
          businessTags: Array.isArray(parsedSettings.businessTags) ? parsedSettings.businessTags : [],
          allowedImageTypes: Array.isArray(parsedSettings.allowedImageTypes) ? parsedSettings.allowedImageTypes : prev.allowedImageTypes,
          allowedVideoTypes: Array.isArray(parsedSettings.allowedVideoTypes) ? parsedSettings.allowedVideoTypes : prev.allowedVideoTypes,
        }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Safe array operations to prevent errors
  const addWebhook = (webhook: any) => {
    const newWebhook = {
      id: Date.now().toString(),
      name: webhook.name || "",
      url: webhook.url || "",
      events: Array.isArray(webhook.events) ? webhook.events : [],
      active: webhook.active !== false
    };
    setSettings(prev => ({
      ...prev,
      webhooks: [...(prev.webhooks || []), newWebhook]
    }));
  };

  const removeWebhook = (id: string) => {
    setSettings(prev => ({
      ...prev,
      webhooks: (prev.webhooks || []).filter(w => w.id !== id)
    }));
  };

  const addTag = (tag: any) => {
    const newTag = {
      id: Date.now().toString(),
      name: tag.name || "",
      color: tag.color || "#3b82f6"
    };
    setSettings(prev => ({
      ...prev,
      businessTags: [...(prev.businessTags || []), newTag]
    }));
  };

  const removeTag = (id: string) => {
    setSettings(prev => ({
      ...prev,
      businessTags: (prev.businessTags || []).filter(t => t.id !== id)
    }));
  };

  const addFileType = (type: "image" | "video", extension: string) => {
    if (!extension) return;
    const key = type === "image" ? "allowedImageTypes" : "allowedVideoTypes";
    setSettings(prev => {
      const currentTypes = prev[key] || [];
      if (currentTypes.includes(extension)) return prev;
      return {
        ...prev,
        [key]: [...currentTypes, extension]
      };
    });
  };

  const removeFileType = (type: "image" | "video", extension: string) => {
    const key = type === "image" ? "allowedImageTypes" : "allowedVideoTypes";
    setSettings(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(t => t !== extension)
    }));
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

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "general" && (
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
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

              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Facebook Auto-Post</Label>
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
                        <Label>Google My Business Auto-Post</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically post completed projects to Google My Business
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPostGoogleMyBusiness}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostGoogleMyBusiness", checked)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="goHighLevelApiKey">GoHighLevel API Key</Label>
                      <Input
                        id="goHighLevelApiKey"
                        type="password"
                        value={settings.goHighLevelApiKey}
                        onChange={(e) =>
                          updateSetting("goHighLevelApiKey", e.target.value)
                        }
                        placeholder="Enter your GoHighLevel API key"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "ai" && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="aiPromptTemplate">AI Prompt Template</Label>
                      <Textarea
                        id="aiPromptTemplate"
                        value={settings.aiPromptTemplate}
                        onChange={(e) =>
                          updateSetting("aiPromptTemplate", e.target.value)
                        }
                        rows={3}
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
                      />
                    </div>
                    <div>
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(settings.aiVariables || []).map((variable, index) => (
                          <Badge key={index} variant="outline">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "webhooks" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
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
                      {(settings.webhooks || []).map((webhook) => (
                        <div key={webhook.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{webhook.name}</h4>
                              <p className="text-sm text-muted-foreground">{webhook.url}</p>
                              <div className="flex gap-1 mt-1">
                                {(webhook.events || []).map((event) => (
                                  <Badge key={event} variant="secondary" className="text-xs">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={webhook.active ? "default" : "secondary"}>
                                {webhook.active ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeWebhook(webhook.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "tags" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Business Tags</CardTitle>
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
                      {(settings.businessTags || []).map((tag) => (
                        <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                            onClick={() => removeTag(tag.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "media" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>File Type Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Allowed Image Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(settings.allowedImageTypes || []).map((type) => (
                            <Badge key={type} variant="outline" className="gap-1">
                              {type}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeFileType("image", type)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newType = prompt("Enter image file extension (e.g., .webp):");
                              if (newType) addFileType("image", newType);
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
                          {(settings.allowedVideoTypes || []).map((type) => (
                            <Badge key={type} variant="outline" className="gap-1">
                              {type}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeFileType("video", type)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newType = prompt("Enter video file extension (e.g., .mp4):");
                              if (newType) addFileType("video", newType);
                            }}
                            className="gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Type
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                        <Input
                          id="maxFileSize"
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) =>
                            updateSetting("maxFileSize", parseInt(e.target.value))
                          }
                          className="w-32"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Metadata Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MetadataSettings />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
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

              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
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
                      <Label htmlFor="passwordRequirements">Password Requirements</Label>
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
                          <SelectItem value="very-strong">Very Strong</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          updateSetting("sessionTimeout", parseInt(e.target.value))
                        }
                        className="w-32"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "billing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingContact">Billing Contact</Label>
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
                          Automatically renew subscription
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
          {showWebhookForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Add Webhook</h3>
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
                    addWebhook(webhook);
                    setShowWebhookForm(false);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookName">Name</Label>
                      <Input
                        id="webhookName"
                        name="name"
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
                        placeholder="https://example.com/webhook"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhookEvents">Events (comma-separated)</Label>
                      <Input
                        id="webhookEvents"
                        name="events"
                        placeholder="project.created, project.completed"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="webhookActive"
                        name="active"
                        defaultChecked
                      />
                      <Label htmlFor="webhookActive">Active</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowWebhookForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Webhook</Button>
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

              {activeTab === "media" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Media Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetadataSettings />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}