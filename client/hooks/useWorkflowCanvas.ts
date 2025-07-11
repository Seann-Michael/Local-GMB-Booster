import { useState, useCallback, useRef } from "react";
import {
  WorkflowNode,
  Connection,
  Position,
  NodeType,
  CanvasState,
} from "@/types/workflow";

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useWorkflowCanvas() {
  const [state, setState] = useState<CanvasState>({
    nodes: [],
    connections: [],
    selectedNodeId: null,
    selectedConnectionId: null,
    isConnecting: false,
    connectionStart: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((nodeType: NodeType, position: Position) => {
    const newNode: WorkflowNode = {
      id: generateId(),
      type: nodeType,
      position,
      data: {
        label: nodeType
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        config: {},
        isConfigured: false,
      },
    };

    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      selectedNodeId: newNode.id,
    }));

    return newNode.id;
  }, []);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      setState((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node,
        ),
      }));
    },
    [],
  );

  const deleteNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId),
      connections: prev.connections.filter(
        (conn) => conn.source !== nodeId && conn.target !== nodeId,
      ),
      selectedNodeId:
        prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
    }));
  }, []);

  const addConnection = useCallback(
    (source: string, target: string) => {
      // Prevent self-connections and duplicate connections
      if (source === target) return;

      const existingConnection = state.connections.find(
        (conn) => conn.source === source && conn.target === target,
      );
      if (existingConnection) return;

      const newConnection: Connection = {
        id: generateId(),
        source,
        target,
      };

      setState((prev) => ({
        ...prev,
        connections: [...prev.connections, newConnection],
        isConnecting: false,
        connectionStart: null,
      }));
    },
    [state.connections],
  );

  const deleteConnection = useCallback((connectionId: string) => {
    setState((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => conn.id !== connectionId),
      selectedConnectionId:
        prev.selectedConnectionId === connectionId
          ? null
          : prev.selectedConnectionId,
    }));
  }, []);

  const startConnection = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      isConnecting: true,
      connectionStart: { nodeId },
    }));
  }, []);

  const completeConnection = useCallback(
    (targetNodeId: string) => {
      if (state.connectionStart) {
        addConnection(state.connectionStart.nodeId, targetNodeId);
      }
    },
    [state.connectionStart, addConnection],
  );

  const cancelConnection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnecting: false,
      connectionStart: null,
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

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: null,
      selectedConnectionId: null,
    }));
  }, []);

  return {
    state,
    canvasRef,
    actions: {
      addNode,
      updateNode,
      deleteNode,
      addConnection,
      deleteConnection,
      startConnection,
      completeConnection,
      cancelConnection,
      selectNode,
      selectConnection,
      setZoom,
      setPan,
      clearSelection,
    },
  };
}
