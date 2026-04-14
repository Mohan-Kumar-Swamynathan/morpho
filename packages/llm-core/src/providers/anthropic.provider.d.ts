import type { LLMProvider, LLMOptions } from '../types.js';
export interface AnthropicConfig {
    apiKey: string;
    model?: string;
}
export declare class AnthropicProvider implements LLMProvider {
    readonly id = "anthropic";
    readonly name = "Anthropic";
    readonly supportsVision = true;
    private apiKey;
    private model;
    constructor(config: AnthropicConfig);
    generateText(prompt: string, options?: LLMOptions): Promise<string>;
    generateJSON<T>(prompt: string, schema: {
        parse: (data: unknown) => T;
    }): Promise<T>;
    generateCanvasJSON(prompt: string): Promise<import('../types.js').CanvasJSON>;
    analyzeImage(image: import('../types.js').Base64Image, prompt: string): Promise<import('../types.js').CanvasJSON>;
    streamText(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}
//# sourceMappingURL=anthropic.provider.d.ts.map