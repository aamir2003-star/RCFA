// src/engine/pipeline/feasibilityEstimator.js
// Step 7 — Estimate timeline/cost/risk impact and identify affected modules

// Lookup table for known conflict types (per spec)
const FEASIBILITY_TABLE = {
    'Security vs Performance': {
        timelineImpact: '+15%',
        costImpact: '+10%',
        riskLevel: 'High',
    },
    'Cost vs Scalability': {
        timelineImpact: '+20%',
        costImpact: '+35%',
        riskLevel: 'Critical',
    },
    'Encryption vs Latency': {
        timelineImpact: '+10%',
        costImpact: '+5%',
        riskLevel: 'Medium',
    },
    'EEA vs Global Replication': {
        timelineImpact: '+25%',
        costImpact: '+20%',
        riskLevel: 'Critical',
    },
};

// Default fallback for unknown / AI-detected conflict types
const DEFAULT_FEASIBILITY = {
    timelineImpact: '+10%',
    costImpact: '+5%',
    riskLevel: 'Medium',
};

// Module mapping per category — which modules are typically impacted
const CATEGORY_MODULE_MAP = {
    Security: ['Auth Protocols', 'API Gateway', 'Data Encryption Layer'],
    Performance: ['Caching Layer', 'Load Balancer', 'CDN'],
    Scalability: ['Infrastructure', 'Database Cluster', 'Load Balancer'],
    Cost: ['Infrastructure', 'Billing Module', 'Monitoring'],
    Functional: ['Core Application', 'Business Logic'],
};

/**
 * Identify affected downstream modules from requirements' categories.
 * @param {Object} reqA
 * @param {Object} reqB
 * @returns {string[]}
 */
const getAffectedModules = (reqA, reqB) => {
    const modulesA = CATEGORY_MODULE_MAP[reqA.category] || ['Core Application'];
    const modulesB = CATEGORY_MODULE_MAP[reqB.category] || ['Core Application'];

    // Merge + deduplicate
    const merged = [...new Set([...modulesA, ...modulesB])];
    return merged.slice(0, 4); // cap at 4 for readability
};

/**
 * Estimate feasibility impact for a detected conflict.
 * @param {Object} conflict - { reqA, reqB, conflictType, source }
 * @returns {{ timelineImpact, costImpact, riskLevel, affectedModules }}
 */
export const estimateFeasibility = (conflict) => {
    const { reqA, reqB, conflictType } = conflict;

    // Look up impact from table, fallback to default
    const feasibility = FEASIBILITY_TABLE[conflictType] || DEFAULT_FEASIBILITY;

    const affectedModules = getAffectedModules(reqA, reqB);

    return {
        feasibility: { ...feasibility },
        affectedModules,
    };
};

/**
 * Apply feasibility estimates to all conflicts.
 * @param {Array} conflicts
 * @returns {Array} conflicts with feasibility and affectedModules added
 */
export const estimateAllFeasibilities = (conflicts) => {
    const result = conflicts.map((conflict) => {
        const { feasibility, affectedModules } = estimateFeasibility(conflict);
        return { ...conflict, feasibility, affectedModules };
    });

    console.log(`✅ Step 7 — Feasibility estimated for ${result.length} conflicts`);
    return result;
};
