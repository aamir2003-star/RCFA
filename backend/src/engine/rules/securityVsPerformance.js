// src/engine/rules/securityVsPerformance.js
// Rule 1 — Flags pairs where one requirement is Security and the other is Performance

/**
 * Detects Security vs Performance conflicts based on category.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {{ flagged: boolean, conflictType: string, ruleConfidence: number }}
 */
export const securityVsPerformance = (reqA, reqB) => {
    const categories = new Set([reqA.category, reqB.category]);

    if (categories.has('Security') && categories.has('Performance')) {
        return {
            flagged: true,
            conflictType: 'Security vs Performance',
            ruleConfidence: 0.85,
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
