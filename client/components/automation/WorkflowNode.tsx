import { useState } from "react";
import { NodeData, Position } from "@/types/automation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Webhook,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Bell,
  GitBranch,
  Filter,
  Clock,
  Shuffle,
  Merge,
  MoreVertical,
  Trash2,
  Settings,
  Copy,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeIcons = {
  "trigger-webhook": Webhook,
  "trigger-schedule": Calendar,
  "trigger-form": Mail,
  "trigger-email": Mail,
  "action-email": Mail,
  "action-sms": MessageSquare,
  "action-webhook": Webhook,
  "action-api": Database,
  "action-database": Database,
  "action-notification": Bell,
  "condition-if": GitBranch,
  "condition-filter": Filter,
  "condition-branch": GitBranch,
  "utility-delay": Clock,
  "utility-transform": Shuffle,
  "utility-merge": Merge,
};

const nodeColors = {
  trigger: "border-blue-200 bg-blue-50",
  action: "border-green-200 bg-green-50",
  condition: "border-yellow-200 bg-yellow-50",
  utility: "border-purple-200 bg-purple-50",
};

const nodeCategories = {
  "trigger-webhook": "trigger",
  "trigger-schedule": "trigger",
  "trigger-form": "trigger",
  "trigger-email": "trigger",
  "action-email": "action",
  "action-sms": "action",
  "action-webhook": "action",
  "action-api": "action",
  "action-database": "action",
  "action-notification": "action",
  "condition-if": "condition",
  "condition-filter": "condition",
  "condition-branch": "condition",
  "utility-delay": "utility",
  "utility-transform": "utility",
  "utility-merge": "utility",
} as const;

interface WorkflowNodeProps {
  node: NodeData;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onDragStart: (offset: Position) => void;
  onDrag: (position: Position) => void;
  onDragEnd: () => void;
  onOutputConnect: (outputId: string) => void;
  onInputConnect: (inputId: string) => void;
  scale: number;
}

export function WorkflowNode({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onDelete,
  onEdit,
  onDragStart,
  onDrag,
  onDragEnd,
  onOutputConnect,
  onInputConnect,
  scale,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const Icon = nodeIcons[node.type];
  const category = nodeCategories[node.type];
  const colorClass = nodeColors[category];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onSelect();
    onDragStart(offset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    onDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
  };

  const handleOutputClick = (outputId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onOutputConnect(outputId);
  };

  const handleInputClick = (inputId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onInputConnect(inputId);
  };

  return (
    <div
      className="absolute cursor-move select-none"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card
        className={cn(
          "relative w-48 p-3 border-2 transition-all duration-200",
          colorClass,
          isSelected && "ring-2 ring-primary ring-offset-2",
          isDragging && "shadow-lg scale-105",
          "hover:shadow-md",
        )}
      >
        {/* Input Connection Points */}
        {node.inputs?.map((input) => (
          <div
            key={input.id}
            className="absolute left-0 w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:border-primary transform -translate-x-1/2 -translate-y-1/2 transition-colors"
            style={{
              top: input.position.y,
              left: input.position.x,
            }}
            onClick={(e) => handleInputClick(input.id, e)}
            title="Connect input"
          />
        ))}

        {/* Output Connection Points */}
        {node.outputs?.map((output) => (
          <div
            key={output.id}
            className="absolute right-0 w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:border-primary transform translate-x-1/2 -translate-y-1/2 transition-colors"
            style={{
              top: output.position.y,
              right: -output.position.x + 192, // 192 = 48 * 4 (w-48)
            }}
            onClick={(e) => handleOutputClick(output.id, e)}
            title="Connect output"
          />
        ))}

        {/* Node Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md",
                category === "trigger" && "bg-blue-100 text-blue-600",
                category === "action" && "bg-green-100 text-green-600",
                category === "condition" && "bg-yellow-100 text-yellow-600",
                category === "utility" && "bg-purple-100 text-purple-600",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-50 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                Test
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Node Content */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900">
            {node.data.label}
          </h4>
          {node.data.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {node.data.description}
            </p>
          )}
        </div>

        {/* Node Status */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1">
            {node.data.isValid ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-500" />
            )}
            <span className="text-xs text-gray-500">
              {node.data.isValid ? "Configured" : "Setup required"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
