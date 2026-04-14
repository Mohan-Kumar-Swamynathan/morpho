import Konva from 'konva';
export class MorphoCanvas {
    stage;
    layer;
    selectionLayer;
    nodes = new Map();
    selectedIds = new Set();
    config;
    isDragging = false;
    isPanning = false;
    constructor(config) {
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
    setupEventListeners() {
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
            if (!pointer)
                return;
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
    setBackground(color) {
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
    clearSelection() {
        this.selectedIds.clear();
        this.selectionLayer.destroyChildren();
        this.selectionLayer.batchDraw();
    }
    selectNode(id, addToSelection = false) {
        if (!addToSelection) {
            this.selectedIds.clear();
            this.selectionLayer.destroyChildren();
        }
        this.selectedIds.add(id);
        this.drawSelectionBox(id);
    }
    drawSelectionBox(id) {
        const node = this.nodes.get(id);
        if (!node)
            return;
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
    renderCanvasJSON(json) {
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
    renderNode(node, parent) {
        let konvaNode;
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
                    this.loadImage(node.imageUrl, konvaNode);
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
                        this.renderNode(child, konvaNode);
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
    loadImage(url, imageNode) {
        const img = new Image();
        img.onload = () => {
            imageNode.image(img);
            this.layer.batchDraw();
        };
        img.src = url;
    }
    zoomIn() {
        this.scaleStage(this.stage.scaleX() * 1.2);
    }
    zoomOut() {
        this.scaleStage(this.stage.scaleX() / 1.2);
    }
    zoomToFit() {
        const nodes = this.layer.getChildren();
        if (nodes.length === 0)
            return;
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
    scaleStage(scale) {
        const clampedScale = Math.max(0.1, Math.min(6.4, scale));
        this.stage.scale({ x: clampedScale, y: clampedScale });
        this.stage.batchDraw();
    }
    getCanvasJSON() {
        const nodes = [];
        for (const [id, konvaNode] of this.nodes) {
            const node = this.nodeToCanvasNode(id, konvaNode);
            if (node)
                nodes.push(node);
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
    nodeToCanvasNode(id, node) {
        const type = node.className.toLowerCase();
        return {
            id,
            type: type,
            name: `Layer ${id}`,
            x: node.x(),
            y: node.y(),
            width: node.width() || 100,
            height: node.height() || 100,
            opacity: node.opacity(),
            rotation: node.rotation(),
        };
    }
    resize(width, height) {
        this.stage.width(width);
        this.stage.height(height);
        this.stage.batchDraw();
    }
    destroy() {
        this.stage.destroy();
    }
}
export function createCanvas(container, config) {
    return new MorphoCanvas({
        container,
        width: config?.width || window.innerWidth,
        height: config?.height || window.innerHeight,
        background: config?.background || '#ffffff',
        onChange: config?.onChange,
    });
}
//# sourceMappingURL=index.js.map