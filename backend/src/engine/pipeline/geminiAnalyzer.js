// src/engine/pipeline/geminiAnalyzer.js
// Step 5 — Bulk-Analyze requirements to identify conflicts in a single pass

import { getGeminiModel } from '../../config/gemini.js';

/**
 * Bulk-Analyze all requirements in one or two prompts to identify conflicts.
 * This is an O(1) or O(N/K) API strategy that avoids the O(N^2) request explosion.
 * 
 * @param {Array} requirements - Flat list of all requirements
 * @returns {Promise<Array>} List of detected conflict objects
 */
export const analyzeWithGemini = async (requirements) => {
    const client = getGeminiModel();

    if (!client || requirements.length < 2) {
        return [];
    }

    console.log(`🤖 Step 5 — Bulk-scanning ${requirements.length} requirements for conflicts with Gemini AI...`);

    // Prepare the list for the prompt
    const requirementsText = requirements.map((r) =>
        `[ID: ${r._id}] ${r.title}: ${r.description}`
    ).join('\n');

    const prompt = `
You are an expert software requirement analyst. 
Given the following list of requirements, identify all pairs that conflict, contradict, or have significant technical dependencies with each other.

List of Requirements:
${requirementsText}

Analyze all possible combinations for logical, semantic, or technical conflicts.
Focus on identifying:
1. Contradictions (e.g., "manual" vs "autonomous", "online only" vs "offline only").
2. Resource conflicts (e.g., "maximize performance" while "minimizing hardware costs").
3. Security vs Usability or Compliance conflicts.

Respond ONLY as a JSON array of objects. Do not include markdown formatting or extra text.
JSON Structure:
[
  {
    "reqA_id": "string id from the list",
    "reqB_id": "string id from the list",
    "conflictType": "string (Contradiction/Resource/Security/etc)",
    "confidence": 0.0 to 1.0,
    "explanation": "concise summary of why they conflict",
    "feasibility": { "timelineImpact": "+X%", "costImpact": "+Y%", "riskLevel": "Low|Medium|High|Critical" },
    "resolutions": [ { "title": "Option name", "description": "desc", "strategyType": "Avoidance|Mitigation|Acceptance" } ]
  }
]
`.trim();

    try {
        const response = await client.chat.completions.create({
            model: 'gemini-2.0-flash',
            messages: [
                { role: 'system', content: 'You are a requirements conflict analyzer. Respond only with JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const text = response.choices[0].message.content;

        // Clean the response: Gemini sometimes wraps in markdown or objects
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/) || text.match(/(\[[\s\S]*\])/);
        const raw = jsonMatch ? jsonMatch[1] : text;
        const parsedResults = JSON.parse(raw.trim());

        // Normalize if wrapped in an object like { "conflicts": [...] }
        const finalResults = Array.isArray(parsedResults) ? parsedResults : (parsedResults.conflicts || parsedResults.results || []);

        const aiConflicts = finalResults.map((item) => {
            const reqA = requirements.find(r => r._id === item.reqA_id);
            const reqB = requirements.find(r => r._id === item.reqB_id);

            if (!reqA || !reqB) return null;

            return {
                reqA,
                reqB,
                conflictType: item.conflictType || 'AI Detected',
                ruleConfidence: typeof item.confidence === 'number' ? item.confidence : 0.8,
                source: 'ai',
                explanation: item.explanation || 'No explanation provided.',
                feasibility: item.feasibility || { timelineImpact: '+10%', costImpact: '+5%', riskLevel: 'Medium' },
                resolutions: item.resolutions || []
            };
        }).filter(Boolean);

        console.log(`✅ Step 5 — Gemini detected ${aiConflicts.length} conflicts via bulk scan`);
        return aiConflicts;

    } catch (err) {
        console.error(`❌ Gemini bulk scan failed: ${err.message}`);
        return [];
    }
};
