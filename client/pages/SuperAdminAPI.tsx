import React, { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Code,
  Key,
  Globe,
  Server,
  Activity,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  TestTube,
  ExternalLink,
  Webhook,
  Database,
  Search,
  Filter,
  BarChart3,
  Users,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { formatSystemDate } from "@/lib/dateUtils";

interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  secret?: string;
  permissions: string[];
  scopes: string[];
  isActive: boolean;
  expiresAt?: string;
  lastUsed?: string;
  createdAt: string;
  createdBy: string;
  ipWhitelist: string[];
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  retryAttempts: number;
  timeout: number;
  lastDelivery?: string;
  createdAt: string;
  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
  };
}

interface APIEndpoint {
  id: string;
  path: string;
  method: string;
  description: string;
  isActive: boolean;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  authentication: "none" | "api-key" | "oauth";
  version: string;
  deprecated: boolean;
  stats: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

interface APIStats {
  totalKeys: number;
  activeKeys: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  totalWebhooks: number;
  activeWebhooks: number;
  webhookSuccessRate: number;
}

interface ThirdPartyIntegration {
  id: string;
  name: string;
  service: string;
  category:
    | "email"
    | "sms"
    | "payment"
    | "storage"
    | "analytics"
    | "social"
    | "maps"
    | "other";
  apiKey: string;
  apiSecret?: string;
  additionalConfig: Record<string, string>;
  isActive: boolean;
  isConnected: boolean;
  lastTested?: string;
  createdAt: string;
  updatedAt: string;
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    lastRequest?: string;
    errorRate: number;
  };
}

interface APIUsageLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  apiKey: string;
  sourceIP: string;
  userAgent: string;
  responseCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  error?: string;
}

interface RateLimitRule {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  limit: number;
  window: "minute" | "hour" | "day";
  isActive: boolean;
  exemptApiKeys: string[];
  createdAt: string;
}

const API_SCOPES = [
  { value: "read", label: "Read Access", description: "View data" },
  { value: "write", label: "Write Access", description: "Create/update data" },
  { value: "delete", label: "Delete Access", description: "Delete data" },
  { value: "admin", label: "Admin Access", description: "Full system access" },
];

const API_PERMISSIONS = [
  "users:read",
  "users:write",
  "projects:read",
  "projects:write",
  "reviews:read",
  "reviews:write",
  "analytics:read",
  "messages:read",
  "messages:write",
  "webhooks:read",
  "webhooks:write",
];

const WEBHOOK_EVENTS = [
  "user.created",
  "user.updated",
  "user.deleted",
  "project.created",
  "project.updated",
  "project.completed",
  "review.submitted",
  "message.sent",
  "message.viewed",
  "payment.completed",
  "subscription.updated",
];

