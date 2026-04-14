import { useCanvasStore } from '../store/canvasStore';

export default function PropertiesPanel() {
  const canvas = useCanvasStore((s) => s.canvas);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const updateNode = useCanvasStore((s) => s.updateNode);

  const selectedNode = canvas.nodes.find((n) => selectedIds.includes(n.id));

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border-l border-canvas-border flex flex-col">
        <div className="px-4 py-3 border-b border-canvas-border">
          <h2 className="font-semibold text-sm">Properties</h2>
        </div>
        
        <div className="flex-1 p-4">
          <p className="text-sm text-gray-500">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    updateNode(selectedNode.id, { [field]: value });
  };

  const updateFill = (index: number, key: string, value: any) => {
    const fills = [...(selectedNode.fills || [])];
    fills[index] = { ...fills[index], [key]: value };
    updateNode(selectedNode.id, { fills });
  };

  return (
    <div className="w-64 bg-white border-l border-canvas-border flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-canvas-border">
        <h2 className="font-semibold text-sm">Properties</h2>
        <p className="text-xs text-gray-500 mt-1">{selectedNode.name}</p>
      </div>

      <div className="p-4 space-y-4">
        <PropertySection title="Position">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">X</label>
              <input
                type="number"
                value={Math.round(selectedNode.x)}
                onChange={(e) => updateField('x', Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={Math.round(selectedNode.y)}
                onChange={(e) => updateField('y', Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </PropertySection>

        <PropertySection title="Size">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">W</label>
              <input
                type="number"
                value={Math.round(selectedNode.width)}
                onChange={(e) => updateField('width', Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">H</label>
              <input
                type="number"
                value={Math.round(selectedNode.height)}
                onChange={(e) => updateField('height', Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </PropertySection>

        <PropertySection title="Fill">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedNode.fills?.[0]?.color || '#ffffff'}
                onChange={(e) => updateFill(0, 'color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedNode.fills?.[0]?.color || '#ffffff'}
                onChange={(e) => updateFill(0, 'color', e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedNode.fills?.[0]?.opacity ?? 1}
                onChange={(e) => updateFill(0, 'opacity', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </PropertySection>

        <PropertySection title="Stroke">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedNode.strokes?.[0]?.color || '#000000'}
                onChange={(e) => {
                  const strokes = selectedNode.strokes || [];
                  updateNode(selectedNode.id, { 
                    strokes: [...strokes, { color: e.target.value, width: 1, style: 'solid', position: 'center' }] 
                  });
                }}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="number"
                placeholder="Width"
                value={selectedNode.strokes?.[0]?.width || ''}
                onChange={(e) => {
                  const strokes = selectedNode.strokes || [];
                  if (strokes[0]) {
                    strokes[0] = { ...strokes[0], width: Number(e.target.value) };
                    updateNode(selectedNode.id, { strokes });
                  }
                }}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </PropertySection>

        <PropertySection title="Corner Radius">
          <input
            type="number"
            value={typeof selectedNode.cornerRadius === 'number' ? selectedNode.cornerRadius : 0}
            onChange={(e) => updateField('cornerRadius', Number(e.target.value))}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </PropertySection>

        <PropertySection title="Opacity">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedNode.opacity ?? 1}
            onChange={(e) => updateField('opacity', Number(e.target.value))}
            className="w-full"
          />
        </PropertySection>

        <PropertySection title="Rotation">
          <input
            type="number"
            value={selectedNode.rotation || 0}
            onChange={(e) => updateField('rotation', Number(e.target.value))}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </PropertySection>

        {selectedNode.type === 'text' && (
          <PropertySection title="Text Content">
            <textarea
              value={selectedNode.textContent || ''}
              onChange={(e) => updateField('textContent', e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded resize-none"
              rows={3}
            />
          </PropertySection>
        )}
      </div>
    </div>
  );
}

function PropertySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}
