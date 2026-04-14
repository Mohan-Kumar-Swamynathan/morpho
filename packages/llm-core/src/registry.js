export class LLMRegistry {
    providers = new Map();
    activeProvider = 'openai';
    fallbackChain = [];
    config = new Map();
    register(id, provider) {
        this.providers.set(id, provider);
    }
    setActive(id, config) {
        if (!this.providers.has(id)) {
            throw new Error(`Provider ${id} not registered`);
        }
        this.activeProvider = id;
        if (config) {
            this.config.set(id, { provider: id, ...config });
        }
    }
    getActive() {
        const provider = this.providers.get(this.activeProvider);
        if (!provider) {
            throw new Error(`Active provider ${this.activeProvider} not found`);
        }
        return provider;
    }
    setFallbackChain(providers) {
        this.fallbackChain = providers;
    }
    async generateWithFallback(prompt, options) {
        const tried = [];
        for (const id of this.fallbackChain) {
            const provider = this.providers.get(id);
            if (!provider)
                continue;
            try {
                return await provider.generateText(prompt, options);
            }
            catch (error) {
                tried.push(id);
                console.warn(`Provider ${id} failed, trying next in fallback chain`);
            }
        }
        throw new Error(`All fallback providers failed. Tried: ${tried.join(', ')}`);
    }
    getProvider(id) {
        return this.providers.get(id);
    }
    listProviders() {
        return Array.from(this.providers.keys());
    }
    getConfig(providerId) {
        return this.config.get(providerId);
    }
}
export const globalRegistry = new LLMRegistry();
//# sourceMappingURL=registry.js.map