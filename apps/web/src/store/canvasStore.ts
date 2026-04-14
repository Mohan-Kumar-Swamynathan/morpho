import { create } from 'zustand';

interface CanvasNode {
  id: string;
  type: 'frame' | 'group' | 'component' | 'instance' | 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'line' | 'vector' | 'text' | 'image' | 'boolean_operation';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  fills?: { type: 'solid' | 'gradient' | 'image'; color?: string; opacity?: number }[];
  strokes?: { color: string; width: number; style: 'solid' | 'dashed' | 'dotted'; position: 'center' | 'inside' | 'outside' }[];
  effects?: { type: string; color?: string; offset?: { x: number; y: number }; blur?: number; spread?: number }[];
  children?: CanvasNode[];
  componentId?: string;
  variantProps?: Record<string, string>;
  textContent?: string;
  textStyle?: { fontFamily: string; fontSize: number; fontWeight: number; lineHeight: number; letterSpacing: number; alignment: 'left' | 'center' | 'right' };
  imageUrl?: string;
  cornerRadius?: number | { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number };
}

interface CanvasJSON {
  version: string;
  meta: { name: string; width: number; height: number; background: string };
  nodes: CanvasNode[];
  components?: any[];
  tokens?: any;
}

function createDefaultCanvas(): CanvasJSON {
  return {
    version: '1.0.0',
    meta: { name: 'Untitled', width: 1440, height: 900, background: '#ffffff' },
    nodes: [],
  };
}

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

interface CanvasState {
  canvas: CanvasJSON;
  selectedIds: string[];
  zoom: number;
  tool: 'select' | 'rectangle' | 'ellipse' | 'text' | 'frame' | 'hand';
  isDragging: boolean;
  isPanning: boolean;
  
  setCanvas: (canvas: CanvasJSON) => void;
  addNode: (node: Omit<CanvasNode, 'id'>) => string;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  setTool: (tool: CanvasState['tool']) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsPanning: (isPanning: boolean) => void;
  resetCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: createDefaultCanvas(),
  selectedIds: [],
  zoom: 1,
  tool: 'select',
  isDragging: false,
  isPanning: false,

  setCanvas: (canvas) => set({ canvas }),
  
  addNode: (node) => {
    const id = generateId();
    const newNode: CanvasNode = { ...node, id };
    set((state) => ({
      canvas: {
        ...state.canvas,
        nodes: [...state.canvas.nodes, newNode],
      },
    }));
    return id;
  },
  
  updateNode: (id, updates) => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        nodes: state.canvas.nodes.map((n) => 
          n.id === id ? { ...n, ...updates } : n
        ),
      },
    }));
  },
  
  deleteNode: (id) => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        nodes: state.canvas.nodes.filter((n) => n.id !== id),
      },
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }));
  },
  
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(6.4, zoom)) }),
  setTool: (tool) => set({ tool }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setIsPanning: (isPanning) => set({ isPanning }),
  
  resetCanvas: () => set({ canvas: createDefaultCanvas(), selectedIds: [] }),
}));