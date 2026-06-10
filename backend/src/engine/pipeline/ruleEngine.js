// src/engine/pipeline/ruleEngine.js
// Step 4 — Run all rules against all pairs, separate flagged from unflagged

import { rules } from '../rules/index.js';

/**
 * Run all registered rules against every pair.
 * Rule-flagged pairs are returned separately and skip Gemini (cost saving).
 *
 * @param {Array<[req, req]>} pairs - all unique requirement pairs
 * @returns {{ ruleFlagged: Array, unflagged: Array }}
 */
export const runRules = (pairs) => {
    const ruleFlagged = [];
    const unflagged = [];

    for (const [reqA, reqB] of pairs) {
        let matched = false;

        for (const rule of rules) {
            const result = rule(reqA, reqB);

            if (result.flagged) {
                ruleFlagged.push({
                    reqA,
                    reqB,
                    conflictType: result.conflictType,
                    ruleConfidence: result.ruleConfidence,
                    source: 'rule',
                    explanation: result.explanation,
                    resolutions: result.resolutions || [],
                });
                matched = true;
                break; // First matching rule wins
            }
        }

        if (!matched) {
            unflagged.push([reqA, reqB]);
        }
    }

    console.log(
        `✅ Step 4 — Rule engine: ${ruleFlagged.length} rule-flagged, ${unflagged.length} sent to AI`
    );

    return { ruleFlagged, unflagged };
};
