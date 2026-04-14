import type { LLMProvider } from '../types.js';
export interface ProviderConfig {
    provider: string;
    apiKey?: string;
    model?: string;
    baseURL?: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class LLMRegistry {
    private providers;
    private activeProvider;
    private fallbackChain;
    private config;
    register(id: string, provider: LLMProvider): void;
    setActive(id: string, config?: Partial<ProviderConfig>): void;
    getActive(): LLMProvider;
    setFallbackChain(providers: string[]): void;
    generateWithFallback(prompt: string, options?: Parameters<LLMProvider['generateText']>[1]): Promise<string>;
    getProvider(id: string): LLMProvider | undefined;
    listProviders(): string[];
    getConfig(providerId: string): ProviderConfig | undefined;
}
export declare const globalRegistry: LLMRegistry;
//# sourceMappingURL=registry.d.ts.map