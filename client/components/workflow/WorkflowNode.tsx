import { useState, useRef } from "react";
import { WorkflowNode as WorkflowNodeType } from "@/types/workflow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Settings,
  Copy,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Slack,
  MessageCircle,
  GitBranch,
  Filter,
  Clock,
  Code,
} from "lucide-react";
import { nodeTemplates } from "./NodeLibrary";

const iconMap = {
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Slack,
  MessageCircle,
  GitBranch,
  Filter,
  Clock,
  Code,
};

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onStartConnection: () => void;
  onCompleteConnection: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export function WorkflowNode({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onDelete,
  onEdit,
  onStartConnection,
  onCompleteConnection,
  onDragStart,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const template = nodeTemplates.find((t) => t.type === node.type);
  const Icon = template
    ? iconMap[template.icon as keyof typeof iconMap]
    : Settings;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    onSelect();
    onDragStart(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onCompleteConnection();
    } else {
      onStartConnection();
    }
  };

  return (
    <div
      ref={nodeRef}
      className="absolute cursor-move"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Card
        className={`w-64 p-4 border-2 transition-all ${
          isSelected
            ? "border-blue-500 shadow-lg"
            : "border-gray-200 hover:border-gray-300"
        } ${isDragging ? "shadow-xl" : ""}`}
      >
        {/* Connection Points */}
        {node.type !== "trigger-webhook" &&
          node.type !== "trigger-schedule" &&
          node.type !== "trigger-email" &&
          node.type !== "trigger-form" && (
            <div
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:border-blue-500 transition-colors"
              onClick={handleConnectionClick}
              title="Input connection"
            />
          )}

        <div
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:border-blue-500 transition-colors"
          onClick={handleConnectionClick}
          title="Output connection"
        />

        {/* Node Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: template?.color || "#6B7280" }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900">
                {node.data.label}
              </h3>
              <Badge variant="outline" className="text-xs capitalize mt-1">
                {template?.category || "unknown"}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Test
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Node Content */}
        <div className="space-y-2">
          {node.data.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {node.data.description}
            </p>
          )}

          {template?.description && !node.data.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {template.description}
            </p>
          )}
        </div>

        {/* Configuration Status */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {node.data.isConfigured ? (
              <>
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">Configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-600">Setup required</span>
              </>
            )}
          </div>

          {node.data.isConfigured && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
