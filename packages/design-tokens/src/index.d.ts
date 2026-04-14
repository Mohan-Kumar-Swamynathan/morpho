export declare const morphoTokens: {
    colors: {
        primary: {
            value: string;
            description: string;
        };
        secondary: {
            value: string;
            description: string;
        };
        success: {
            value: string;
            description: string;
        };
        warning: {
            value: string;
            description: string;
        };
        error: {
            value: string;
            description: string;
        };
        background: {
            value: string;
            description: string;
        };
        surface: {
            value: string;
            description: string;
        };
        text: {
            value: string;
            description: string;
        };
        textSecondary: {
            value: string;
            description: string;
        };
        border: {
            value: string;
            description: string;
        };
    };
    typography: {
        heading: {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        };
        subheading: {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        };
        body: {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        };
        small: {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        };
        caption: {
            fontFamily: string;
            fontSize: number;
            fontWeight: number;
            lineHeight: number;
            letterSpacing: number;
        };
    };
    spacing: {
        xs: {
            value: number;
        };
        sm: {
            value: number;
        };
        md: {
            value: number;
        };
        lg: {
            value: number;
        };
        xl: {
            value: number;
        };
        '2xl': {
            value: number;
        };
        '3xl': {
            value: number;
        };
    };
    radius: {
        none: {
            value: number;
        };
        sm: {
            value: number;
        };
        md: {
            value: number;
        };
        lg: {
            value: number;
        };
        xl: {
            value: number;
        };
        full: {
            value: number;
        };
    };
    shadows: {
        sm: {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        };
        md: {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        };
        lg: {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        };
        xl: {
            color: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
        };
    };
    animations: {
        fast: {
            duration: number;
            easing: string;
        };
        normal: {
            duration: number;
            easing: string;
        };
        slow: {
            duration: number;
            easing: string;
        };
    };
};
export declare function toCSSVariables(tokens: typeof morphoTokens): string;
export declare function toTailwindConfig(tokens: typeof morphoTokens): Record<string, unknown>;
//# sourceMappingURL=index.d.ts.map