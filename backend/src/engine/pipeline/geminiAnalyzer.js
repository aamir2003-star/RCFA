// src/engine/pipeline/geminiAnalyzer.js
// Step 5 — Analyze unflagged pairs via Gemini AI with batching, retry, and queue

import { getGeminiModel } from '../../config/gemini.js';

const BATCH_SIZE = 20;       // Max pairs per API call
const MAX_RETRIES = 3;       // Retry attempts per batch
const MAX_CONCURRENT = 10;   // Max concurrent Gemini requests

/**
 * Sleep for ms milliseconds.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Build the Gemini prompt for a single pair.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {string}
 */
const buildPrompt = (reqA, reqB) => `
You are a software requirements conflict analyzer.
Analyze these two requirements for logical, semantic, or technical conflicts.

Requirement A: ${reqA.description} (Priority: ${reqA.priority}, Stakeholder: ${reqA.stakeholder})
Requirement B: ${reqB.description} (Priority: ${reqB.priority}, Stakeholder: ${reqB.stakeholder})

Respond ONLY in JSON format:
{
  "conflicted": true | false,
  "conflictType": "string (e.g. Security vs Performance)",
  "confidence": 0.0 to 1.0,
  "explanation": "one sentence summary",
  "feasibility": {
    "timelineImpact": "+X%",
    "costImpact": "+Y%",
    "riskLevel": "Low|Medium|High|Critical"
  },
  "resolutions": [
    { "title": "Option 1", "description": "short desc", "strategyType": "Compromise|Strict|Alternative|Hybrid" },
    { "title": "Option 2", "description": "short desc", "strategyType": "Compromise|Strict|Alternative|Hybrid" },
    { "title": "Option 3", "description": "short desc", "strategyType": "Compromise|Strict|Alternative|Hybrid" }
  ]
}
`.trim();

/**
 * Parse Gemini's text response into a structured object.
 * Handles malformed JSON gracefully.
 * @param {string} text
 * @returns {Object|null}
 */
const parseGeminiResponse = (text) => {
    try {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
            text.match(/(\{[\s\S]*\})/);

        const raw = jsonMatch ? jsonMatch[1] : text;
        const parsed = JSON.parse(raw.trim());

        if (!parsed.conflicted) return { conflicted: false };

        return {
            conflicted: true,
            conflictType: parsed.conflictType || 'Unknown',
            confidence: typeof parsed.confidence === 'number'
                ? Math.min(1, Math.max(0, parsed.confidence))
                : 0.5,
            explanation: parsed.explanation || '',
            feasibility: parsed.feasibility || null,
            resolutions: parsed.resolutions || []
        };
    } catch {
        console.warn('⚠️  Failed to parse Gemini response:', text.substring(0, 200));
        return null;
    }
};

/**
 * Call Gemini (via OpenAI-compatible endpoint) for a single pair with exponential backoff retry.
 * @param {Object} client - OpenAI client instance
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {Promise<Object>}
 */
const analyzeOnePair = async (client, reqA, reqB) => {
    const prompt = buildPrompt(reqA, reqB);
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await client.chat.completions.create({
                model: 'gemini-flash-latest',
                messages: [
                    { role: 'system', content: 'You are a software requirements conflict analyzer.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' }
            });

            const text = response.choices[0].message.content;

            // Log token usage for cost tracking
            const usage = response.usage;
            if (usage) {
                console.debug(
                    `🔢 Gemini tokens — prompt: ${usage.prompt_tokens}, response: ${usage.completion_tokens}`
                );
            }

            const parsed = parseGeminiResponse(text);
            if (parsed) return parsed;

            // Malformed response — treat as no conflict
            return { conflicted: false, conflictType: 'Unknown', confidence: 0, explanation: 'Parse error' };

        } catch (err) {
            lastError = err;
            const backoff = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
            console.warn(`⚠️  Gemini attempt ${attempt} failed: ${err.message}. Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }

    console.error(`❌ Gemini failed after ${MAX_RETRIES} attempts:`, lastError?.message);
    return { conflicted: false, conflictType: 'Unknown', confidence: 0, explanation: 'Gemini API error' };
};

/**
 * Process an array of pairs concurrently with a max concurrency limit.
 * @param {Array} pairs
 * @param {Function} fn - async function to call for each pair
 * @param {number} concurrency
 * @returns {Promise<Array>}
 */
const withConcurrencyLimit = async (pairs, fn, concurrency) => {
    const results = [];
    let index = 0;

    const worker = async () => {
        while (index < pairs.length) {
            const current = index++;
            results[current] = await fn(pairs[current]);
        }
    };

    const workers = Array.from({ length: Math.min(concurrency, pairs.length) }, worker);
    await Promise.all(workers);
    return results;
};

/**
 * Analyze all unflagged pairs using Gemini AI.
 * Groups into batches of BATCH_SIZE, runs with MAX_CONCURRENT limit.
 * Returns only conflicted pairs.
 *
 * @param {Array<[req, req]>} unflaggedPairs
 * @returns {Promise<Array>} AI-detected conflicts with source: 'ai'
 */
export const analyzeWithGemini = async (unflaggedPairs) => {
    const client = getGeminiModel();

    if (!client) {
        console.warn('⚠️  Gemini client unavailable — skipping AI analysis');
        return [];
    }

    if (unflaggedPairs.length === 0) {
        console.log('✅ Step 5 — No pairs to send to Gemini');
        return [];
    }

    console.log(`🤖 Step 5 — Sending ${unflaggedPairs.length} pairs to Gemini (batch size: ${BATCH_SIZE})`);

    const aiResults = await withConcurrencyLimit(
        unflaggedPairs,
        async ([reqA, reqB]) => {
            const result = await analyzeOnePair(client, reqA, reqB);
            return { reqA, reqB, ...result };
        },
        MAX_CONCURRENT
    );

    // Filter to only conflicted pairs
    const aiConflicts = aiResults.filter((r) => r.conflicted).map((r) => ({
        reqA: r.reqA,
        reqB: r.reqB,
        conflictType: r.conflictType,
        ruleConfidence: r.confidence,
        source: 'ai',
        explanation: r.explanation,
        feasibility: r.feasibility,
        resolutions: r.resolutions
    }));

    console.log(`✅ Step 5 — Gemini detected ${aiConflicts.length} conflicts from ${unflaggedPairs.length} pairs`);
    return aiConflicts;
};
