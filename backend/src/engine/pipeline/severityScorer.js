// src/engine/pipeline/severityScorer.js
// Step 6 — Compute severity score (1-10) and assign color band

// Priority weight mapping (per spec)
const PRIORITY_WEIGHTS = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
};

// Stakeholder weight mapping (per spec)
const STAKEHOLDER_WEIGHTS = {
    Legal: 1.5,
    Security: 1.5,
    PM: 1.2,
    Architect: 1.2,
    Developer: 1.0,
    Other: 1.0,
};

/**
 * Get the color band based on severity score.
 * Red ≥ 8, Orange 5–7.9, Yellow 3–4.9, Green < 3 (resolved)
 * @param {number} score
 * @returns {string}
 */
const getColorBand = (score) => {
    if (score >= 8) return 'Red';
    if (score >= 5) return 'Orange';
    if (score >= 3) return 'Yellow';
    return 'Green';
};

/**
 * Compute severity score for a conflict pair.
 * Formula: Severity = PriorityWeight × ImpactFactor × StakeholderWeight
 * Normalized to 1–10 scale.
 *
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {{ severityScore: number, severityColor: string }}
 */
export const computeSeverity = (reqA, reqB) => {
    // PriorityWeight: use the HIGHER priority of the two
    const weightA = PRIORITY_WEIGHTS[reqA.priority] || 2;
    const weightB = PRIORITY_WEIGHTS[reqB.priority] || 2;
    const priorityWeight = Math.max(weightA, weightB);

    // ImpactFactor = same as the higher priority weight (per spec)
    const impactFactor = priorityWeight;

    // StakeholderWeight: use the HIGHER weight between both stakeholders
    const stakeA = STAKEHOLDER_WEIGHTS[reqA.stakeholder] || 1.0;
    const stakeB = STAKEHOLDER_WEIGHTS[reqB.stakeholder] || 1.0;
    const stakeholderWeight = Math.max(stakeA, stakeB);

    // Raw score
    const rawScore = priorityWeight * impactFactor * stakeholderWeight;

    // Max possible: 4 × 4 × 1.5 = 24 → normalize to 10
    const MAX_RAW = 24;
    const normalized = Math.min(10, Math.max(1, (rawScore / MAX_RAW) * 10));
    const severityScore = Math.round(normalized * 10) / 10; // 1 decimal

    const severityColor = getColorBand(severityScore);

    return { severityScore, severityColor };
};