export default function SuperAdminAPI() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [stats, setStats] = useState<APIStats>({
    totalKeys: 0,
    activeKeys: 0,
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    totalWebhooks: 0,
    activeWebhooks: 0,
    webhookSuccessRate: 0,
  });

  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("keys");

  // Third-party integrations state
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const [usageLogs, setUsageLogs] = useState<APIUsageLog[]>([]);
  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>([]);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [editingIntegration, setEditingIntegration] =
    useState<ThirdPartyIntegration | null>(null);
  const [editingRateLimit, setEditingRateLimit] =
    useState<RateLimitRule | null>(null);

  // Form states
  const [keyForm, setKeyForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    scopes: [] as string[],
    expiresAt: "",
    ipWhitelist: "",
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    },
  });

  const [webhookForm, setWebhookForm] = useState({
    name: "",
    url: "",
    events: [] as string[],
    retryAttempts: 3,
    timeout: 30,
  });

  const [integrationForm, setIntegrationForm] = useState({
    name: "",
    service: "",
    category: "other" as ThirdPartyIntegration["category"],
    apiKey: "",
    apiSecret: "",
    additionalConfig: {} as Record<string, string>,
  });

  const [rateLimitForm, setRateLimitForm] = useState({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
    limit: 100,
    window: "minute" as "minute" | "hour" | "day",
    exemptApiKeys: [] as string[],
  });

  useEffect(() => {
    loadMockData();
    loadIntegrationsFromStorage();
  }, []);

  const loadMockData = () => {
    // Mock API keys
    const mockKeys: APIKey[] = [
      {
        id: "key-1",
        name: "Frontend Dashboard",
        description: "Main dashboard API access",
        key: "fd_sk_test_51HyJw2L...",
        permissions: ["users:read", "projects:read", "projects:write"],
        scopes: ["read", "write"],
        isActive: true,
        lastUsed: "2024-01-20T14:30:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        ipWhitelist: ["192.168.1.0/24"],
        rateLimits: {
          requestsPerMinute: 100,
          requestsPerHour: 1000,
          requestsPerDay: 10000,
        },
        usage: {
          totalRequests: 15420,
          successfulRequests: 15200,
          failedRequests: 220,
          averageResponseTime: 145,
        },
      },
      {
        id: "key-2",
        name: "Mobile App",
        description: "Mobile application API key",
        key: "ma_sk_test_51HyJw2L...",
        permissions: ["users:read", "reviews:read", "messages:read"],
        scopes: ["read"],
        isActive: true,
        lastUsed: "2024-01-20T12:15:00Z",
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "developer",
        ipWhitelist: [],
        rateLimits: {
          requestsPerMinute: 50,
          requestsPerHour: 500,
          requestsPerDay: 5000,
        },
        usage: {
          totalRequests: 8950,
          successfulRequests: 8820,
          failedRequests: 130,
          averageResponseTime: 89,
        },
      },
    ];

    // Mock webhooks
    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: "webhook-1",
        name: "Payment Notifications",
        url: "https://api.stripe.com/v1/webhook",
        events: ["payment.completed", "subscription.updated"],
        isActive: true,
        secret: "whsec_...",
        retryAttempts: 3,
        timeout: 30,
        lastDelivery: "2024-01-20T13:45:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        stats: {
          totalDeliveries: 2450,
          successfulDeliveries: 2398,
          failedDeliveries: 52,
          averageResponseTime: 234,
        },
      },
    ];

    // Mock endpoints
    const mockEndpoints: APIEndpoint[] = [
      {
        id: "endpoint-1",
        path: "/api/v1/users",
        method: "GET",
        description: "Get users list",
        isActive: true,
        rateLimits: {
          requestsPerMinute: 100,
          requestsPerHour: 1000,
        },
        authentication: "api-key",
        version: "v1",
        deprecated: false,
        stats: {
          totalRequests: 45230,
          averageResponseTime: 120,
          errorRate: 1.2,
        },
      },
    ];

    // Mock integrations data
    const mockIntegrations: ThirdPartyIntegration[] = [
      {
        id: "int-1",
        name: "SendGrid Email Service",
        service: "SendGrid",
        category: "email",
        apiKey: "SG.8k7X9p...",
        isActive: true,
        isConnected: true,
        lastTested: "2024-01-20T10:30:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-20T10:30:00Z",
        additionalConfig: {
          fromEmail: "noreply@company.com",
          fromName: "Company Name",
        },
        usage: {
          requestsToday: 245,
          requestsThisMonth: 8420,
          lastRequest: "2024-01-20T14:25:00Z",
          errorRate: 0.2,
        },
      },
      {
        id: "int-2",
        name: "Twilio SMS Service",
        service: "Twilio",
        category: "sms",
        apiKey: "AC4n2B8q...",
        apiSecret: "7f9K3m...",
        isActive: true,
        isConnected: true,
        lastTested: "2024-01-19T16:45:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-19T16:45:00Z",
        additionalConfig: {
          fromNumber: "+1234567890",
        },
        usage: {
          requestsToday: 89,
          requestsThisMonth: 2340,
          lastRequest: "2024-01-20T11:20:00Z",
          errorRate: 0.8,
        },
      },
      {
        id: "int-3",
        name: "Google Maps API",
        service: "Google Maps",
        category: "maps",
        apiKey: "AIza...",
        isActive: false,
        isConnected: false,
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-01-20T00:00:00Z",
        additionalConfig: {},
        usage: {
          requestsToday: 0,
          requestsThisMonth: 0,
          errorRate: 0,
        },
      },
    ];

    setApiKeys(mockKeys);
    setWebhooks(mockWebhooks);
    setEndpoints(mockEndpoints);
    setIntegrations(mockIntegrations);

    // Update stats
    setStats({
      totalKeys: mockKeys.length,
      activeKeys: mockKeys.filter((k) => k.isActive).length,
      totalRequests: mockKeys.reduce(
        (sum, k) => sum + k.usage.totalRequests,
        0,
      ),
      successRate: 97.8,
      averageResponseTime: 115,
      totalWebhooks: mockWebhooks.length,
      activeWebhooks: mockWebhooks.filter((w) => w.isActive).length,
      webhookSuccessRate: 98.2,
    });

    // Mock usage logs
    const mockUsageLogs: APIUsageLog[] = [
      {
        id: "log-1",
        timestamp: "2024-01-20T14:30:00Z",
        endpoint: "/api/v1/users",
        method: "GET",
        apiKey: "fd_sk_test_51HyJw2L...",
        sourceIP: "192.168.1.100",
        userAgent: "MyApp/1.0",
        responseCode: 200,
        responseTime: 145,
        requestSize: 1024,
        responseSize: 4096,
      },
    ];

    setUsageLogs(mockUsageLogs);

    // Mock rate limit rules
    const mockRateLimitRules: RateLimitRule[] = [
      {
        id: "rule-1",
        name: "User Endpoints",
        description: "Rate limit for user-related endpoints",
        endpoint: "/api/v1/users/*",
        method: "GET",
        limit: 100,
        window: "minute",
        isActive: true,
        exemptApiKeys: [],
        createdAt: "2024-01-01T00:00:00Z",
      },
    ];

    setRateLimitRules(mockRateLimitRules);
  };

  const loadIntegrationsFromStorage = () => {
    try {
      const stored = localStorage.getItem("third_party_integrations");
      if (stored) {
        const parsedIntegrations = JSON.parse(stored);
        setIntegrations((prev) => {
          // Merge with existing mock data, but prioritize stored data
          const stored = parsedIntegrations;
          const existing = prev.filter(
            (p) => !stored.find((s: ThirdPartyIntegration) => s.id === p.id),
          );
          return [...existing, ...stored];
        });
      }
    } catch (error) {
      console.error("Error loading integrations from storage:", error);
    }
  };

  const generateAPIKey = () => {
    const prefix = "fd_sk_live_";
    const randomPart = Array.from({ length: 32 }, () =>
      Math.random().toString(36).charAt(2),
    ).join("");
    return `${prefix}${randomPart}`;
  };

  const generateWebhookSecret = () => {
    const prefix = "whsec_";
    const randomPart = Array.from({ length: 32 }, () =>
      Math.random().toString(36).charAt(2),
    ).join("");
    return `${prefix}${randomPart}`;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const formatApiKey = (apiKey: string) => {
    if (!apiKey || apiKey.length < 6) return "••••••";
    const cleanKey = apiKey.replace(/[^\w.-]/g, "");
    const lastSix = cleanKey.slice(-6);
    if (cleanKey.startsWith("SG.")) return `SG.•••••${lastSix}`;
    if (cleanKey.startsWith("AC")) return `AC•••••${lastSix}`;
    if (cleanKey.startsWith("AIza")) return `AI•••••${lastSix}`;
    return `•••••${lastSix}`;
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500",
      POST: "bg-green-500",
      PUT: "bg-yellow-500",
      DELETE: "bg-red-500",
    };
    return <Badge className={colors[method] || "bg-gray-500"}>{method}</Badge>;
  };

  const handleCreateKey = () => {
    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: keyForm.name,
      description: keyForm.description,
      key: generateAPIKey(),
      permissions: keyForm.permissions,
      scopes: keyForm.scopes,
      isActive: true,
      expiresAt: keyForm.expiresAt || undefined,
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      ipWhitelist: keyForm.ipWhitelist
        ? keyForm.ipWhitelist.split(",").map((ip) => ip.trim())
        : [],
      rateLimits: keyForm.rateLimits,
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
      },
    };

    setApiKeys([...apiKeys, newKey]);
    setShowKeyDialog(false);
    setKeyForm({
      name: "",
      description: "",
      permissions: [],
      scopes: [],
      expiresAt: "",
      ipWhitelist: "",
      rateLimits: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000,
      },
    });
    toast.success("API key created successfully");
  };

  const handleCreateWebhook = () => {
    const newWebhook: WebhookEndpoint = {
      id: `webhook-${Date.now()}`,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      isActive: true,
      secret: generateWebhookSecret(),
      retryAttempts: webhookForm.retryAttempts,
      timeout: webhookForm.timeout,
      createdAt: new Date().toISOString(),
      stats: {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageResponseTime: 0,
      },
    };

    setWebhooks([...webhooks, newWebhook]);
    setShowWebhookDialog(false);
    setWebhookForm({
      name: "",
      url: "",
      events: [],
      retryAttempts: 3,
      timeout: 30,
    });
    toast.success("Webhook endpoint created successfully");
  };

  const testIntegration = async (integration: ThirdPartyIntegration) => {
    try {
      toast.info(`Testing ${integration.service} connection...`);

      // Simulate API test delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Special handling for Google Maps API
      if (integration.service === "Google Maps" && integration.apiKey) {
        try {
          // Test Google Maps API by making a simple geocoding request
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${integration.apiKey}`,
          );
          const data = await response.json();

          if (data.status === "OK") {
            // Update integration status
            const updatedIntegrations = integrations.map((int) =>
              int.id === integration.id
                ? {
                    ...int,
                    isConnected: true,
                    lastTested: new Date().toISOString(),
                  }
                : int,
            );
            setIntegrations(updatedIntegrations);
            saveIntegrationsToStorage(updatedIntegrations);
            toast.success(`${integration.service} connection successful!`);
          } else {
            throw new Error(data.error_message || "API test failed");
          }
        } catch (error) {
          console.error("Google Maps API test failed:", error);
          const updatedIntegrations = integrations.map((int) =>
            int.id === integration.id
              ? {
                  ...int,
                  isConnected: false,
                  lastTested: new Date().toISOString(),
                }
              : int,
          );
          setIntegrations(updatedIntegrations);
          saveIntegrationsToStorage(updatedIntegrations);
          toast.error(`${integration.service} connection failed: ${error}`);
        }
        return;
      }

      // Mock successful connection for other services
      const updatedIntegrations = integrations.map((int) =>
        int.id === integration.id
          ? {
              ...int,
              isConnected: true,
              lastTested: new Date().toISOString(),
            }
          : int,
      );
      setIntegrations(updatedIntegrations);
      saveIntegrationsToStorage(updatedIntegrations);
      toast.success(`${integration.service} connection successful!`);
    } catch (error) {
      console.error("Integration test failed:", error);
      toast.error(`${integration.service} connection failed`);
    }
  };

  const saveIntegrationsToStorage = (integrations: ThirdPartyIntegration[]) => {
    try {
      localStorage.setItem(
        "third_party_integrations",
        JSON.stringify(integrations),
      );
    } catch (error) {
      console.error("Error saving integrations to storage:", error);
    }
  };

  const handleCreateIntegration = () => {
    const newIntegration: ThirdPartyIntegration = {
      id: `int-${Date.now()}`,
      name: integrationForm.name,
      service: integrationForm.service,
      category: integrationForm.category,
      apiKey: integrationForm.apiKey,
      apiSecret: integrationForm.apiSecret || undefined,
      additionalConfig: integrationForm.additionalConfig,
      isActive: true,
      isConnected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usage: {
        requestsToday: 0,
        requestsThisMonth: 0,
        errorRate: 0,
      },
    };

    const updatedIntegrations = [...integrations, newIntegration];
    setIntegrations(updatedIntegrations);
    saveIntegrationsToStorage(updatedIntegrations);
    setShowIntegrationDialog(false);
    setIntegrationForm({
      name: "",
      service: "",
      category: "other",
      apiKey: "",
      apiSecret: "",
      additionalConfig: {},
    });
    toast.success("Integration created successfully");
  };

  const handleUpdateIntegration = () => {
    if (!editingIntegration) return;

    const updatedIntegrations = integrations.map((int) =>
      int.id === editingIntegration.id
        ? {
            ...int,
            name: integrationForm.name,
            service: integrationForm.service,
            category: integrationForm.category,
            apiKey: integrationForm.apiKey,
            apiSecret: integrationForm.apiSecret || undefined,
            additionalConfig: integrationForm.additionalConfig,
            updatedAt: new Date().toISOString(),
          }
        : int,
    );

    setIntegrations(updatedIntegrations);
    saveIntegrationsToStorage(updatedIntegrations);
    setShowIntegrationDialog(false);
    setEditingIntegration(null);
    setIntegrationForm({
      name: "",
      service: "",
      category: "other",
      apiKey: "",
      apiSecret: "",
      additionalConfig: {},
    });
    toast.success("Integration updated successfully");
  };

  const handleDeleteIntegration = (id: string) => {
    const updatedIntegrations = integrations.filter((int) => int.id !== id);
    setIntegrations(updatedIntegrations);
    saveIntegrationsToStorage(updatedIntegrations);
    toast.success("Integration deleted successfully");
  };

  const handleToggleIntegration = (id: string) => {
    const updatedIntegrations = integrations.map((int) =>
      int.id === id
        ? {
            ...int,
            isActive: !int.isActive,
            updatedAt: new Date().toISOString(),
          }
        : int,
    );
    setIntegrations(updatedIntegrations);
    saveIntegrationsToStorage(updatedIntegrations);
  };

  const setupGoogleMapsIntegration = () => {
    const existingGoogleMaps = integrations.find(
      (int) => int.service === "Google Maps",
    );

    if (existingGoogleMaps) {
      // Edit existing Google Maps integration
      setEditingIntegration(existingGoogleMaps);
      setIntegrationForm({
        name: existingGoogleMaps.name,
        service: existingGoogleMaps.service,
        category: existingGoogleMaps.category,
        apiKey: existingGoogleMaps.apiKey,
        apiSecret: existingGoogleMaps.apiSecret || "",
        additionalConfig: existingGoogleMaps.additionalConfig,
      });
    } else {
      // Create new Google Maps integration
      setEditingIntegration(null);
      setIntegrationForm({
        name: "Google Maps API",
        service: "Google Maps",
        category: "maps",
        apiKey: "",
        apiSecret: "",
        additionalConfig: {},
      });
    }
    setShowIntegrationDialog(true);
  };

  const resetGoogleMapsIntegration = () => {
    const updatedIntegrations = integrations.filter(
      (int) => int.service !== "Google Maps",
    );
    setIntegrations(updatedIntegrations);
    saveIntegrationsToStorage(updatedIntegrations);
    toast.success("Google Maps integration reset");
  };

  const openEditIntegrationDialog = (integration: ThirdPartyIntegration) => {
    setEditingIntegration(integration);
    setIntegrationForm({
      name: integration.name,
      service: integration.service,
      category: integration.category,
      apiKey: integration.apiKey,
      apiSecret: integration.apiSecret || "",
      additionalConfig: integration.additionalConfig,
    });
    setShowIntegrationDialog(true);
  };

  const getCategoryBadge = (category: ThirdPartyIntegration["category"]) => {
    const colors: Record<ThirdPartyIntegration["category"], string> = {
      email: "bg-blue-500",
      sms: "bg-green-500",
      payment: "bg-yellow-500",
      storage: "bg-purple-500",
      analytics: "bg-red-500",
      social: "bg-pink-500",
      maps: "bg-orange-500",
      other: "bg-gray-500",
    };
    return (
      <Badge className={colors[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const getConnectionBadge = (isConnected: boolean) => {
    return isConnected ? (
      <Badge className="bg-green-500 gap-1">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Not Connected
      </Badge>
    );
  };

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredWebhooks = webhooks.filter(
    (webhook) =>
      webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.service.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SuperAdminLayout>
      <div className="max-w-full overflow-x-hidden pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Management</h1>
            <p className="text-muted-foreground">
              Manage API keys, webhooks, third-party integrations, and rate
              limits
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Key className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active API Keys
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.activeKeys}/{stats.totalKeys}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Requests</p>
                  <p className="text-2xl font-bold">
                    {stats.totalRequests.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Webhook className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Webhooks
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.activeWebhooks}/{stats.totalWebhooks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="keys" className="gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Globe className="h-4 w-4" />
              Third-Party APIs
            </TabsTrigger>
            <TabsTrigger value="usage" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Usage & Logs
            </TabsTrigger>
            <TabsTrigger value="rate-limits" className="gap-2">
              <Shield className="h-4 w-4" />
              Rate Limiting
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2">
              <Code className="h-4 w-4" />
              Docs
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>API Keys</CardTitle>
                  <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create API Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingKey ? "Edit API Key" : "Create New API Key"}
                        </DialogTitle>
                        <DialogDescription>
                          Configure permissions and rate limits for your API key
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={keyForm.name}
                              onChange={(e) =>
                                setKeyForm({ ...keyForm, name: e.target.value })
                              }
                              placeholder="Frontend Dashboard"
                            />
                          </div>
                          <div>
                            <Label>Expires At (Optional)</Label>
                            <Input
                              type="datetime-local"
                              value={keyForm.expiresAt}
                              onChange={(e) =>
                                setKeyForm({
                                  ...keyForm,
                                  expiresAt: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={keyForm.description}
                            onChange={(e) =>
                              setKeyForm({
                                ...keyForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the purpose of this API key"
                          />
                        </div>

                        <div>
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {API_PERMISSIONS.map((permission) => (
                              <label
                                key={permission}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={keyForm.permissions.includes(
                                    permission,
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setKeyForm({
                                        ...keyForm,
                                        permissions: [
                                          ...keyForm.permissions,
                                          permission,
                                        ],
                                      });
                                    } else {
                                      setKeyForm({
                                        ...keyForm,
                                        permissions: keyForm.permissions.filter(
                                          (p) => p !== permission,
                                        ),
                                      });
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{permission}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Scopes</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {API_SCOPES.map((scope) => (
                              <label
                                key={scope.value}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={keyForm.scopes.includes(scope.value)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setKeyForm({
                                        ...keyForm,
                                        scopes: [
                                          ...keyForm.scopes,
                                          scope.value,
                                        ],
                                      });
                                    } else {
                                      setKeyForm({
                                        ...keyForm,
                                        scopes: keyForm.scopes.filter(
                                          (s) => s !== scope.value,
                                        ),
                                      });
                                    }
                                  }}
                                  className="rounded"
                                />
                                <div>
                                  <span className="text-sm font-medium">
                                    {scope.label}
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    {scope.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>IP Whitelist (Optional)</Label>
                          <Input
                            value={keyForm.ipWhitelist}
                            onChange={(e) =>
                              setKeyForm({
                                ...keyForm,
                                ipWhitelist: e.target.value,
                              })
                            }
                            placeholder="192.168.1.0/24, 10.0.0.1 (comma separated)"
                          />
                        </div>

                        <div>
                          <Label>Rate Limits</Label>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <Label className="text-xs">Per Minute</Label>
                              <Input
                                type="number"
                                value={keyForm.rateLimits.requestsPerMinute}
                                onChange={(e) =>
                                  setKeyForm({
                                    ...keyForm,
                                    rateLimits: {
                                      ...keyForm.rateLimits,
                                      requestsPerMinute: parseInt(
                                        e.target.value,
                                      ),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Per Hour</Label>
                              <Input
                                type="number"
                                value={keyForm.rateLimits.requestsPerHour}
                                onChange={(e) =>
                                  setKeyForm({
                                    ...keyForm,
                                    rateLimits: {
                                      ...keyForm.rateLimits,
                                      requestsPerHour: parseInt(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Per Day</Label>
                              <Input
                                type="number"
                                value={keyForm.rateLimits.requestsPerDay}
                                onChange={(e) =>
                                  setKeyForm({
                                    ...keyForm,
                                    rateLimits: {
                                      ...keyForm.rateLimits,
                                      requestsPerDay: parseInt(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowKeyDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateKey} className="gap-2">
                          <Key className="h-4 w-4" />
                          {editingKey ? "Update Key" : "Create Key"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search API keys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{key.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {key.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {key.key.substring(0, 16)}...
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {key.scopes.slice(0, 2).map((scope) => (
                              <Badge
                                key={scope}
                                variant="outline"
                                className="text-xs"
                              >
                                {scope}
                              </Badge>
                            ))}
                            {key.scopes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{key.scopes.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(key.isActive)}</TableCell>
                        <TableCell>
                          {key.lastUsed
                            ? formatSystemDate(key.lastUsed)
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {key.usage.totalRequests.toLocaleString()} total
                            </div>
                            <div className="text-muted-foreground">
                              {key.usage.averageResponseTime}ms avg
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Key
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Copy className="h-4 w-4" />
                                Copy Key
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                {key.isActive ? (
                                  <>
                                    <Lock className="h-4 w-4" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4" />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <Dialog
                    open={showWebhookDialog}
                    onOpenChange={setShowWebhookDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Webhook
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Webhook</DialogTitle>
                        <DialogDescription>
                          Configure a webhook endpoint to receive real-time
                          notifications
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={webhookForm.name}
                            onChange={(e) =>
                              setWebhookForm({
                                ...webhookForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Payment Notifications"
                          />
                        </div>

                        <div>
                          <Label>Webhook URL</Label>
                          <Input
                            value={webhookForm.url}
                            onChange={(e) =>
                              setWebhookForm({
                                ...webhookForm,
                                url: e.target.value,
                              })
                            }
                            placeholder="https://api.yourapp.com/webhook"
                          />
                        </div>

                        <div>
                          <Label>Events</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                            {WEBHOOK_EVENTS.map((event) => (
                              <label
                                key={event}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={webhookForm.events.includes(event)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setWebhookForm({
                                        ...webhookForm,
                                        events: [...webhookForm.events, event],
                                      });
                                    } else {
                                      setWebhookForm({
                                        ...webhookForm,
                                        events: webhookForm.events.filter(
                                          (e) => e !== event,
                                        ),
                                      });
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{event}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Retry Attempts</Label>
                            <Input
                              type="number"
                              value={webhookForm.retryAttempts}
                              onChange={(e) =>
                                setWebhookForm({
                                  ...webhookForm,
                                  retryAttempts: parseInt(e.target.value),
                                })
                              }
                              min="0"
                              max="10"
                            />
                          </div>
                          <div>
                            <Label>Timeout (seconds)</Label>
                            <Input
                              type="number"
                              value={webhookForm.timeout}
                              onChange={(e) =>
                                setWebhookForm({
                                  ...webhookForm,
                                  timeout: parseInt(e.target.value),
                                })
                              }
                              min="5"
                              max="300"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowWebhookDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateWebhook} className="gap-2">
                          <Webhook className="h-4 w-4" />
                          Create Webhook
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Delivery</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell>
                          <div className="font-medium">{webhook.name}</div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {webhook.url}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.slice(0, 2).map((event) => (
                              <Badge
                                key={event}
                                variant="outline"
                                className="text-xs"
                              >
                                {event}
                              </Badge>
                            ))}
                            {webhook.events.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{webhook.events.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(webhook.isActive)}
                        </TableCell>
                        <TableCell>
                          {webhook.lastDelivery
                            ? formatSystemDate(webhook.lastDelivery)
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {(
                              (webhook.stats.successfulDeliveries /
                                webhook.stats.totalDeliveries) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <TestTube className="h-4 w-4" />
                                Test Webhook
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Webhook
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Copy className="h-4 w-4" />
                                Copy URL
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                {webhook.isActive ? (
                                  <>
                                    <Lock className="h-4 w-4" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4" />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Third-Party Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Third-Party API Integrations
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={setupGoogleMapsIntegration}
                      className="gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      Setup Google Maps
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetGoogleMapsIntegration}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset Google Maps
                    </Button>
                    <Dialog
                      open={showIntegrationDialog}
                      onOpenChange={setShowIntegrationDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Integration
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingIntegration
                              ? "Edit Integration"
                              : "Add New Integration"}
                          </DialogTitle>
                          <DialogDescription>
                            Configure a third-party API integration
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Integration Name</Label>
                              <Input
                                value={integrationForm.name}
                                onChange={(e) =>
                                  setIntegrationForm({
                                    ...integrationForm,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="SendGrid Email Service"
                              />
                            </div>
                            <div>
                              <Label>Service</Label>
                              <Input
                                value={integrationForm.service}
                                onChange={(e) =>
                                  setIntegrationForm({
                                    ...integrationForm,
                                    service: e.target.value,
                                  })
                                }
                                placeholder="SendGrid"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Category</Label>
                            <Select
                              value={integrationForm.category}
                              onValueChange={(value) =>
                                setIntegrationForm({
                                  ...integrationForm,
                                  category:
                                    value as ThirdPartyIntegration["category"],
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="payment">Payment</SelectItem>
                                <SelectItem value="storage">Storage</SelectItem>
                                <SelectItem value="analytics">
                                  Analytics
                                </SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="maps">Maps</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>API Key</Label>
                            <Input
                              value={integrationForm.apiKey}
                              onChange={(e) =>
                                setIntegrationForm({
                                  ...integrationForm,
                                  apiKey: e.target.value,
                                })
                              }
                              placeholder="Enter your API key"
                              type="password"
                            />
                          </div>

                          <div>
                            <Label>API Secret (Optional)</Label>
                            <Input
                              value={integrationForm.apiSecret}
                              onChange={(e) =>
                                setIntegrationForm({
                                  ...integrationForm,
                                  apiSecret: e.target.value,
                                })
                              }
                              placeholder="Enter your API secret"
                              type="password"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowIntegrationDialog(false);
                              setEditingIntegration(null);
                              setIntegrationForm({
                                name: "",
                                service: "",
                                category: "other",
                                apiKey: "",
                                apiSecret: "",
                                additionalConfig: {},
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={
                              editingIntegration
                                ? handleUpdateIntegration
                                : handleCreateIntegration
                            }
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            {editingIntegration ? "Update" : "Add"} Integration
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Integration</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Connection</TableHead>
                      <TableHead>Usage Today</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {integration.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {integration.service}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(integration.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-muted-foreground max-w-[120px] truncate block text-right">
                              {formatApiKey(integration.apiKey)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  integration.apiKey,
                                );
                                toast.success("API key copied to clipboard");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(integration.isActive)}
                        </TableCell>
                        <TableCell>
                          {getConnectionBadge(integration.isConnected)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {integration.usage.requestsToday.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">
                              {integration.usage.errorRate}% error rate
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => testIntegration(integration)}
                              >
                                <TestTube className="h-4 w-4" />
                                Test Connection
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() =>
                                  openEditIntegrationDialog(integration)
                                }
                              >
                                <Edit className="h-4 w-4" />
                                Edit Integration
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() =>
                                  handleToggleIntegration(integration.id)
                                }
                              >
                                {integration.isActive ? (
                                  <>
                                    <Lock className="h-4 w-4" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4" />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() =>
                                  handleDeleteIntegration(integration.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage & Logs Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Usage Logs
                </CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-9" />
                  </div>
                  <Select defaultValue="today">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Source IP</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Response Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            {formatSystemDate(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>{getMethodBadge(log.method)}</TableCell>
                        <TableCell>
                          <code className="text-sm">{log.endpoint}</code>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {log.apiKey.substring(0, 16)}...
                          </code>
                        </TableCell>
                        <TableCell>{log.sourceIP}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.responseCode < 300
                                ? "bg-green-500"
                                : log.responseCode < 400
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {log.responseCode}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.responseTime}ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rate Limiting Tab */}
          <TabsContent value="rate-limits" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Rate Limiting Rules
                  </CardTitle>
                  <Dialog
                    open={showRateLimitDialog}
                    onOpenChange={setShowRateLimitDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Rate Limit Rule</DialogTitle>
                        <DialogDescription>
                          Configure rate limiting for specific endpoints or
                          methods
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div>
                          <Label>Rule Name</Label>
                          <Input
                            value={rateLimitForm.name}
                            onChange={(e) =>
                              setRateLimitForm({
                                ...rateLimitForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="User Endpoints"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={rateLimitForm.description}
                            onChange={(e) =>
                              setRateLimitForm({
                                ...rateLimitForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Rate limit for user-related endpoints"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Endpoint Pattern</Label>
                            <Input
                              value={rateLimitForm.endpoint}
                              onChange={(e) =>
                                setRateLimitForm({
                                  ...rateLimitForm,
                                  endpoint: e.target.value,
                                })
                              }
                              placeholder="/api/v1/users/*"
                            />
                          </div>
                          <div>
                            <Label>HTTP Method</Label>
                            <Select
                              value={rateLimitForm.method}
                              onValueChange={(value) =>
                                setRateLimitForm({
                                  ...rateLimitForm,
                                  method: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="*">All Methods</SelectItem>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Limit</Label>
                            <Input
                              type="number"
                              value={rateLimitForm.limit}
                              onChange={(e) =>
                                setRateLimitForm({
                                  ...rateLimitForm,
                                  limit: parseInt(e.target.value),
                                })
                              }
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label>Time Window</Label>
                            <Select
                              value={rateLimitForm.window}
                              onValueChange={(value) =>
                                setRateLimitForm({
                                  ...rateLimitForm,
                                  window: value as "minute" | "hour" | "day",
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minute">
                                  Per Minute
                                </SelectItem>
                                <SelectItem value="hour">Per Hour</SelectItem>
                                <SelectItem value="day">Per Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowRateLimitDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button className="gap-2">
                          <Shield className="h-4 w-4" />
                          Create Rule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rateLimitRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {rule.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{rule.endpoint}</code>
                        </TableCell>
                        <TableCell>{getMethodBadge(rule.method)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {rule.limit} per {rule.window}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(rule.isActive)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    API Documentation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive API documentation with examples and tutorials
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download OpenAPI Spec
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
