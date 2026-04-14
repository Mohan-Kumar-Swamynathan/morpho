import type { CanvasJSON } from '../canvas-json/src/index.js';
export interface CodeGenOptions {
    indent?: number;
    includeCSS?: boolean;
    useTypeScript?: boolean;
}
export declare function generateReactTailwind(canvas: CanvasJSON, options?: CodeGenOptions): string;
export declare function generateHTMLCSS(canvas: CanvasJSON, options?: CodeGenOptions): string;
export declare function generateCSSVariables(canvas: CanvasJSON): string;
export declare function generateTailwindConfig(canvas: CanvasJSON): string;
//# sourceMappingURL=index.d.ts.map