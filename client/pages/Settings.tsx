import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  ArrowRight,
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
  Bell,
  ToggleLeft,
  ToggleRight,
  Edit,
  Eye,
  X,
  BarChart3,
  Database,
  Key,
} from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  createdAt: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

export default function Settings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("business");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            name: "John Smith",
            email: "john@smithconstruction.com",
            phone: "(555) 123-4567",
            role: "admin" as const,
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  });

  const [businessData, setBusiness] = useState(() => {
    const saved = localStorage.getItem("businessProfile");
    return saved
      ? JSON.parse(saved)
      : {
          logo: "",
          name: "Smith Construction LLC",
          email: "contact@smithconstruction.com",
          phone: "(555) 123-4567",
        };
  });

  const [settingsData, setSettingsData] = useState(() => {
    const saved = localStorage.getItem("appSettings");
    return saved
      ? JSON.parse(saved)
      : {
          notifications: {
            email: true,
            push: false,
            weekly: true,
          },
          location: {
            gpsEnabled: true,
            useAddressForDirections: true,
            mapProvider: "google",
            distanceUnits: "miles",
          },
          media: {
            imageQuality: "high",
            videoQuality: "hd",
            imageAspect: "16:9",
            timestampEnabled: true,
            gpsStampEnabled: false,
          },
          upload: {
            autoUpload: false,
            compressionEnabled: true,
            maxFileSize: "10MB",
          },
          subscription: {
            plan: "Pro",
            status: "active",
            nextBilling: "2024-02-15",
            billingHistory: [
              { date: "2024-01-15", amount: "$29.00", status: "Paid" },
              { date: "2023-12-15", amount: "$29.00", status: "Paid" },
              { date: "2023-11-15", amount: "$29.00", status: "Paid" },
            ],
            features: [
              "Unlimited projects",
              "Up to 50 team members",
              "Advanced analytics",
              "Custom integrations",
              "Priority support",
              "50GB storage",
            ],
          },
          integrations: {
            ghlApiKey: "",
            googleMyBusinessUrl: "",
          },
          company: {
            stats: {
              storage: "2.4GB",
              users: 12,
              photos: 1247,
              videos: 89,
              projects: 34,
            },
          },
        };
  });

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "Project Updates",
      url: "",
      events: ["project_created", "project_completed"],
      active: false,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === "business") {
      setBusiness((prev: any) => ({ ...prev, [field]: value }));
    } else {
      setSettingsData((prev: any) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBusiness((prev: any) => ({
            ...prev,
            logo: e.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("businessProfile", JSON.stringify(businessData));
      localStorage.setItem("appSettings", JSON.stringify(settingsData));
      localStorage.setItem("users", JSON.stringify(users));
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

    setUsers((prev) => [...prev, user]);
    setNewUser({ name: "", email: "", phone: "", role: "viewer" });
    setShowAddUser(false);
    toast.success("User added successfully!");
  };

  const updateUser = () => {
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );
    setEditingUser(null);
    setShowEditUser(false);
    toast.success("User updated successfully!");
  };

  const removeUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User removed successfully!");
    }
  };

  const addWebhook = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: "New Webhook",
      url: "",
      events: [],
      active: false,
    };
    setWebhooks((prev) => [...prev, newWebhook]);
  };

  const updateWebhook = (id: string, updates: Partial<Webhook>) => {
    setWebhooks((prev) =>
      prev.map((webhook) =>
        webhook.id === id ? { ...webhook, ...updates } : webhook,
      ),
    );
  };

  const removeWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((webhook) => webhook.id !== id));
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    // Simulate promo code validation
    if (promoCode.toUpperCase() === "SAVE20") {
      toast.success("Promo code applied! 20% discount for next billing cycle.");
      setPromoCode("");
    } else {
      toast.error("Invalid promo code");
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

        <Breadcrumb />

        {/* Sticky Tab Navigation */}
        <div className="sticky top-16 z-40 bg-background border-b mb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide pb-1 relative">
              <div className="flex space-x-1 min-w-max px-4 py-3">
                {[
                  { id: "business", label: "Business Profile", icon: Users },
                  { id: "team", label: "Team Management", icon: Users },
                  {
                    id: "subscription",
                    label: "Subscription",
                    icon: CreditCard,
                  },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "location", label: "Location Settings", icon: MapPin },
                  { id: "media", label: "Media Settings", icon: Camera },
                  { id: "upload", label: "Upload Settings", icon: Upload },
                  { id: "integrations", label: "Integrations", icon: Webhook },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </button>
                ))}
              </div>
              {/* Scroll indicator arrows */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-background to-transparent w-8 pointer-events-none">
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </div>
            </div>

            {/* Sticky Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 px-4 py-3 border-t bg-background">
              <Link to="/">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleSave}
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
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Business Profile Tab */}
          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={businessData.logo} />
                    <AvatarFallback className="text-lg">
                      {businessData.name
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
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      Business logo - JPG, PNG up to 2MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessData.name}
                      onChange={(e) =>
                        handleInputChange("business", "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={businessData.email}
                      onChange={(e) =>
                        handleInputChange("business", "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input
                      id="businessPhone"
                      value={businessData.phone}
                      onChange={(e) =>
                        handleInputChange("business", "phone", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Management Tab */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Members ({users.length})</CardTitle>
                  <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={newUser.phone}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
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
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddUser(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={addUser}>Add User</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                            {user.phone && (
                              <p className="text-sm text-muted-foreground">
                                {user.phone}
                              </p>
                            )}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingUser(user);
                              setShowEditUser(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

              {/* Edit User Dialog */}
              <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                  {editingUser && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev ? { ...prev, name: e.target.value } : null,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev ? { ...prev, email: e.target.value } : null,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={editingUser.phone || ""}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev ? { ...prev, phone: e.target.value } : null,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={editingUser.role}
                          onValueChange={(value: any) =>
                            setEditingUser((prev) =>
                              prev ? { ...prev, role: value } : null,
                            )
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
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowEditUser(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={updateUser}>Update User</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              {/* Company Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Company Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <Database className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {settingsData.company.stats.storage}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Storage Used
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {settingsData.company.stats.users}
                      </div>
                      <div className="text-sm text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {settingsData.company.stats.photos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Photos
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Camera className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {settingsData.company.stats.videos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Videos
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {settingsData.company.stats.projects}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Projects
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        ProjectLens {settingsData.subscription.plan}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span className="font-medium text-green-600">
                          {settingsData.subscription.status}
                        </span>
                      </p>
                    </div>
                    <Badge variant="outline">
                      ${settingsData.subscription.plan === "Pro" ? "29" : "9"}
                      /month
                    </Badge>
                  </div>

                  {/* Plan Features */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Plan Features</h4>
                    <ul className="space-y-2">
                      {settingsData.subscription.features.map(
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

                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Next Billing</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          settingsData.subscription.nextBilling,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Promo Code</h4>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button onClick={applyPromoCode} variant="outline">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Manage Billing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settingsData.subscription.billingHistory.map(
                        (bill: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(bill.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{bill.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  bill.status === "Paid"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {bill.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
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
                    checked={settingsData.notifications.email}
                    onCheckedChange={(checked) =>
                      handleInputChange("notifications", "email", checked)
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
                    checked={settingsData.notifications.push}
                    onCheckedChange={(checked) =>
                      handleInputChange("notifications", "push", checked)
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
                    checked={settingsData.notifications.weekly}
                    onCheckedChange={(checked) =>
                      handleInputChange("notifications", "weekly", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Settings Tab */}
          {activeTab === "location" && (
            <Card>
              <CardHeader>
                <CardTitle>Location Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">GPS Enabled</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable GPS tracking for projects
                    </p>
                  </div>
                  <Switch
                    checked={settingsData.location.gpsEnabled}
                    onCheckedChange={(checked) =>
                      handleInputChange("location", "gpsEnabled", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Directions</Label>
                  <Select
                    value={
                      settingsData.location.useAddressForDirections
                        ? "address"
                        : "gps"
                    }
                    onValueChange={(value) =>
                      handleInputChange(
                        "location",
                        "useAddressForDirections",
                        value === "address",
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="address">Use Address</SelectItem>
                      <SelectItem value="gps">Use GPS Coordinates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Map Provider</Label>
                  <Select
                    value={settingsData.location.mapProvider}
                    onValueChange={(value) =>
                      handleInputChange("location", "mapProvider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Maps</SelectItem>
                      <SelectItem value="apple">Apple Maps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance Units</Label>
                  <Select
                    value={settingsData.location.distanceUnits}
                    onValueChange={(value) =>
                      handleInputChange("location", "distanceUnits", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="kilometers">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Media Settings Tab */}
          {activeTab === "media" && (
            <Card>
              <CardHeader>
                <CardTitle>Media Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image Quality</Label>
                    <Select
                      value={settingsData.media.imageQuality}
                      onValueChange={(value) =>
                        handleInputChange("media", "imageQuality", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Video Quality</Label>
                    <Select
                      value={settingsData.media.videoQuality}
                      onValueChange={(value) =>
                        handleInputChange("media", "videoQuality", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="hd">1080p (HD)</SelectItem>
                        <SelectItem value="4k">4K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Image Aspect Ratio</Label>
                    <Select
                      value={settingsData.media.imageAspect}
                      onValueChange={(value) =>
                        handleInputChange("media", "imageAspect", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Timestamp on Photos</h4>
                      <p className="text-sm text-muted-foreground">
                        Add date and time to photos
                      </p>
                    </div>
                    <Switch
                      checked={settingsData.media.timestampEnabled}
                      onCheckedChange={(checked) =>
                        handleInputChange("media", "timestampEnabled", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">GPS Coordinates on Photos</h4>
                      <p className="text-sm text-muted-foreground">
                        Stamp GPS coordinates on photos
                      </p>
                    </div>
                    <Switch
                      checked={settingsData.media.gpsStampEnabled}
                      onCheckedChange={(checked) =>
                        handleInputChange("media", "gpsStampEnabled", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Settings Tab */}
          {activeTab === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Upload</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically upload photos when taken
                    </p>
                  </div>
                  <Switch
                    checked={settingsData.upload.autoUpload}
                    onCheckedChange={(checked) =>
                      handleInputChange("upload", "autoUpload", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compression</h4>
                    <p className="text-sm text-muted-foreground">
                      Compress images to save storage space
                    </p>
                  </div>
                  <Switch
                    checked={settingsData.upload.compressionEnabled}
                    onCheckedChange={(checked) =>
                      handleInputChange("upload", "compressionEnabled", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Maximum File Size</Label>
                  <Select
                    value={settingsData.upload.maxFileSize}
                    onValueChange={(value) =>
                      handleInputChange("upload", "maxFileSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5MB">5MB</SelectItem>
                      <SelectItem value="10MB">10MB</SelectItem>
                      <SelectItem value="25MB">25MB</SelectItem>
                      <SelectItem value="50MB">50MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              {/* API Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ghlApiKey">GHL API Key</Label>
                    <Input
                      id="ghlApiKey"
                      type="password"
                      placeholder="Enter your GHL API key"
                      value={settingsData.integrations?.ghlApiKey || ""}
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            ghlApiKey: e.target.value,
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to sync leads and contacts with GoHighLevel
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="googleMyBusinessUrl">
                      Google My Business Profile URL
                    </Label>
                    <Input
                      id="googleMyBusinessUrl"
                      placeholder="https://business.google.com/dashboard/your-business"
                      value={
                        settingsData.integrations?.googleMyBusinessUrl || ""
                      }
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            googleMyBusinessUrl: e.target.value,
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Link to automatically post project updates to your Google
                      My Business profile
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
                      checked={settingsData.rss?.enabled || false}
                      onCheckedChange={(checked) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          rss: { ...prev.rss, enabled: checked },
                        }))
                      }
                    />
                  </div>
                  {settingsData.rss?.enabled && (
                    <div className="space-y-2">
                      <Label>RSS Feed URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value="https://projectlens.app/feed/rss"
                          readOnly
                          className="bg-muted"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "https://projectlens.app/feed/rss",
                            );
                            toast.success("RSS URL copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Include public projects in RSS feed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Webhooks</CardTitle>
                  <Button onClick={addWebhook} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Webhook
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webhooks.map((webhook) => (
                      <div
                        key={webhook.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Webhook name"
                            value={webhook.name}
                            onChange={(e) =>
                              updateWebhook(webhook.id, {
                                name: e.target.value,
                              })
                            }
                            className="max-w-xs"
                          />
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={webhook.active}
                              onCheckedChange={(checked) =>
                                updateWebhook(webhook.id, { active: checked })
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeWebhook(webhook.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          placeholder="https://your-site.com/webhook"
                          value={webhook.url}
                          onChange={(e) =>
                            updateWebhook(webhook.id, { url: e.target.value })
                          }
                        />
                        <div>
                          <Label className="text-sm font-medium">
                            Trigger Events
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[
                              "project_created",
                              "project_completed",
                              "photo_uploaded",
                              "task_assigned",
                              "user_added",
                            ].map((event) => (
                              <Badge
                                key={event}
                                variant={
                                  webhook.events.includes(event)
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                  const newEvents = webhook.events.includes(
                                    event,
                                  )
                                    ? webhook.events.filter((e) => e !== event)
                                    : [...webhook.events, event];
                                  updateWebhook(webhook.id, {
                                    events: newEvents,
                                  });
                                }}
                              >
                                {event.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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
