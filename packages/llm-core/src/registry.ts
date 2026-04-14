import type { LLMProvider } from './types.js';

export interface ProviderConfig {
  provider: string;
  apiKey?: string;
  model?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export class LLMRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private activeProvider: string = 'openai';
  private fallbackChain: string[] = [];
  private config: Map<string, ProviderConfig> = new Map();

  register(id: string, provider: LLMProvider): void {
    this.providers.set(id, provider);
  }

  setActive(id: string, config?: Partial<ProviderConfig>): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider ${id} not registered`);
    }
    this.activeProvider = id;
    if (config) {
      this.config.set(id, { provider: id, ...config });
    }
  }

  getActive(): LLMProvider {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Active provider ${this.activeProvider} not found`);
    }
    return provider;
  }

  setFallbackChain(providers: string[]): void {
    this.fallbackChain = providers;
  }

  async generateWithFallback(prompt: string, options?: Parameters<LLMProvider['generateText']>[1]): Promise<string> {
    const tried: string[] = [];

    for (const id of this.fallbackChain) {
      const provider = this.providers.get(id);
      if (!provider) continue;

      try {
        return await provider.generateText(prompt, options);
      } catch (error) {
        tried.push(id);
        console.warn(`Provider ${id} failed, trying next in fallback chain`);
      }
    }

    throw new Error(`All fallback providers failed. Tried: ${tried.join(', ')}`);
  }

  getProvider(id: string): LLMProvider | undefined {
    return this.providers.get(id);
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getConfig(providerId: string): ProviderConfig | undefined {
    return this.config.get(providerId);
  }
}

export const globalRegistry = new LLMRegistry();
