import Konva from 'konva';
import { CanvasNode, CanvasJSON } from '../canvas-json/src/index.js';
export interface CanvasConfig {
    container: HTMLElement;
    width: number;
    height: number;
    background?: string;
    onChange?: (canvas: MorphoCanvas) => void;
}
export declare class MorphoCanvas {
    stage: Konva.Stage;
    layer: Konva.Layer;
    selectionLayer: Konva.Layer;
    private nodes;
    private selectedIds;
    private config;
    private isDragging;
    private isPanning;
    constructor(config: CanvasConfig);
    private setupEventListeners;
    setBackground(color: string): void;
    clearSelection(): void;
    selectNode(id: string, addToSelection?: boolean): void;
    private drawSelectionBox;
    renderCanvasJSON(json: CanvasJSON): void;
    renderNode(node: CanvasNode, parent: Konva.Group | Konva.Layer): Konva.Node;
    private loadImage;
    zoomIn(): void;
    zoomOut(): void;
    zoomToFit(): void;
    private scaleStage;
    getCanvasJSON(): CanvasJSON;
    private nodeToCanvasNode;
    resize(width: number, height: number): void;
    destroy(): void;
}
export declare function createCanvas(container: HTMLElement, config?: Partial<CanvasConfig>): MorphoCanvas;
//# sourceMappingURL=index.d.ts.map