import React, { useState, useEffect } from "react";
import { AgencyLayout } from "@/components/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  CalendarDays,
  DollarSign,
  Clock,
  Users,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AgencyProject,
  AgencyClient,
  AgencyTeamMember,
  AGENCY_SERVICES,
} from "@/types/agency";

export default function AgencyProjectCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [teamMembers, setTeamMembers] = useState<AgencyTeamMember[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [assignedTeam, setAssignedTeam] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "one-off" as "one-off" | "recurring",
    clientId: "",
    budget: "",
    estimatedHours: "",
    startDate: "",
    dueDate: "",

    // Recurring settings
    recurringFrequency: "monthly" as
      | "weekly"
      | "monthly"
      | "quarterly"
      | "yearly",

    // Custom fields for additional client info
    customClientName: "",
    customClientEmail: "",
    customClientPhone: "",
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockClients: AgencyClient[] = [
      {
        id: "client-1",
        name: "TechCorp Ltd",
        email: "john@techcorp.com",
        phone: "+1-555-0123",
        company: "TechCorp",
        isActive: true,
        createdAt: "2023-01-15T10:00:00Z",
        activeProjects: 2,
        totalProjects: 5,
      },
      {
        id: "client-2",
        name: "RetailPlus Inc",
        email: "marketing@retailplus.com",
        phone: "+1-555-0456",
        company: "RetailPlus",
        isActive: true,
        createdAt: "2023-03-20T14:00:00Z",
        activeProjects: 1,
        totalProjects: 3,
      },
      {
        id: "client-3",
        name: "LocalBiz Co",
        email: "owner@localbiz.com",
        phone: "+1-555-0789",
        company: "LocalBiz",
        isActive: true,
        createdAt: "2023-11-10T09:00:00Z",
        activeProjects: 0,
        totalProjects: 1,
      },
    ];

    const mockTeamMembers: AgencyTeamMember[] = [
      {
        id: "user-1",
        name: "Sarah Johnson",
        email: "sarah@agency.com",
        role: "Project Manager",
        specialties: ["project-management", "client-relations"],
        isActive: true,
      },
      {
        id: "user-2",
        name: "Mike Chen",
        email: "mike@agency.com",
        role: "Senior Developer",
        specialties: ["website-development", "website-design"],
        isActive: true,
      },
      {
        id: "user-3",
        name: "Emily Rodriguez",
        email: "emily@agency.com",
        role: "Local Optimization Specialist",
        specialties: ["local-optimization", "content-marketing", "analytics"],
        isActive: true,
      },
      {
        id: "user-4",
        name: "David Kim",
        email: "david@agency.com",
        role: "PPC Manager",
        specialties: ["paid-advertising", "analytics"],
        isActive: true,
      },
    ];

    setClients(mockClients);
    setTeamMembers(mockTeamMembers);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceToggle = (serviceValue: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceValue)
        ? prev.filter((s) => s !== serviceValue)
        : [...prev, serviceValue],
    );
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setAssignedTeam((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Project name is required");
      }

      if (!formData.clientId && !formData.customClientName) {
        throw new Error(
          "Please select a client or enter custom client details",
        );
      }

      if (selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      if (!formData.budget || isNaN(Number(formData.budget))) {
        throw new Error("Please enter a valid budget");
      }

      if (assignedTeam.length === 0) {
        throw new Error("Please assign at least one team member");
      }

      // Create project data
      const projectData: Partial<AgencyProject> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        clientId: formData.clientId || "custom",
        clientName: formData.clientId
          ? clients.find((c) => c.id === formData.clientId)?.name || ""
          : formData.customClientName,
        clientEmail: formData.clientId
          ? clients.find((c) => c.id === formData.clientId)?.email || ""
          : formData.customClientEmail,
        clientPhone: formData.clientId
          ? clients.find((c) => c.id === formData.clientId)?.phone
          : formData.customClientPhone,
        services: selectedServices,
        budget: Number(formData.budget),
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : undefined,
        startDate: formData.startDate,
        dueDate: formData.dueDate || undefined,
        assignedTeam: assignedTeam,
        status: "draft",
        progress: 0,
        documents: [],
        images: [],
        tasks: [],
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user", // Replace with actual user ID
      };

      // Add recurring settings if applicable
      if (formData.type === "recurring") {
        projectData.recurringSettings = {
          frequency: formData.recurringFrequency,
        };
      }

      // In a real app, this would be an API call
      console.log("Creating project:", projectData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Project created successfully!");
      navigate("/agency/admin/projects");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceLabel = (value: string) => {
    return AGENCY_SERVICES.find((s) => s.value === value)?.label || value;
  };

  const getTeamMemberName = (id: string) => {
    return teamMembers.find((m) => m.id === id)?.name || "";
  };

  return (
    <AgencyLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agency/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground">
              Set up a new project for your agency
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter project name..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Project Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "one-off" | "recurring") =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-off">One-off Project</SelectItem>
                      <SelectItem value="recurring">
                        Recurring Project
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the project scope and objectives..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Existing Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    handleInputChange("clientId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.email}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                — OR —
              </div>

              <div className="space-y-4">
                <Label>Create New Client</Label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customClientName">Client Name</Label>
                    <Input
                      id="customClientName"
                      value={formData.customClientName}
                      onChange={(e) =>
                        handleInputChange("customClientName", e.target.value)
                      }
                      placeholder="Enter client name..."
                      disabled={!!formData.clientId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customClientEmail">Email</Label>
                    <Input
                      id="customClientEmail"
                      type="email"
                      value={formData.customClientEmail}
                      onChange={(e) =>
                        handleInputChange("customClientEmail", e.target.value)
                      }
                      placeholder="client@example.com"
                      disabled={!!formData.clientId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customClientPhone">Phone</Label>
                    <Input
                      id="customClientPhone"
                      value={formData.customClientPhone}
                      onChange={(e) =>
                        handleInputChange("customClientPhone", e.target.value)
                      }
                      placeholder="+1-555-0123"
                      disabled={!!formData.clientId}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {AGENCY_SERVICES.map((service) => (
                  <div
                    key={service.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={service.value}
                      checked={selectedServices.includes(service.value)}
                      onCheckedChange={() => handleServiceToggle(service.value)}
                    />
                    <Label
                      htmlFor={service.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">
                    Selected Services:
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {getServiceLabel(service)}
                        <button
                          type="button"
                          onClick={() => handleServiceToggle(service)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget and Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Budget & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget * (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) =>
                        handleInputChange("estimatedHours", e.target.value)
                      }
                      placeholder="0"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">
                    {formData.type === "recurring"
                      ? "First Due Date"
                      : "Due Date"}
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {formData.type === "recurring" && (
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency">
                    Recurring Frequency
                  </Label>
                  <Select
                    value={formData.recurringFrequency}
                    onValueChange={(
                      value: "weekly" | "monthly" | "quarterly" | "yearly",
                    ) => handleInputChange("recurringFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Team Assignment *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={member.id}
                        checked={assignedTeam.includes(member.id)}
                        onCheckedChange={() =>
                          handleTeamMemberToggle(member.id)
                        }
                      />
                      <div>
                        <Label
                          htmlFor={member.id}
                          className="font-medium cursor-pointer"
                        >
                          {member.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {member.role} • {member.email}
                        </p>
                        {member.specialties && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.specialties.slice(0, 3).map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                            {member.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {assignedTeam.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <Label className="text-sm text-muted-foreground">
                    Assigned Team Members:
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assignedTeam.map((memberId) => (
                      <Badge key={memberId} variant="default">
                        {getTeamMemberName(memberId)}
                        <button
                          type="button"
                          onClick={() => handleTeamMemberToggle(memberId)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link to="/agency/admin/projects">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AgencyLayout>
  );
}
