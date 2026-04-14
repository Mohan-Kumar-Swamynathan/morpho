import type { LLMProvider, LLMOptions, Base64Image, CanvasJSON } from '../types.js';

export interface OllamaConfig {
  baseURL?: string;
  model?: string;
}

export class OllamaProvider implements LLMProvider {
  readonly id = 'ollama';
  readonly name = 'Ollama';
  readonly supportsVision = false;
  private baseURL: string;
  private model: string;

  constructor(config: OllamaConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:11434';
    this.model = config.model || 'llama3';
    this.supportsVision = this.model.includes('llava') || this.model.includes('vision');
  }

  async generateText(prompt: string, options?: LLMOptions): Promise<string> {
    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model || this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json() as { response: string };
    return data.response;
  }

  async generateJSON<T>(prompt: string, schema: { parse: (data: unknown) => T }): Promise<T> {
    const text = await this.generateText(prompt, {
      systemPrompt: `You must respond with valid JSON only. No markdown formatting.`,
    });

    try {
      const parsed = JSON.parse(text);
      return schema.parse(parsed);
    } catch {
      throw new Error('Failed to parse JSON from LLM response');
    }
  }

  async generateCanvasJSON(prompt: string): Promise<CanvasJSON> {
    const canvasSchema = {
      parse: (data: unknown) => data as CanvasJSON,
    };
    return this.generateJSON(prompt, canvasSchema);
  }

  async analyzeImage(image: Base64Image, prompt: string): Promise<CanvasJSON> {
    if (!this.supportsVision) {
      throw new Error(`Model ${this.model} does not support vision`);
    }

    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        images: [image.data],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json() as { response: string };
    const text = data.response;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as CanvasJSON;
      }
      throw new Error('No JSON found in response');
    } catch {
      throw new Error('Failed to parse CanvasJSON from vision model response');
    }
  }

  async streamText(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split('\n').filter(l => l.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          onChunk(json.response || '');
        } catch {}
      }
    }
  }
}
