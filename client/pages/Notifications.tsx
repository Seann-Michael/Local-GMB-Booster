import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  User,
  Camera,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Notification {
  id: string;
  type:
    | "project_created"
    | "photo_uploaded"
    | "task_assigned"
    | "project_completed";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "project_created",
      title: "New Project Created",
      message: "Kitchen Renovation project has been created by John Smith",
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/project/1",
    },
    {
      id: "2",
      type: "photo_uploaded",
      title: "Photos Uploaded",
      message: "5 new photos added to Bathroom Upgrade project",
      timestamp: "1 hour ago",
      read: false,
      actionUrl: "/project/2",
    },
    {
      id: "3",
      type: "task_assigned",
      title: "Task Assigned",
      message: "You have been assigned a new task: Install fixtures",
      timestamp: "3 hours ago",
      read: true,
      actionUrl: "/project/1",
    },
    {
      id: "4",
      type: "project_completed",
      title: "Project Completed",
      message: "Deck Construction project has been marked as completed",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/project/3",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "project_created":
        return <FileText className="h-4 w-4" />;
      case "photo_uploaded":
        return <Camera className="h-4 w-4" />;
      case "task_assigned":
        return <User className="h-4 w-4" />;
      case "project_completed":
        return <Check className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        notification.type === "project_created"
                          ? "bg-blue-100 text-blue-600"
                          : notification.type === "photo_uploaded"
                            ? "bg-green-100 text-green-600"
                            : notification.type === "task_assigned"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Badge variant="default" className="h-2 w-2 p-0" />
                          )}
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                removeNotification(notification.id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {notification.actionUrl && (
                        <Link to={notification.actionUrl}>
                          <Button variant="outline" size="sm" className="mt-3">
                            View Details
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
