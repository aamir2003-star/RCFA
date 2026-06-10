// src/engine/pipeline/requirementParser.js
// Step 1 — Fetch and validate requirements from MongoDB, normalize priorities

import { RequirementModel } from '../../models/requirements/requirement.model.js';

// Priority normalization map — handles mixed-case strings from DB
const PRIORITY_MAP = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    med: 'MEDIUM',
    low: 'LOW',
};

/**
 * Fetch all requirements for a project, validate, and normalize.
 * @param {string} projectId
 * @returns {Promise<Array>} cleaned requirements
 */
export const parseRequirements = async (projectId) => {
    const requirements = await RequirementModel.find({ projectId }).lean();

    if (!requirements || requirements.length === 0) {
        throw new Error(`No requirements found for projectId: ${projectId}`);
    }

    const cleaned = [];
    const errors = [];

    for (const req of requirements) {
        // Validate required fields
        if (!req._id) {
            errors.push(`Requirement missing _id`);
            continue;
        }

        // Use title as description if description is missing
        const description = (req.description && req.description.trim())
            ? req.description.trim()
            : (req.title ? req.title.trim() : null);

        if (!description) {
            errors.push(`Requirement ${req._id} missing both title and description`);
            continue;
        }

        // Normalize priority
        const rawPriority = (req.priority || 'medium').toLowerCase();
        const normalizedPriority = PRIORITY_MAP[rawPriority] || 'MEDIUM';

        cleaned.push({
            _id: req._id.toString(),
            description,
            title: req.title || description,
            priority: normalizedPriority,
            module: req.module || 'General',
            category: req.category || null, // null = needs classification
            stakeholder: req.stakeholder || 'Developer',
            projectId: req.projectId?.toString(),
        });
    }

    if (errors.length > 0) {
        console.warn(`⚠️  Parser skipped ${errors.length} invalid requirements:`, errors);
    }

    console.log(`✅ Step 1 — Parsed ${cleaned.length} requirements`);
    return cleaned;
};
