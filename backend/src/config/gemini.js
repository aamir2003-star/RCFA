// src/config/gemini.js
// Gemini API client singleton — used by geminiAnalyzer.js
import OpenAI from 'openai';

let openaiClient = null;

/**
 * Returns the OpenAI-compatible Gemini client.
 * Falls back gracefully if GEMINI_API_KEY is not set.
 */
export const getGeminiModel = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY is not set. AI analysis will be skipped.');
        return null;
    }

    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.GEMINI_API_KEY,
            baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        });
        console.log('✅ Gemini OpenAI-compatible client initialized');
    }

    return openaiClient;
};
