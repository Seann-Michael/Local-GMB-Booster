import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Camera,
  Save,
  Download,
  Upload,
  Users,
  Plus,
  Trash2,
  Globe,
  Rss,
  Webhook,
  CreditCard,
  Image as ImageIcon,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  createdAt: string;
}

export default function Settings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            name: "John Smith",
            email: "john@smithconstruction.com",
            role: "admin" as const,
            createdAt: new Date().toISOString(),
          },
        ];
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  });

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "John Smith",
          email: "john@smithconstruction.com",
          company: "Smith Construction LLC",
          phone: "(555) 123-4567",
          bio: "Professional contractor specializing in residential renovations and custom builds.",
          avatar: "",
          notifications: {
            email: true,
            push: false,
            weekly: true,
          },
          integrations: {
            website: false,
            googleBusiness: false,
          },
          imageSettings: {
            watermark: false,
            timestamp: false,
            gpsLocation: false,
            watermarkText: "Smith Construction LLC",
          },
          subscription: {
            plan: "Pro",
            status: "active",
            nextBilling: "2024-02-15",
          },
        };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhooks, setWebhooks] = useState([
    {
      id: "1",
      name: "Project Updates",
      url: "",
      events: ["project_created", "project_completed"],
      active: false,
    },
  ]);
  const [rssEnabled, setRssEnabled] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean,
    nested?: string,
  ) => {
    setProfileData((prev: any) => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileData((prev: any) => ({
            ...prev,
            avatar: e.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("userProfile", JSON.stringify(profileData));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and email are required");
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setNewUser({ name: "", email: "", role: "viewer" });
    toast.success("User added successfully!");
  };

  const removeUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      const updatedUsers = users.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      toast.success("User removed successfully!");
    }
  };

  const exportData = () => {
    const projects = localStorage.getItem("projects") || "[]";
    const profile = localStorage.getItem("userProfile") || "{}";
    const userData = localStorage.getItem("users") || "[]";
    const data = {
      profile: JSON.parse(profile),
      projects: JSON.parse(projects),
      users: JSON.parse(userData),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projectlens-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    try {
      // Simulate webhook test
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Webhook test successful!");
    } catch (error) {
      toast.error("Webhook test failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
            {[
              { id: "business", label: "Business Profile", icon: Users },
              { id: "user", label: "User Profile", icon: Users },
              { id: "users", label: "Team Management", icon: Users },
              { id: "subscription", label: "Subscription", icon: CreditCard },
              { id: "location", label: "Location Settings", icon: MapPin },
              { id: "camera", label: "Camera Settings", icon: Camera },
              { id: "upload", label: "Upload Settings", icon: Upload },
              { id: "webhooks", label: "Webhooks", icon: Webhook },
              { id: "advanced", label: "Advanced", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="text-lg">
                        {profileData.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your business..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects via email
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notifications.email}
                      onCheckedChange={(checked) =>
                        handleInputChange("email", checked, "notifications")
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified on your device
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notifications.push}
                      onCheckedChange={(checked) =>
                        handleInputChange("push", checked, "notifications")
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        Get a weekly report of your project activity
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notifications.weekly}
                      onCheckedChange={(checked) =>
                        handleInputChange("weekly", checked, "notifications")
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Website Sync</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync projects to your website
                      </p>
                    </div>
                    <Switch
                      checked={profileData.integrations.website}
                      onCheckedChange={(checked) =>
                        handleInputChange("website", checked, "integrations")
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google My Business</h4>
                      <p className="text-sm text-muted-foreground">
                        Share project photos to Google My Business
                      </p>
                    </div>
                    <Switch
                      checked={profileData.integrations.googleBusiness}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "googleBusiness",
                          checked,
                          "integrations",
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download all your projects and profile data
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={exportData}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Users Management Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New User</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2">
                      <Select
                        value={newUser.role}
                        onValueChange={(value: any) =>
                          setNewUser((prev) => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addUser} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                          {user.role !== "admin" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        ProjectLens {profileData.subscription.plan}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span className="font-medium text-green-600">
                          {profileData.subscription.status}
                        </span>
                      </p>
                    </div>
                    <Badge variant="outline">
                      ${profileData.subscription.plan === "Pro" ? "29" : "9"}
                      /month
                    </Badge>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Features Included</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Unlimited projects</li>
                        <li>• AI description enhancement</li>
                        <li>• Photo tagging & organization</li>
                        <li>• Customer management</li>
                        <li>• Review request automation</li>
                        {profileData.subscription.plan === "Pro" && (
                          <>
                            <li>• Advanced integrations</li>
                            <li>• Webhooks & RSS feeds</li>
                            <li>• Custom watermarks</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Billing Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Next billing:{" "}
                        {new Date(
                          profileData.subscription.nextBilling,
                        ).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Manage Billing
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Image Settings Tab */}
          {activeTab === "image-settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Add Watermark</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically add your company watermark to all photos
                      </p>
                    </div>
                    <Switch
                      checked={profileData.imageSettings.watermark}
                      onCheckedChange={(checked) =>
                        handleInputChange("watermark", checked, "imageSettings")
                      }
                    />
                  </div>

                  {profileData.imageSettings.watermark && (
                    <div className="space-y-2">
                      <Label htmlFor="watermarkText">Watermark Text</Label>
                      <Input
                        id="watermarkText"
                        placeholder="Your Company Name"
                        value={profileData.imageSettings.watermarkText}
                        onChange={(e) =>
                          handleInputChange(
                            "watermarkText",
                            e.target.value,
                            "imageSettings",
                          )
                        }
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Timestamp</h4>
                      <p className="text-sm text-muted-foreground">
                        Add date and time to photos
                      </p>
                    </div>
                    <Switch
                      checked={profileData.imageSettings.timestamp}
                      onCheckedChange={(checked) =>
                        handleInputChange("timestamp", checked, "imageSettings")
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">GPS Location</h4>
                      <p className="text-sm text-muted-foreground">
                        Embed location data in photos
                      </p>
                    </div>
                    <Switch
                      checked={profileData.imageSettings.gpsLocation}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "gpsLocation",
                          checked,
                          "imageSettings",
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Advanced/Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Website Sync</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync projects to your website
                      </p>
                    </div>
                    <Switch
                      checked={profileData.integrations.website}
                      onCheckedChange={(checked) =>
                        handleInputChange("website", checked, "integrations")
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google My Business</h4>
                      <p className="text-sm text-muted-foreground">
                        Share project photos to Google My Business
                      </p>
                    </div>
                    <Switch
                      checked={profileData.integrations.googleBusiness}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "googleBusiness",
                          checked,
                          "integrations",
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === "advanced" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook"
                        placeholder="https://your-site.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button variant="outline" onClick={testWebhook}>
                        Test
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when projects are created or updated
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RSS Feed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable RSS Feed</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate an RSS feed of your latest projects
                      </p>
                    </div>
                    <Switch
                      checked={rssEnabled}
                      onCheckedChange={setRssEnabled}
                    />
                  </div>
                  {rssEnabled && (
                    <div className="space-y-2">
                      <Label>RSS Feed URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value="https://projectlens.app/feed/rss"
                          readOnly
                          className="bg-muted"
                        />
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export All Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download all projects, users, and settings
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={exportData}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
