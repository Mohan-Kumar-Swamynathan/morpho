import { useState } from 'react';
import { X, Code, Copy, Check } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

function generateReactTailwind(canvas: any): string {
  const components: string[] = [];
  
  for (const node of canvas.nodes) {
    const style = {
      position: 'absolute' as const,
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.width}px`,
      height: `${node.height}px`,
      backgroundColor: node.fills?.[0]?.color || 'transparent',
      borderRadius: node.cornerRadius ? `${node.cornerRadius}px` : undefined,
    };
    
    const styleStr = Object.entries(style).map(([k, v]) => {
      const camelKey = k.replace(/-([a-z])/g, (_: any, c: string) => c.toUpperCase());
      return `${camelKey}: '${v}'`;
    }).join(', ');

    if (node.type === 'text') {
      components.push(`<div style={{ ${styleStr}, fontSize: '${node.textStyle?.fontSize || 16}px', fontFamily: '${node.textStyle?.fontFamily || 'Inter'}' }}>${node.textContent || 'Text'}</div>`);
    } else {
      components.push(`<div style={{ ${styleStr} }} />`);
    }
  }

  const name = (canvas.meta.name || 'Canvas').replace(/[^a-zA-Z0-9]/g, '') || 'Canvas';
  
  return `import React from 'react';

export default function ${name}() {
  return (
    <div style={{ position: 'relative', width: '${canvas.meta.width}px', height: '${canvas.meta.height}px', background: '${canvas.meta.background}' }}>
      ${components.map(c => '      ' + c).join('\n')}
    </div>
  );
}`;
}

function generateHTMLCSS(canvas: any): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${canvas.meta.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .canvas { position: relative; width: ${canvas.meta.width}px; height: ${canvas.meta.height}px; background: ${canvas.meta.background}; }
  </style>
</head>
<body>
  <div class="canvas">`;

  for (const node of canvas.nodes) {
    const style = `position:absolute;left:${node.x}px;top:${node.y}px;width:${node.width}px;height:${node.height}px;background:${node.fills?.[0]?.color || 'transparent'}`;
    html += `\n    <div style="${style}"></div>`;
  }

  html += `
  </div>
</body>
</html>`;
  return html;
}

export default function ExportPanel({ onClose }: { onClose: () => void }) {
  const canvas = useCanvasStore((s: any) => s.canvas);
  const [format, setFormat] = useState<'react' | 'html'>('react');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    if (format === 'react') return generateReactTailwind(canvas);
    return generateHTMLCSS(canvas);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const code = getCode();
    const extensions: Record<string, string> = { react: 'tsx', html: 'html' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morpho-export.${extensions[format]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-blue-500" />
            <span className="font-semibold text-sm">Export Code</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'react', label: 'React + Tailwind' },
            { id: 'html', label: 'HTML + CSS' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                format === f.id
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto font-mono">
            <code>{getCode()}</code>
          </pre>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadCode}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}