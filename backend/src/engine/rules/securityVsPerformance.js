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
            explanation: `Contradiction between ${reqA.category === 'Security' ? reqA.title : reqB.title} (High-Security) and ${reqA.category === 'Performance' ? reqA.title : reqB.title} (High-Performance). Security overhead (encryption/auth) may impact latency targets.`,
            resolutions: [
                { title: 'Asymmetric Offloading', description: 'Move encryption tasks to hardware accelerators to maintain latency.', strategyType: 'Hybrid' },
                { title: 'Tiered Security', description: 'Apply high-security only to PII data, relaxing for public metadata.', strategyType: 'Compromise' }
            ]
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
