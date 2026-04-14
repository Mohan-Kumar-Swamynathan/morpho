import { z } from 'zod';
export const FillSchema = z.object({
    type: z.enum(['solid', 'gradient', 'image']).default('solid'),
    color: z.string().optional(),
    gradient: z.object({
        type: z.enum(['linear', 'radial']),
        stops: z.array(z.object({ color: z.string(), position: z.number() })),
        angle: z.number().optional(),
    }).optional(),
    imageUrl: z.string().optional(),
    opacity: z.number().optional().default(1),
});
export const StrokeSchema = z.object({
    color: z.string(),
    width: z.number(),
    style: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
    position: z.enum(['center', 'inside', 'outside']).default('center'),
});
export const EffectSchema = z.object({
    type: z.enum(['dropShadow', 'innerShadow', 'blur', 'backgroundBlur']),
    color: z.string().optional(),
    offset: z.object({ x: z.number(), y: z.number() }).optional(),
    blur: z.number().optional(),
    spread: z.number().optional(),
});
export const AutoLayoutSchema = z.object({
    direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
    gap: z.number().default(0),
    padding: z.number().default(0),
    alignment: z.enum(['start', 'center', 'end', 'spaceBetween']).default('start'),
    hugContent: z.boolean().optional(),
    fillContainer: z.boolean().optional(),
});
export const ConstraintsSchema = z.object({
    horizontal: z.enum(['left', 'right', 'center', 'scale', 'leftRight']).default('left'),
    vertical: z.enum(['top', 'bottom', 'center', 'scale', 'topBottom']).default('top'),
});
export const TextStyleSchema = z.object({
    fontFamily: z.string().default('Inter'),
    fontSize: z.number().default(16),
    fontWeight: z.number().default(400),
    lineHeight: z.number().default(1.5),
    letterSpacing: z.number().default(0),
    alignment: z.enum(['left', 'center', 'right']).default('left'),
});
export const CornerRadiusSchema = z.object({
    topLeft: z.number().default(0),
    topRight: z.number().default(0),
    bottomLeft: z.number().default(0),
    bottomRight: z.number().default(0),
});
export const CanvasNodeSchema = z.object({
    id: z.string(),
    type: z.enum(['frame', 'group', 'component', 'instance', 'rectangle', 'ellipse', 'polygon', 'star', 'line', 'vector', 'text', 'image', 'boolean_operation']),
    name: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    rotation: z.number().optional(),
    opacity: z.number().optional().default(1),
    visible: z.boolean().optional().default(true),
    locked: z.boolean().optional().default(false),
    fills: z.array(FillSchema).optional(),
    strokes: z.array(StrokeSchema).optional(),
    effects: z.array(EffectSchema).optional(),
    children: z.array(z.lazy(() => CanvasNodeSchema)).optional(),
    componentId: z.string().optional(),
    variantProps: z.record(z.string()).optional(),
    autoLayout: AutoLayoutSchema.optional(),
    constraints: ConstraintsSchema.optional(),
    textContent: z.string().optional(),
    textStyle: TextStyleSchema.optional(),
    imageUrl: z.string().optional(),
    cornerRadius: z.union([z.number(), CornerRadiusSchema]).optional(),
});
export const ComponentVariantSchema = z.object({
    name: z.string(),
    props: z.record(z.string()),
});
export const ComponentDefinitionSchema = z.object({
    id: z.string(),
    name: z.string(),
    node: CanvasNodeSchema,
    variants: z.array(ComponentVariantSchema).optional(),
});
export const DesignTokensSchema = z.object({
    colors: z.record(z.object({
        value: z.string(),
        description: z.string().optional(),
    })).optional(),
    typography: z.record(z.object({
        fontFamily: z.string(),
        fontSize: z.number(),
        fontWeight: z.number(),
        lineHeight: z.number(),
        letterSpacing: z.number(),
    })).optional(),
    spacing: z.record(z.object({
        value: z.number(),
    })).optional(),
    radius: z.record(z.object({
        value: z.number(),
    })).optional(),
    shadows: z.record(z.object({
        color: z.string(),
        offsetX: z.number(),
        offsetY: z.number(),
        blur: z.number(),
        spread: z.number(),
    })).optional(),
    animations: z.record(z.object({
        duration: z.number(),
        easing: z.string(),
    })).optional(),
});
export const CanvasJSONSchema = z.object({
    version: z.string().default('1.0.0'),
    meta: z.object({
        name: z.string().default('Untitled'),
        width: z.number().default(1440),
        height: z.number().default(900),
        background: z.string().default('#ffffff'),
    }),
    nodes: z.array(CanvasNodeSchema),
    components: z.array(ComponentDefinitionSchema).optional(),
    tokens: DesignTokensSchema.optional(),
});
export function createDefaultCanvas() {
    return {
        version: '1.0.0',
        meta: {
            name: 'Untitled',
            width: 1440,
            height: 900,
            background: '#ffffff',
        },
        nodes: [],
        components: [],
        tokens: {
            colors: {
                primary: { value: '#3b82f6' },
                secondary: { value: '#6b7280' },
                background: { value: '#ffffff' },
                text: { value: '#1f2937' },
            },
            typography: {
                heading: { fontFamily: 'Inter', fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0 },
                body: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
            },
            spacing: {
                sm: { value: 4 },
                md: { value: 8 },
                lg: { value: 16 },
                xl: { value: 24 },
            },
            radius: {
                sm: { value: 4 },
                md: { value: 8 },
                lg: { value: 16 },
            },
            shadows: {},
            animations: {},
        },
    };
}
export function generateId() {
    return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
//# sourceMappingURL=index.js.map