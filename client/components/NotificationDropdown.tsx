import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  X,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  User,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  projectId?: string;
  userId?: string;
  businessId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "warning",
    title: "Storage Space Low",
    message:
      "Your storage is 85% full. Consider upgrading your plan or removing old files.",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    actionUrl: "/admin/settings?tab=billing",
    actionText: "Upgrade Plan",
  },
  {
    id: "notif_002",
    type: "success",
    title: "Project Completed",
    message:
      "Kitchen Renovation project has been marked as completed by the team.",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: "/project/demo-1",
    actionText: "View Project",
    projectId: "demo-1",
  },
  {
    id: "notif_003",
    type: "info",
    title: "New Team Member Added",
    message:
      "John Smith has been added to your team with Project Manager role.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    actionUrl: "/admin/settings?tab=users",
    actionText: "View Users",
    userId: "user_456",
  },
  {
    id: "notif_004",
    type: "error",
    title: "Backup Failed",
    message: "Daily backup process failed. Please check your backup settings.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: false,
    actionUrl: "/admin/settings?tab=general",
    actionText: "Check Settings",
  },
  {
    id: "notif_005",
    type: "info",
    title: "Monthly Report Ready",
    message:
      "Your monthly project analytics report is now available for download.",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    read: true,
    actionUrl: "/admin/analytics",
    actionText: "View Report",
  },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage
    const stored = localStorage.getItem("userNotifications");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockNotifications;
      }
    }
    return mockNotifications;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Save to localStorage when notifications change
  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId),
    );
    toast.success("Notification removed");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs z-20 bg-red-500 text-white border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 max-h-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-6 px-2"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs h-6 px-2"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "group border-l-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30",
                    notification.type === "error" && "border-l-red-500",
                    notification.type === "warning" && "border-l-yellow-500",
                    notification.type === "success" && "border-l-green-500",
                    notification.type === "info" && "border-l-blue-500",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.actionText && (
                              <span className="text-xs text-primary flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {notification.actionText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                            title="Mark as read"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          title="Remove notification"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/admin/settings?tab=notifications";
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
