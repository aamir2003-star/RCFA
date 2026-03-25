
export const generatePairs = (requirements) => {
    const pairs = [];
    const n = requirements.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            pairs.push([requirements[i], requirements[j]]);
        }
    }

    const expected = (n * (n - 1)) / 2;
    console.log(`✅ Step 3 — Generated ${pairs.length} pairs from ${n} requirements (expected: ${expected})`);

    return pairs;
};
