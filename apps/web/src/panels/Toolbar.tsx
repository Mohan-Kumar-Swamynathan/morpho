import { useCanvasStore } from '../store/canvasStore';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  Frame, 
  Hand,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo
} from 'lucide-react';

export default function Toolbar() {
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'hand', icon: Hand, label: 'Pan (H)' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'frame', icon: Frame, label: 'Frame (F)' },
  ];

  return (
    <div className="w-12 bg-white border-r border-canvas-border flex flex-col items-center py-4 gap-2">
      <div className="flex flex-col gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id as any)}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              tool === t.id 
                ? 'bg-morpho-primary text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={t.label}
          >
            <t.icon size={18} />
          </button>
        ))}
      </div>

      <div className="w-9 h-px bg-gray-200 my-2" />

      <div className="flex flex-col gap-1">
        <button
          onClick={() => setZoom(zoom / 1.2)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        
        <div className="text-xs text-center text-gray-500 py-1">
          {Math.round(zoom * 100)}%
        </div>
        
        <button
          onClick={() => setZoom(zoom * 1.2)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
}
