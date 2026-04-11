// src/engine/rules/eeaVsGlobalReplication.js
// Rule 4 — Keyword match: (EEA OR GDPR OR residency) AND (global OR replicate OR US-East OR mirror)

const EEA_KEYWORDS = ['eea', 'gdpr', 'residency', 'data residency', 'sovereignty', 'regional'];
const GLOBAL_KEYWORDS = ['global', 'replicate', 'replication', 'us-east', 'us-west', 'mirror', 'worldwide', 'multi-region', 'cross-region', 'border'];

/**
 * Check if text contains any keyword from a list.
 * @param {string} text
 * @param {string[]} keywords
 * @returns {boolean}
 */
const hasKeyword = (text, keywords) => {
    const lower = (text || '').toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
};

/**
 * Detects EEA vs Global Replication conflicts.
 * EEA/GDPR data residency requirements conflict with global data replication.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {{ flagged: boolean, conflictType: string, ruleConfidence: number }}
 */
export const eeaVsGlobalReplication = (reqA, reqB) => {
    const textA = `${reqA.title || ''} ${reqA.description || ''}`;
    const textB = `${reqB.title || ''} ${reqB.description || ''}`;
    const combined = `${textA} ${textB}`;

    const hasEEA = hasKeyword(combined, EEA_KEYWORDS);
    const hasGlobal = hasKeyword(combined, GLOBAL_KEYWORDS);

    if (hasEEA && hasGlobal) {
        // Check if it's a cross-requirement conflict (stronger signal)
        const reqAHasEEA = hasKeyword(textA, EEA_KEYWORDS);
        const reqBHasEEA = hasKeyword(textB, EEA_KEYWORDS);
        const reqAHasGlobal = hasKeyword(textA, GLOBAL_KEYWORDS);
        const reqBHasGlobal = hasKeyword(textB, GLOBAL_KEYWORDS);

        const crossConflict =
            (reqAHasEEA && reqBHasGlobal) ||
            (reqBHasEEA && reqAHasGlobal);

        return {
            flagged: true,
            conflictType: 'EEA vs Global Replication',
            ruleConfidence: crossConflict ? 0.95 : 0.78,
            explanation: `Legal compliance conflict: Data residency requirements (GDPR/EEA) in ${reqAHasEEA ? reqA.title : reqB.title} directly contradict the global mirroring/replication strategy in ${reqAHasGlobal ? reqA.title : reqB.title}.`,
            resolutions: [
                { title: 'Regional Sharding', description: 'Partition the database so that EEA user data remains on EU servers while other data is replicated globally.', strategyType: 'Alternative' },
                { title: 'Anonymized Mirroring', description: 'Only replicate non-PII or anonymized data to the global mirror.', strategyType: 'Hybrid' }
            ]
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
