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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import {
  Save,
  Building2,
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  Globe,
  Rss,
  Webhook,
  Plus,
  Trash2,
  Edit,
  Download,
  Brain,
  Settings as SettingsIcon,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface BusinessSettings {
  // General
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logo: string;
  timezone: string;
  dateFormat: string;

  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  passwordRequirements: string;
  sessionTimeout: number;

  // AI Settings
  aiPrompt: string;
  enableAiRewriting: boolean;

  // Billing Settings
  billingContact: string;
  billingEmail: string;
  autoRenewal: boolean;

  // Company Settings
  stats: {
    totalUsers: number;
    totalProjects: number;
  };

  // Subscription
  subscription: {
    plan: string;
    status: string;
    nextBilling: string;
    features: string[];
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

export default function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<BusinessSettings>({
    // General
    businessName: "Joe's Pizza",
    ownerName: "Joe Smith",
    email: "joe@joespizza.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    website: "https://joespizza.com",
    description: "Best pizza in town since 1995",
    logo: "",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    systemAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    passwordRequirements: "strong",
    sessionTimeout: 30,

    // AI Settings
    aiPrompt:
      "Please rewrite this project description to be more engaging and professional while maintaining all the key details and technical specifications.",
    enableAiRewriting: true,

    // Billing Settings
    billingContact: "Joe Smith",
    billingEmail: "billing@joespizza.com",
    autoRenewal: true,

    // Company Settings
    stats: {
      totalUsers: 5,
      totalProjects: 23,
    },

    // Subscription
    subscription: {
      plan: "Pro",
      status: "Active",
      nextBilling: "2024-04-15",
      features: [
        "Unlimited projects",
        "Advanced photo management",
        "Client project sharing",
        "Priority support",
        "AI-powered descriptions",
      ],
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [tags, setTags] = useState<string[]>([
    "Kitchen",
    "Bathroom",
    "Roofing",
    "Flooring",
    "Painting",
  ]);
  const [newTag, setNewTag] = useState("");

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "ai", label: "AI Settings", icon: Brain },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Webhook },
  ];

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Phoenix",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
  ];

  const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("business_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load users
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (savedUsers.length === 0) {
      const defaultUsers = [
        {
          id: "1",
          name: "Joe Smith",
          email: "joe@joespizza.com",
          role: "Owner",
          active: true,
        },
        {
          id: "2",
          name: "Sarah Manager",
          email: "sarah@joespizza.com",
          role: "Manager",
          active: true,
        },
      ];
      setUsers(defaultUsers);
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    } else {
      setUsers(savedUsers);
    }

    // Load billing history
    const sampleHistory: BillingHistory[] = [
      {
        id: "1",
        date: "2024-03-01",
        amount: 29,
        status: "paid",
        description: "Monthly subscription - Pro Plan",
      },
      {
        id: "2",
        date: "2024-02-01",
        amount: 29,
        status: "paid",
        description: "Monthly subscription - Pro Plan",
      },
      {
        id: "3",
        date: "2024-01-01",
        amount: 29,
        status: "paid",
        description: "Monthly subscription - Pro Plan",
      },
    ];
    setBillingHistory(sampleHistory);

    // Load tags
    const savedTags = localStorage.getItem("companyTags");
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem("business_settings", JSON.stringify(settings));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("companyTags", JSON.stringify(tags));

      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateSetting("logo", e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: "default" as const, label: "Paid", icon: CheckCircle },
      pending: {
        variant: "outline" as const,
        label: "Pending",
        icon: Clock,
      },
      failed: {
        variant: "destructive" as const,
        label: "Failed",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your business settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Settings Layout */}
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
                            alt="Business logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 200x200px PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={settings.businessName}
                        onChange={(e) =>
                          updateSetting("businessName", e.target.value)
                        }
                        placeholder="Your business name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        value={settings.ownerName}
                        onChange={(e) =>
                          updateSetting("ownerName", e.target.value)
                        }
                        placeholder="Owner name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                        placeholder="business@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSetting("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => updateSetting("address", e.target.value)}
                      placeholder="123 Business St, City, State 12345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => updateSetting("website", e.target.value)}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) =>
                        updateSetting("description", e.target.value)
                      }
                      placeholder="Brief description of your business"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) =>
                          updateSetting("timezone", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
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
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          {dateFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Tags */}
                  <div className="space-y-2">
                    <Label>Project Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users who have access to your business account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.active ? "default" : "secondary"}
                              >
                                {user.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* AI Settings Tab */}
            {activeTab === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Settings</CardTitle>
                  <CardDescription>
                    Configure AI-powered features for your projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableAiRewriting">
                        Enable AI Rewriting
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to help rewrite and improve project
                        descriptions
                      </p>
                    </div>
                    <Switch
                      id="enableAiRewriting"
                      checked={settings.enableAiRewriting}
                      onCheckedChange={(checked) =>
                        updateSetting("enableAiRewriting", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aiPrompt">AI Rewriting Prompt</Label>
                    <Textarea
                      id="aiPrompt"
                      value={settings.aiPrompt}
                      onChange={(e) =>
                        updateSetting("aiPrompt", e.target.value)
                      }
                      placeholder="Enter the prompt that will guide AI when rewriting project descriptions..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      This prompt will be sent to the AI along with the original
                      project description to guide the rewriting process.
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">AI Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Automatic project description enhancement</li>
                      <li>• Professional language improvement</li>
                      <li>• Technical detail preservation</li>
                      <li>• Customizable writing style</li>
                    </ul>
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
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive project updates and alerts via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("emailNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive urgent notifications via text message
                        </p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("smsNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">
                          Marketing Communications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive product updates and promotional content
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) =>
                          updateSetting("marketingEmails", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="systemAlerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system maintenance and
                          updates
                        </p>
                      </div>
                      <Switch
                        id="systemAlerts"
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
                        <Label htmlFor="twoFactorAuth">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
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
                          <SelectValue placeholder="Select password strength" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">
                            Basic (8+ characters)
                          </SelectItem>
                          <SelectItem value="strong">
                            Strong (8+ chars, mixed case, numbers)
                          </SelectItem>
                          <SelectItem value="very-strong">
                            Very Strong (12+ chars, mixed case, numbers,
                            symbols)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">
                        Session Timeout (minutes)
                      </Label>
                      <Select
                        value={settings.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          updateSetting("sessionTimeout", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Settings - Identical to Agency Billing */}
            {activeTab === "billing" && (
              <div className="space-y-6">
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
                      <div className="text-2xl font-bold">
                        {settings.subscription.plan}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {settings.stats.totalUsers} users
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Total
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$29</div>
                      <p className="text-xs text-muted-foreground">
                        Next bill:{" "}
                        {new Date(
                          settings.subscription.nextBilling,
                        ).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Status
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {settings.subscription.status}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Auto-renewal{" "}
                        {settings.autoRenewal ? "enabled" : "disabled"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="billingContact">Billing Contact</Label>
                        <Input
                          id="billingContact"
                          value={settings.billingContact}
                          onChange={(e) =>
                            updateSetting("billingContact", e.target.value)
                          }
                          placeholder="Billing contact name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billingEmail">Billing Email</Label>
                        <Input
                          id="billingEmail"
                          type="email"
                          value={settings.billingEmail}
                          onChange={(e) =>
                            updateSetting("billingEmail", e.target.value)
                          }
                          placeholder="billing@example.com"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoRenewal">Auto-Renewal</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically renew your subscription each month
                        </p>
                      </div>
                      <Switch
                        id="autoRenewal"
                        checked={settings.autoRenewal}
                        onCheckedChange={(checked) =>
                          updateSetting("autoRenewal", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                    <CardDescription>
                      Your current plan and usage details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          Local GMB Booster {settings.subscription.plan}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Status:{" "}
                          <span className="font-medium text-green-600">
                            {settings.subscription.status}
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline">$29/month</Badge>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Plan Features</h4>
                      <ul className="space-y-2">
                        {settings.subscription.features.map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                              {feature}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Next Billing</h4>
                        <p className="text-muted-foreground">
                          {new Date(
                            settings.subscription.nextBilling,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Payment Method</h4>
                        <p className="text-muted-foreground">•••• 4242</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Update Payment Method
                      </Button>
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      Your recent payment history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                {new Date(item.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>${item.amount}</TableCell>
                              <TableCell>
                                {getStatusBadge(item.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect your business with external services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Website Integration</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Embed project galleries on your website
                      </p>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Rss className="h-5 w-5 text-orange-500" />
                        <h4 className="font-medium">RSS Feed</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Syndicate your project updates
                      </p>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Webhook className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Webhooks</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Receive real-time notifications
                      </p>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Camera className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Photo Backup</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Automatic cloud backup
                      </p>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
