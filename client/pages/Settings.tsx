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

  // Billing Settings
  billingContact: string;
  billingEmail: string;
  autoRenewal: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
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

    // Billing Settings
    billingContact: "Joe Smith",
    billingEmail: "billing@joespizza.com",
    autoRenewal: true,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
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
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem("business_settings", JSON.stringify(settings));

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

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className="space-y-6">
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
                        <h3 className="font-semibold">Local GMB Booster Pro</h3>
                        <p className="text-sm text-muted-foreground">
                          Status:{" "}
                          <span className="font-medium text-green-600">
                            Active
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline">$29/month</Badge>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Plan Features</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                          Unlimited projects
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                          Advanced photo management
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                          Client project sharing
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                          Priority support
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Next Billing</h4>
                        <p className="text-muted-foreground">April 1, 2024</p>
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
