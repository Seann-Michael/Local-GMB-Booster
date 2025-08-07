// Agency Project Management Types

export interface AgencyProject {
  id: string;
  name: string;
  description: string;
  type: "one-off" | "recurring";
  status: "draft" | "active" | "paused" | "completed" | "cancelled";

  // Client Information
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;

  // Project Details
  services: string[]; // e.g., ['paid-advertising', 'website-design', 'seo']
  budget: number;
  estimatedHours?: number;
  actualHours?: number;

  // Dates
  startDate: string;
  endDate?: string;
  dueDate?: string;
  completedDate?: string;

  // Recurring Project Details (if type is 'recurring')
  recurringSettings?: {
    frequency: "weekly" | "monthly" | "quarterly" | "yearly";
    nextDueDate?: string;
    lastCompletedDate?: string;
  };

  // Project Assets
  documents: AgencyProjectDocument[];
  images: AgencyProjectImage[];

  // Project Management
  tasks: AgencyProjectTask[];
  notes: AgencyProjectNote[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTeam: string[]; // user IDs

  // Progress tracking
  progress: number; // 0-100
  milestones?: AgencyProjectMilestone[];
}

export interface AgencyProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";

  // Assignment
  assignedTo?: string; // user ID
  assignedToType: "internal" | "client";
  assignedToName: string;
  assignedToEmail: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedDate?: string;

  // Estimated vs actual time
  estimatedHours?: number;
  actualHours?: number;

  // Task metadata
  createdBy: string;
  dependencies?: string[]; // other task IDs
  subtasks?: AgencyProjectSubtask[];

  // Comments and updates
  comments: AgencyTaskComment[];

  // File attachments
  attachments: AgencyProjectDocument[];
}

export interface AgencyProjectSubtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface AgencyTaskComment {
  id: string;
  taskId: string;
  message: string;
  authorId: string;
  authorName: string;
  authorType: "internal" | "client";
  createdAt: string;
  isInternal: boolean; // if true, only visible to internal team
}

export interface AgencyProjectNote {
  id: string;
  projectId: string;
  title?: string;
  content: string;
  type: "internal" | "client-facing";
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  tags?: string[];
}

export interface AgencyProjectDocument {
  id: string;
  projectId: string;
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;

  // Access control
  visibility: "internal" | "client" | "team";
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;

  // Metadata
  description?: string;
  version?: string;
  tags?: string[];
  category?: string; // e.g., 'contract', 'design', 'report', 'asset'
}

export interface AgencyProjectImage {
  id: string;
  projectId: string;
  url: string;
  fileName: string;
  fileSize: number;

  // Image metadata
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;

  // Access control
  visibility: "internal" | "client" | "team";
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;

  // Organization
  tags?: string[];
  category?: string; // e.g., 'before', 'after', 'design', 'asset'
  isPrimary?: boolean;
}

export interface AgencyProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: "pending" | "completed" | "overdue";

  // Associated deliverables
  deliverables?: string[];

  // Payment information (for billing milestones)
  paymentAmount?: number;
  paymentStatus?: "pending" | "invoiced" | "paid";

  createdAt: string;
  updatedAt: string;
}

// Filter and search interfaces
export interface AgencyProjectFilters {
  status?: string[];
  type?: string[];
  services?: string[];
  clients?: string[];
  assignedTeam?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface AgencyProjectSortOptions {
  field: "name" | "status" | "dueDate" | "createdAt" | "progress" | "budget";
  direction: "asc" | "desc";
}

// Agency team member interface
export interface AgencyTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  specialties?: string[];
  isActive: boolean;
}

// Agency client interface
export interface AgencyClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;

  // Contact preferences
  preferredContactMethod?: "email" | "phone" | "platform";
  timezone?: string;

  // Account information
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;

  // Projects count
  activeProjects: number;
  totalProjects: number;
}

// Service options for projects
export const AGENCY_SERVICES = [
  { value: "paid-advertising", label: "Paid Advertising" },
  { value: "website-design", label: "Website Design" },
  { value: "website-development", label: "Website Development" },
  { value: "local-optimization", label: "Local Optimization" },
  { value: "social-media", label: "Social Media Management" },
  { value: "content-marketing", label: "Content Marketing" },
  { value: "email-marketing", label: "Email Marketing" },
  { value: "branding", label: "Branding & Design" },
  { value: "analytics", label: "Analytics & Reporting" },
  { value: "consulting", label: "Consulting" },
  { value: "maintenance", label: "Website Maintenance" },
  { value: "copywriting", label: "Copywriting" },
  { value: "video-production", label: "Video Production" },
  { value: "photography", label: "Photography" },
] as const;

export const PROJECT_STATUSES = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "active", label: "Active", color: "blue" },
  { value: "paused", label: "Paused", color: "yellow" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
] as const;

export const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "gray" },
  { value: "in-progress", label: "In Progress", color: "blue" },
  { value: "review", label: "Review", color: "yellow" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
] as const;

export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "gray" },
  { value: "medium", label: "Medium", color: "blue" },
  { value: "high", label: "High", color: "yellow" },
  { value: "urgent", label: "Urgent", color: "red" },
] as const;

// Sprint Management Types
export interface AgencySprint {
  id: string;
  name: string;
  description?: string;
  goal: string;
  status: "planning" | "active" | "completed" | "cancelled";

  // Timeline
  startDate: string;
  endDate: string;
  plannedHours: number;
  actualHours?: number;

  // Team and capacity
  teamMembers: string[]; // user IDs
  capacity: number; // team capacity in hours

  // Sprint metrics
  plannedPoints?: number;
  completedPoints?: number;

  // Associations
  projectId?: string;
  projectName?: string;

  // Tasks
  taskIds: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Sprint retrospective
  retrospective?: {
    whatWentWell: string[];
    whatCouldImprove: string[];
    actionItems: string[];
    completedAt: string;
  };
}

export interface SprintTask {
  id: string;
  sprintId: string;
  originalTaskId: string; // reference to AgencyTask
  storyPoints?: number;
  sprintOrder: number;
  addedAt: string;
  removedAt?: string;

  // Sprint-specific status
  sprintStatus:
    | "planned"
    | "in-progress"
    | "blocked"
    | "completed"
    | "carried-over";
  blockedReason?: string;
}

export interface SprintBurndownData {
  date: string;
  idealRemaining: number;
  actualRemaining: number;
  completedPoints: number;
  addedPoints: number;
}

export const SPRINT_STATUSES = [
  { value: "planning", label: "Planning", color: "blue" },
  { value: "active", label: "Active", color: "green" },
  { value: "completed", label: "Completed", color: "gray" },
  { value: "cancelled", label: "Cancelled", color: "red" },
] as const;
