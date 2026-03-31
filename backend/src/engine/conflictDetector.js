// src/engine/conflictDetector.js
// Main orchestrator — runs all 7 steps in sequence for a given projectId

import { parseRequirements } from './pipeline/requirementParser.js';
import { classifyRequirements } from './pipeline/requirementClassifier.js';
import { generatePairs } from './pipeline/pairGenerator.js';
import { runRules } from './pipeline/ruleEngine.js';
import { analyzeWithGemini } from './pipeline/geminiAnalyzer.js';
import { computeSeverity } from './pipeline/severityScorer.js';
import { estimateAllFeasibilities } from './pipeline/feasibilityEstimator.js';
import { ConflictModel } from '../models/conflict/conflict.model.js';
import { emitConflictNew, emitAnalysisProgress } from '../sockets/events/conflictEvents.js';

/**
 * Report progress via callback and Socket.io.
 * @param {string} projectId
 * @param {string} jobId
 * @param {Function} onProgress
 * @param {number} percent
 * @param {string} message
 */
const progress = (projectId, jobId, onProgress, percent, message) => {
    console.log(`[${percent}%] ${message}`);
    if (typeof onProgress === 'function') {
        onProgress(percent, message);
    }

    // Emit via Socket.io
    emitAnalysisProgress(projectId, jobId, percent, message);
};

/**
 * Main conflict detection orchestrator.
 * Runs all 7 steps, saves to MongoDB, emits Socket.io events.
 *
 * @param {string} projectId
 * @param {string} jobId - used to associate progress reports
 * @param {Function} onProgress - callback(percent, message) for live updates
 * @returns {Promise<Object>} summary of the detection run
 */
export const runConflictDetection = async (projectId, jobId, onProgress = null) => {
    console.log(`\n🔍 Starting conflict detection for project: ${projectId} (job: ${jobId})\n`);

    // ─── Step 1: Parse Requirements ───────────────────────────────────────────
    progress(projectId, jobId, onProgress, 5, 'Fetching and parsing requirements...');
    const parsed = await parseRequirements(projectId);

    if (parsed.length < 2) {
        throw new Error(`Need at least 2 requirements to detect conflicts. Found: ${parsed.length}`);
    }

    // ─── Step 2: Classify Requirements ─────────────────────────────────────────
    progress(projectId, jobId, onProgress, 15, 'Classifying requirements...');
    const classified = classifyRequirements(parsed);

    // ─── Step 3: Generate Pairs ─────────────────────────────────────────────────
    progress(projectId, jobId, onProgress, 25, 'Generating requirement pairs...');
    const pairs = generatePairs(classified);

    // ─── Step 4: Run Rule Engine ────────────────────────────────────────────────
    progress(projectId, jobId, onProgress, 35, 'Running rule engine...');
    const { ruleFlagged, unflagged } = runRules(pairs);

    // ─── Step 5: Gemini AI Analysis ─────────────────────────────────────────────
    progress(projectId, jobId, onProgress, 45, `Analyzing ${unflagged.length} pairs with Gemini AI...`);
    const aiDetected = await analyzeWithGemini(unflagged);

    // ─── Combine all detected conflicts ────────────────────────────────────────
    const allConflicts = [...ruleFlagged, ...aiDetected];
    progress(projectId, jobId, onProgress, 65, `Total conflicts detected: ${allConflicts.length}. Scoring severity...`);

    // ─── Step 6: Score Severity ─────────────────────────────────────────────────
    const scoredConflicts = allConflicts.map((conflict) => {
        const { severityScore, severityColor } = computeSeverity(conflict.reqA, conflict.reqB);
        return { ...conflict, severityScore, severityColor };
    });

    // ─── Step 7: Estimate Feasibility ───────────────────────────────────────────
    progress(projectId, jobId, onProgress, 75, 'Estimating feasibility impacts...');
    const finalConflicts = estimateAllFeasibilities(scoredConflicts);

    // ─── Save to MongoDB ────────────────────────────────────────────────────────
    progress(projectId, jobId, onProgress, 85, 'Saving conflicts to database...');
    const savedConflicts = [];

    for (const conflict of finalConflicts) {
        try {
            const doc = await ConflictModel.create({
                projectId,
                requirementA: conflict.reqA._id,
                requirementB: conflict.reqB._id,
                conflictType: conflict.conflictType,
                type: sanitizeTypeEnum(conflict.conflictType),
                severityScore: conflict.severityScore,
                severityColor: conflict.severityColor,
                aiConfidence: conflict.ruleConfidence || 0,
                source: conflict.source,
                explanation: conflict.explanation || '',
                feasibility: conflict.feasibility,
                affectedModules: conflict.affectedModules,
                resolutions: conflict.resolutions,
                status: 'open',
            });

            savedConflicts.push(doc);

            // Emit real-time Socket.io event
            emitConflictNew(projectId, doc.toObject());
        } catch (err) {
            console.error(`❌ Failed to save conflict: ${err.message}`);
        }
    }

    progress(projectId, jobId, onProgress, 100, `Detection complete. ${savedConflicts.length} conflicts saved.`);

    console.log(`\n✅ Conflict detection finished for project: ${projectId}`);
    console.log(`   Rule-detected: ${ruleFlagged.length}`);
    console.log(`   AI-detected: ${aiDetected.length}`);
    console.log(`   Saved to DB: ${savedConflicts.length}\n`);

    return {
        projectId,
        jobId,
        requirementsAnalyzed: parsed.length,
        pairsChecked: pairs.length,
        ruleFlaggedCount: ruleFlagged.length,
        aiDetectedCount: aiDetected.length,
        totalConflicts: savedConflicts.length,
        savedConflicts,
    };
};

/**
 * Sanitize a conflictType string into a valid Conflict model `type` enum value.
 * Falls back to 'contradiction' for unknown types.
 */
const VALID_TYPES = [
    'contradiction', 'duplicate', 'dependency',
    'Security vs Performance', 'Cost vs Scalability',
    'Encryption vs Latency', 'EEA vs Global Replication',
    'AI Detected', 'Unknown',
];

const sanitizeTypeEnum = (conflictType) => {
    if (VALID_TYPES.includes(conflictType)) return conflictType;
    if (conflictType && conflictType !== 'Unknown') return 'AI Detected';
    return 'Unknown';
};
