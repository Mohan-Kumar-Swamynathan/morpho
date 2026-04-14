export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export class ProviderError extends Error {
    provider;
    constructor(message, provider) {
        super(message);
        this.provider = provider;
        this.name = 'ProviderError';
    }
}
//# sourceMappingURL=types.js.map