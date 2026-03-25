// src/engine/rules/index.js
// Rule Registry — dynamically exports all rules as an ordered array

import { securityVsPerformance } from './securityVsPerformance.js';
import { costVsScalability } from './costVsScalability.js';
import { encryptionVsLatency } from './encryptionVsLatency.js';
import { eeaVsGlobalReplication } from './eeaVsGlobalReplication.js';

/**
 * All registered conflict rules.
 * Each rule is a function: (reqA, reqB) => { flagged, conflictType, ruleConfidence }
 * Rules are checked in order — first match wins.
 */
export const rules = [
    securityVsPerformance,
    costVsScalability,
    encryptionVsLatency,
    eeaVsGlobalReplication,
];

export default rules;
