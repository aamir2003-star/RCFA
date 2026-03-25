// src/jobs/conflictScanJob.js
// Background job runner — tracks analysis progress per jobId in-memory

import { v4 as uuidv4 } from 'uuid';
import { runConflictDetection } from '../engine/conflictDetector.js';

/**
 * In-memory job store: Map<jobId, JobStatus>
 * JobStatus: { status: 'pending'|'running'|'completed'|'failed', progress: 0-100, result, error }
 */
const jobStore = new Map();

/**
 * Estimate analysis time based on requirement count (rough heuristic).
 * 50 reqs → ~45s, 100 reqs → ~120s
 * @param {number} reqCount
 * @returns {number} estimated seconds
 */
const estimateTime = (reqCount) => {
    const pairs = (reqCount * (reqCount - 1)) / 2;
    // ~0.1s per pair for rules + (assume 30% go to Gemini at ~0.5s each)
    return Math.ceil(pairs * 0.1 + pairs * 0.3 * 0.5);
};

/**
 * Start a new conflict detection job asynchronously.
 * @param {string} projectId
 * @returns {{ jobId: string, estimatedTime: number }}
 */
export const startJob = (projectId) => {
    const jobId = uuidv4();

    // Initialize job state
    jobStore.set(jobId, {
        status: 'pending',
        progress: 0,
        message: 'Job queued',
        result: null,
        error: null,
        startedAt: new Date(),
    });

    // Run async — don't await
    setImmediate(async () => {
        jobStore.set(jobId, {
            ...jobStore.get(jobId),
            status: 'running',
            progress: 0,
            message: 'Starting analysis...',
        });

        try {
            const result = await runConflictDetection(
                projectId,
                jobId,
                (percent, message) => {
                    jobStore.set(jobId, {
                        ...jobStore.get(jobId),
                        progress: percent,
                        message,
                    });
                }
            );

            jobStore.set(jobId, {
                ...jobStore.get(jobId),
                status: 'completed',
                progress: 100,
                message: 'Analysis complete',
                result,
                completedAt: new Date(),
            });
        } catch (err) {
            console.error(`❌ Job ${jobId} failed:`, err.message);
            jobStore.set(jobId, {
                ...jobStore.get(jobId),
                status: 'failed',
                progress: 0,
                message: err.message,
                error: err.message,
            });
        }
    });

    // Rough estimate — will be refined once we know req count
    return { jobId, estimatedTime: estimateTime(20) };
};

/**
 * Get job status by jobId.
 * @param {string} jobId
 * @returns {Object|null}
 */
export const getJobStatus = (jobId) => {
    return jobStore.get(jobId) || null;
};

/**
 * Clean up old completed jobs (call periodically).
 * Removes jobs older than 1 hour.
 */
export const cleanOldJobs = () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    for (const [jobId, job] of jobStore.entries()) {
        const age = now - new Date(job.startedAt).getTime();
        if (age > ONE_HOUR && (job.status === 'completed' || job.status === 'failed')) {
            jobStore.delete(jobId);
        }
    }
};
