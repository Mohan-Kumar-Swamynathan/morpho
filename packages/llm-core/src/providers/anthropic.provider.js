export class AnthropicProvider {
    id = 'anthropic';
    name = 'Anthropic';
    supportsVision = true;
    apiKey;
    model;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'claude-sonnet-4-20250514';
    }
    async generateText(prompt, options) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: options?.model || this.model,
                max_tokens: options?.maxTokens || 4096,
                temperature: options?.temperature || 0.7,
                system: options?.systemPrompt,
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.content[0]?.text || '';
    }
    async generateJSON(prompt, schema) {
        const text = await this.generateText(prompt, {
            systemPrompt: `You must respond with valid JSON only. No markdown formatting.`,
        });
        try {
            const parsed = JSON.parse(text);
            return schema.parse(parsed);
        }
        catch {
            throw new Error('Failed to parse JSON from LLM response');
        }
    }
    async generateCanvasJSON(prompt) {
        const canvasSchema = {
            parse: (data) => data,
        };
        return this.generateJSON(prompt, canvasSchema);
    }
    async analyzeImage(image, prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'image', source: { type: 'base64', media_type: image.mimeType, data: image.data } },
                            { type: 'text', text: prompt },
                        ],
                    },
                ],
            }),
        });
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.statusText}`);
        }
        const data = await response.json();
        const text = data.content[0]?.text || '';
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        }
        catch {
            throw new Error('Failed to parse CanvasJSON from vision model response');
        }
    }
    async streamText(prompt, onChunk) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            return;
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value);
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]')
                        return;
                    try {
                        const json = JSON.parse(data);
                        const text = json.delta?.text || '';
                        onChunk(text);
                    }
                    catch { }
                }
            }
        }
    }
}
//# sourceMappingURL=anthropic.provider.js.map