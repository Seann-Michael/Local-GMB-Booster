import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Volume2,
  VolumeX,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Megaphone,
  Wrench,
  Users,
  Shield,
  Moon,
  Sun,
  Calendar,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";

interface NotificationPreferences {
  // Global settings
  enableNotifications: boolean;
  enableSounds: boolean;

  // Message type preferences
  messageTypes: {
    info: boolean;
    warning: boolean;
    success: boolean;
    error: boolean;
  };

  // Category preferences
  categories: {
    system: boolean;
    marketing: boolean;
    support: boolean;
    emergency: boolean;
  };

  // Delivery method preferences
  deliveryMethods: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Frequency settings
  frequency: "immediate" | "hourly" | "daily" | "weekly";
  digestTime: string; // HH:MM format

  // Do Not Disturb settings
  doNotDisturb: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    weekendsOnly: boolean;
  };

  // Advanced settings
  autoMarkAsRead: boolean;
  showPreviews: boolean;
  groupSimilar: boolean;

  // Contact information for non-app notifications
  contactInfo: {
    email: string;
    phone: string;
  };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enableNotifications: true,
  enableSounds: true,
  messageTypes: {
    info: true,
    warning: true,
    success: true,
    error: true,
  },
  categories: {
    system: true,
    marketing: true,
    support: true,
    emergency: true,
  },
  deliveryMethods: {
    inApp: true,
    email: false,
    sms: false,
    push: false,
  },
  frequency: "immediate",
  digestTime: "09:00",
  doNotDisturb: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
    weekendsOnly: false,
  },
  autoMarkAsRead: false,
  showPreviews: true,
  groupSimilar: true,
  contactInfo: {
    email: "",
    phone: "",
  },
};

