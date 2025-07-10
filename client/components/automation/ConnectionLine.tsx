import { Connection, Position } from "@/types/automation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionLineProps {
  connection: Connection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  scale: number;
}

export function ConnectionLine({
  connection,
  isSelected,
  onSelect,
  onDelete,
  scale,
}: ConnectionLineProps) {
  const start = connection.points[0];
  const end = connection.points[1];

  // Calculate control points for curved connection
  const midX = (start.x + end.x) / 2;
  const controlPoint1: Position = { x: midX, y: start.y };
  const controlPoint2: Position = { x: midX, y: end.y };

  // Create SVG path for bezier curve
  const pathData = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;

  // Calculate midpoint for delete button
  const midpoint = calculateBezierPoint(
    start,
    controlPoint1,
    controlPoint2,
    end,
    0.5,
  );

  return (
    <g>
      {/* Connection path */}
      <path
        d={pathData}
        stroke={isSelected ? "#3b82f6" : "#6b7280"}
        strokeWidth={isSelected ? "3" : "2"}
        fill="none"
        className={cn(
          "cursor-pointer transition-all duration-200",
          "hover:stroke-blue-400",
        )}
        onClick={onSelect}
      />

      {/* Arrow marker */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isSelected ? "#3b82f6" : "#6b7280"}
            className="transition-colors duration-200"
          />
        </marker>
      </defs>

      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="8"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="pointer-events-none"
      />

      {/* Delete button */}
      {isSelected && (
        <foreignObject
          x={midpoint.x - 12}
          y={midpoint.y - 12}
          width="24"
          height="24"
        >
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

// Helper function to calculate point on bezier curve
function calculateBezierPoint(
  p0: Position,
  p1: Position,
  p2: Position,
  p3: Position,
  t: number,
): Position {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y };
}

interface TempConnectionLineProps {
  start: Position;
  end: Position;
}

export function TempConnectionLine({ start, end }: TempConnectionLineProps) {
  const midX = (start.x + end.x) / 2;
  const controlPoint1: Position = { x: midX, y: start.y };
  const controlPoint2: Position = { x: midX, y: end.y };

  const pathData = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;

  return (
    <path
      d={pathData}
      stroke="#3b82f6"
      strokeWidth="2"
      strokeDasharray="5,5"
      fill="none"
      className="pointer-events-none animate-pulse"
    />
  );
}
