import { useCanvasStore } from '../store/canvasStore';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';

export default function LayersPanel() {
  const canvas = useCanvasStore((s) => s.canvas);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const setSelectedIds = useCanvasStore((s) => s.setSelectedIds);
  const deleteNode = useCanvasStore((s) => s.deleteNode);

  return (
    <div className="w-60 bg-white border-l border-canvas-border flex flex-col">
      <div className="px-4 py-3 border-b border-canvas-border">
        <h2 className="font-semibold text-sm">Layers</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {canvas.nodes.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No layers yet. Use the toolbar to add shapes.
          </div>
        ) : (
          <div className="p-2">
            {[...canvas.nodes].reverse().map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedIds([node.id])}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm ${
                  selectedIds.includes(node.id) 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown size={14} />
                </button>
                
                <span className="flex-1 truncate">{node.name}</span>
                
                <button 
                  className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
