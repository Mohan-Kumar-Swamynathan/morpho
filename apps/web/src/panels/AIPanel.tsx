import { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

async function callAI(prompt: string, provider: string, apiKey: string): Promise<any> {
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } else if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || '';
  } else {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt, stream: false }),
    });
    const data = await response.json();
    return data.response || '';
  }
}

export default function AIPanel({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'ollama'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const canvas = useCanvasStore((s: any) => s.canvas);
  const setCanvas = useCanvasStore((s: any) => s.setCanvas);

  const generateUI = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const fullPrompt = `Generate a UI layout for the following description. Respond with a JSON object that includes:
- nodes: array of UI elements with type, name, x, y, width, height, fills, textContent (for text elements)
- Return ONLY valid JSON, no markdown formatting.

Description: ${prompt}`;

      const result = await callAI(fullPrompt, provider, apiKey);
      
      let parsed;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch {
        parsed = {
          nodes: [
            {
              type: 'frame',
              name: 'Generated Container',
              x: 100,
              y: 100,
              width: 400,
              height: 300,
              fills: [{ type: 'solid', color: '#f3f4f6', opacity: 1 }],
            },
            {
              type: 'text',
              name: 'Generated Text',
              x: 120,
              y: 120,
              width: 360,
              height: 40,
              textContent: prompt.slice(0, 50),
              textStyle: { fontFamily: 'Inter', fontSize: 24, fontWeight: 600, lineHeight: 1.2, letterSpacing: 0, alignment: 'center' },
              fills: [{ type: 'solid', color: '#1f2937', opacity: 1 }],
            },
          ],
        };
      }

      setCanvas({
        ...canvas,
        nodes: [...canvas.nodes, ...parsed.nodes.map((n: any) => ({ ...n, id: generateId() }))],
      });
      
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[400px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-500" />
          <span className="font-semibold text-sm">AI Generate</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full px-2 py-1.5 text-sm border rounded"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="ollama">Ollama (Local)</option>
          </select>
        </div>

        {provider !== 'ollama' && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
              className="w-full px-2 py-1.5 text-sm border rounded"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Describe your UI</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Create a login form with email and password fields..."
            className="w-full px-2 py-2 text-sm border rounded resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                generateUI();
              }
            }}
          />
        </div>

        {error && (
          <div className="text-xs text-red-500 p-2 bg-red-50 rounded">{error}</div>
        )}

        <button
          onClick={generateUI}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send size={16} />
              Generate with AI
            </>
          )}
        </button>

        <p className="text-xs text-gray-400">Press Cmd+Enter to generate</p>
      </div>
    </div>
  );
}