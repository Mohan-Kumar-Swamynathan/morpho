import Konva from 'konva';
import { CanvasNode, CanvasJSON, createDefaultCanvas, generateId, Fill, Stroke, Effect, TextStyle, CornerRadius, AutoLayout } from '../canvas-json/src/index.js';

export interface CanvasConfig {
  container: HTMLElement;
  width: number;
  height: number;
  background?: string;
  onChange?: (canvas: MorphoCanvas) => void;
}

export class MorphoCanvas {
  stage: Konva.Stage;
  layer: Konva.Layer;
  selectionLayer: Konva.Layer;
  private nodes: Map<string, Konva.Node> = new Map();
  private selectedIds: Set<string> = new Set();
  private config: CanvasConfig;
  private isDragging = false;
  private isPanning = false;

  constructor(config: CanvasConfig) {
    this.config = config;
    
    this.stage = new Konva.Stage({
      container: config.container,
      width: config.width,
      height: config.height,
    });

    this.layer = new Konva.Layer();
    this.selectionLayer = new Konva.Layer();
    this.stage.add(this.layer);
    this.stage.add(this.selectionLayer);

    if (config.background) {
      this.setBackground(config.background);
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.stage.on('click', (e) => {
      if (e.target === this.stage) {
        this.clearSelection();
      }
    });

    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const oldScale = this.stage.scaleX();
      const pointer = this.stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.max(0.1, Math.min(6.4, newScale));

      this.stage.scale({ x: clampedScale, y: clampedScale });
      
      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };
      this.stage.position(newPos);
      this.stage.batchDraw();
    });
  }

  setBackground(color: string): void {
    const bg = new Konva.Rect({
      x: -100000,
      y: -100000,
      width: 200000,
      height: 200000,
      fill: color,
      listening: false,
    });
    this.layer.add(bg);
    bg.moveToBottom();
    this.layer.batchDraw();
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.selectionLayer.destroyChildren();
    this.selectionLayer.batchDraw();
  }

  selectNode(id: string, addToSelection = false): void {
    if (!addToSelection) {
      this.selectedIds.clear();
      this.selectionLayer.destroyChildren();
    }
    this.selectedIds.add(id);
    this.drawSelectionBox(id);
  }

  private drawSelectionBox(id: string): void {
    const node = this.nodes.get(id);
    if (!node) return;

    const box = node.getClientRect();
    const selection = new Konva.Rect({
      x: box.x - 4,
      y: box.y - 4,
      width: box.width + 8,
      height: box.height + 8,
      stroke: '#3b82f6',
      strokeWidth: 2,
      dash: [4, 4],
    });
    this.selectionLayer.add(selection);
    this.selectionLayer.batchDraw();
  }

  renderCanvasJSON(json: CanvasJSON): void {
    this.layer.destroyChildren();
    this.nodes.clear();
    
    if (json.meta.background) {
      this.setBackground(json.meta.background);
    }

    for (const node of json.nodes) {
      this.renderNode(node, this.layer);
    }

    this.layer.batchDraw();
    this.config.onChange?.(this);
  }

  renderNode(node: CanvasNode, parent: Konva.Group | Konva.Layer): Konva.Node {
    let konvaNode: Konva.Node;

    switch (node.type) {
      case 'frame':
      case 'rectangle':
        konvaNode = new Konva.Rect({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          fill: node.fills?.[0]?.color || 'transparent',
          stroke: node.strokes?.[0]?.color,
          strokeWidth: node.strokes?.[0]?.width,
          cornerRadius: typeof node.cornerRadius === 'number' ? node.cornerRadius : 0,
          opacity: node.opacity,
          rotation: node.rotation,
          draggable: !node.locked,
        });
        break;

      case 'ellipse':
        konvaNode = new Konva.Ellipse({
          x: node.x + node.width / 2,
          y: node.y + node.height / 2,
          radiusX: node.width / 2,
          radiusY: node.height / 2,
          fill: node.fills?.[0]?.color || 'transparent',
          stroke: node.strokes?.[0]?.color,
          strokeWidth: node.strokes?.[0]?.width,
          opacity: node.opacity,
          rotation: node.rotation,
          draggable: !node.locked,
        });
        break;

      case 'text':
        konvaNode = new Konva.Text({
          x: node.x,
          y: node.y,
          text: node.textContent || '',
          fontSize: node.textStyle?.fontSize || 16,
          fontFamily: node.textStyle?.fontFamily || 'Inter',
          fontStyle: node.textStyle?.fontWeight ? `bold ${node.textStyle.fontWeight}` : undefined,
          fill: node.fills?.[0]?.color || '#000000',
          width: node.width,
          opacity: node.opacity,
          rotation: node.rotation,
          draggable: !node.locked,
        });
        break;

      case 'image':
        konvaNode = new Konva.Image({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          image: new Image(),
          opacity: node.opacity,
          rotation: node.rotation,
          draggable: !node.locked,
        });
        if (node.imageUrl) {
          this.loadImage(node.imageUrl, konvaNode as Konva.Image);
        }
        break;

      case 'group':
        konvaNode = new Konva.Group({
          x: node.x,
          y: node.y,
          opacity: node.opacity,
          rotation: node.rotation,
          draggable: !node.locked,
        });
        if (node.children) {
          for (const child of node.children) {
            this.renderNode(child, konvaNode as Konva.Group);
          }
        }
        break;

      default:
        konvaNode = new Konva.Rect({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          fill: '#cccccc',
          draggable: !node.locked,
        });
    }

    konvaNode.setAttr('morphoId', node.id);
    
    konvaNode.on('click', () => {
      this.selectNode(node.id);
      this.config.onChange?.(this);
    });

    konvaNode.on('dragend', () => {
      node.x = konvaNode.x();
      node.y = konvaNode.y();
      this.config.onChange?.(this);
    });

    this.nodes.set(node.id, konvaNode);
    parent.add(konvaNode);

    return konvaNode;
  }

  private loadImage(url: string, imageNode: Konva.Image): void {
    const img = new Image();
    img.onload = () => {
      imageNode.image(img);
      this.layer.batchDraw();
    };
    img.src = url;
  }

  zoomIn(): void {
    this.scaleStage(this.stage.scaleX() * 1.2);
  }

  zoomOut(): void {
    this.scaleStage(this.stage.scaleX() / 1.2);
  }

  zoomToFit(): void {
    const nodes = this.layer.getChildren();
    if (nodes.length === 0) return;

    const box = nodes[0].getClientRect();
    for (let i = 1; i < nodes.length; i++) {
      const b = nodes[i].getClientRect();
      box.x = Math.min(box.x, b.x);
      box.y = Math.min(box.y, b.y);
      box.width = Math.max(box.x + box.width, b.x + b.width) - box.x;
      box.height = Math.max(box.y + box.height, b.y + b.height) - box.y;
    }

    const scaleX = this.stage.width() / box.width;
    const scaleY = this.stage.height() / box.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;
    const clampedScale = Math.max(0.1, Math.min(6.4, scale));

    this.stage.scale({ x: clampedScale, y: clampedScale });
    this.stage.position({
      x: (this.stage.width() - box.width * clampedScale) / 2 - box.x * clampedScale,
      y: (this.stage.height() - box.height * clampedScale) / 2 - box.y * clampedScale,
    });
    this.stage.batchDraw();
  }

  private scaleStage(scale: number): void {
    const clampedScale = Math.max(0.1, Math.min(6.4, scale));
    this.stage.scale({ x: clampedScale, y: clampedScale });
    this.stage.batchDraw();
  }

  getCanvasJSON(): CanvasJSON {
    const nodes: CanvasNode[] = [];
    
    for (const [id, konvaNode] of this.nodes) {
      const node = this.nodeToCanvasNode(id, konvaNode);
      if (node) nodes.push(node);
    }

    return {
      version: '1.0.0',
      meta: {
        name: 'Untitled',
        width: this.stage.width(),
        height: this.stage.height(),
        background: '#ffffff',
      },
      nodes,
    };
  }

  private nodeToCanvasNode(id: string, node: Konva.Node): CanvasNode | null {
    const type = node.className.toLowerCase();
    
    return {
      id,
      type: type as CanvasNode['type'],
      name: `Layer ${id}`,
      x: node.x(),
      y: node.y(),
      width: node.width() || 100,
      height: node.height() || 100,
      opacity: node.opacity(),
      rotation: node.rotation(),
    };
  }

  resize(width: number, height: number): void {
    this.stage.width(width);
    this.stage.height(height);
    this.stage.batchDraw();
  }

  destroy(): void {
    this.stage.destroy();
  }
}

export function createCanvas(container: HTMLElement, config?: Partial<CanvasConfig>): MorphoCanvas {
  return new MorphoCanvas({
    container,
    width: config?.width || window.innerWidth,
    height: config?.height || window.innerHeight,
    background: config?.background || '#ffffff',
    onChange: config?.onChange,
  });
}
