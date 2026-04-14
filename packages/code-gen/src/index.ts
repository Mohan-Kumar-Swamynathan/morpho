import type { CanvasJSON, CanvasNode } from '../canvas-json/src/index.js';

export interface CodeGenOptions {
  indent?: number;
  includeCSS?: boolean;
  useTypeScript?: boolean;
}

const defaultOptions: CodeGenOptions = {
  indent: 2,
  includeCSS: true,
  useTypeScript: true,
};

function indent(text: string, level: number, size = 2): string {
  const spaces = ' '.repeat(level * size);
  return text.split('\n').map(line => line ? spaces + line : line).join('\n');
}

function styleObjectToReact(obj: Record<string, string>): string {
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => {
      const camelKey = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${camelKey}: '${v}'`;
    })
    .join(', ');
  return `{ ${entries} }`;
}

function styleObjectToCSS(obj: Record<string, string>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
}

function getFillStyle(node: CanvasNode): Record<string, string> {
  const styles: Record<string, string> = {};
  const fill = node.fills?.[0];
  
  if (fill?.type === 'solid' && fill.color) {
    styles['backgroundColor'] = fill.color;
  } else if (fill?.type === 'gradient') {
    if (fill.gradient?.type === 'linear') {
      const stops = fill.gradient.stops.map(s => `${s.color} ${s.position * 100}%`).join(', ');
      styles['background'] = `linear-gradient(${fill.gradient.angle || 0}deg, ${stops})`;
    }
  }
  
  if (fill?.opacity !== undefined && fill.opacity < 1) {
    styles['opacity'] = String(fill.opacity);
  }
  
  return styles;
}

function getStrokeStyle(node: CanvasNode): Record<string, string> {
  const styles: Record<string, string> = {};
  const stroke = node.strokes?.[0];
  
  if (stroke) {
    styles['border'] = `${stroke.width}px ${stroke.style} ${stroke.color}`;
    if (stroke.position === 'inside') {
      styles['boxSizing'] = 'border-box';
    }
  }
  
  return styles;
}

function getTextStyle(node: CanvasNode): Record<string, string> {
  const styles: Record<string, string> = {};
  const textStyle = node.textStyle;
  
  if (textStyle) {
    styles['fontFamily'] = `'${textStyle.fontFamily}', sans-serif`;
    styles['fontSize'] = `${textStyle.fontSize}px`;
    styles['fontWeight'] = String(textStyle.fontWeight);
    styles['lineHeight'] = `${textStyle.lineHeight}`;
    styles['letterSpacing'] = `${textStyle.letterSpacing}px`;
    styles['textAlign'] = textStyle.alignment;
    styles['color'] = node.fills?.[0]?.color || '#000000';
  }
  
  return styles;
}

function getCornerRadius(node: CanvasNode): Record<string, string> {
  const styles: Record<string, string> = {};
  
  if (typeof node.cornerRadius === 'number') {
    styles['borderRadius'] = `${node.cornerRadius}px`;
  } else if (node.cornerRadius) {
    const r = node.cornerRadius;
    styles['borderRadius'] = `${r.topLeft}px ${r.topRight}px ${r.bottomRight}px ${r.bottomLeft}px`;
  }
  
  return styles;
}

function getLayoutStyle(node: CanvasNode): Record<string, string> {
  const styles: Record<string, string> = {};
  const autoLayout = node.autoLayout;
  
  if (autoLayout) {
    styles['display'] = 'flex';
    styles['flexDirection'] = autoLayout.direction;
    styles['gap'] = `${autoLayout.gap}px`;
    styles['padding'] = `${autoLayout.padding}px`;
    
    const alignMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      spaceBetween: 'space-between',
    };
    styles['justifyContent'] = alignMap[autoLayout.alignment] || 'flex-start';
  }
  
  return styles;
}

function generateNodeComponent(node: CanvasNode, options: CodeGenOptions): { jsx: string; css: string } {
  const baseStyles: Record<string, string> = {
    position: 'absolute',
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
    ...getFillStyle(node),
    ...getStrokeStyle(node),
    ...getCornerRadius(node),
  };

  if (node.type === 'text') {
    Object.assign(baseStyles, getTextStyle(node));
  }

  if (node.autoLayout) {
    Object.assign(baseStyles, getLayoutStyle(node));
    delete baseStyles.position;
    delete baseStyles.left;
    delete baseStyles.top;
  }

  if (node.rotation) {
    baseStyles['transform'] = `rotate(${node.rotation}deg)`;
  }

  if (node.opacity !== undefined && node.opacity < 1) {
    baseStyles['opacity'] = String(node.opacity);
  }

  const jsxProps: Record<string, string> = {};
  if (Object.keys(baseStyles).length > 0) {
    jsxProps['style'] = styleObjectToReact(baseStyles);
  }

  let jsx = '';
  let css = '';

  switch (node.type) {
    case 'frame':
    case 'rectangle':
      jsx = `<div ${Object.entries(jsxProps).map(([k, v]) => `${k}={${v}}`).join(' ')} />`;
      break;
    case 'ellipse':
      jsx = `<div ${Object.entries(jsxProps).map(([k, v]) => `${k}={${v}}`).join(' ')} style={{ ...style, borderRadius: '50%' }} />`;
      break;
    case 'text':
      jsx = `<div ${Object.entries(jsxProps).map(([k, v]) => `${k}={${v}}`).join(' ')}>${node.textContent || 'Text'}</div>`;
      break;
    case 'group':
      if (node.children && node.children.length > 0) {
        jsx = `<div ${Object.entries(jsxProps).map(([k, v]) => `${k}={${v}}`).join(' ')}>\n`;
        for (const child of node.children) {
          const childCode = generateNodeComponent(child, options);
          jsx += indent(childCode.jsx, 1) + '\n';
          css += childCode.css;
        }
        jsx += '</div>';
      } else {
        jsx = `<div />`;
      }
      break;
    case 'image':
      jsx = `<img src="${node.imageUrl || ''}" alt="${node.name}" ${Object.entries(jsxProps).map(([k, v]) => `${k}={${v}}`).join(' ')} />`;
      break;
    default:
      jsx = `<div />`;
  }

  if (options.includeCSS) {
    const className = `element-${node.id}`;
    css += `.${className} {\n${indent(styleObjectToCSS(baseStyles), 1)}\n}\n`;
  }

  return { jsx, css };
}

export function generateReactTailwind(canvas: CanvasJSON, options: CodeGenOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  let code = '';

  const componentName = canvas.meta.name.replace(/[^a-zA-Z0-9]/g, '') || 'Canvas';

  const components: string[] = [];
  const mainContent: string[] = [];

  for (const node of canvas.nodes) {
    const { jsx } = generateNodeComponent(node, opts);
    const name = node.name.replace(/[^a-zA-Z0-9]/g, '') || `Node${node.id.slice(-4)}`;
    components.push(`function ${name}() {\n  return ${jsx};\n}`);
    mainContent.push(`<${name} />`);
  }

  code += `import React from 'react';\n\n`;
  
  if (components.length > 0) {
    code += components.join('\n\n');
    code += '\n\n';
  }

  code += `export default function ${componentName}() {\n`;
  code += `  return (\n`;
  code += `    <div style={{ position: 'relative', width: '${canvas.meta.width}px', height: '${canvas.meta.height}px', background: '${canvas.meta.background}' }}>\n`;
  
  for (const line of mainContent) {
    code += `      ${line}\n`;
  }
  
  code += `    </div>\n`;
  code += `  );\n`;
  code += `}\n`;

  return code;
}

export function generateHTMLCSS(canvas: CanvasJSON, options: CodeGenOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  let html = '';
  let css = '';

  html += `<!DOCTYPE html>\n<html lang="en">\n<head>\n`;
  html += `  <meta charset="UTF-8">\n`;
  html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
  html += `  <title>${canvas.meta.name}</title>\n`;
  html += `  <style>\n`;
  html += `    * { margin: 0; padding: 0; box-sizing: border-box; }\n`;
  html += `    body { font-family: sans-serif; }\n`;
  html += `    .canvas {\n`;
  html += `      position: relative;\n`;
  html += `      width: ${canvas.meta.width}px;\n`;
  html += `      height: ${canvas.meta.height}px;\n`;
  html += `      background: ${canvas.meta.background};\n`;
  html += `      overflow: hidden;\n`;
  html += `    }\n`;

  for (const node of canvas.nodes) {
    const { jsx, css: nodeCss } = generateNodeComponent(node, opts);
    css += nodeCss;
    
    const className = `element-${node.id}`;
    html += `    <div class="canvas ${className}"></div>\n`;
  }

  html += `    ${css}\n`;
  html += `  </style>\n`;
  html += `</head>\n<body>\n`;
  html += `  <div class="canvas"></div>\n`;
  html += `</body>\n</html>`;

  return html;
}

export function generateCSSVariables(canvas: CanvasJSON): string {
  let css = ':root {\n';
  
  if (canvas.tokens?.colors) {
    for (const [name, token] of Object.entries(canvas.tokens.colors)) {
      css += `  --color-${name}: ${token.value};\n`;
    }
  }
  
  if (canvas.tokens?.typography) {
    for (const [name, token] of Object.entries(canvas.tokens.typography)) {
      css += `  --font-${name}-family: ${token.fontFamily};\n`;
      css += `  --font-${name}-size: ${token.fontSize}px;\n`;
      css += `  --font-${name}-weight: ${token.fontWeight};\n`;
      css += `  --font-${name}-line-height: ${token.lineHeight};\n`;
    }
  }
  
  if (canvas.tokens?.spacing) {
    for (const [name, token] of Object.entries(canvas.tokens.spacing)) {
      css += `  --spacing-${name}: ${token.value}px;\n`;
    }
  }
  
  if (canvas.tokens?.radius) {
    for (const [name, token] of Object.entries(canvas.tokens.radius)) {
      css += `  --radius-${name}: ${token.value}px;\n`;
    }
  }
  
  css += '}\n';
  return css;
}

export function generateTailwindConfig(canvas: CanvasJSON): string {
  const config: Record<string, unknown> = {
    theme: {
      extend: {},
    },
  };

  if (canvas.tokens?.colors) {
    const colors: Record<string, string> = {};
    for (const [name, token] of Object.entries(canvas.tokens.colors)) {
      colors[name] = token.value;
    }
    config.theme!.extend!.colors = colors;
  }

  if (canvas.tokens?.typography) {
    const fontSize: Record<string, string> = {};
    for (const [name, token] of Object.entries(canvas.tokens.typography)) {
      fontSize[name] = `${token.fontSize}px`;
    }
    config.theme!.extend!.fontSize = fontSize;
  }

  if (canvas.tokens?.spacing) {
    const spacing: Record<string, string> = {};
    for (const [name, token] of Object.entries(canvas.tokens.spacing)) {
      spacing[name] = `${token.value}px`;
    }
    config.theme!.extend!.spacing = spacing;
  }

  if (canvas.tokens?.radius) {
    const borderRadius: Record<string, string> = {};
    for (const [name, token] of Object.entries(canvas.tokens.radius)) {
      borderRadius[name] = `${token.value}px`;
    }
    config.theme!.extend!.borderRadius = borderRadius;
  }

  return `module.exports = ${JSON.stringify(config, null, 2)}`;
}
