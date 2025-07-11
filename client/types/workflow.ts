export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: {
    label: string;
    description?: string;
    config: Record<string, any>;
    isConfigured: boolean;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  status: "draft" | "active" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

export type NodeType =
  | "trigger-webhook"
  | "trigger-schedule"
  | "trigger-email"
  | "trigger-form"
  | "action-email"
  | "action-sms"
  | "action-webhook"
  | "action-database"
  | "action-slack"
  | "action-discord"
  | "condition-if"
  | "condition-filter"
  | "utility-delay"
  | "utility-code";

export interface NodeTemplate {
  type: NodeType;
  category: "trigger" | "action" | "condition" | "utility";
  label: string;
  description: string;
  icon: string;
  color: string;
  configFields: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export interface CanvasState {
  nodes: WorkflowNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  isConnecting: boolean;
  connectionStart: { nodeId: string; handle?: string } | null;
  zoom: number;
  pan: Position;
  isDragging: boolean;
}
