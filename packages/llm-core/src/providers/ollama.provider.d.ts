import type { LLMProvider, LLMOptions, Base64Image, CanvasJSON } from '../types.js';
export interface OllamaConfig {
    baseURL?: string;
    model?: string;
}
export declare class OllamaProvider implements LLMProvider {
    readonly id = "ollama";
    readonly name = "Ollama";
    readonly supportsVision = false;
    private baseURL;
    private model;
    constructor(config?: OllamaConfig);
    generateText(prompt: string, options?: LLMOptions): Promise<string>;
    generateJSON<T>(prompt: string, schema: {
        parse: (data: unknown) => T;
    }): Promise<T>;
    generateCanvasJSON(prompt: string): Promise<CanvasJSON>;
    analyzeImage(image: Base64Image, prompt: string): Promise<CanvasJSON>;
    streamText(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}
//# sourceMappingURL=ollama.provider.d.ts.map