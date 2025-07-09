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
  Download,
  Webhook,
  Key,
  Tag,
  Image,
  Video,
  FileText,
  MessageSquare,
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
      const parsedSettings = JSON.parse(savedSettings);
      // Ensure all array properties exist to prevent map errors
      setSettings({
        ...parsedSettings,
        webhooks: parsedSettings.webhooks || [],
        aiVariables: parsedSettings.aiVariables || [],
        businessTags: parsedSettings.businessTags || [],
        allowedImageTypes: parsedSettings.allowedImageTypes || [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
        ],
        allowedVideoTypes: parsedSettings.allowedVideoTypes || [
          ".mp4",
          ".mov",
          ".avi",
          ".wmv",
        ],
      });
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
      webhooks: [...(prev.webhooks || []), newWebhook],
    }));
    setShowWebhookForm(false);
    toast.success("Webhook added successfully!");
  };

  const updateWebhook = (webhookId: string, updatedWebhook: any) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: (prev.webhooks || []).map((webhook) =>
        webhook.id === webhookId ? { ...webhook, ...updatedWebhook } : webhook,
      ),
    }));
    setEditingWebhook(null);
    toast.success("Webhook updated successfully!");
  };

  const deleteWebhook = (webhookId: string) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: (prev.webhooks || []).filter(
        (webhook) => webhook.id !== webhookId,
      ),
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
      businessTags: [...(prev.businessTags || []), newTag],
    }));
    setShowTagForm(false);
    toast.success("Tag added successfully!");
  };

  const updateTag = (tagId: string, updatedTag: any) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: (prev.businessTags || []).map((tag) =>
        tag.id === tagId ? { ...tag, ...updatedTag } : tag,
      ),
    }));
    setEditingTag(null);
    toast.success("Tag updated successfully!");
  };

  const deleteTag = (tagId: string) => {
    setSettings((prev) => ({
      ...prev,
      businessTags: (prev.businessTags || []).filter((tag) => tag.id !== tagId),
    }));
    toast.success("Tag deleted successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
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
                        {(settings.aiVariables || []).map((variable, index) => (
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

            {/* Review Settings */}
            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Settings</CardTitle>
                  <CardDescription>
                    Configure review collection and customer experience settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Review Threshold */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Review Collection Settings</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Google Review Redirect Settings</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">
                                1 Star Reviews
                              </span>
                              <div className="flex gap-1">
                                {[1].map((star) => (
                                  <Star
                                    key={`1star-${star}`}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">
                                2 Star Reviews
                              </span>
                              <div className="flex gap-1">
                                {[1, 2].map((star) => (
                                  <Star
                                    key={`2star-${star}`}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">
                                3 Star Reviews
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3].map((star) => (
                                  <Star
                                    key={`3star-${star}`}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">
                                4 Star Reviews
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4].map((star) => (
                                  <Star
                                    key={`4star-${star}`}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">
                                5 Star Reviews
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={`5star-${star}`}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Toggle which star ratings should redirect customers to
                          leave a Google review. Lower ratings can be captured
                          internally for feedback.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Review Request Expiration</Label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="14">14 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="60">60 Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          How long review links remain active
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Owner Video */}
                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Personal Video Message (Optional)
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Personal Video</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="space-y-3">
                            <Video className="mx-auto h-12 w-12 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Upload a personal video message
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                A short, personal thank you video increases
                                review completion rates
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                Choose Video File
                              </Button>
                              <p className="text-xs text-gray-500">
                                MP4, MOV, or WebM • Max 50MB • 30-60 seconds
                                recommended
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preview existing video if uploaded */}
                      <div className="hidden bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Current Video
                          </span>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </Button>
                        </div>
                        <div className="bg-black rounded aspect-video flex items-center justify-center">
                          <span className="text-white text-sm">
                            Video Preview
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <Camera className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Video Tips for Higher Review Rates
                            </p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>
                                • Keep it personal and authentic (30-60 seconds)
                              </li>
                              <li>• Thank them for choosing your business</li>
                              <li>
                                • Mention the specific project they completed
                              </li>
                              <li>• Ask them to share their experience</li>
                              <li>
                                • Record in good lighting with clear audio
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Google My Business */}
                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Google My Business Integration
                    </h4>
                    <div className="space-y-2">
                      <Label>Google Review URL</Label>
                      <Input
                        placeholder="https://g.page/r/YOUR_BUSINESS_ID/review"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Direct link to your Google My Business review page
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* AI Enhancement Prompt */}
                  <div className="space-y-4">
                    <h4 className="font-medium">AI Review Enhancement</h4>
                    <div className="space-y-2">
                      <Label>AI Enhancement Prompt</Label>
                      <Textarea
                        placeholder="Enhance this customer review to be more SEO-friendly and detailed while maintaining authenticity. Include location-specific keywords and service categories. Make it sound natural and helpful for potential customers..."
                        defaultValue="You are helping enhance customer reviews to be more discoverable and helpful. Take the customer's original review and enhance it by: 1) Adding location-specific keywords (city, state), 2) Including relevant service categories, 3) Making it more descriptive while keeping the customer's authentic voice, 4) Adding helpful details that would assist other potential customers. Keep the enhancement natural and genuine."
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        This prompt guides the AI on how to enhance customer
                        reviews while maintaining authenticity
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* SEO Keywords */}
                  <div className="space-y-4">
                    <h4 className="font-medium">SEO Enhancement Keywords</h4>
                    <div className="space-y-2">
                      <Label>Business Keywords</Label>
                      <Input
                        placeholder="contractor, renovation, construction, remodeling"
                        defaultValue="construction, renovation, contractor"
                      />
                      <p className="text-xs text-muted-foreground">
                        Keywords to include in enhanced reviews (comma
                        separated)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Categories</Label>
                      <Input
                        placeholder="Home Improvement, Kitchen Renovation, Bathroom Remodel"
                        defaultValue="Home Construction, Kitchen & Bath Renovation"
                      />
                      <p className="text-xs text-muted-foreground">
                        Main service categories for SEO optimization
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Review Request Scheduling */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Review Request Automation</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Send Review Request</Label>
                        <Select defaultValue="project-complete">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Only</SelectItem>
                            <SelectItem value="project-complete">
                              When Project is Marked Complete
                            </SelectItem>
                            <SelectItem value="24h-after">
                              24 Hours After Project Complete
                            </SelectItem>
                            <SelectItem value="3d-after">
                              3 Days After Project Complete
                            </SelectItem>
                            <SelectItem value="1w-after">
                              1 Week After Project Complete
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          When to automatically send review requests
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Follow-up Attempts</Label>
                        <Select defaultValue="2">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No Follow-ups</SelectItem>
                            <SelectItem value="1">1 Follow-up</SelectItem>
                            <SelectItem value="2">2 Follow-ups</SelectItem>
                            <SelectItem value="3">3 Follow-ups</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          How many follow-up reminders to send
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Follow-up Interval</Label>
                        <Select defaultValue="3d">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1d">1 Day</SelectItem>
                            <SelectItem value="3d">3 Days</SelectItem>
                            <SelectItem value="1w">1 Week</SelectItem>
                            <SelectItem value="2w">2 Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Time between follow-up reminders
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Stop Reminders After</Label>
                        <Select defaultValue="2w">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1w">1 Week</SelectItem>
                            <SelectItem value="2w">2 Weeks</SelectItem>
                            <SelectItem value="1m">1 Month</SelectItem>
                            <SelectItem value="never">Never Stop</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          When to stop sending reminders
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900 mb-1">
                            Automation Best Practices
                          </p>
                          <ul className="text-xs text-yellow-700 space-y-1">
                            <li>
                              • Send initial request 24-48 hours after project
                              completion
                            </li>
                            <li>
                              • Limit follow-ups to 2-3 attempts to avoid being
                              pushy
                            </li>
                            <li>
                              • Space reminders 3-7 days apart for best response
                              rates
                            </li>
                            <li>
                              • Stop reminders after 2 weeks to respect customer
                              time
                            </li>
                          </ul>
                        </div>
                      </div>
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
                      {(settings.webhooks || []).map((webhook) => (
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
                                onClick={() => setEditingWebhook(webhook)}
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
                                    deleteWebhook(webhook.id);
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
                      onClick={() => setShowTagForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Tag
                    </Button>
                  </div>

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
                          ></div>
                          <span className="font-medium">{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTag(tag)}
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
                                deleteTag(tag.id);
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
                  <div className="space-y-4">
                    <h4 className="font-medium">Allowed File Types</h4>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Image Types
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(settings.allowedImageTypes || []).map(
                            (type, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="gap-1"
                              >
                                {type}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 ml-1"
                                  onClick={() => {
                                    const newTypes =
                                      settings.allowedImageTypes.filter(
                                        (_, i) => i !== index,
                                      );
                                    updateSetting(
                                      "allowedImageTypes",
                                      newTypes,
                                    );
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ),
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newType = prompt(
                                "Enter image file extension (e.g., .jpg):",
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
                          >
                            <Plus className="h-3 w-3" />
                            Add Type
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Video Types
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(settings.allowedVideoTypes || []).map(
                            (type, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="gap-1"
                              >
                                {type}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 ml-1"
                                  onClick={() => {
                                    const newTypes =
                                      settings.allowedVideoTypes.filter(
                                        (_, i) => i !== index,
                                      );
                                    updateSetting(
                                      "allowedVideoTypes",
                                      newTypes,
                                    );
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ),
                          )}
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
                          >
                            <Plus className="h-3 w-3" />
                            Add Type
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="maxFileSize"
                          className="text-sm font-medium mb-2 block"
                        >
                          Maximum File Size (MB)
                        </Label>
                        <Input
                          id="maxFileSize"
                          type="number"
                          min="1"
                          max="100"
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
                    </div>
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

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to downgrade to the Starter plan? This will take effect at your next billing cycle.",
                                )
                              ) {
                                toast.success(
                                  "Plan downgrade scheduled for next billing cycle",
                                );
                              }
                            }}
                          >
                            Downgrade
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
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              Manage Auto-renewal
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to cancel your plan? This action cannot be undone. Your access will continue until the end of your current billing period.",
                                  )
                                ) {
                                  toast.success(
                                    "Plan cancellation scheduled. You'll retain access until April 15, 2024.",
                                  );
                                }
                              }}
                            >
                              Cancel Plan
                            </Button>
                          </div>
                        </div>
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
                  const formData = new FormData(e.target as HTMLFormElement);
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
                }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhookName">Name</Label>
                    <Input
                      id="webhookName"
                      name="name"
                      defaultValue={editingWebhook?.name}
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
                  const formData = new FormData(e.target as HTMLFormElement);
                  const tag = {
                    name: formData.get("name") as string,
                    color: formData.get("color") as string,
                  };
                  if (editingTag) {
                    updateTag(editingTag.id, tag);
                  } else {
                    addTag(tag);
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input
                      id="tagName"
                      name="name"
                      defaultValue={editingTag?.name}
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
    </AppLayout>
  );
}
