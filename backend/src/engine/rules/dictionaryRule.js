// src/engine/rules/dictionaryRule.js
// High-performance rule matcher using dictionary.json patterns

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dictionaryPath = path.join(__dirname, 'dictionary.json');

let dictionary = null;

/**
 * Load dictionary.json lazily.
 */
const getDictionary = () => {
    if (dictionary) return dictionary;
    try {
        const raw = fs.readFileSync(dictionaryPath, 'utf8');
        dictionary = JSON.parse(raw);
        return dictionary;
    } catch (err) {
        console.error(`❌ Failed to load dictionary.json: ${err.message}`);
        return null;
    }
};

/**
 * Dictionary-based rule matcher.
 * Checks if requirement descriptions contain terms from conflict patterns.
 * 
 * @param {Object} reqA 
 * @param {Object} reqB 
 * @returns {Object} { flagged: boolean, conflictType: string, ruleConfidence: number }
 */
export const dictionaryRule = (reqA, reqB) => {
    const dict = getDictionary();
    if (!dict || !dict.conflictPattern) return { flagged: false };

    const descA = (reqA.description || "").toLowerCase();
    const descB = (reqB.description || "").toLowerCase();

    // Iterate through all categories in the dictionary
    for (const category of Object.values(dict.conflictPattern)) {
        for (const pattern of category) {
            const { term1, term2, description, severity } = pattern;

            const t1 = term1.toLowerCase();
            const t2 = term2.toLowerCase();

            // Check if terms exist in opposite requirements
            // Pattern: (A has T1 AND B has T2) OR (A has T2 AND B has T1)
            const match1 = descA.includes(t1) && descB.includes(t2);
            const match2 = descA.includes(t2) && descB.includes(t1);

            if (match1 || match2) {
                return {
                    flagged: true,
                    conflictType: description || `${term1} vs ${term2}`,
                    ruleConfidence: 0.9, // High confidence for explicit keyword matches
                    severity: severity || 'High'
                };
            }
        }
    }

    return { flagged: false };
};
