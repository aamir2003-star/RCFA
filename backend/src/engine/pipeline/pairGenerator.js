/**
 * Generate requirement pairs using a Smart Pairing strategy.
 * Instead of O(N^2), we prioritize comparisons that are likely to conflict:
 * 1. Same Module: High conflict risk.
 * 2. High Priority: Might conflict with anything.
 * 3. Cross-Module (Special): Security or Performance vs others.
 */
export const generatePairs = (requirements) => {
    const pairs = [];
    const n = requirements.length;

    console.log(`🔍 Step 3 — Optimizing pair generation for ${n} requirements...`);

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const reqA = requirements[i];
            const reqB = requirements[j];

            // 1. Same Module - Always compare
            // Fallback to 'General' if both are missing to ensure we don't skip comparisons by mistake
            const modA = (reqA.module || 'General').toLowerCase();
            const modB = (reqB.module || 'General').toLowerCase();
            const sameModule = (modA === modB);

            // 2. High Priority - Compare against all
            // Matching normalized 'HIGH' or 'CRITICAL' from parser
            const highPriority = (reqA.priority === 'HIGH' || reqA.priority === 'CRITICAL' ||
                reqB.priority === 'HIGH' || reqB.priority === 'CRITICAL');

            // 3. Global Modules - Compare against all
            const isGlobal = (m) => m && ['global', 'core', 'general', 'system'].includes(m.toLowerCase());
            const globalModule = isGlobal(reqA.module) || isGlobal(reqB.module);

            // 4. Critical Categories (Security/Performance) - Compare across modules
            const isCritical = (c) => c && ['Security', 'Performance'].includes(c);
            const criticalConflict = isCritical(reqA.category) || isCritical(reqB.category);

            if (sameModule || highPriority || globalModule || criticalConflict) {
                pairs.push([reqA, reqB]);
            }
        }
    }

    const totalPossible = (n * (n - 1)) / 2;
    const reduction = ((1 - (pairs.length / totalPossible)) * 100).toFixed(1);

    // Safety Valve: If we still have too many pairs for the free tier (RPM limits)
    // Filter down to only high-impact pairs if it exceeds 1000
    if (pairs.length > 1000) {
        console.warn(`⚠️  Too many pairs (${pairs.length}). Filtering for high-priority conflicts only...`);
        return pairs
            .filter(([a, b]) =>
                a.priority === 'HIGH' || b.priority === 'HIGH' ||
                a.priority === 'CRITICAL' || b.priority === 'CRITICAL' ||
                a.category !== 'Functional' || b.category !== 'Functional'
            )
            .slice(0, 1000);
    }

    console.log(`✅ Step 3 — Generated ${pairs.length} smart pairs (Reduction: ${reduction}%, Total possible: ${totalPossible})`);

    return pairs;
};
