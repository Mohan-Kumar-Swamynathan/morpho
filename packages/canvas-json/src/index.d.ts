import { z } from 'zod';
export declare const FillSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["solid", "gradient", "image"]>>;
    color: z.ZodOptional<z.ZodString>;
    gradient: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["linear", "radial"]>;
        stops: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            position: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            color: string;
            position: number;
        }, {
            color: string;
            position: number;
        }>, "many">;
        angle: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "linear" | "radial";
        stops: {
            color: string;
            position: number;
        }[];
        angle?: number | undefined;
    }, {
        type: "linear" | "radial";
        stops: {
            color: string;
            position: number;
        }[];
        angle?: number | undefined;
    }>>;
    imageUrl: z.ZodOptional<z.ZodString>;
    opacity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    opacity: number;
    type: "image" | "solid" | "gradient";
    color?: string | undefined;
    gradient?: {
        type: "linear" | "radial";
        stops: {
            color: string;
            position: number;
        }[];
        angle?: number | undefined;
    } | undefined;
    imageUrl?: string | undefined;
}, {
    color?: string | undefined;
    opacity?: number | undefined;
    type?: "image" | "solid" | "gradient" | undefined;
    gradient?: {
        type: "linear" | "radial";
        stops: {
            color: string;
            position: number;
        }[];
        angle?: number | undefined;
    } | undefined;
    imageUrl?: string | undefined;
}>;
export declare const StrokeSchema: z.ZodObject<{
    color: z.ZodString;
    width: z.ZodNumber;
    style: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
    position: z.ZodDefault<z.ZodEnum<["center", "inside", "outside"]>>;
}, "strip", z.ZodTypeAny, {
    width: number;
    color: string;
    position: "center" | "inside" | "outside";
    style: "solid" | "dashed" | "dotted";
}, {
    width: number;
    color: string;
    position?: "center" | "inside" | "outside" | undefined;
    style?: "solid" | "dashed" | "dotted" | undefined;
}>;
export declare const EffectSchema: z.ZodObject<{
    type: z.ZodEnum<["dropShadow", "innerShadow", "blur", "backgroundBlur"]>;
    color: z.ZodOptional<z.ZodString>;
    offset: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    blur: z.ZodOptional<z.ZodNumber>;
    spread: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "dropShadow" | "innerShadow" | "blur" | "backgroundBlur";
    color?: string | undefined;
    offset?: {
        x: number;
        y: number;
    } | undefined;
    blur?: number | undefined;
    spread?: number | undefined;
}, {
    type: "dropShadow" | "innerShadow" | "blur" | "backgroundBlur";
    color?: string | undefined;
    offset?: {
        x: number;
        y: number;
    } | undefined;
    blur?: number | undefined;
    spread?: number | undefined;
}>;
export declare const AutoLayoutSchema: z.ZodObject<{
    direction: z.ZodDefault<z.ZodEnum<["horizontal", "vertical"]>>;
    gap: z.ZodDefault<z.ZodNumber>;
    padding: z.ZodDefault<z.ZodNumber>;
    alignment: z.ZodDefault<z.ZodEnum<["start", "center", "end", "spaceBetween"]>>;
    hugContent: z.ZodOptional<z.ZodBoolean>;
    fillContainer: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    direction: "horizontal" | "vertical";
    gap: number;
    padding: number;
    alignment: "center" | "start" | "end" | "spaceBetween";
    hugContent?: boolean | undefined;
    fillContainer?: boolean | undefined;
}, {
    direction?: "horizontal" | "vertical" | undefined;
    gap?: number | undefined;
    padding?: number | undefined;
    alignment?: "center" | "start" | "end" | "spaceBetween" | undefined;
    hugContent?: boolean | undefined;
    fillContainer?: boolean | undefined;
}>;
export declare const ConstraintsSchema: z.ZodObject<{
    horizontal: z.ZodDefault<z.ZodEnum<["left", "right", "center", "scale", "leftRight"]>>;
    vertical: z.ZodDefault<z.ZodEnum<["top", "bottom", "center", "scale", "topBottom"]>>;
}, "strip", z.ZodTypeAny, {
    horizontal: "scale" | "center" | "left" | "right" | "leftRight";
    vertical: "scale" | "center" | "top" | "bottom" | "topBottom";
}, {
    horizontal?: "scale" | "center" | "left" | "right" | "leftRight" | undefined;
    vertical?: "scale" | "center" | "top" | "bottom" | "topBottom" | undefined;
}>;
export declare const TextStyleSchema: z.ZodObject<{
    fontFamily: z.ZodDefault<z.ZodString>;
    fontSize: z.ZodDefault<z.ZodNumber>;
    fontWeight: z.ZodDefault<z.ZodNumber>;
    lineHeight: z.ZodDefault<z.ZodNumber>;
    letterSpacing: z.ZodDefault<z.ZodNumber>;
    alignment: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
}, "strip", z.ZodTypeAny, {
    alignment: "center" | "left" | "right";
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
}, {
    alignment?: "center" | "left" | "right" | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | undefined;
    fontWeight?: number | undefined;
    lineHeight?: number | undefined;
    letterSpacing?: number | undefined;
}>;
export declare const CornerRadiusSchema: z.ZodObject<{
    topLeft: z.ZodDefault<z.ZodNumber>;
    topRight: z.ZodDefault<z.ZodNumber>;
    bottomLeft: z.ZodDefault<z.ZodNumber>;
    bottomRight: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
}, {
    topLeft?: number | undefined;
    topRight?: number | undefined;
    bottomLeft?: number | undefined;
    bottomRight?: number | undefined;
}>;
export declare const CanvasNodeSchema: any;
export declare const ComponentVariantSchema: z.ZodObject<{
    name: z.ZodString;
    props: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    props: Record<string, string>;
}, {
    name: string;
    props: Record<string, string>;
}>;
export declare const ComponentDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    node: any;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        props: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        props: Record<string, string>;
    }, {
        name: string;
        props: Record<string, string>;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    node?: any;
    variants?: {
        name: string;
        props: Record<string, string>;
    }[] | undefined;
}, {
    id: string;
    name: string;
    node?: any;
    variants?: {
        name: string;
        props: Record<string, string>;
    }[] | undefined;
}>;
export declare const DesignTokensSchema: z.ZodObject<{
    colors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        description?: string | undefined;
    }, {
        value: string;
        description?: string | undefined;
    }>>>;
    typography: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        fontFamily: z.ZodString;
        fontSize: z.ZodNumber;
        fontWeight: z.ZodNumber;
        lineHeight: z.ZodNumber;
        letterSpacing: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: number;
    }, {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: number;
    }>>>;
    spacing: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
    }, {
        value: number;
    }>>>;
    radius: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
    }, {
        value: number;
    }>>>;
    shadows: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        color: z.ZodString;
        offsetX: z.ZodNumber;
        offsetY: z.ZodNumber;
        blur: z.ZodNumber;
        spread: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
    }, {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
    }>>>;
    animations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        duration: z.ZodNumber;
        easing: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        easing: string;
    }, {
        duration: number;
        easing: string;
    }>>>;
}, "strip", z.ZodTypeAny, {
    colors?: Record<string, {
        value: string;
        description?: string | undefined;
    }> | undefined;
    typography?: Record<string, {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: number;
    }> | undefined;
    spacing?: Record<string, {
        value: number;
    }> | undefined;
    radius?: Record<string, {
        value: number;
    }> | undefined;
    shadows?: Record<string, {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
    }> | undefined;
    animations?: Record<string, {
        duration: number;
        easing: string;
    }> | undefined;
}, {
    colors?: Record<string, {
        value: string;
        description?: string | undefined;
    }> | undefined;
    typography?: Record<string, {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: number;
    }> | undefined;
    spacing?: Record<string, {
        value: number;
    }> | undefined;
    radius?: Record<string, {
        value: number;
    }> | undefined;
    shadows?: Record<string, {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
    }> | undefined;
    animations?: Record<string, {
        duration: number;
        easing: string;
    }> | undefined;
}>;
export declare const CanvasJSONSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    meta: z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        background: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        name: string;
        background: string;
    }, {
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        background?: string | undefined;
    }>;
    nodes: z.ZodArray<any, "many">;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        node: any;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            props: z.ZodRecord<z.ZodString, z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            props: Record<string, string>;
        }, {
            name: string;
            props: Record<string, string>;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        node?: any;
        variants?: {
            name: string;
            props: Record<string, string>;
        }[] | undefined;
    }, {
        id: string;
        name: string;
        node?: any;
        variants?: {
            name: string;
            props: Record<string, string>;
        }[] | undefined;
    }>, "many">>;
    tokens: z.ZodOptional<z.ZodObject<{
        colors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            description?: string | undefined;
        }, {
            value: string;
            description?: string | undefined;
        }>>>;
        typography: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            fontFamily: z.ZodString;
            fontSize: z.ZodNumber;
            fontWeight: z.ZodNumber;
            lineHeight: z.ZodNumber;
            letterSpacing: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }>>>;
        spacing: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
        }, {
            value: number;
        }>>>;
        radius: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
        }, {
            value: number;
        }>>>;
        shadows: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            color: z.ZodString;
            offsetX: z.ZodNumber;
            offsetY: z.ZodNumber;
            blur: z.ZodNumber;
            spread: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }>>>;
        animations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            duration: z.ZodNumber;
            easing: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            duration: number;
            easing: string;
        }, {
            duration: number;
            easing: string;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        colors?: Record<string, {
            value: string;
            description?: string | undefined;
        }> | undefined;
        typography?: Record<string, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }> | undefined;
        spacing?: Record<string, {
            value: number;
        }> | undefined;
        radius?: Record<string, {
            value: number;
        }> | undefined;
        shadows?: Record<string, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }> | undefined;
        animations?: Record<string, {
            duration: number;
            easing: string;
        }> | undefined;
    }, {
        colors?: Record<string, {
            value: string;
            description?: string | undefined;
        }> | undefined;
        typography?: Record<string, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }> | undefined;
        spacing?: Record<string, {
            value: number;
        }> | undefined;
        radius?: Record<string, {
            value: number;
        }> | undefined;
        shadows?: Record<string, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }> | undefined;
        animations?: Record<string, {
            duration: number;
            easing: string;
        }> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    meta: {
        width: number;
        height: number;
        name: string;
        background: string;
    };
    nodes: any[];
    components?: {
        id: string;
        name: string;
        node?: any;
        variants?: {
            name: string;
            props: Record<string, string>;
        }[] | undefined;
    }[] | undefined;
    tokens?: {
        colors?: Record<string, {
            value: string;
            description?: string | undefined;
        }> | undefined;
        typography?: Record<string, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }> | undefined;
        spacing?: Record<string, {
            value: number;
        }> | undefined;
        radius?: Record<string, {
            value: number;
        }> | undefined;
        shadows?: Record<string, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }> | undefined;
        animations?: Record<string, {
            duration: number;
            easing: string;
        }> | undefined;
    } | undefined;
}, {
    meta: {
        width?: number | undefined;
        height?: number | undefined;
        name?: string | undefined;
        background?: string | undefined;
    };
    nodes: any[];
    version?: string | undefined;
    components?: {
        id: string;
        name: string;
        node?: any;
        variants?: {
            name: string;
            props: Record<string, string>;
        }[] | undefined;
    }[] | undefined;
    tokens?: {
        colors?: Record<string, {
            value: string;
            description?: string | undefined;
        }> | undefined;
        typography?: Record<string, {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        }> | undefined;
        spacing?: Record<string, {
            value: number;
        }> | undefined;
        radius?: Record<string, {
            value: number;
        }> | undefined;
        shadows?: Record<string, {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        }> | undefined;
        animations?: Record<string, {
            duration: number;
            easing: string;
        }> | undefined;
    } | undefined;
}>;
export type Fill = z.infer<typeof FillSchema>;
export type Stroke = z.infer<typeof StrokeSchema>;
export type Effect = z.infer<typeof EffectSchema>;
export type AutoLayout = z.infer<typeof AutoLayoutSchema>;
export type Constraints = z.infer<typeof ConstraintsSchema>;
export type TextStyle = z.infer<typeof TextStyleSchema>;
export type CornerRadius = z.infer<typeof CornerRadiusSchema>;
export type CanvasNode = z.infer<typeof CanvasNodeSchema>;
export type ComponentVariant = z.infer<typeof ComponentVariantSchema>;
export type ComponentDefinition = z.infer<typeof ComponentDefinitionSchema>;
export type DesignTokens = z.infer<typeof DesignTokensSchema>;
export type CanvasJSON = z.infer<typeof CanvasJSONSchema>;
export declare function createDefaultCanvas(): CanvasJSON;
export declare function generateId(): string;
//# sourceMappingURL=index.d.ts.map