import { useEffect, useState, useCallback } from "react";
import { useWorkflowBuilder } from "@/hooks/useWorkflowBuilder";
import { NodeType, Position } from "@/types/automation";
import { WorkflowNode } from "./WorkflowNode";
import { ConnectionLine, TempConnectionLine } from "./ConnectionLine";
import { NodeLibrary } from "./NodeLibrary";
import { PropertyPanel } from "./PropertyPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Settings,
  Grid,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
  onPublish?: (workflow: any) => void;
}

export function WorkflowBuilder({
  workflowId,
  onSave,
  onPublish,
}: WorkflowBuilderProps) {
  const { state, actions, canvasRef } = useWorkflowBuilder();
  const [showGrid, setShowGrid] = useState(true);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);

  // Handle canvas mouse events
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        actions.selectNode(null);
        actions.selectConnection(null);
        if (state.isConnecting) {
          actions.cancelConnection();
        }
      }
    },
    [actions, state.isConnecting],
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
        const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
        setMousePosition({ x, y });

        if (state.isDragging) {
          actions.drag({ x: e.clientX, y: e.clientY });
        }
      }
    },
    [actions, state.isDragging, state.pan, state.zoom, canvasRef],
  );

  const handleNodeAdd = useCallback(
    (nodeType: NodeType) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const position = {
          x: (300 - state.pan.x) / state.zoom,
          y: (200 - state.pan.y) / state.zoom,
        };
        const nodeId = actions.addNode(nodeType, position);
        actions.selectNode(nodeId);
      }
    },
    [actions, state.pan, state.zoom, canvasRef],
  );

  const handleZoomIn = () => actions.setZoom(state.zoom * 1.2);
  const handleZoomOut = () => actions.setZoom(state.zoom / 1.2);
  const handleResetView = () => actions.resetView();

  const handleSave = async () => {
    await actions.saveWorkflow();
    onSave?.(state.workflow);
  };

  const handlePublish = () => {
    onPublish?.(state.workflow);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "=":
          case "+":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "0":
            e.preventDefault();
            handleResetView();
            break;
        }
      }

      if (e.key === "Delete" && state.selectedNodeId) {
        actions.deleteNode(state.selectedNodeId);
      }

      if (e.key === "Escape") {
        actions.selectNode(null);
        actions.selectConnection(null);
        if (state.isConnecting) {
          actions.cancelConnection();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, state.selectedNodeId, state.isConnecting, handleSave]);

  return (
    <div
      className="flex bg-background overflow-hidden"
      style={{ height: "calc(100vh - 73px)" }}
    >
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Toolbar */}
        <div className="border-b bg-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Library Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLibraryCollapsed(!isLibraryCollapsed)}
            >
              {isLibraryCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {/* Workflow Info */}
            <div className="flex items-center gap-2">
              <Input
                value={state.workflow.name}
                onChange={(e) =>
                  actions.updateNode("", { data: { label: e.target.value } })
                }
                className="font-medium border-none bg-transparent text-lg w-48"
              />
              <Badge
                variant={
                  state.workflow.status === "active" ? "default" : "secondary"
                }
              >
                {state.workflow.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm font-medium min-w-[3rem] text-center">
                {Math.round(state.zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetView}
                className="h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* View Options */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGrid(!showGrid)}
              className={cn("h-8 w-8", showGrid && "bg-muted")}
            >
              <Grid className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPanelVisible(!isPanelVisible)}
              className="h-8 w-8"
            >
              {isPanelVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={handlePublish}
                disabled={state.workflow.status === "active"}
              >
                <Play className="mr-2 h-4 w-4" />
                {state.workflow.status === "active" ? "Active" : "Publish"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Workflow
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export Workflow
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Workflow Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative overflow-hidden cursor-default"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            style={{
              transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Grid Background */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            )}

            {/* Nodes */}
            {state.workflow.nodes.map((node) => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={state.selectedNodeId === node.id}
                isConnecting={state.isConnecting}
                onSelect={() => actions.selectNode(node.id)}
                onDelete={() => actions.deleteNode(node.id)}
                onEdit={() => actions.selectNode(node.id)}
                onDragStart={(offset) => actions.startDrag(node.id, offset)}
                onDrag={actions.drag}
                onDragEnd={actions.endDrag}
                onOutputConnect={(outputId) =>
                  actions.startConnection(node.id, outputId)
                }
                onInputConnect={(inputId) => {
                  if (state.connectionStart) {
                    actions.completeConnection(node.id, inputId);
                  }
                }}
                scale={1} // Individual nodes don't scale, the container does
              />
            ))}

            {/* SVG for Connections */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Existing Connections */}
              {state.workflow.connections.map((connection) => (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  isSelected={state.selectedConnectionId === connection.id}
                  onSelect={() => actions.selectConnection(connection.id)}
                  onDelete={() => actions.deleteConnection(connection.id)}
                  scale={state.zoom}
                />
              ))}

              {/* Temporary Connection Line */}
              {state.isConnecting && state.connectionStart && (
                <TempConnectionLine
                  start={{
                    x:
                      state.workflow.nodes.find(
                        (n) => n.id === state.connectionStart!.nodeId,
                      )!.position.x + 192,
                    y:
                      state.workflow.nodes.find(
                        (n) => n.id === state.connectionStart!.nodeId,
                      )!.position.y + 20,
                  }}
                  end={mousePosition}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Nodes: {state.workflow.nodes.length}</span>
            <span>Connections: {state.workflow.connections.length}</span>
            <span>
              Mouse: {Math.round(mousePosition.x)},{" "}
              {Math.round(mousePosition.y)}
            </span>
          </div>
          <div>Last saved: {state.workflow.updatedAt.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Property Panel */}
      {isPanelVisible && !!state.selectedNodeId && (
        <PropertyPanel
          node={
            state.selectedNodeId
              ? state.workflow.nodes.find(
                  (n) => n.id === state.selectedNodeId,
                ) || null
              : null
          }
          onNodeUpdate={actions.updateNode}
          onClose={() => actions.selectNode(null)}
          isVisible={true}
        />
      )}

      {/* Node Library - Moved to Right */}
      <NodeLibrary onNodeAdd={handleNodeAdd} isCollapsed={isLibraryCollapsed} />
    </div>
  );
}
