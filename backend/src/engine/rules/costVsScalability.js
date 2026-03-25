// src/engine/rules/costVsScalability.js
// Rule 2 — Flags pairs where one requirement is Cost and the other is Scalability

/**
 * Detects Cost vs Scalability conflicts based on category.
 * Scaling infrastructure inevitably increases cost.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {{ flagged: boolean, conflictType: string, ruleConfidence: number }}
 */
export const costVsScalability = (reqA, reqB) => {
    const categories = new Set([reqA.category, reqB.category]);

    if (categories.has('Cost') && categories.has('Scalability')) {
        return {
            flagged: true,
            conflictType: 'Cost vs Scalability',
            ruleConfidence: 0.9,
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
