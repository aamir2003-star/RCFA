// tests/engine/conflictDetector.test.js
// Integration test for the conflict detection pipeline with mocked Gemini
// Run with: node tests/engine/conflictDetector.test.js

import assert from 'node:assert';
import { parseRequirements } from '../../src/engine/pipeline/requirementParser.js';
import { classifyRequirements } from '../../src/engine/pipeline/requirementClassifier.js';
import { generatePairs } from '../../src/engine/pipeline/pairGenerator.js';
import { runRules } from '../../src/engine/pipeline/ruleEngine.js';
import { computeSeverity } from '../../src/engine/pipeline/severityScorer.js';
import { estimateAllFeasibilities } from '../../src/engine/pipeline/feasibilityEstimator.js';

let passed = 0;
let failed = 0;

const test = (name, fn) => {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ❌ ${name}: ${err.message}`);
        failed++;
    }
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockRequirements = [
    {
        _id: 'req-001',
        title: 'AES-256 encryption for all user data',
        description: 'All user data must be encrypted using AES-256 encryption for GDPR compliance.',
        priority: 'HIGH',
        category: 'Security',
        stakeholder: 'Legal',
        projectId: 'proj-001'
    },
    {
        _id: 'req-002',
        title: 'Dashboard loads in under 1 second',
        description: 'The dashboard must have response time under 100ms for all API calls.',
        priority: 'HIGH',
        category: 'Performance',
        stakeholder: 'PM',
        projectId: 'proj-001'
    },
    {
        _id: 'req-003',
        title: 'Support 10,000 concurrent users',
        description: 'System must support 10,000 concurrent users with horizontal cluster scaling.',
        priority: 'MEDIUM',
        category: 'Scalability',
        stakeholder: 'Architect',
        projectId: 'proj-001'
    },
    {
        _id: 'req-004',
        title: 'Keep infrastructure cost under $5,000/month',
        description: 'Monthly infrastructure billing and cloud cost must stay under $5,000.',
        priority: 'MEDIUM',
        category: 'Cost',
        stakeholder: 'PM',
        projectId: 'proj-001'
    },
    {
        _id: 'req-005',
        title: 'User can reset password',
        description: 'Users must be able to reset their password via email.',
        priority: 'LOW',
        category: null, // Will be auto-classified
        stakeholder: 'Developer',
        projectId: 'proj-001'
    }
];

// ─── Step 2: Classifier Tests ─────────────────────────────────────────────────
console.log('\n📋 Step 2 — Requirement Classifier\n');

test('classifies password-related requirement as Security', () => {
    const reqs = [{ description: 'Users must use password authentication', category: null }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Security');
});

test('classifies latency requirement as Performance', () => {
    const reqs = [{ description: 'API response time must be under 200ms latency', category: null }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Performance');
});

test('classifies concurrent users requirement as Scalability', () => {
    const reqs = [{ description: 'Support 5000 concurrent users with horizontal scaling', category: null }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Scalability');
});

test('classifies budget requirement as Cost', () => {
    const reqs = [{ description: 'Monthly infrastructure cost must stay under $2000 budget', category: null }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Cost');
});

test('classifies undefined keyword requirement as Functional', () => {
    const reqs = [{ description: 'User can view their order history', category: null }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Functional');
});

test('preserves existing category (does not overwrite)', () => {
    const reqs = [{ description: 'Some random text', category: 'Security' }];
    const classified = classifyRequirements(reqs);
    assert.strictEqual(classified[0].category, 'Security');
});

// ─── Step 3: Pair Generator Tests ─────────────────────────────────────────────
console.log('\n📋 Step 3 — Pair Generator\n');

test('generates n*(n-1)/2 pairs for n=5', () => {
    const pairs = generatePairs(mockRequirements);
    assert.strictEqual(pairs.length, 10); // 5*4/2
});

test('generates correct number for n=2', () => {
    const pairs = generatePairs([{}, {}]);
    assert.strictEqual(pairs.length, 1);
});

test('generates correct number for n=10', () => {
    const reqs = Array.from({ length: 10 }, (_, i) => ({ _id: `req-${i}` }));
    const pairs = generatePairs(reqs);
    assert.strictEqual(pairs.length, 45); // 10*9/2
});

test('each pair is [A, B] tuple with i < j index', () => {
    const reqs = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }];
    const pairs = generatePairs(reqs);
    assert.deepStrictEqual(pairs[0][0]._id, 'a');
    assert.deepStrictEqual(pairs[0][1]._id, 'b');
});

// ─── Step 4: Rule Engine Integration ─────────────────────────────────────────
console.log('\n📋 Step 4 — Rule Engine Integration\n');

test('detects expected conflicts from 5 mock requirements', () => {
    const pairs = generatePairs(mockRequirements);
    const { ruleFlagged, unflagged } = runRules(pairs);

    // Should flag: Security+Performance, Cost+Scalability, Encryption+Latency (overlap)
    assert.ok(ruleFlagged.length >= 2, `Expected ≥2 rule conflicts, got ${ruleFlagged.length}`);
    assert.ok(pairs.length === ruleFlagged.length + unflagged.length, 'Pairs not partitioned correctly');
});

test('rule-flagged conflicts have correct shape', () => {
    const pairs = generatePairs(mockRequirements);
    const { ruleFlagged } = runRules(pairs);

    for (const conflict of ruleFlagged) {
        assert.ok(conflict.reqA, 'Missing reqA');
        assert.ok(conflict.reqB, 'Missing reqB');
        assert.ok(conflict.conflictType, 'Missing conflictType');
        assert.strictEqual(conflict.source, 'rule');
        assert.ok(conflict.ruleConfidence > 0, 'ruleConfidence must be > 0');
    }
});

// ─── Step 6: Severity Scorer Tests ───────────────────────────────────────────
console.log('\n📋 Step 6 — Severity Scorer\n');

test('CRITICAL + CRITICAL + Legal = Red (≥8)', () => {
    const a = { priority: 'CRITICAL', stakeholder: 'Legal' };
    const b = { priority: 'CRITICAL', stakeholder: 'Security' };
    const { severityScore, severityColor } = computeSeverity(a, b);
    assert.strictEqual(severityColor, 'Red');
    assert.ok(severityScore >= 8);
});

test('LOW + LOW + Developer = Green (<3)', () => {
    const a = { priority: 'LOW', stakeholder: 'Developer' };
    const b = { priority: 'LOW', stakeholder: 'Developer' };
    const { severityScore, severityColor } = computeSeverity(a, b);
    assert.ok(severityScore < 3, `Expected score < 3, got ${severityScore}`);
    assert.strictEqual(severityColor, 'Green');
});

test('score is between 1 and 10', () => {
    const a = { priority: 'HIGH', stakeholder: 'PM' };
    const b = { priority: 'MEDIUM', stakeholder: 'Developer' };
    const { severityScore } = computeSeverity(a, b);
    assert.ok(severityScore >= 1 && severityScore <= 10, `Score ${severityScore} out of range`);
});

test('uses higher priority of the two', () => {
    const a = { priority: 'LOW', stakeholder: 'Developer' };
    const b = { priority: 'HIGH', stakeholder: 'Developer' };
    const { severityScore: s1 } = computeSeverity(a, b);

    // Both HIGH should score the same or higher
    const a2 = { priority: 'HIGH', stakeholder: 'Developer' };
    const b2 = { priority: 'HIGH', stakeholder: 'Developer' };
    const { severityScore: s2 } = computeSeverity(a2, b2);

    assert.ok(s2 >= s1, 'Higher priority pair should have ≥ score');
});

// ─── Step 7: Feasibility Estimator Tests ──────────────────────────────────────
console.log('\n📋 Step 7 — Feasibility Estimator\n');

test('Security vs Performance returns correct feasibility', () => {
    const conflict = {
        reqA: { category: 'Security' },
        reqB: { category: 'Performance' },
        conflictType: 'Security vs Performance'
    };
    const [result] = estimateAllFeasibilities([conflict]);
    assert.strictEqual(result.feasibility.timelineImpact, '+15%');
    assert.strictEqual(result.feasibility.costImpact, '+10%');
    assert.strictEqual(result.feasibility.riskLevel, 'High');
});

test('Cost vs Scalability returns Critical risk', () => {
    const conflict = {
        reqA: { category: 'Cost' },
        reqB: { category: 'Scalability' },
        conflictType: 'Cost vs Scalability'
    };
    const [result] = estimateAllFeasibilities([conflict]);
    assert.strictEqual(result.feasibility.riskLevel, 'Critical');
    assert.strictEqual(result.feasibility.costImpact, '+35%');
});

test('Unknown conflict type falls back to Medium risk', () => {
    const conflict = {
        reqA: { category: 'Functional' },
        reqB: { category: 'Functional' },
        conflictType: 'Some AI Detected Type'
    };
    const [result] = estimateAllFeasibilities([conflict]);
    assert.strictEqual(result.feasibility.riskLevel, 'Medium');
});

test('affectedModules array is populated', () => {
    const conflict = {
        reqA: { category: 'Security' },
        reqB: { category: 'Performance' },
        conflictType: 'Security vs Performance'
    };
    const [result] = estimateAllFeasibilities([conflict]);
    assert.ok(Array.isArray(result.affectedModules));
    assert.ok(result.affectedModules.length > 0);
});

// ─── Final Summary ────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed > 0) {
    console.error('❌ Some tests failed!');
    process.exit(1);
} else {
    console.log('✅ All tests passed!');
}
