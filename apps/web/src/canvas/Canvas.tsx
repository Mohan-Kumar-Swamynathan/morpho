import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Rect, Ellipse, Text, Group, Transformer } from 'react-konva';
import { useCanvasStore } from '../store/canvasStore';

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

interface CanvasNode {
  id: string;
  type: 'frame' | 'group' | 'rectangle' | 'ellipse' | 'text' | 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  fills?: { type: string; color?: string; opacity?: number }[];
  strokes?: { color: string; width: number; style: string; position: string }[];
  cornerRadius?: number;
  textContent?: string;
  textStyle?: { fontFamily: string; fontSize: number; fontWeight: number; lineHeight: number; letterSpacing: number; alignment: string };
  children?: CanvasNode[];
}

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  
  const canvas = useCanvasStore((s: any) => s.canvas);
  const selectedIds = useCanvasStore((s: any) => s.selectedIds);
  const tool = useCanvasStore((s: any) => s.tool);
  const zoom = useCanvasStore((s: any) => s.zoom);
  const setSelectedIds = useCanvasStore((s: any) => s.setSelectedIds);
  const setZoom = useCanvasStore((s: any) => s.setZoom);
  const setIsPanning = useCanvasStore((s: any) => s.setIsPanning);
  const addNode = useCanvasStore((s: any) => s.addNode);
  const updateNode = useCanvasStore((s: any) => s.updateNode);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const stage = stageRef.current.getStage();
      const selectedNodes = selectedIds
        .map((id: string) => stage.findOne(`[data-id="${id}"]`))
        .filter(Boolean);
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setZoom(newScale);
  }, [setZoom]);

  const handleStageClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
    }
  }, [setSelectedIds]);

  const handleStageDragEnd = useCallback((e: any) => {
    const stage = e.target.getStage();
    if (stage) {
      setIsPanning(false);
    }
  }, [setIsPanning]);

  const handleStageMouseDown = useCallback((e: any) => {
    if (tool === 'hand') {
      setIsPanning(true);
    } else if (tool !== 'select') {
      const stage = stageRef.current.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scale = stage.scaleX();
      const x = (pointer.x - stage.x()) / scale;
      const y = (pointer.y - stage.y()) / scale;

      if (tool === 'rectangle') {
        addNode({
          type: 'rectangle',
          name: `Rectangle ${canvas.nodes.length + 1}`,
          x,
          y,
          width: 100,
          height: 100,
          fills: [{ type: 'solid', color: '#3b82f6', opacity: 1 }],
        });
      } else if (tool === 'ellipse') {
        addNode({
          type: 'ellipse',
          name: `Ellipse ${canvas.nodes.length + 1}`,
          x,
          y,
          width: 100,
          height: 100,
          fills: [{ type: 'solid', color: '#3b82f6', opacity: 1 }],
        });
      } else if (tool === 'text') {
        addNode({
          type: 'text',
          name: `Text ${canvas.nodes.length + 1}`,
          x,
          y,
          width: 200,
          height: 40,
          textContent: 'Text',
          textStyle: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0, alignment: 'left' },
          fills: [{ type: 'solid', color: '#1f2937', opacity: 1 }],
        });
      } else if (tool === 'frame') {
        addNode({
          type: 'frame',
          name: `Frame ${canvas.nodes.length + 1}`,
          x,
          y,
          width: 400,
          height: 300,
          fills: [{ type: 'solid', color: '#ffffff', opacity: 1 }],
          strokes: [{ color: '#e5e7eb', width: 1, style: 'solid', position: 'center' }],
        });
      }
    }
  }, [tool, canvas.nodes.length, addNode, setIsPanning]);

  const handleTransformEnd = useCallback((e: any) => {
    const node = e.target;
    const id = node.attrs['data-id'];
    if (!id) return;

    updateNode(id, {
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
      rotation: node.rotation(),
    });

    node.scaleX(1);
    node.scaleY(1);
  }, [updateNode]);

  const handleDragEnd = useCallback((e: any, id: string) => {
    updateNode(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [updateNode]);

  return (
    <div ref={containerRef} className="w-full h-full bg-white overflow-hidden">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        draggable={tool === 'hand'}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onDragEnd={handleStageDragEnd}
        style={{ cursor: tool === 'hand' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer>
          <Rect
            x={-50000}
            y={-50000}
            width={100000}
            height={100000}
            fill={canvas.meta.background || '#ffffff'}
            listening={false}
          />
          
          {canvas.nodes.map((node: CanvasNode) => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedIds.includes(node.id)}
              onSelect={() => setSelectedIds([node.id])}
              onDragEnd={(e: any) => handleDragEnd(e, node.id)}
              onTransformEnd={handleTransformEnd}
            />
          ))}
          
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox: any, newBox: any) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}

interface CanvasNodeComponentProps {
  node: CanvasNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
}

function CanvasNodeComponent({ node, isSelected, onSelect, onDragEnd, onTransformEnd }: CanvasNodeComponentProps) {
  const tool = useCanvasStore((s: any) => s.tool);

  const commonProps: any = {
    x: node.x,
    y: node.y,
    draggable: tool === 'select',
    onClick: onSelect,
    onDragEnd: onDragEnd,
    onTransformEnd: onTransformEnd,
    'data-id': node.id,
  };

  switch (node.type) {
    case 'rectangle':
    case 'frame':
      return (
        <Rect
          {...commonProps}
          width={node.width}
          height={node.height}
          fill={node.fills?.[0]?.color || 'transparent'}
          stroke={node.strokes?.[0]?.color}
          strokeWidth={node.strokes?.[0]?.width}
          cornerRadius={typeof node.cornerRadius === 'number' ? node.cornerRadius : 0}
          opacity={node.opacity}
          rotation={node.rotation}
          name={node.name}
        />
      );

    case 'ellipse':
      return (
        <Ellipse
          {...commonProps}
          x={node.x + node.width / 2}
          y={node.y + node.height / 2}
          radiusX={node.width / 2}
          radiusY={node.height / 2}
          fill={node.fills?.[0]?.color || 'transparent'}
          stroke={node.strokes?.[0]?.color}
          strokeWidth={node.strokes?.[0]?.width}
          opacity={node.opacity}
          rotation={node.rotation}
          name={node.name}
        />
      );

    case 'text':
      return (
        <Text
          {...commonProps}
          text={node.textContent || 'Text'}
          fontSize={node.textStyle?.fontSize || 16}
          fontFamily={node.textStyle?.fontFamily || 'Inter'}
          fill={node.fills?.[0]?.color || '#000000'}
          width={node.width}
          opacity={node.opacity}
          rotation={node.rotation}
          name={node.name}
        />
      );

    case 'group':
      return (
        <Group
          {...commonProps}
          opacity={node.opacity}
          rotation={node.rotation}
          name={node.name}
        >
          {node.children?.map((child: CanvasNode) => (
            <CanvasNodeComponent
              key={child.id}
              node={child}
              isSelected={false}
              onSelect={() => {}}
              onDragEnd={() => {}}
              onTransformEnd={() => {}}
            />
          ))}
        </Group>
      );

    default:
      return (
        <Rect
          {...commonProps}
          width={node.width}
          height={node.height}
          fill="#cccccc"
          name={node.name}
        />
      );
  }
}