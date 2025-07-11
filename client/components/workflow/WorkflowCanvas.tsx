import { useState, useRef, useCallback } from "react";
import { NodeType, Position } from "@/types/workflow";
import { useWorkflowCanvas } from "@/hooks/useWorkflowCanvas";
import { WorkflowNode } from "./WorkflowNode";
import { ConnectionLine, TempConnectionLine } from "./ConnectionLine";
import { NodeLibrary } from "./NodeLibrary";
import { PropertyPanel } from "./PropertyPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Play,
  Save,
  Download,
  Settings,
} from "lucide-react";

interface WorkflowCanvasProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onSave: () => void;
  onPublish: () => void;
}

export function WorkflowCanvas({
  workflowName,
  onWorkflowNameChange,
  onSave,
  onPublish,
}: WorkflowCanvasProps) {
  const { state, canvasRef, actions } = useWorkflowCanvas();
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const selectedNode = state.selectedNodeId
    ? state.nodes.find((n) => n.id === state.selectedNodeId) || null
    : null;

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
      const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
      setMousePosition({ x, y });

      if (isDragging && draggedNode) {
        const newX = x - dragStart.x;
        const newY = y - dragStart.y;
        actions.updateNode(draggedNode, {
          position: { x: newX, y: newY },
        });
      }
    },
    [actions, isDragging, draggedNode, dragStart, state.pan, state.zoom],
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedNode(null);
    }
  }, [isDragging]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        actions.clearSelection();
        if (state.isConnecting) {
          actions.cancelConnection();
        }
      }
    },
    [actions, state.isConnecting],
  );

  const handleNodeAdd = useCallback(
    (nodeType: NodeType) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (400 - state.pan.x) / state.zoom;
        const y = (200 - state.pan.y) / state.zoom;
        actions.addNode(nodeType, { x, y });
      }
    },
    [actions, state.pan, state.zoom],
  );

  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
      const y = (e.clientY - rect.top - state.pan.y) / state.zoom;

      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        setDragStart({
          x: x - node.position.x,
          y: y - node.position.y,
        });
        setDraggedNode(nodeId);
        setIsDragging(true);
      }
    },
    [state.nodes, state.pan, state.zoom],
  );

  const handleNodeStartConnection = useCallback(
    (nodeId: string) => {
      actions.startConnection(nodeId);
    },
    [actions],
  );

  const handleNodeCompleteConnection = useCallback(
    (nodeId: string) => {
      actions.completeConnection(nodeId);
    },
    [actions],
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData(
        "application/reactflow",
      ) as NodeType;
      if (nodeType && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
        const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
        actions.addNode(nodeType, { x, y });
      }
    },
    [actions, state.pan, state.zoom],
  );

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const getTempConnectionEnd = (): Position => {
    if (state.isConnecting && state.connectionStart) {
      const sourceNode = state.nodes.find(
        (n) => n.id === state.connectionStart!.nodeId,
      );
      if (sourceNode) {
        return mousePosition;
      }
    }
    return { x: 0, y: 0 };
  };

  const getTempConnectionStart = (): Position => {
    if (state.isConnecting && state.connectionStart) {
      const sourceNode = state.nodes.find(
        (n) => n.id === state.connectionStart!.nodeId,
      );
      if (sourceNode) {
        return {
          x: sourceNode.position.x + 256,
          y: sourceNode.position.y + 50,
        };
      }
    }
    return { x: 0, y: 0 };
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Node Library */}
      <NodeLibrary onNodeAdd={handleNodeAdd} />

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                value={workflowName}
                onChange={(e) => onWorkflowNameChange(e.target.value)}
                className="font-semibold text-lg border-none bg-transparent px-0 focus:ring-0"
                placeholder="Workflow name"
              />
              <Badge variant="secondary">Draft</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => actions.setZoom(state.zoom * 0.8)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm font-medium min-w-[4rem] text-center">
                {Math.round(state.zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => actions.setZoom(state.zoom * 1.25)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  actions.setZoom(1);
                  actions.setPan({ x: 0, y: 0 });
                }}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${showGrid ? "bg-gray-100" : ""}`}
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300" />

            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>

            <Button size="sm" onClick={onPublish}>
              <Play className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative cursor-default"
            style={{
              transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
              transformOrigin: "0 0",
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            {/* Grid Background */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                  width: "200vw",
                  height: "200vh",
                  left: "-100vw",
                  top: "-100vh",
                }}
              />
            )}

            {/* Welcome Message */}
            {state.nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Build your first workflow
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Drag and drop apps from the left panel to get started, or
                    click on any app to add it to your workflow.
                  </p>
                </div>
              </div>
            )}

            {/* Workflow Nodes */}
            {state.nodes.map((node) => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={state.selectedNodeId === node.id}
                isConnecting={state.isConnecting}
                onSelect={() => actions.selectNode(node.id)}
                onDelete={() => actions.deleteNode(node.id)}
                onEdit={() => actions.selectNode(node.id)}
                onStartConnection={() => handleNodeStartConnection(node.id)}
                onCompleteConnection={() =>
                  handleNodeCompleteConnection(node.id)
                }
                onDragStart={(e) => handleNodeDragStart(node.id, e)}
              />
            ))}

            {/* SVG for Connections */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Existing Connections */}
              {state.connections.map((connection) => {
                const sourceNode = state.nodes.find(
                  (n) => n.id === connection.source,
                );
                const targetNode = state.nodes.find(
                  (n) => n.id === connection.target,
                );

                if (!sourceNode || !targetNode) return null;

                return (
                  <ConnectionLine
                    key={connection.id}
                    connection={connection}
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                    isSelected={state.selectedConnectionId === connection.id}
                    onSelect={() => actions.selectConnection(connection.id)}
                    onDelete={() => actions.deleteConnection(connection.id)}
                  />
                );
              })}

              {/* Temporary Connection Line */}
              {state.isConnecting && (
                <TempConnectionLine
                  startX={getTempConnectionStart().x}
                  startY={getTempConnectionStart().y}
                  endX={getTempConnectionEnd().x}
                  endY={getTempConnectionEnd().y}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Steps: {state.nodes.length}</span>
            <span>Connections: {state.connections.length}</span>
          </div>
          <div>
            Mouse: {Math.round(mousePosition.x)}, {Math.round(mousePosition.y)}
          </div>
        </div>
      </div>

      {/* Property Panel */}
      {selectedNode && (
        <PropertyPanel
          node={selectedNode}
          onUpdateNode={actions.updateNode}
          onClose={() => actions.clearSelection()}
        />
      )}
    </div>
  );
}
