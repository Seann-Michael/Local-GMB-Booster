import { WorkflowNode, Connection } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConnectionLineProps {
  connection: Connection;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConnectionLine({
  connection,
  sourceNode,
  targetNode,
  isSelected,
  onSelect,
  onDelete,
}: ConnectionLineProps) {
  // Calculate connection points
  const sourceX = sourceNode.position.x + 256; // 64 * 4 (w-64)
  const sourceY = sourceNode.position.y + 50; // Approximate center
  const targetX = targetNode.position.x;
  const targetY = targetNode.position.y + 50;

  // Create smooth curve
  const midX = (sourceX + targetX) / 2;
  const controlX1 = sourceX + Math.min(100, (targetX - sourceX) / 3);
  const controlX2 = targetX - Math.min(100, (targetX - sourceX) / 3);

  const pathData = `M ${sourceX} ${sourceY} C ${controlX1} ${sourceY}, ${controlX2} ${targetY}, ${targetX} ${targetY}`;

  // Calculate midpoint for delete button
  const midY = (sourceY + targetY) / 2;

  return (
    <g>
      {/* Main connection path */}
      <path
        d={pathData}
        stroke={isSelected ? "#3B82F6" : "#9CA3AF"}
        strokeWidth={isSelected ? "3" : "2"}
        fill="none"
        className="cursor-pointer transition-all duration-200 hover:stroke-blue-400"
        onClick={onSelect}
      />

      {/* Arrow marker */}
      <defs>
        <marker
          id={`arrow-${connection.id}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={isSelected ? "#3B82F6" : "#9CA3AF"}
            className="transition-colors duration-200"
          />
        </marker>
      </defs>

      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="8"
        fill="none"
        markerEnd={`url(#arrow-${connection.id})`}
        className="pointer-events-none"
      />

      {/* Delete button when selected */}
      {isSelected && (
        <foreignObject x={midX - 12} y={midY - 12} width="24" height="24">
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </foreignObject>
      )}
    </g>
  );
}

interface TempConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function TempConnectionLine({
  startX,
  startY,
  endX,
  endY,
}: TempConnectionLineProps) {
  const controlX1 = startX + Math.min(100, (endX - startX) / 3);
  const controlX2 = endX - Math.min(100, (endX - startX) / 3);

  const pathData = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;

  return (
    <path
      d={pathData}
      stroke="#3B82F6"
      strokeWidth="2"
      strokeDasharray="5,5"
      fill="none"
      className="pointer-events-none animate-pulse"
    />
  );
}
