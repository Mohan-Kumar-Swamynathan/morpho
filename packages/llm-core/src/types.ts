export interface LLMProvider {
  id: string;
  name: string;
  supportsVision: boolean;
  generateText(prompt: string, options?: LLMOptions): Promise<string>;
  generateJSON<T>(prompt: string, schema: ZodSchema<T>): Promise<T>;
  generateCanvasJSON(prompt: string): Promise<CanvasJSON>;
  analyzeImage(image: Base64Image, prompt: string): Promise<CanvasJSON>;
  streamText(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  model?: string;
}

export interface Base64Image {
  data: string;
  mimeType: string;
}

export interface CanvasJSON {
  version: string;
  meta: {
    name: string;
    width: number;
    height: number;
    background: string;
  };
  nodes: CanvasNode[];
  components: ComponentDefinition[];
  tokens: DesignTokens;
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  fills?: Fill[];
  strokes?: Stroke[];
  effects?: Effect[];
  children?: CanvasNode[];
  componentId?: string;
  variantProps?: Record<string, string>;
  autoLayout?: AutoLayout;
  constraints?: Constraints;
  textContent?: string;
  textStyle?: TextStyle;
  imageUrl?: string;
  cornerRadius?: number | CornerRadius;
}

export type NodeType =
  | 'frame' | 'group' | 'component' | 'instance'
  | 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'line' | 'vector'
  | 'text' | 'image' | 'boolean_operation';

export interface Fill {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradient?: Gradient;
  imageUrl?: string;
  opacity?: number;
}

export interface Gradient {
  type: 'linear' | 'radial';
  stops: { color: string; position: number }[];
  angle?: number;
}

export interface Stroke {
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  position: 'center' | 'inside' | 'outside';
}

export interface Effect {
  type: 'dropShadow' | 'innerShadow' | 'blur' | 'backgroundBlur';
  color?: string;
  offset?: { x: number; y: number };
  blur?: number;
  spread?: number;
}

export interface AutoLayout {
  direction: 'horizontal' | 'vertical';
  gap: number;
  padding: number;
  alignment: 'start' | 'center' | 'end' | 'spaceBetween';
  hugContent?: boolean;
  fillContainer?: boolean;
}

export interface Constraints {
  horizontal: 'left' | 'right' | 'center' | 'scale' | 'leftRight';
  vertical: 'top' | 'bottom' | 'center' | 'scale' | 'topBottom';
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  alignment: 'left' | 'center' | 'right';
}

export interface CornerRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  node: CanvasNode;
  variants?: ComponentVariant[];
}

export interface ComponentVariant {
  name: string;
  props: Record<string, string>;
}

export interface DesignTokens {
  colors: Record<string, ColorToken>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, SpacingToken>;
  radius: Record<string, RadiusToken>;
  shadows: Record<string, ShadowToken>;
  animations: Record<string, AnimationToken>;
}

export interface ColorToken {
  value: string;
  description?: string;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface SpacingToken {
  value: number;
}

export interface RadiusToken {
  value: number;
}

export interface ShadowToken {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}

export interface AnimationToken {
  duration: number;
  easing: string;
}

export interface ZodSchema<T> {
  parse: (data: unknown) => T;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProviderError extends Error {
  constructor(message: string, public provider: string) {
    super(message);
    this.name = 'ProviderError';
  }
}
