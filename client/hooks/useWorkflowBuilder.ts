import { useState, useCallback, useRef } from "react";
import {
  NodeData,
  Connection,
  Workflow,
  Position,
  NodeType,
} from "@/types/automation";
import { generateId } from "@/lib/idGenerator";

export interface WorkflowBuilderState {
  workflow: Workflow;
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  isDragging: boolean;
  dragOffset: Position;
  connectionStart: { nodeId: string; outputId: string } | null;
  zoom: number;
  pan: Position;
  isConnecting: boolean;
}

export function useWorkflowBuilder(initialWorkflow?: Workflow) {
  const [state, setState] = useState<WorkflowBuilderState>({
    workflow: initialWorkflow || {
      id: generateId("workflow"),
      name: "New Workflow",
      status: "draft",
      nodes: [],
      connections: [],
      triggers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0,
    },
    selectedNodeId: null,
    selectedConnectionId: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    connectionStart: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    isConnecting: false,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((nodeType: NodeType, position: Position) => {
    const newNode: NodeData = {
      id: generateId("node"),
      type: nodeType,
      position,
      data: {
        label: nodeType
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        description: "",
        config: {},
        isValid: false,
      },
      inputs: nodeType.startsWith("trigger")
        ? []
        : [
            {
              id: generateId("input"),
              type: "input",
              dataType: "action",
              position: { x: 0, y: 20 },
            },
          ],
      outputs: [
        {
          id: generateId("output"),
          type: "output",
          dataType: "action",
          position: { x: 200, y: 20 },
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        nodes: [...prev.workflow.nodes, newNode],
        triggers: nodeType.startsWith("trigger")
          ? [...prev.workflow.triggers, newNode]
          : prev.workflow.triggers,
        updatedAt: new Date(),
      },
    }));

    return newNode.id;
  }, []);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      setState((prev) => ({
        ...prev,
        workflow: {
          ...prev.workflow,
          nodes: prev.workflow.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node,
          ),
          triggers: prev.workflow.triggers.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node,
          ),
          updatedAt: new Date(),
        },
      }));
    },
    [],
  );

  const deleteNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        nodes: prev.workflow.nodes.filter((node) => node.id !== nodeId),
        connections: prev.workflow.connections.filter(
          (conn) =>
            conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId,
        ),
        triggers: prev.workflow.triggers.filter((node) => node.id !== nodeId),
        updatedAt: new Date(),
      },
      selectedNodeId:
        prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
    }));
  }, []);

  const addConnection = useCallback(
    (
      sourceNodeId: string,
      sourceOutputId: string,
      targetNodeId: string,
      targetInputId: string,
    ) => {
      const sourceNode = state.workflow.nodes.find(
        (n) => n.id === sourceNodeId,
      );
      const targetNode = state.workflow.nodes.find(
        (n) => n.id === targetNodeId,
      );

      if (!sourceNode || !targetNode) return;

      const newConnection: Connection = {
        id: generateId("connection"),
        sourceNodeId,
        sourceOutputId,
        targetNodeId,
        targetInputId,
        points: [
          { x: sourceNode.position.x + 200, y: sourceNode.position.y + 20 },
          { x: targetNode.position.x, y: targetNode.position.y + 20 },
        ],
      };

      setState((prev) => ({
        ...prev,
        workflow: {
          ...prev.workflow,
          connections: [...prev.workflow.connections, newConnection],
          updatedAt: new Date(),
        },
        connectionStart: null,
        isConnecting: false,
      }));
    },
    [state.workflow.nodes],
  );

  const deleteConnection = useCallback((connectionId: string) => {
    setState((prev) => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        connections: prev.workflow.connections.filter(
          (conn) => conn.id !== connectionId,
        ),
        updatedAt: new Date(),
      },
      selectedConnectionId:
        prev.selectedConnectionId === connectionId
          ? null
          : prev.selectedConnectionId,
    }));
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
      selectedConnectionId: null,
    }));
  }, []);

  const selectConnection = useCallback((connectionId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedConnectionId: connectionId,
      selectedNodeId: null,
    }));
  }, []);

  const startDrag = useCallback((nodeId: string, offset: Position) => {
    setState((prev) => ({
      ...prev,
      isDragging: true,
      dragOffset: offset,
      selectedNodeId: nodeId,
    }));
  }, []);

  const drag = useCallback(
    (position: Position) => {
      if (!state.isDragging || !state.selectedNodeId) return;

      const newPosition = {
        x: position.x - state.dragOffset.x,
        y: position.y - state.dragOffset.y,
      };

      updateNode(state.selectedNodeId, { position: newPosition });
    },
    [state.isDragging, state.selectedNodeId, state.dragOffset, updateNode],
  );

  const endDrag = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  const startConnection = useCallback((nodeId: string, outputId: string) => {
    setState((prev) => ({
      ...prev,
      connectionStart: { nodeId, outputId },
      isConnecting: true,
    }));
  }, []);

  const completeConnection = useCallback(
    (nodeId: string, inputId: string) => {
      if (!state.connectionStart) return;

      addConnection(
        state.connectionStart.nodeId,
        state.connectionStart.outputId,
        nodeId,
        inputId,
      );
    },
    [state.connectionStart, addConnection],
  );

  const cancelConnection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      connectionStart: null,
      isConnecting: false,
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({
      ...prev,
      zoom: Math.max(0.25, Math.min(2, zoom)),
    }));
  }, []);

  const setPan = useCallback((pan: Position) => {
    setState((prev) => ({
      ...prev,
      pan,
    }));
  }, []);

  const resetView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 },
    }));
  }, []);

  const saveWorkflow = useCallback(async () => {
    // In a real app, this would save to a backend
    localStorage.setItem(
      `workflow-${state.workflow.id}`,
      JSON.stringify(state.workflow),
    );
    setState((prev) => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        updatedAt: new Date(),
      },
    }));
  }, [state.workflow]);

  const loadWorkflow = useCallback(async (workflowId: string) => {
    // In a real app, this would load from a backend
    const saved = localStorage.getItem(`workflow-${workflowId}`);
    if (saved) {
      const workflow = JSON.parse(saved) as Workflow;
      setState((prev) => ({
        ...prev,
        workflow,
        selectedNodeId: null,
        selectedConnectionId: null,
      }));
    }
  }, []);

  return {
    state,
    actions: {
      addNode,
      updateNode,
      deleteNode,
      addConnection,
      deleteConnection,
      selectNode,
      selectConnection,
      startDrag,
      drag,
      endDrag,
      startConnection,
      completeConnection,
      cancelConnection,
      setZoom,
      setPan,
      resetView,
      saveWorkflow,
      loadWorkflow,
    },
    canvasRef,
  };
}
