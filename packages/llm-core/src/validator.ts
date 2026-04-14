import type { ZodSchema, CanvasJSON, CanvasNode } from './types.js';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class OutputValidator {
  private maxRetries = 3;

  async validateWithRetry<T>(
    prompt: string,
    generateFn: (prompt: string) => Promise<string>,
    schema: ZodSchema<T>,
    onRetry?: (attempt: number, error: string) => Promise<string>
  ): Promise<ValidationResult<T>> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const text = await generateFn(prompt);
        const parsed = JSON.parse(text);
        const data = schema.parse(parsed);
        return { success: true, data };
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Validation attempt ${attempt}/${this.maxRetries} failed: ${lastError}`);

        if (attempt < this.maxRetries && onRetry) {
          const retryPrompt = await onRetry(attempt, lastError);
          if (!retryPrompt) break;
        }
      }
    }

    return { success: false, error: `Failed after ${this.maxRetries} attempts: ${lastError}` };
  }

  extractJSON(text: string): string | null {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
  }

  validateCanvasNode(node: unknown): node is CanvasNode {
    if (typeof node !== 'object' || node === null) return false;
    const n = node as CanvasNode;
    return (
      typeof n.id === 'string' &&
      typeof n.type === 'string' &&
      typeof n.name === 'string' &&
      typeof n.x === 'number' &&
      typeof n.y === 'number' &&
      typeof n.width === 'number' &&
      typeof n.height === 'number'
    );
  }

  validateCanvasJSON(data: unknown): data is CanvasJSON {
    if (typeof data !== 'object' || data === null) return false;
    const d = data as CanvasJSON;
    return (
      typeof d.version === 'string' &&
      typeof d.meta === 'object' &&
      Array.isArray(d.nodes)
    );
  }
}

export const outputValidator = new OutputValidator();
