import { Sparkles, Code, Download, Settings, Github, Menu } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface HeaderProps {
  onToggleAI: () => void;
  onToggleExport: () => void;
}

export default function Header({ onToggleAI, onToggleExport }: HeaderProps) {
  const canvas = useCanvasStore((s) => s.canvas);
  const setCanvas = useCanvasStore((s) => s.setCanvas);

  const saveToFile = () => {
    const json = JSON.stringify(canvas, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${canvas.meta.name || 'morpho-design'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        setCanvas(parsed);
      } catch {
        alert('Invalid JSON file');
      }
    };
    input.click();
  };

  return (
    <header className="h-12 bg-white border-b border-canvas-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-semibold text-lg">Morpho</span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <input
          type="text"
          value={canvas.meta.name}
          onChange={(e) => setCanvas({ ...canvas, meta: { ...canvas.meta, name: e.target.value } })}
          className="text-sm font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Untitled"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAI}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Sparkles size={16} />
          AI Generate
        </button>

        <button
          onClick={onToggleExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Code size={16} />
          Export
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <button
          onClick={saveToFile}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Save"
        >
          <Download size={16} />
        </button>

        <button
          onClick={loadFromFile}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Open"
        >
          <Menu size={16} />
        </button>

        <a
          href="https://github.com/morpho-design/morpho"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="GitHub"
        >
          <Github size={16} />
        </a>
      </div>
    </header>
  );
}
