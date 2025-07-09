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
  Users,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  Filter,
  Search,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Settings,
  Eye,
  Send,
  PieChart,
  BarChart3,
  Zap,
  Tag,
  MapPin,
  Building,
  Star,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { formatSystemDate } from "@/lib/dateUtils";

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  userCount: number;
  isActive: boolean;
  isStatic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastCalculated?: string;
  tags: string[];
}

interface SegmentCriteria {
  field: string;
  operator: string;
  value: string;
  type: "user" | "behavior" | "engagement" | "business" | "custom";
  logicalOperator?: "AND" | "OR";
}

interface SegmentStats {
  totalSegments: number;
  activeSegments: number;
  totalUsers: number;
  segmentedUsers: number;
  averageSegmentSize: number;
  engagementBoost: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  signupDate: string;
  lastLogin: string;
  projectCount: number;
  reviewCount: number;
  loginCount: number;
  subscriptionTier: string;
  location: string;
  companySize: string;
  industry: string;
  engagementScore: number;
  tags: string[];
}

const CRITERIA_FIELDS = {
  user: [
    { value: "role", label: "User Role", type: "string" },
    { value: "signupDate", label: "Signup Date", type: "date" },
    { value: "lastLogin", label: "Last Login", type: "date" },
    { value: "subscriptionTier", label: "Subscription Tier", type: "string" },
    { value: "location", label: "Location", type: "string" },
    { value: "companySize", label: "Company Size", type: "string" },
    { value: "industry", label: "Industry", type: "string" },
  ],
  behavior: [
    { value: "projectCount", label: "Project Count", type: "number" },
    { value: "reviewCount", label: "Review Count", type: "number" },
    { value: "loginCount", label: "Login Count", type: "number" },
    { value: "daysInactive", label: "Days Inactive", type: "number" },
    { value: "featureUsage", label: "Feature Usage", type: "string" },
  ],
  engagement: [
    { value: "engagementScore", label: "Engagement Score", type: "number" },
    { value: "messageViews", label: "Message Views", type: "number" },
    { value: "messageDismissals", label: "Message Dismissals", type: "number" },
    {
      value: "notificationPrefs",
      label: "Notification Preferences",
      type: "boolean",
    },
  ],
  business: [
    { value: "revenue", label: "Revenue Generated", type: "number" },
    { value: "clientCount", label: "Client Count", type: "number" },
    { value: "businessAge", label: "Business Age (months)", type: "number" },
    { value: "businessType", label: "Business Type", type: "string" },
  ],
};

const OPERATORS = {
  string: [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "in", label: "Is one of" },
    { value: "not_in", label: "Is not one of" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "between", label: "Between" },
    { value: "greater_equal", label: "Greater than or equal" },
    { value: "less_equal", label: "Less than or equal" },
  ],
  date: [
    { value: "equals", label: "On date" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "between", label: "Between" },
    { value: "days_ago", label: "Days ago" },
    { value: "weeks_ago", label: "Weeks ago" },
  ],
  boolean: [
    { value: "is_true", label: "Is true" },
    { value: "is_false", label: "Is false" },
  ],
};

