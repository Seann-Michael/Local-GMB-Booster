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
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SuperAdminSettings {
  // System Information
  systemName: string;
  adminName: string;
  adminEmail: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;

  // System Settings
  maintenanceMode: boolean;
  allowNewSignups: boolean;
  requireEmailVerification: boolean;
  enableApiAccess: boolean;
  maxUsersPerAccount: number;
  dataRetentionDays: number;

  // Security Settings
  sessionTimeout: number;
  passwordComplexity: string;
  enableTwoFactor: boolean;
  apiRateLimit: number;
  enableAuditLogs: boolean;

  // Email Settings
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;

  // Notification Settings
  systemAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  userNotifications: boolean;

  // Financial Settings
  defaultCurrency: string;
  taxRate: number;
  enableInvoicing: boolean;
  paymentGateway: string;
  enableSubscriptions: boolean;

  // AI Settings
  openaiApiKey: string;
  openaiOrganization: string;
  enableAiFeatures: boolean;
}

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<SuperAdminSettings>({
    // System Information
    systemName: "Local GMB Booster",
    adminName: "Super Admin",
    adminEmail: "admin@localgmbbooster.com",
    supportEmail: "support@localgmbbooster.com",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",

    // System Settings
    maintenanceMode: false,
    allowNewSignups: true,
    requireEmailVerification: true,
    enableApiAccess: true,
    maxUsersPerAccount: 50,
    dataRetentionDays: 365,

    // Security Settings
    sessionTimeout: 60,
    passwordComplexity: "strong",
    enableTwoFactor: true,
    apiRateLimit: 1000,
    enableAuditLogs: true,

    // Email Settings
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@localgmbbooster.com",
    fromName: "Local GMB Booster",

    // Notification Settings
    systemAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    userNotifications: true,

    // Financial Settings
    defaultCurrency: "USD",
    taxRate: 8.25,
    enableInvoicing: true,
    paymentGateway: "stripe",
    enableSubscriptions: true,

    // AI Settings
    openaiApiKey: "",
    openaiOrganization: "",
    enableAiFeatures: true,
  });

  const [activeTab, setActiveTab] = useState("system");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("super_admin_settings");
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
      localStorage.setItem("super_admin_settings", JSON.stringify(settings));

      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof SuperAdminSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    { id: "system", label: "System", icon: Settings },
    { id: "users", label: "User Management", icon: User },
    { id: "workspaces", label: "Workspaces", icon: Building2 },
    { id: "billing", label: "Billing & Plans", icon: DollarSign },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "branding", label: "Branding", icon: Camera },
    { id: "features", label: "Feature Control", icon: BarChart3 },
    { id: "automation", label: "Automation", icon: Server },
    { id: "security", label: "Security", icon: Shield },
    { id: "monitoring", label: "Monitoring", icon: Bell },
    { id: "developer", label: "Developer", icon: Database },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "legal", label: "Legal", icon: FileText },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Manage system-wide configurations and preferences
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
            {/* System Settings */}
            {activeTab === "system" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Basic system information and global settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={settings.systemName}
                        onChange={(e) =>
                          updateSetting("systemName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminName">Admin Name</Label>
                      <Input
                        id="adminName"
                        value={settings.adminName}
                        onChange={(e) =>
                          updateSetting("adminName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) =>
                          updateSetting("adminEmail", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) =>
                          updateSetting("supportEmail", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h4 className="font-medium">System Preferences</h4>
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
                            <SelectItem value="UTC">UTC</SelectItem>
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

                  <Separator />

                  {/* System Controls */}
                  <div className="space-y-4">
                    <h4 className="font-medium">System Controls</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Temporarily disable access for maintenance
                          </p>
                        </div>
                        <Switch
                          checked={settings.maintenanceMode}
                          onCheckedChange={(checked) =>
                            updateSetting("maintenanceMode", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow New Signups</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable new user registrations
                          </p>
                        </div>
                        <Switch
                          checked={settings.allowNewSignups}
                          onCheckedChange={(checked) =>
                            updateSetting("allowNewSignups", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Require Email Verification</Label>
                          <p className="text-sm text-muted-foreground">
                            Users must verify email before accessing system
                          </p>
                        </div>
                        <Switch
                          checked={settings.requireEmailVerification}
                          onCheckedChange={(checked) =>
                            updateSetting("requireEmailVerification", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable API Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow third-party integrations via API
                          </p>
                        </div>
                        <Switch
                          checked={settings.enableApiAccess}
                          onCheckedChange={(checked) =>
                            updateSetting("enableApiAccess", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Limits */}
                  <div className="space-y-4">
                    <h4 className="font-medium">System Limits</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="maxUsersPerAccount">
                          Max Users Per Account
                        </Label>
                        <Input
                          id="maxUsersPerAccount"
                          type="number"
                          value={settings.maxUsersPerAccount}
                          onChange={(e) =>
                            updateSetting(
                              "maxUsersPerAccount",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataRetentionDays">
                          Data Retention (Days)
                        </Label>
                        <Input
                          id="dataRetentionDays"
                          type="number"
                          value={settings.dataRetentionDays}
                          onChange={(e) =>
                            updateSetting(
                              "dataRetentionDays",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>User & Account Management</CardTitle>
                  <CardDescription>
                    Monitor user activity, audit trails, and account management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Active Users</h4>
                      </div>
                      <div className="text-2xl font-bold">1,247</div>
                      <p className="text-sm text-muted-foreground">
                        Last 30 days
                      </p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Login Sessions</h4>
                      </div>
                      <div className="text-2xl font-bold">3,421</div>
                      <p className="text-sm text-muted-foreground">
                        This month
                      </p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Eye className="h-5 w-5 text-orange-500" />
                        <h4 className="font-medium">Audit Events</h4>
                      </div>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-sm text-muted-foreground">Today</p>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Activity Logs & Audit Trails
                      </h4>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Logs
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Action</th>
                            <th className="p-3 text-left">Resource</th>
                            <th className="p-3 text-left">Timestamp</th>
                            <th className="p-3 text-left">IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">john@example.com</td>
                            <td className="p-3">Login</td>
                            <td className="p-3">Dashboard</td>
                            <td className="p-3">2 minutes ago</td>
                            <td className="p-3">192.168.1.100</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">admin@system.com</td>
                            <td className="p-3">Updated Settings</td>
                            <td className="p-3">System Config</td>
                            <td className="p-3">5 minutes ago</td>
                            <td className="p-3">10.0.0.1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workspace Control */}
            {activeTab === "workspaces" && (
              <Card>
                <CardHeader>
                  <CardTitle>Subaccount / Workspace Control</CardTitle>
                  <CardDescription>
                    Manage subaccounts, allocate resources, and control module
                    access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Active Workspaces</h4>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Workspace
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Marketing Pro",
                        users: 15,
                        storage: "8.5 GB",
                        modules: ["CRM", "AI Writer", "Forms"],
                      },
                      {
                        name: "Sales Team",
                        users: 8,
                        storage: "3.2 GB",
                        modules: ["CRM", "Forms"],
                      },
                      {
                        name: "Enterprise Corp",
                        users: 50,
                        storage: "25 GB",
                        modules: ["All Modules"],
                      },
                    ].map((workspace, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{workspace.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {workspace.users} users • {workspace.storage}{" "}
                              storage used
                            </p>
                            <div className="flex gap-2 mt-2">
                              {workspace.modules.map((module) => (
                                <span
                                  key={module}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {module}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Resource Allocation</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Default Storage Limit (GB)</Label>
                        <Input type="number" defaultValue="10" />
                      </div>
                      <div className="space-y-2">
                        <Label>API Usage Limit (per month)</Label>
                        <Input type="number" defaultValue="10000" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Available Modules</h4>
                    <div className="grid gap-2 md:grid-cols-3">
                      {[
                        "CRM",
                        "AI Writer",
                        "Forms",
                        "Analytics",
                        "Email Marketing",
                        "Social Media",
                      ].map((module) => (
                        <div
                          key={module}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span className="text-sm">{module}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing & Plans */}
            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Plans Management</CardTitle>
                  <CardDescription>
                    Configure pricing tiers, subscription plans, and billing
                    controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Monthly Revenue</h4>
                      <div className="text-2xl font-bold">$45,230</div>
                      <p className="text-sm text-green-600">+12% this month</p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Active Subscriptions</h4>
                      <div className="text-2xl font-bold">347</div>
                      <p className="text-sm text-blue-600">+8 new this week</p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Trial Accounts</h4>
                      <div className="text-2xl font-bold">23</div>
                      <p className="text-sm text-orange-600">
                        5 converting soon
                      </p>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Pricing Tiers</h4>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Plan
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        {
                          name: "Starter",
                          price: "$29",
                          features: [
                            "5 Users",
                            "10GB Storage",
                            "Basic Support",
                          ],
                        },
                        {
                          name: "Professional",
                          price: "$79",
                          features: [
                            "25 Users",
                            "100GB Storage",
                            "Priority Support",
                            "Advanced Features",
                          ],
                        },
                        {
                          name: "Enterprise",
                          price: "$199",
                          features: [
                            "Unlimited Users",
                            "1TB Storage",
                            "24/7 Support",
                            "Custom Integration",
                          ],
                        },
                      ].map((plan, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{plan.name}</h5>
                            <span className="text-lg font-bold">
                              {plan.price}
                            </span>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {plan.features.map((feature) => (
                              <li key={feature}>• {feature}</li>
                            ))}
                          </ul>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Clone
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Promo Codes & Discounts</h4>
                    <div className="flex gap-4">
                      <Input placeholder="Promo code name" />
                      <Input placeholder="Discount %" type="number" />
                      <Button>Create Code</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Billing Overrides</h4>
                    <div className="grid gap-2 md:grid-cols-4">
                      <Button variant="outline">Pause Billing</Button>
                      <Button variant="outline">Apply Credit</Button>
                      <Button variant="outline">Force Payment</Button>
                      <Button variant="outline">Cancel Subscription</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Branding & White Label */}
            {activeTab === "branding" && (
              <Card>
                <CardHeader>
                  <CardTitle>Branding & White Label</CardTitle>
                  <CardDescription>
                    Customize platform appearance, logos, and branding elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-medium">Platform Branding</h4>

                      <div className="space-y-2">
                        <Label>Platform Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <Button variant="outline" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Favicon</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 border border-muted-foreground rounded flex items-center justify-center">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Button variant="outline" size="sm">
                            Upload Favicon
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Color Scheme</h4>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-3">
                          <Label className="w-20">Primary</Label>
                          <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                          <Input
                            type="color"
                            defaultValue="#2563eb"
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Label className="w-20">Secondary</Label>
                          <div className="w-8 h-8 bg-gray-600 rounded border"></div>
                          <Input
                            type="color"
                            defaultValue="#64748b"
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Label className="w-20">Accent</Label>
                          <div className="w-8 h-8 bg-green-600 rounded border"></div>
                          <Input
                            type="color"
                            defaultValue="#16a34a"
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Typography</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Primary Font</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Font</Label>
                        <Select defaultValue="system">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="arial">Arial</SelectItem>
                            <SelectItem value="helvetica">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Email Templates</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        Welcome Email Template
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Password Reset Template
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Invoice Template
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Notification Template
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Login Page Customization</h4>
                    <div className="space-y-2">
                      <Label>Background Image</Label>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Background
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Control */}
            {activeTab === "features" && (
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles & Module Control</CardTitle>
                  <CardDescription>
                    Enable/disable features, manage rollouts, and control access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Core Features</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        {
                          name: "AI Content Writer",
                          status: true,
                          users: "All Users",
                        },
                        {
                          name: "Advanced Analytics",
                          status: true,
                          users: "Pro & Enterprise",
                        },
                        {
                          name: "Custom Integrations",
                          status: false,
                          users: "Enterprise Only",
                        },
                        {
                          name: "White Label Access",
                          status: true,
                          users: "Enterprise Only",
                        },
                        {
                          name: "API Access",
                          status: true,
                          users: "All Users",
                        },
                        {
                          name: "Mobile App",
                          status: false,
                          users: "Beta Users",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {feature.users}
                            </div>
                          </div>
                          <Switch checked={feature.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Beta Features</h4>
                    <div className="space-y-3">
                      {[
                        {
                          name: "AI Voice Assistant",
                          description: "Voice-powered content creation",
                          access: "10 Beta Users",
                        },
                        {
                          name: "Advanced Automation",
                          description: "Complex workflow automation",
                          access: "5 Enterprise Clients",
                        },
                      ].map((beta, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{beta.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {beta.description}
                              </div>
                              <div className="text-xs text-blue-600">
                                {beta.access}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Manage Access
                              </Button>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Scheduled Releases</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Mobile App v2.0</div>
                          <div className="text-sm text-muted-foreground">
                            Scheduled for March 15, 2024
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Automation & Defaults */}
            {activeTab === "automation" && (
              <Card>
                <CardHeader>
                  <CardTitle>Automation & Default Settings</CardTitle>
                  <CardDescription>
                    Configure system automation, templates, and default
                    behaviors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">AI Prompt Templates</h4>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Blog Post Writer",
                          usage: "1,234 times",
                          type: "Content Creation",
                        },
                        {
                          name: "Social Media Posts",
                          usage: "856 times",
                          type: "Marketing",
                        },
                        {
                          name: "Email Subject Lines",
                          usage: "432 times",
                          type: "Email Marketing",
                        },
                      ].map((template, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {template.type} • Used {template.usage}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Scheduled Tasks</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            Daily Blog Post Creation
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Runs every day at 9:00 AM
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Active
                          </span>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            Weekly Analytics Report
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Runs every Monday at 8:00 AM
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Active
                          </span>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Notification System Settings
                    </h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-3">
                        <h5 className="font-medium">Email Notifications</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Welcome emails</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Payment reminders</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Feature updates</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium">SMS Notifications</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Security alerts</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">
                              System maintenance
                            </Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">
                              Marketing messages
                            </Label>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium">Push Notifications</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">New features</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Account updates</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Reminders</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>
                    Manage security policies and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableTwoFactor}
                        onCheckedChange={(checked) =>
                          updateSetting("enableTwoFactor", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Audit Logs</Label>
                        <p className="text-sm text-muted-foreground">
                          Track all admin actions and system changes
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableAuditLogs}
                        onCheckedChange={(checked) =>
                          updateSetting("enableAuditLogs", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordComplexity">
                        Password Complexity
                      </Label>
                      <Select
                        value={settings.passwordComplexity}
                        onValueChange={(value) =>
                          updateSetting("passwordComplexity", value)
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
                      <Label htmlFor="apiRateLimit">
                        API Rate Limit (per hour)
                      </Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) =>
                          updateSetting(
                            "apiRateLimit",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>
                    Configure email delivery and SMTP settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={settings.fromEmail}
                        onChange={(e) =>
                          updateSetting("fromEmail", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={settings.fromName}
                        onChange={(e) =>
                          updateSetting("fromName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">SMTP Configuration</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={settings.smtpHost}
                          onChange={(e) =>
                            updateSetting("smtpHost", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) =>
                            updateSetting("smtpPort", parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">SMTP Username</Label>
                        <Input
                          id="smtpUser"
                          value={settings.smtpUser}
                          onChange={(e) =>
                            updateSetting("smtpUser", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={settings.smtpPassword}
                          onChange={(e) =>
                            updateSetting("smtpPassword", e.target.value)
                          }
                        />
                      </div>
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
                    Configure system-wide notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Critical system notifications and alerts
                        </p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting("systemAlerts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Security-related notifications and warnings
                        </p>
                      </div>
                      <Switch
                        checked={settings.securityAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting("securityAlerts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>User Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          User activity and account notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.userNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("userNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Product updates and marketing communications
                        </p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) =>
                          updateSetting("marketingEmails", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Settings */}
            {activeTab === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription>
                    Configure AI services and API keys for the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableAiFeatures">
                        Enable AI Features
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI-powered features across the platform
                      </p>
                    </div>
                    <Switch
                      id="enableAiFeatures"
                      checked={settings.enableAiFeatures}
                      onCheckedChange={(checked) =>
                        updateSetting("enableAiFeatures", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiApiKey"
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) =>
                        updateSetting("openaiApiKey", e.target.value)
                      }
                      placeholder="sk-..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Your OpenAI API key for AI-powered features. Keep this
                      secure and never share it.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openaiOrganization">
                      OpenAI Organization ID (Optional)
                    </Label>
                    <Input
                      id="openaiOrganization"
                      value={settings.openaiOrganization}
                      onChange={(e) =>
                        updateSetting("openaiOrganization", e.target.value)
                      }
                      placeholder="org-..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional organization ID for OpenAI API usage tracking
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">AI Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Project description enhancement</li>
                      <li>• Content generation and improvement</li>
                      <li>• Smart categorization and tagging</li>
                      <li>• Automated image analysis</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">
                        Security Notice
                      </h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      API keys are encrypted and stored securely. Only super
                      administrators can view and modify these settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Settings */}
            {activeTab === "financial" && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Configuration</CardTitle>
                  <CardDescription>
                    Manage billing, payments, and financial settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <Select
                        value={settings.defaultCurrency}
                        onValueChange={(value) =>
                          updateSetting("defaultCurrency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (��)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={settings.taxRate}
                        onChange={(e) =>
                          updateSetting("taxRate", parseFloat(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentGateway">Payment Gateway</Label>
                      <Select
                        value={settings.paymentGateway}
                        onValueChange={(value) =>
                          updateSetting("paymentGateway", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Invoicing</Label>
                        <p className="text-sm text-muted-foreground">
                          Generate and send automated invoices
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableInvoicing}
                        onCheckedChange={(checked) =>
                          updateSetting("enableInvoicing", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Subscriptions</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow recurring subscription billing
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableSubscriptions}
                        onCheckedChange={(checked) =>
                          updateSetting("enableSubscriptions", checked)
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
                  <CardTitle>Integration Configuration</CardTitle>
                  <CardDescription>
                    Manage third-party integrations and API connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Google My Business</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect to Google My Business API for location
                        management
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Google Analytics</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Analytics integration for advanced reporting
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Pending Setup
                        </span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Mailchimp</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Email marketing and automation platform
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Not Connected
                        </span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Stripe</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Payment processing and subscription management
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Integration Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Third-Party Integrations</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow external services to connect via API
                          </p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-sync Data</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically synchronize data with connected
                            services
                          </p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Webhooks</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow real-time notifications from integrated
                            services
                          </p>
                        </div>
                        <Switch checked={false} onCheckedChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">API Management</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full gap-2">
                        <Globe className="h-4 w-4" />
                        Manage API Keys
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Database className="h-4 w-4" />
                        View Integration Logs
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Settings className="h-4 w-4" />
                        Configure Webhooks
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Database Settings */}
            {activeTab === "database" && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Configuration</CardTitle>
                  <CardDescription>
                    Database maintenance and backup settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Database Status</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Primary database connection status
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Online</span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Last Backup</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Most recent database backup
                      </p>
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString()} 3:00 AM
                      </span>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Database Maintenance</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full gap-2">
                        <Database className="h-4 w-4" />
                        Run Database Optimization
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Create Manual Backup
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <BarChart3 className="h-4 w-4" />
                        View Database Statistics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
