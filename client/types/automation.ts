export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: NodeType;
  position: Position;
  data: {
    label: string;
    description?: string;
    config?: Record<string, any>;
    isValid?: boolean;
  };
  inputs?: ConnectionPoint[];
  outputs?: ConnectionPoint[];
}

export interface ConnectionPoint {
  id: string;
  type: "input" | "output";
  dataType: "trigger" | "action" | "condition" | "data";
  position: Position;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourceOutputId: string;
  targetNodeId: string;
  targetInputId: string;
  points: Position[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "paused" | "error";
  nodes: NodeData[];
  connections: Connection[];
  triggers: NodeData[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
}

export type NodeType =
  | "trigger-webhook"
  | "trigger-schedule"
  | "trigger-form"
  | "trigger-email"
  | "action-email"
  | "action-sms"
  | "action-webhook"
  | "action-api"
  | "action-database"
  | "action-notification"
  | "condition-if"
  | "condition-filter"
  | "condition-branch"
  | "utility-delay"
  | "utility-transform"
  | "utility-merge";

export interface NodeTemplate {
  type: NodeType;
  category: "trigger" | "action" | "condition" | "utility";
  label: string;
  description: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  configSchema: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: Date;
  completedAt?: Date;
  steps: ExecutionStep[];
  error?: string;
}

export interface ExecutionStep {
  nodeId: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt: Date;
  completedAt?: Date;
  input?: any;
  output?: any;
  error?: string;
  duration?: number;
}

export interface WorkflowStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTime: number;
  lastRun?: Date;
  averagePerDay: number;
}

export interface AutomationSettings {
  maxExecutionsPerMinute: number;
  retryAttempts: number;
  timeoutMinutes: number;
  enableLogging: boolean;
  enableNotifications: boolean;
  webhookUrl?: string;
}
