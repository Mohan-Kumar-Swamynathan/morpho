import type { LLMProvider, LLMOptions, Base64Image, CanvasJSON } from '../types.js';
export interface OpenAIConfig {
    apiKey: string;
    baseURL?: string;
    model?: string;
}
export declare class OpenAIProvider implements LLMProvider {
    readonly id = "openai";
    readonly name = "OpenAI";
    readonly supportsVision = true;
    private apiKey;
    private baseURL;
    private model;
    constructor(config: OpenAIConfig);
    generateText(prompt: string, options?: LLMOptions): Promise<string>;
    generateJSON<T>(prompt: string, schema: {
        parse: (data: unknown) => T;
    }): Promise<T>;
    generateCanvasJSON(prompt: string): Promise<CanvasJSON>;
    analyzeImage(image: Base64Image, prompt: string): Promise<CanvasJSON>;
    streamText(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}
//# sourceMappingURL=openai.provider.d.ts.map