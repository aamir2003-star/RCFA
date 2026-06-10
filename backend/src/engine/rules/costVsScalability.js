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
            ruleConfidence: 0.8,
            explanation: `Contradiction between ${reqA.category === 'Cost' ? reqA.title : reqB.title} (Budget Restraint) and ${reqA.category === 'Scalability' ? reqA.title : reqB.title} (Unlimited Growth). Scalability typically requires horizontal redundancy which increases direct cloud costs.`,
            resolutions: [
                { title: 'Serverless Auto-scaling', description: 'Use consumption-based billing (Lambda/CloudRun) to scale only when needed.', strategyType: 'Alternative' },
                { title: 'Hard Budget Caps', description: 'Implement circuit breakers to stop scaling once cost limit is reached.', strategyType: 'Strict' }
            ]
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