export default function NotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const userId = currentUser?.id || "default";
    const stored = localStorage.getItem(`notificationPreferences_${userId}`);

    if (stored) {
      const parsed = JSON.parse(stored);
      setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
    } else {
      // Initialize with user's email if available
      const initialPrefs = {
        ...DEFAULT_PREFERENCES,
        contactInfo: {
          email: currentUser?.email || "",
          phone: "",
        },
      };
      setPreferences(initialPrefs);
    }
  };

  const handlePreferenceChange = (path: string, value: any) => {
    setPreferences((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current = updated as any;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return updated;
    });
    setHasChanges(true);
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const userId = currentUser?.id || "default";
      localStorage.setItem(
        `notificationPreferences_${userId}`,
        JSON.stringify(preferences),
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Notification preferences saved successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    const defaultsWithEmail = {
      ...DEFAULT_PREFERENCES,
      contactInfo: {
        email: currentUser?.email || "",
        phone: "",
      },
    };
    setPreferences(defaultsWithEmail);
    setHasChanges(true);
    toast.info("Preferences reset to defaults");
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Wrench className="h-4 w-4 text-gray-500" />;
      case "marketing":
        return <Megaphone className="h-4 w-4 text-purple-500" />;
      case "support":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "emergency":
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case "inApp":
        return <Bell className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "push":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Notification Preferences
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={savePreferences}
              disabled={!hasChanges || isLoading}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Global Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on/off all notifications globally
                  </p>
                </div>
                <Switch
                  checked={preferences.enableNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("enableNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    {preferences.enableSounds ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    Notification Sounds
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when notifications arrive
                  </p>
                </div>
                <Switch
                  checked={preferences.enableSounds}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("enableSounds", checked)
                  }
                  disabled={!preferences.enableNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Message Types */}
          <Card>
            <CardHeader>
              <CardTitle>Message Types</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which types of messages you want to receive
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences.messageTypes).map(
                  ([type, enabled]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getMessageTypeIcon(type)}
                        <div>
                          <Label className="capitalize text-base">{type}</Label>
                          <p className="text-xs text-muted-foreground">
                            {type === "info" &&
                              "General information and updates"}
                            {type === "warning" &&
                              "Important warnings and alerts"}
                            {type === "success" && "Success confirmations"}
                            {type === "error" &&
                              "Error notifications and issues"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            `messageTypes.${type}`,
                            checked,
                          )
                        }
                        disabled={!preferences.enableNotifications}
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Message Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select categories of messages you're interested in
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences.categories).map(
                  ([category, enabled]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(category)}
                        <div>
                          <Label className="capitalize text-base">
                            {category}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {category === "system" &&
                              "System updates and maintenance"}
                            {category === "marketing" &&
                              "Feature announcements and promotions"}
                            {category === "support" &&
                              "Support updates and help"}
                            {category === "emergency" &&
                              "Critical alerts and security"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            `categories.${category}`,
                            checked,
                          )
                        }
                        disabled={!preferences.enableNotifications}
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Methods</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive notifications
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences.deliveryMethods).map(
                  ([method, enabled]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getDeliveryMethodIcon(method)}
                        <div>
                          <Label className="text-base">
                            {method === "inApp" && "In-App Notifications"}
                            {method === "email" && "Email Notifications"}
                            {method === "sms" && "SMS Notifications"}
                            {method === "push" && "Push Notifications"}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {method === "inApp" &&
                              "Show notifications in the app"}
                            {method === "email" &&
                              "Send notifications to your email"}
                            {method === "sms" &&
                              "Send text messages to your phone"}
                            {method === "push" &&
                              "Send push notifications to your device"}
                          </p>
                          {(method === "email" || method === "sms") &&
                            enabled && (
                              <Badge
                                variant="secondary"
                                className="mt-1 text-xs"
                              >
                                Contact info required
                              </Badge>
                            )}
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            `deliveryMethods.${method}`,
                            checked,
                          )
                        }
                        disabled={!preferences.enableNotifications}
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Frequency Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Frequency & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select
                  value={preferences.frequency}
                  onValueChange={(value: any) =>
                    handlePreferenceChange("frequency", value)
                  }
                  disabled={!preferences.enableNotifications}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Immediate - Receive notifications as they happen
                      </div>
                    </SelectItem>
                    <SelectItem value="hourly">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Hourly Digest - Batch notifications every hour
                      </div>
                    </SelectItem>
                    <SelectItem value="daily">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Daily Digest - One summary per day
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Weekly Digest - One summary per week
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {preferences.frequency !== "immediate" && (
                <div className="grid gap-2">
                  <Label htmlFor="digestTime">Digest Time</Label>
                  <Input
                    id="digestTime"
                    type="time"
                    value={preferences.digestTime}
                    onChange={(e) =>
                      handlePreferenceChange("digestTime", e.target.value)
                    }
                    disabled={!preferences.enableNotifications}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time when you want to receive your digest
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Do Not Disturb */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Do Not Disturb
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Do Not Disturb</Label>
                  <p className="text-sm text-muted-foreground">
                    Silence notifications during specific hours
                  </p>
                </div>
                <Switch
                  checked={preferences.doNotDisturb.enabled}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("doNotDisturb.enabled", checked)
                  }
                  disabled={!preferences.enableNotifications}
                />
              </div>

              {preferences.doNotDisturb.enabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={preferences.doNotDisturb.startTime}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "doNotDisturb.startTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={preferences.doNotDisturb.endTime}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "doNotDisturb.endTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekends Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Apply Do Not Disturb only on weekends
                      </p>
                    </div>
                    <Switch
                      checked={preferences.doNotDisturb.weekendsOnly}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(
                          "doNotDisturb.weekendsOnly",
                          checked,
                        )
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-mark as Read</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically mark notifications as read after viewing
                  </p>
                </div>
                <Switch
                  checked={preferences.autoMarkAsRead}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("autoMarkAsRead", checked)
                  }
                  disabled={!preferences.enableNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Message Previews</Label>
                  <p className="text-sm text-muted-foreground">
                    Display message content in notification previews
                  </p>
                </div>
                <Switch
                  checked={preferences.showPreviews}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("showPreviews", checked)
                  }
                  disabled={!preferences.enableNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Group Similar Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Combine similar notifications into groups
                  </p>
                </div>
                <Switch
                  checked={preferences.groupSimilar}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("groupSimilar", checked)
                  }
                  disabled={!preferences.enableNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Required for email and SMS notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={preferences.contactInfo.email}
                  onChange={(e) =>
                    handlePreferenceChange("contactInfo.email", e.target.value)
                  }
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={preferences.contactInfo.phone}
                  onChange={(e) =>
                    handlePreferenceChange("contactInfo.phone", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Banner */}
        {hasChanges && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="shadow-lg border-2 border-primary">
              <CardContent className="p-4 flex items-center gap-4">
                <p className="text-sm font-medium">You have unsaved changes</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadPreferences();
                      setHasChanges(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={savePreferences}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
