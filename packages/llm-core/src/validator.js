export class OutputValidator {
    maxRetries = 3;
    async validateWithRetry(prompt, generateFn, schema, onRetry) {
        let lastError = '';
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const text = await generateFn(prompt);
                const parsed = JSON.parse(text);
                const data = schema.parse(parsed);
                return { success: true, data };
            }
            catch (error) {
                lastError = error instanceof Error ? error.message : 'Unknown error';
                console.warn(`Validation attempt ${attempt}/${this.maxRetries} failed: ${lastError}`);
                if (attempt < this.maxRetries && onRetry) {
                    const retryPrompt = await onRetry(attempt, lastError);
                    if (!retryPrompt)
                        break;
                }
            }
        }
        return { success: false, error: `Failed after ${this.maxRetries} attempts: ${lastError}` };
    }
    extractJSON(text) {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? match[0] : null;
    }
    validateCanvasNode(node) {
        if (typeof node !== 'object' || node === null)
            return false;
        const n = node;
        return (typeof n.id === 'string' &&
            typeof n.type === 'string' &&
            typeof n.name === 'string' &&
            typeof n.x === 'number' &&
            typeof n.y === 'number' &&
            typeof n.width === 'number' &&
            typeof n.height === 'number');
    }
    validateCanvasJSON(data) {
        if (typeof data !== 'object' || data === null)
            return false;
        const d = data;
        return (typeof d.version === 'string' &&
            typeof d.meta === 'object' &&
            Array.isArray(d.nodes));
    }
}
export const outputValidator = new OutputValidator();
//# sourceMappingURL=validator.js.map