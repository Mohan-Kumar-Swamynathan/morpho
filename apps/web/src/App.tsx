import { useState } from 'react';
import { useCanvasStore } from './store/canvasStore';
import Canvas from './canvas/Canvas';
import Toolbar from './panels/Toolbar';
import LayersPanel from './panels/LayersPanel';
import PropertiesPanel from './panels/PropertiesPanel';
import AIPanel from './panels/AIPanel';
import ExportPanel from './panels/ExportPanel';
import Header from './components/Header';

export default function App() {
  const [showAI, setShowAI] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const canvas = useCanvasStore((s) => s.canvas);
  const selectedIds = useCanvasStore((s) => s.selectedIds);

  return (
    <div className="flex flex-col h-screen bg-canvas-bg">
      <Header onToggleAI={() => setShowAI(!showAI)} onToggleExport={() => setShowExport(!showExport)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Canvas />
          </div>
        </div>
        
        <LayersPanel />
        <PropertiesPanel />
      </div>
      
      {showAI && (
        <AIPanel onClose={() => setShowAI(false)} />
      )}
      
      {showExport && (
        <ExportPanel onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
