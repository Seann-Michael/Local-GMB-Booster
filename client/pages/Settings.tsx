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
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/AppLayout";
import {
  Save,
  Building2,
  User,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Bot,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  MapPin,
  Globe,
  Camera,
  Upload,
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  Download,
  Webhook,
  Key,
  Tag,
  Image,
  Video,
  FileText,
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
      setSettings(JSON.parse(savedSettings));
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
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings((prev) => ({
          ...prev,
          logo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Webhook management functions
  const addWebhook = (webhook: any) => {
    const newWebhook = {
      ...webhook,
      id: Date.now().toString(),
    };
    setSettings((prev) => ({
      ...prev,
      webhooks: [...prev.webhooks, newWebhook],
    }));
    setShowWebhookForm(false);
    toast.success("Webhook added successfully!");
  };

  const updateWebhook = (webhookId: string, updatedWebhook: any) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((webhook) =>
        webhook.id === webhookId ? { ...webhook, ...updatedWebhook } : webhook,
      ),
    }));
    setEditingWebhook(null);
    toast.success("Webhook updated successfully!");
  };

  const deleteWebhook = (webhookId: string) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.filter((webhook) => webhook.id !== webhookId),
    }));
    toast.success("Webhook deleted successfully!");
  };

  // Tag management functions
  const addTag = (tag: any) => {
    const newTag = {
      ...tag,
      id: Date.now().toString(),
    };
    setSettings((prev) => ({
      ...prev,
      businessTags: [...prev.businessTags, newTag],
    }));
    setShowTagForm(false);
    toast.success("Tag added successfully!");
  };

  const updateTag = (tagId: string, updatedTag: any) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: prev.businessTags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updatedTag } : tag,
      ),
    }));
    setEditingTag(null);
    toast.success("Tag updated successfully!");
  };

  const deleteTag = (tagId: string) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: prev.businessTags.filter((tag) => tag.id !== tagId),
    }));
    toast.success("Tag deleted successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "ai", label: "AI Assistance", icon: Bot },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "tags", label: "Tags", icon: MapPin },
    { id: "media", label: "Media", icon: Camera },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Settings</h1>
            <p className="text-muted-foreground">
              Manage your business profile, preferences, and configurations
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Business Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center overflow-hidden">
                        {settings.logo ? (
                          <img
                            src={settings.logo}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 200x200px, PNG or JPG
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={settings.businessName}
                        onChange={(e) =>
                          updateSetting("businessName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={settings.contactName}
                        onChange={(e) =>
                          updateSetting("contactName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSetting("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={(e) =>
                          updateSetting("website", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Address</h4>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={settings.address}
                        onChange={(e) =>
                          updateSetting("address", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={settings.city}
                          onChange={(e) =>
                            updateSetting("city", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={settings.state}
                          onChange={(e) =>
                            updateSetting("state", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={settings.zipCode}
                          onChange={(e) =>
                            updateSetting("zipCode", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Preferences */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Business Preferences</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.timezone}
                          onValueChange={(value) =>
                            updateSetting("timezone", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time
                            </SelectItem>
                            <SelectItem value="America/New_York">
                              Eastern Time
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={settings.currency}
                          onValueChange={(value) =>
                            updateSetting("currency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                          value={settings.dateFormat}
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistance Settings */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Prompt Configuration</CardTitle>
                    <CardDescription>
                      Configure how AI generates descriptions for your projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiPromptTemplate">Prompt Template</Label>
                      <Textarea
                        id="aiPromptTemplate"
                        placeholder="Enter your AI prompt template..."
                        value={settings.aiPromptTemplate}
                        onChange={(e) =>
                          updateSetting("aiPromptTemplate", e.target.value)
                        }
                        className="min-h-[100px]"
                      />
                      <p className="text-sm text-muted-foreground">
                        Use variables like {"{PROJECT_TYPE}"}, {"{ADDRESS}"},{" "}
                        {"{SERVICES}"} in your template
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aiInstructions">AI Instructions</Label>
                      <Textarea
                        id="aiInstructions"
                        placeholder="Provide specific instructions for the AI..."
                        value={settings.aiInstructions}
                        onChange={(e) =>
                          updateSetting("aiInstructions", e.target.value)
                        }
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {settings.aiVariables.map((variable, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="gap-1"
                          >
                            {"{" + variable + "}"}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newVariable = prompt(
                              "Enter new variable name:",
                            );
                            if (newVariable) {
                              updateSetting("aiVariables", [
                                ...settings.aiVariables,
                                newVariable.toUpperCase(),
                              ]);
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Add Variable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Project Settings */}
            {activeTab === "projects" && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                  <CardDescription>
                    Configure automatic posting and AI assistance for projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Auto-Posting Options</h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Post to Facebook</Label>
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
                      <div className="space-y-0.5">
                        <Label>Auto Post to Google My Business</Label>
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
                      <div className="space-y-0.5">
                        <Label>Auto Post to RSS Feed</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically add completed projects to RSS feed
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPostRssFeed}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPostRssFeed", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">AI Assistance</h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>AI Prompt for Project Descriptions</Label>
                        <p className="text-sm text-muted-foreground">
                          Use AI to help generate and improve project
                          descriptions
                        </p>
                      </div>
                      <Switch
                        checked={settings.aiPromptForDescriptions}
                        onCheckedChange={(checked) =>
                          updateSetting("aiPromptForDescriptions", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integrations Settings */}
            {activeTab === "integrations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect external services and manage API integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Facebook</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect to Facebook for automatic posting
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${settings.facebookConnected ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {settings.facebookConnected
                              ? "Connected"
                              : "Not Connected"}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            settings.facebookConnected ? "outline" : "default"
                          }
                          onClick={() =>
                            updateSetting(
                              "facebookConnected",
                              !settings.facebookConnected,
                            )
                          }
                        >
                          {settings.facebookConnected
                            ? "Disconnect"
                            : "Connect"}
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <h4 className="font-medium">Google My Business</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect to Google My Business for location updates
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${settings.googleMyBusinessConnected ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {settings.googleMyBusinessConnected
                              ? "Connected"
                              : "Not Connected"}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            settings.googleMyBusinessConnected
                              ? "outline"
                              : "default"
                          }
                          onClick={() =>
                            updateSetting(
                              "googleMyBusinessConnected",
                              !settings.googleMyBusinessConnected,
                            )
                          }
                        >
                          {settings.googleMyBusinessConnected
                            ? "Disconnect"
                            : "Connect"}
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">API Keys</h4>
                    <div className="space-y-2">
                      <Label htmlFor="goHighLevelApiKey">
                        GoHighLevel API Key
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="goHighLevelApiKey"
                          type="password"
                          value={settings.goHighLevelApiKey}
                          onChange={(e) =>
                            updateSetting("goHighLevelApiKey", e.target.value)
                          }
                          placeholder="Enter your GoHighLevel API key"
                          className="flex-1"
                        />
                        <Button
                          onClick={() =>
                            toast.success("API key saved successfully")
                          }
                          size="sm"
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connect to GoHighLevel for CRM integration
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Webhooks</h4>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowWebhookForm(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Webhook
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.webhooks.map((webhook) => (
                        <div key={webhook.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Webhook className="h-4 w-4" />
                              <div>
                                <p className="font-medium">{webhook.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {webhook.url}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Events: {webhook.events.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${webhook.active ? "bg-green-500" : "bg-gray-400"}`}
                              ></div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toast.success(
                                    "Edit webhook functionality coming soon",
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this webhook?",
                                    )
                                  ) {
                                    toast.success("Webhook deleted");
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags Settings */}
            {activeTab === "tags" && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Tags</CardTitle>
                  <CardDescription>
                    Manage tags for organizing and categorizing content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Create and manage tags to organize your projects and
                      content
                    </p>
                    <Button
                      className="gap-2"
                      onClick={() =>
                        toast.success("Add tag functionality coming soon")
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Tag
                    </Button>
                  </div>

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
                          ></div>
                          <span className="font-medium">{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast.success(
                                "Edit tag functionality coming soon",
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this tag?",
                                )
                              ) {
                                toast.success("Tag deleted");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tag Usage</h4>
                    <p className="text-sm text-muted-foreground">
                      Tags help organize your content and make it easier to find
                      specific projects. You can assign multiple tags to each
                      project for better categorization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Settings */}
            {activeTab === "media" && (
              <Card>
                <CardHeader>
                  <CardTitle>Media Settings</CardTitle>
                  <CardDescription>
                    Configure media handling and storage preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Image className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Images</h4>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Max file size: 10 MB</p>
                        <p>Formats: JPG, PNG, WebP</p>
                        <p>Auto-compression: Enabled</p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Video className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Videos</h4>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Max file size: 100 MB</p>
                        <p>Formats: MP4, WebM</p>
                        <p>Auto-optimization: Enabled</p>
                      </div>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Storage Management</h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Storage Used</span>
                        <span className="text-sm font-medium">
                          2.4 GB / 10 GB
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "24%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export All Media
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Clear Cache
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Media Library</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Recent Media</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your uploaded images and videos will appear here for
                        easy access and management.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
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
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive urgent alerts via SMS
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
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive product updates and marketing content
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
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive system maintenance and security alerts
                        </p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting("systemAlerts", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
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

                    <div className="space-y-2">
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
                          <SelectItem value="basic">
                            Basic (8+ characters)
                          </SelectItem>
                          <SelectItem value="strong">
                            Strong (8+ chars, numbers, symbols)
                          </SelectItem>
                          <SelectItem value="complex">
                            Complex (12+ chars, mixed case, numbers, symbols)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
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
                      />
                      <p className="text-sm text-muted-foreground">
                        Users will be logged out after this period of inactivity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing - Exact clone of AgencyBilling */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                {/* Header for billing section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Billing & Subscription
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your business plan and billing information
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <Save className="h-4 w-4" />
                      Download Invoice
                    </Button>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>

                {/* Current Plan Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Current Plan
                      </CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Professional</div>
                      <p className="text-xs text-muted-foreground">1/5 users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Total
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$49</div>
                      <p className="text-xs text-muted-foreground">
                        Next bill: Apr 15, 2024
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Available Slots
                      </CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-muted-foreground">
                        Add more users anytime
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pricing Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Breakdown</CardTitle>
                    <CardDescription>
                      Understand how your monthly bill is calculated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">Base Users (1-5)</h4>
                          <p className="text-sm text-muted-foreground">
                            1 users × $49/month
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$49</div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Monthly Total</span>
                          <span>$49</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed monthly • Next bill date: Apr 15, 2024
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Plans</CardTitle>
                    <CardDescription>
                      Upgrade or downgrade your plan based on your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {/* Starter Plan */}
                      <div className="p-6 border rounded-lg relative">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold">Starter</h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">$39</span>
                              <span className="text-sm text-muted-foreground">
                                /user/month
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Up to 5 admin users
                            </p>
                          </div>

                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Up to 5 admin users
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Basic client management
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Standard support
                            </li>
                          </ul>

                          <Button className="w-full" variant="default">
                            Upgrade
                          </Button>
                        </div>
                      </div>

                      {/* Professional Plan */}
                      <div className="p-6 border rounded-lg relative border-blue-500 bg-blue-50 ring-2 ring-green-500">
                        <div className="absolute -top-2 left-4 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                          Recommended
                        </div>
                        <div className="absolute -top-2 right-4 bg-green-500 text-white px-2 py-1 text-xs rounded">
                          Current Plan
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold">Professional</h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">$49</span>
                              <span className="text-sm text-muted-foreground">
                                /user/month
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Up to 15 admin users
                            </p>
                          </div>

                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Up to 15 admin users
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Advanced client management
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Priority support
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Real-time analytics
                            </li>
                          </ul>

                          <Button
                            className="w-full"
                            variant="secondary"
                            disabled
                          >
                            Current Plan
                          </Button>
                        </div>
                      </div>

                      {/* Enterprise Plan */}
                      <div className="p-6 border rounded-lg relative">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold">Enterprise</h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">$39</span>
                              <span className="text-sm text-muted-foreground">
                                /user/month
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Up to 50 admin users
                            </p>
                          </div>

                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Up to 50 admin users
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              Full feature access
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              24/7 priority support
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-500" />
                              White-label solution
                            </li>
                          </ul>

                          <Button className="w-full" variant="default">
                            Upgrade
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View your past invoices and payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Mar 15, 2024</td>
                            <td className="p-3">Professional Plan - 1 User</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                              >
                                <Save className="h-4 w-4" />
                                Download
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Feb 15, 2024</td>
                            <td className="p-3">Professional Plan - 1 User</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                              >
                                <Save className="h-4 w-4" />
                                Download
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Jan 15, 2024</td>
                            <td className="p-3">Professional Plan - 1 User</td>
                            <td className="p-3 font-medium">$49.00</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                              >
                                <Save className="h-4 w-4" />
                                Download
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Manage your payment methods and billing details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Payment Method</h4>
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-muted-foreground">
                                Expires 12/25
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto"
                            >
                              Update
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Billing Address</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Joe's Pizza</p>
                            <p>123 Main St</p>
                            <p>New York, NY 10001</p>
                            <p>United States</p>
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2">
                            Update Address
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Next Payment</h4>
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-center">
                              <span>Amount Due:</span>
                              <span className="font-medium">$49.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Due Date:</span>
                              <span className="font-medium">Apr 15, 2024</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Auto-renewal</h4>
                          <p className="text-sm text-muted-foreground">
                            Your subscription will automatically renew on April
                            15, 2024. You can cancel anytime.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Manage Auto-renewal
                          </Button>
                        </div>
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
