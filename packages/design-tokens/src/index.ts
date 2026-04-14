export const morphoTokens = {
  colors: {
    primary: { value: '#3b82f6', description: 'Primary brand color' },
    secondary: { value: '#6b7280', description: 'Secondary color' },
    success: { value: '#22c55e', description: 'Success state' },
    warning: { value: '#f59e0b', description: 'Warning state' },
    error: { value: '#ef4444', description: 'Error state' },
    background: { value: '#ffffff', description: 'Page background' },
    surface: { value: '#f9fafb', description: 'Card/panel background' },
    text: { value: '#1f2937', description: 'Primary text' },
    textSecondary: { value: '#6b7280', description: 'Secondary text' },
    border: { value: '#e5e7eb', description: 'Border color' },
  },
  typography: {
    heading: { fontFamily: 'Inter', fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0 },
    subheading: { fontFamily: 'Inter', fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0 },
    body: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
    small: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
    caption: { fontFamily: 'Inter', fontSize: 12, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0 },
  },
  spacing: {
    xs: { value: 4 },
    sm: { value: 8 },
    md: { value: 16 },
    lg: { value: 24 },
    xl: { value: 32 },
    '2xl': { value: 48 },
    '3xl': { value: 64 },
  },
  radius: {
    none: { value: 0 },
    sm: { value: 4 },
    md: { value: 8 },
    lg: { value: 12 },
    xl: { value: 16 },
    full: { value: 9999 },
  },
  shadows: {
    sm: { color: 'rgba(0,0,0,0.05)', offsetX: 0, offsetY: 1, blur: 2, spread: 0 },
    md: { color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 4, blur: 6, spread: 0 },
    lg: { color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 10, blur: 15, spread: 0 },
    xl: { color: 'rgba(0,0,0,0.15)', offsetX: 0, offsetY: 20, blur: 25, spread: 0 },
  },
  animations: {
    fast: { duration: 150, easing: 'ease-out' },
    normal: { duration: 300, easing: 'ease-in-out' },
    slow: { duration: 500, easing: 'ease-in-out' },
  },
};

export function toCSSVariables(tokens: typeof morphoTokens): string {
  let css = ':root {\n';
  
  for (const [category, values] of Object.entries(tokens)) {
    for (const [name, token] of Object.entries(values as Record<string, { value: string | number }>)) {
      css += `  --${category}-${name}: ${token.value};\n`;
    }
  }
  
  css += '}\n';
  return css;
}

export function toTailwindConfig(tokens: typeof morphoTokens): Record<string, unknown> {
  const config: Record<string, unknown> = { theme: { extend: {} } };
  
  if (tokens.colors) {
    const colors: Record<string, string> = {};
    for (const [name, token] of Object.entries(tokens.colors)) {
      colors[name] = token.value;
    }
    (config.theme as Record<string, unknown>).extend!.colors = colors;
  }
  
  if (tokens.spacing) {
    const spacing: Record<string, string> = {};
    for (const [name, token] of Object.entries(tokens.spacing)) {
      spacing[name] = `${token.value}px`;
    }
    (config.theme as Record<string, unknown>).extend!.spacing = spacing;
  }
  
  if (tokens.radius) {
    const borderRadius: Record<string, string> = {};
    for (const [name, token] of Object.entries(tokens.radius)) {
      borderRadius[name] = `${token.value}px`;
    }
    (config.theme as Record<string, unknown>).extend!.borderRadius = borderRadius;
  }
  
  return config;
}
