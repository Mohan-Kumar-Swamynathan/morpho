import type { ZodSchema, CanvasJSON, CanvasNode } from './types.js';
export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export declare class OutputValidator {
    private maxRetries;
    validateWithRetry<T>(prompt: string, generateFn: (prompt: string) => Promise<string>, schema: ZodSchema<T>, onRetry?: (attempt: number, error: string) => Promise<string>): Promise<ValidationResult<T>>;
    extractJSON(text: string): string | null;
    validateCanvasNode(node: unknown): node is CanvasNode;
    validateCanvasJSON(data: unknown): data is CanvasJSON;
}
export declare const outputValidator: OutputValidator;
//# sourceMappingURL=validator.d.ts.map