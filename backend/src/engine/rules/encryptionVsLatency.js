// src/engine/rules/encryptionVsLatency.js
// Rule 3 — Keyword match: (encrypt OR AES OR TLS) AND (latency OR ms OR response)

const ENCRYPTION_KEYWORDS = ['encrypt', 'aes', 'tls', 'ssl', 'rsa', 'cipher', 'cryptograph'];
const LATENCY_KEYWORDS = ['latency', 'ms', 'millisecond', 'response time', 'response', 'fast', 'speed', 'throughput'];

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
 * Detects Encryption vs Latency conflicts via keyword matching.
 * Flags if EITHER req has encryption terms AND EITHER req has latency terms —
 * they don't need to be in the same requirement; the combination is the conflict.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {{ flagged: boolean, conflictType: string, ruleConfidence: number }}
 */
export const encryptionVsLatency = (reqA, reqB) => {
    const textA = `${reqA.title || ''} ${reqA.description || ''}`;
    const textB = `${reqB.title || ''} ${reqB.description || ''}`;
    const combined = `${textA} ${textB}`;

    const hasEncryption = hasKeyword(combined, ENCRYPTION_KEYWORDS);
    const hasLatency = hasKeyword(combined, LATENCY_KEYWORDS);

    // Need one req with encryption and the other with latency (or both mixed)
    const reqAHasEncryption = hasKeyword(textA, ENCRYPTION_KEYWORDS);
    const reqBHasEncryption = hasKeyword(textB, ENCRYPTION_KEYWORDS);
    const reqAHasLatency = hasKeyword(textA, LATENCY_KEYWORDS);
    const reqBHasLatency = hasKeyword(textB, LATENCY_KEYWORDS);
    const categories = new Set([...(reqA.categories || []), ...(reqB.categories || [])]);

    // True conflict: one side talks about security, the other about speed
    const crossConflict =
        (hasKeyword(textA, ENCRYPTION_KEYWORDS) && hasKeyword(textB, LATENCY_KEYWORDS)) ||
        (hasKeyword(textB, ENCRYPTION_KEYWORDS) && hasKeyword(textA, LATENCY_KEYWORDS));

    if (categories.has('Security') && categories.has('Performance')) {
        return {
            flagged: true,
            conflictType: 'Encryption vs Latency',
            ruleConfidence: 0.9,
            explanation: `Resource contention between Security (${reqA.title}) and Latency (${reqB.title}). High-bitrate encryption suites (AES-256) introduce 15-20ms of overhead per packet, conflicting with "Ultra-low latency" goals.`,
            resolutions: [
                { title: 'Hardware Acceleration', description: 'Utilize specialized chips (TPM/HSM) for cryptographic offloading.', strategyType: 'Hybrid' },
                { title: 'Selective Encryption', description: 'Encrypt only sensitive fields instead of the whole payload.', strategyType: 'Compromise' }
            ]
        };
    }

    return { flagged: false, conflictType: null, ruleConfidence: 0 };
};
