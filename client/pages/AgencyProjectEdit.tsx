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
import {
  ArrowLeft,
  Save,
  X,
  CalendarDays,
  DollarSign,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AgencyProject,
  AgencyClient,
  AgencyTeamMember,
  AGENCY_SERVICES,
} from "@/types/agency";

export default function AgencyProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<AgencyProject | null>(null);
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
    status: "draft" as
      | "draft"
      | "active"
      | "paused"
      | "completed"
      | "cancelled",

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

  // Load project and other data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Mock data - replace with actual API calls
        const mockProject: AgencyProject = {
          id: id,
          name: "Website Redesign for TechCorp",
          description:
            "Complete website redesign and development for TechCorp's new product launch",
          type: "one-off",
          status: "active",
          clientId: "client-1",
          clientName: "TechCorp Ltd",
          clientEmail: "john@techcorp.com",
          clientPhone: "+1-555-0123",
          services: ["website-design", "website-development", "local-optimization"],
          budget: 15000,
          estimatedHours: 120,
          actualHours: 68,
          startDate: "2024-01-15",
          dueDate: "2024-03-15",
          documents: [],
          images: [],
          tasks: [],
          notes: [],
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-25T15:30:00Z",
          createdBy: "user-1",
          assignedTeam: ["user-1", "user-2"],
          progress: 65,
        };

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
        ];

        setProject(mockProject);
        setClients(mockClients);
        setTeamMembers(mockTeamMembers);

        // Populate form with project data
        setFormData({
          name: mockProject.name,
          description: mockProject.description,
          type: mockProject.type,
          clientId: mockProject.clientId,
          budget: mockProject.budget.toString(),
          estimatedHours: mockProject.estimatedHours?.toString() || "",
          startDate: mockProject.startDate,
          dueDate: mockProject.dueDate || "",
          status: mockProject.status,
          recurringFrequency:
            mockProject.recurringSettings?.frequency || "monthly",
          customClientName: "",
          customClientEmail: "",
          customClientPhone: "",
        });

        setSelectedServices(mockProject.services);
        setAssignedTeam(mockProject.assignedTeam);
      } catch (error) {
        toast.error("Failed to load project");
        navigate("/agency/admin/projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

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

      if (selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      if (!formData.budget || isNaN(Number(formData.budget))) {
        throw new Error("Please enter a valid budget");
      }

      if (assignedTeam.length === 0) {
        throw new Error("Please assign at least one team member");
      }

      // Update project data
      const updatedProject: Partial<AgencyProject> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        services: selectedServices,
        budget: Number(formData.budget),
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : undefined,
        startDate: formData.startDate,
        dueDate: formData.dueDate || undefined,
        status: formData.status,
        assignedTeam: assignedTeam,
        updatedAt: new Date().toISOString(),
      };

      // Add recurring settings if applicable
      if (formData.type === "recurring") {
        updatedProject.recurringSettings = {
          frequency: formData.recurringFrequency,
        };
      }

      // In a real app, this would be an API call
      console.log("Updating project:", updatedProject);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Project updated successfully!");
      navigate(`/agency/admin/projects/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update project",
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

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AgencyLayout>
    );
  }

  if (!project) {
    return (
      <AgencyLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Button asChild className="mt-4">
            <Link to="/agency/admin/projects">Back to Projects</Link>
          </Button>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/agency/admin/projects/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update project settings and details
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <Link to={`/agency/admin/projects/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AgencyLayout>
  );
}
