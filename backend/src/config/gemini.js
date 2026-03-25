// src/config/gemini.js
// Gemini API client singleton — used by geminiAnalyzer.js
import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiModel = null;

/**
 * Returns the Gemini generative model instance.
 * Falls back gracefully if GEMINI_API_KEY is not set.
 */
export const getGeminiModel = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY is not set. AI analysis will be skipped.');
        return null;
    }

    if (!geminiModel) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('✅ Gemini AI model initialized');
    }

    return geminiModel;
};
