export class OpenAIProvider {
    id = 'openai';
    name = 'OpenAI';
    supportsVision = true;
    apiKey;
    baseURL;
    model;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://api.openai.com/v1';
        this.model = config.model || 'gpt-4o';
    }
    async generateText(prompt, options) {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: options?.model || this.model,
                max_tokens: options?.maxTokens || 4096,
                temperature: options?.temperature || 0.7,
                messages: [
                    ...(options?.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
                    { role: 'user', content: prompt },
                ],
            }),
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0]?.message?.content || '';
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
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.data}` } },
                            { type: 'text', text: prompt },
                        ],
                    },
                ],
            }),
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const data = await response.json();
        const text = data.choices[0]?.message?.content || '';
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
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                stream: true,
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            return;
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const text = decoder.decode(value);
            const lines = text.split('\n').filter(l => l.startsWith('data: '));
            for (const line of lines) {
                const data = line.slice(6);
                if (data === '[DONE]')
                    return;
                try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content || '';
                    onChunk(content);
                }
                catch { }
            }
        }
    }
}
//# sourceMappingURL=openai.provider.js.map