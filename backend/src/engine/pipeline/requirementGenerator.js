// src/engine/pipeline/requirementGenerator.js
// Step 0 — Brainstorm new requirements based on project context and existing specs

import { getGeminiModel } from '../../config/gemini.js';

/**
 * Generate new requirements for specific teams using Gemini AI.
 */
export const generateRequirements = async (project, existingRequirements, teams = ['Developer', 'Legal']) => {
    const client = getGeminiModel();

    if (!client) {
        throw new Error('Gemini AI client not initialized. Check your API key.');
    }

    console.log(`🤖 AI Generator — Brainstorming requirements for ${teams.join(', ')} in project: ${project.name}...`);

    // Prepare context for the AI
    const existingList = existingRequirements.map(r => `- ${r.title}: ${r.description}`).join('\n');

    const prompt = `
You are a senior Product Architect and Compliance Officer. 
Your goal is to brainstorm NEW, high-quality requirements for a project called "${project.name}".

Project Description:
"${project.description || "N/A"}"

Current Requirements (DO NOT DUPLICATE THESE):
${existingList || "No requirements added yet."}

Target Teams: ${teams.join(', ')}

Instructions:
1. Generate 3-5 distinct and actionable requirements for EACH target team.
2. For 'Developer' team: Focus on technical infrastructure, performance, scalability, and integration.
3. For 'Legal' team: Focus on data privacy (GDPR/CCPA), compliance, audit trails, and data sovereignty.
4. Ensure these requirements could potentially CONFLICT with existing ones to test the system's robustness.
5. Assign a priority (low/medium/high/critical) and a category (Functional/Performance/Security/Cost/Scalability).

Respond ONLY as a JSON array of objects.
JSON Structure:
[
  {
    "title": "Short title",
    "description": "Detailed requirement description",
    "priority": "low|medium|high|critical",
    "category": "Functional|Performance|Security|Cost|Scalability",
    "stakeholder": "Developer|Legal"
  }
]
`.trim();

    try {
        const response = await client.chat.completions.create({
            model: 'gemini-2.0-flash', // User advised they have 2.0 flash access
            messages: [
                { role: 'user', content: `Respond ONLY with a JSON array of requirements.\n\n${prompt}` }
            ]
        });

        const text = response.choices[0].message.content;

        // Robust JSON extraction
        let parsedResults = [];
        try {
            const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/) || text.match(/\{[\s\S]*\}/);
            const raw = jsonMatch ? jsonMatch[0] : text;
            const data = JSON.parse(raw.trim());
            parsedResults = Array.isArray(data) ? data : (data.requirements || []);
        } catch (parseErr) {
            console.error("Failed to parse AI response as JSON:", text);
            throw new Error("AI returned malformed data. Please try again.");
        }

        return parsedResults.map(item => ({
            ...item,
            status: 'review', // Mark for PM approval
            projectId: project._id,
            version: 1
        }));

    } catch (err) {
        // If 404, suggest potential fix
        if (err.status === 404) {
            console.error(`❌ Gemini 404: The model could not be found. Check if gemini-1.5-flash is available for your API key.`);
        }
        throw err;
    }
};
