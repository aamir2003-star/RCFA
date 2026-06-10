// src/engine/pipeline/requirementClassifier.js
// Step 2 — Auto-classify requirements without a category using keyword matching

// Keyword lists per category (per PRD spec)
const CATEGORY_KEYWORDS = {
    Security: [
        'encrypt', 'auth', 'authentication', 'password', 'token', 'gdpr',
        'compliance', 'certificate', 'tls', 'ssl', 'aes', 'rsa', 'oauth',
        'rbac', 'access control', 'firewall', 'intrusion', 'vulnerability',
        'penetration', 'audit', 'pii', 'data residency', 'eea', 'sox',
        'hipaa', 'identity', 'mfa', 'two-factor', '2fa', 'jwt', 'csrf',
        'xss', 'injection', 'secure', 'privacy'
    ],
    Performance: [
        'latency', 'speed', 'load time', 'ms', 'millisecond', 'response time',
        'throughput', 'fast', 'slow', 'bandwidth', 'cache', 'caching',
        'optimize', 'optimization', 'performance', 'response', 'uptime',
        'availability', 'sla', 'percentile', 'p99', 'p95', 'apdex',
        'ttfb', 'ttl', 'memory', 'cpu', 'profiling', 'benchmark'
    ],
    Scalability: [
        'concurrent', 'users', 'nodes', 'replicas', 'horizontal', 'cluster',
        'scale', 'scaling', 'distributed', 'load balancer', 'auto-scaling',
        'microservice', 'sharding', 'partition', 'replication', 'kubernetes',
        'k8s', 'docker', 'container', 'pods', 'instances', 'global', 'mirror'
    ],
    Cost: [
        'budget', 'price', '$', 'billing', 'infrastructure cost', 'monthly',
        'cost', 'expense', 'spend', 'roi', 'revenue', 'profit', 'savings',
        'tier', 'subscription', 'license', 'fee', 'invoice', 'payment'
    ]
};

/**
 * Classify a single requirement description into a category.
 * Returns 'Functional' if no keywords match.
 * @param {string} text
 * @returns {string} category
 */
export const classifyRequirement = (text) => {
    if (!text) return 'Functional';
    const lower = text.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) {
                return category;
            }
        }
    }

    return 'Functional';
};

/**
 * Classify all requirements that lack a category.
 * Mutates and returns requirements with `category` guaranteed.
 * @param {Array} requirements
 * @returns {Array}
 */
export const classifyRequirements = (requirements) => {
    let classifiedCount = 0;

    const result = requirements.map((req) => {
        if (req.category) return req; // already has a category

        const category = classifyRequirement(req.description);
        classifiedCount++;
        return { ...req, category };
    });

    console.log(`✅ Step 2 — Classified ${classifiedCount} requirements (${result.length} total)`);
    return result;
};
