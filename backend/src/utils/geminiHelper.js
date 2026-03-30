import { getGeminiModel } from '../config/gemini.js';

/**
 * Generic function to call Gemini with a prompt and expect a JSON response.
 * @param {string} prompt 
 * @param {string} systemContent
 * @returns {Promise<Object>}
 */
export const callGeminiJSON = async (prompt, systemContent = 'You are a helpful assistant.') => {
    const client = getGeminiModel();
    if (!client) {
        throw new Error('Gemini client not initialized');
    }

    const response = await client.chat.completions.create({
        model: 'gemini-flash-latest',
        messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content;

    try {
        // Extract JSON block from markdown code fences if present
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
            text.match(/(\{[\s\S]*\})/);
        const raw = jsonMatch ? jsonMatch[1] : text;
        return JSON.parse(raw.trim());
    } catch (err) {
        console.error('Failed to parse Gemini response as JSON:', text);
        throw new Error('Malformed AI response');
    }
};