export default function SuperAdminSegmentation() {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [stats, setStats] = useState<SegmentStats>({
    totalSegments: 0,
    activeSegments: 0,
    totalUsers: 0,
    segmentedUsers: 0,
    averageSegmentSize: 0,
    engagementBoost: 0,
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSegment, setEditingSegment] = useState<UserSegment | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: [] as SegmentCriteria[],
    isActive: true,
    isStatic: false,
    tags: [] as string[],
    newTag: "",
  });

  useEffect(() => {
    loadSegmentationData();
  }, []);

  const loadSegmentationData = () => {
    const storedSegments = localStorage.getItem("userSegments");
    const mockSegments: UserSegment[] = storedSegments
      ? JSON.parse(storedSegments)
      : [
          {
            id: "high-value-customers",
            name: "High-Value Customers",
            description: "Users with high project count and engagement",
            criteria: [
              {
                field: "projectCount",
                operator: "greater_than",
                value: "5",
                type: "behavior",
              },
              {
                field: "engagementScore",
                operator: "greater_than",
                value: "80",
                type: "engagement",
                logicalOperator: "AND",
              },
            ],
            userCount: 234,
            isActive: true,
            isStatic: false,
            createdAt: "2024-01-10T10:00:00Z",
            updatedAt: "2024-01-15T14:30:00Z",
            createdBy: "Super Admin",
            lastCalculated: "2024-01-20T09:00:00Z",
            tags: ["premium", "engaged"],
          },
          {
            id: "new-users",
            name: "New Users",
            description: "Users who signed up in the last 30 days",
            criteria: [
              {
                field: "signupDate",
                operator: "days_ago",
                value: "30",
                type: "user",
              },
            ],
            userCount: 156,
            isActive: true,
            isStatic: false,
            createdAt: "2024-01-05T15:00:00Z",
            updatedAt: "2024-01-05T15:00:00Z",
            createdBy: "Super Admin",
            lastCalculated: "2024-01-20T09:00:00Z",
            tags: ["onboarding"],
          },
          {
            id: "at-risk-users",
            name: "At-Risk Users",
            description: "Users who haven't logged in for 14+ days",
            criteria: [
              {
                field: "daysInactive",
                operator: "greater_than",
                value: "14",
                type: "behavior",
              },
              {
                field: "projectCount",
                operator: "greater_than",
                value: "0",
                type: "behavior",
                logicalOperator: "AND",
              },
            ],
            userCount: 89,
            isActive: true,
            isStatic: false,
            createdAt: "2024-01-08T11:30:00Z",
            updatedAt: "2024-01-18T16:45:00Z",
            createdBy: "Super Admin",
            lastCalculated: "2024-01-20T09:00:00Z",
            tags: ["retention", "risk"],
          },
          {
            id: "business-owners",
            name: "Business Owners",
            description: "Users with business owner or owner role",
            criteria: [
              {
                field: "role",
                operator: "in",
                value: "business,owner",
                type: "user",
              },
            ],
            userCount: 445,
            isActive: true,
            isStatic: false,
            createdAt: "2024-01-12T09:00:00Z",
            updatedAt: "2024-01-12T09:00:00Z",
            createdBy: "Super Admin",
            lastCalculated: "2024-01-20T09:00:00Z",
            tags: ["primary"],
          },
          {
            id: "power-users",
            name: "Power Users",
            description: "Highly active users with multiple features used",
            criteria: [
              {
                field: "loginCount",
                operator: "greater_than",
                value: "50",
                type: "behavior",
              },
              {
                field: "projectCount",
                operator: "greater_than",
                value: "10",
                type: "behavior",
                logicalOperator: "AND",
              },
              {
                field: "engagementScore",
                operator: "greater_than",
                value: "90",
                type: "engagement",
                logicalOperator: "AND",
              },
            ],
            userCount: 67,
            isActive: false,
            isStatic: false,
            createdAt: "2024-01-14T13:20:00Z",
            updatedAt: "2024-01-19T10:15:00Z",
            createdBy: "Super Admin",
            lastCalculated: "2024-01-20T09:00:00Z",
            tags: ["advanced", "advocates"],
          },
        ];

    setSegments(mockSegments);

    // Calculate stats
    const totalUsers = 1247; // Mock total user count
    const segmentedUsers = mockSegments.reduce(
      (sum, segment) => sum + segment.userCount,
      0,
    );
    const averageSize =
      mockSegments.length > 0
        ? Math.round(
            mockSegments.reduce((sum, s) => sum + s.userCount, 0) /
              mockSegments.length,
          )
        : 0;

    setStats({
      totalSegments: mockSegments.length,
      activeSegments: mockSegments.filter((s) => s.isActive).length,
      totalUsers,
      segmentedUsers: Math.min(segmentedUsers, totalUsers), // Cap at total users
      averageSegmentSize: averageSize,
      engagementBoost: 34.5, // Mock engagement improvement
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      criteria: [],
      isActive: true,
      isStatic: false,
      tags: [],
      newTag: "",
    });
    setEditingSegment(null);
  };

  const handleCreateSegment = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a segment name");
      return;
    }

    if (formData.criteria.length === 0) {
      toast.error("Please add at least one criteria");
      return;
    }

    const newSegment: UserSegment = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      criteria: formData.criteria,
      userCount: Math.floor(Math.random() * 200) + 50, // Mock user count
      isActive: formData.isActive,
      isStatic: formData.isStatic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Super Admin",
      lastCalculated: new Date().toISOString(),
      tags: formData.tags,
    };

    const updatedSegments = [...segments, newSegment];
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));

    toast.success("User segment created successfully!");
    setShowCreateDialog(false);
    resetForm();
    loadSegmentationData();
  };

  const handleEditSegment = (segment: UserSegment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description,
      criteria: segment.criteria,
      isActive: segment.isActive,
      isStatic: segment.isStatic,
      tags: segment.tags,
      newTag: "",
    });
    setShowCreateDialog(true);
  };

  const handleUpdateSegment = () => {
    if (!editingSegment) return;

    const updatedSegment: UserSegment = {
      ...editingSegment,
      name: formData.name,
      description: formData.description,
      criteria: formData.criteria,
      isActive: formData.isActive,
      isStatic: formData.isStatic,
      tags: formData.tags,
      updatedAt: new Date().toISOString(),
      lastCalculated: new Date().toISOString(),
      userCount: Math.floor(Math.random() * 200) + 50, // Recalculate
    };

    const updatedSegments = segments.map((s) =>
      s.id === editingSegment.id ? updatedSegment : s,
    );
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));

    toast.success("User segment updated successfully!");
    setShowCreateDialog(false);
    resetForm();
    loadSegmentationData();
  };

  const handleDeleteSegment = (segmentId: string) => {
    const updatedSegments = segments.filter((s) => s.id !== segmentId);
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));
    toast.success("User segment deleted successfully!");
    loadSegmentationData();
  };

  const handleToggleActive = (segmentId: string) => {
    const updatedSegments = segments.map((s) =>
      s.id === segmentId ? { ...s, isActive: !s.isActive } : s,
    );
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));
    toast.success("Segment status updated!");
    loadSegmentationData();
  };

  const handleDuplicateSegment = (segment: UserSegment) => {
    const duplicatedSegment: UserSegment = {
      ...segment,
      id: Date.now().toString(),
      name: `${segment.name} (Copy)`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userCount: Math.floor(Math.random() * 200) + 50,
    };

    const updatedSegments = [...segments, duplicatedSegment];
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));
    toast.success("Segment duplicated successfully!");
    loadSegmentationData();
  };

  const addCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [
        ...prev.criteria,
        {
          field: "",
          operator: "",
          value: "",
          type: "user",
          logicalOperator: prev.criteria.length > 0 ? "AND" : undefined,
        },
      ],
    }));
  };

  const updateCriteria = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.map((criteria, i) =>
        i === index ? { ...criteria, [field]: value } : criteria,
      ),
    }));
  };

  const removeCriteria = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const calculateSegment = (segmentId: string) => {
    const updatedSegments = segments.map((s) =>
      s.id === segmentId
        ? {
            ...s,
            lastCalculated: new Date().toISOString(),
            userCount: Math.floor(Math.random() * 200) + 50,
          }
        : s,
    );
    setSegments(updatedSegments);
    localStorage.setItem("userSegments", JSON.stringify(updatedSegments));
    toast.success("Segment recalculated!");
    loadSegmentationData();
  };

  const exportSegment = (segment: UserSegment) => {
    const exportData = {
      segment,
      exportedAt: new Date().toISOString(),
      userCount: segment.userCount,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `segment-${segment.name.toLowerCase().replace(/\s+/g, "-")}-${formatSystemDate(new Date().toISOString())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Segment data exported!");
  };

  const getSizeCategory = (userCount: number) => {
    if (userCount > 300) return "large";
    if (userCount > 100) return "medium";
    return "small";
  };

  const getSizeBadge = (userCount: number) => {
    const category = getSizeCategory(userCount);
    switch (category) {
      case "large":
        return <Badge className="bg-purple-500">Large</Badge>;
      case "medium":
        return <Badge className="bg-blue-500">Medium</Badge>;
      case "small":
        return <Badge variant="secondary">Small</Badge>;
      default:
        return <Badge variant="outline">{userCount}</Badge>;
    }
  };

  const getFieldType = (field: string): string => {
    for (const category of Object.values(CRITERIA_FIELDS)) {
      const found = category.find((f) => f.value === field);
      if (found) return found.type;
    }
    return "string";
  };

  const filteredSegments = segments.filter((segment) => {
    if (statusFilter !== "all") {
      if (statusFilter === "active" && !segment.isActive) return false;
      if (statusFilter === "inactive" && segment.isActive) return false;
    }
    if (sizeFilter !== "all") {
      const category = getSizeCategory(segment.userCount);
      if (category !== sizeFilter) return false;
    }
    if (
      searchTerm &&
      !segment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !segment.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !segment.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    )
      return false;
    return true;
  });

  return (
    <SuperAdminLayout>
      <div className="max-w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6" />
              User Segmentation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Create and manage user segments for targeted messaging campaigns
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Segment</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSegment ? "Edit User Segment" : "Create User Segment"}
                </DialogTitle>
                <DialogDescription>
                  Define criteria to automatically group users for targeted
                  messaging
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="criteria">Criteria</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Segment Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., High-Value Customers"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe this user segment..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.newTag}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              newTag: e.target.value,
                            }))
                          }
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="criteria" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Segment Criteria</h3>
                      <p className="text-sm text-muted-foreground">
                        Define conditions to identify users for this segment
                      </p>
                    </div>
                    <Button onClick={addCriteria} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criteria
                    </Button>
                  </div>
                  {formData.criteria.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2" />
                      <p>
                        No criteria defined - add criteria to create segment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.criteria.map((criteria, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          {index > 0 && (
                            <div className="flex items-center gap-2">
                              <Select
                                value={criteria.logicalOperator || "AND"}
                                onValueChange={(value) =>
                                  updateCriteria(
                                    index,
                                    "logicalOperator",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AND">AND</SelectItem>
                                  <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                              </Select>
                              <span className="text-sm text-muted-foreground">
                                previous condition
                              </span>
                            </div>
                          )}
                          <div className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-3">
                              <Label className="text-xs">Category</Label>
                              <Select
                                value={criteria.type}
                                onValueChange={(value) =>
                                  updateCriteria(index, "type", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">
                                    User Info
                                  </SelectItem>
                                  <SelectItem value="behavior">
                                    Behavior
                                  </SelectItem>
                                  <SelectItem value="engagement">
                                    Engagement
                                  </SelectItem>
                                  <SelectItem value="business">
                                    Business
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Label className="text-xs">Field</Label>
                              <Select
                                value={criteria.field}
                                onValueChange={(value) =>
                                  updateCriteria(index, "field", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {CRITERIA_FIELDS[
                                    criteria.type as keyof typeof CRITERIA_FIELDS
                                  ]?.map((field) => (
                                    <SelectItem
                                      key={field.value}
                                      value={field.value}
                                    >
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs">Operator</Label>
                              <Select
                                value={criteria.operator}
                                onValueChange={(value) =>
                                  updateCriteria(index, "operator", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {criteria.field &&
                                    OPERATORS[
                                      getFieldType(
                                        criteria.field,
                                      ) as keyof typeof OPERATORS
                                    ]?.map((op) => (
                                      <SelectItem
                                        key={op.value}
                                        value={op.value}
                                      >
                                        {op.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Label className="text-xs">Value</Label>
                              <Input
                                value={criteria.value}
                                onChange={(e) =>
                                  updateCriteria(index, "value", e.target.value)
                                }
                                placeholder="Enter value..."
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCriteria(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Active Segment</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable this segment for use in campaigns
                        </p>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Static Segment</Label>
                        <p className="text-sm text-muted-foreground">
                          Don't update membership automatically (manual only)
                        </p>
                      </div>
                      <Switch
                        checked={formData.isStatic}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isStatic: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingSegment ? handleUpdateSegment : handleCreateSegment
                  }
                >
                  {editingSegment ? "Update Segment" : "Create Segment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Segments
                  </p>
                  <p className="text-2xl font-bold">{stats.totalSegments}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Segments
                  </p>
                  <p className="text-2xl font-bold">{stats.activeSegments}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Segmented Users
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.segmentedUsers.toLocaleString()}
                  </p>
                </div>
                <Filter className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Size</p>
                  <p className="text-2xl font-bold">
                    {stats.averageSegmentSize}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement ↑</p>
                  <p className="text-2xl font-bold">{stats.engagementBoost}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search segments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="large">Large (300+)</SelectItem>
                    <SelectItem value="medium">Medium (100-300)</SelectItem>
                    <SelectItem value="small">Small (&lt;100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">User Segments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="responsive-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead className="hidden sm:table-cell">Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Criteria
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Last Updated
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSegments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium truncate text-sm sm:text-base">
                            {segment.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {segment.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {segment.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="sm:hidden mt-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span className="text-xs text-muted-foreground">
                                {segment.userCount.toLocaleString()} users
                              </span>
                              {getSizeBadge(segment.userCount)}
                            </div>
                            <div className="md:hidden text-xs text-muted-foreground">
                              {segment.criteria.length} criteria
                            </div>
                            <div className="lg:hidden text-xs text-muted-foreground">
                              Updated: {formatSystemDate(segment.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {segment.userCount.toLocaleString()}
                          </span>
                          {getSizeBadge(segment.userCount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {segment.isActive ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {segment.isStatic && (
                            <Badge variant="outline" className="text-xs">
                              Static
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">
                          {segment.criteria.length} criteria
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div>{formatSystemDate(segment.updatedAt)}</div>
                          {segment.lastCalculated && (
                            <div className="text-xs text-muted-foreground">
                              Calculated:{" "}
                              {formatSystemDate(segment.lastCalculated)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditSegment(segment)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => calculateSegment(segment.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Recalculate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(segment.id)}
                            >
                              {segment.isActive ? (
                                <UserX className="h-4 w-4 mr-2" />
                              ) : (
                                <UserCheck className="h-4 w-4 mr-2" />
                              )}
                              {segment.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => exportSegment(segment)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateSegment(segment)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSegment(segment.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
