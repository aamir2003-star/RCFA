import fs from 'fs';
import csv from 'csv-parser';

/**
 * Parses a CSV file and returns an array of objects mapping to Requirement fields.
 * Expected CSV Headers: Title, Description, Priority, Module
 * @param {string} filePath 
 * @returns {Promise<Array>}
 */
export const parseRequirementsCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim().toLowerCase()
            }))
            .on('data', (data) => {
                // Map common CSV headers to internal requirement fields (case-insensitive due to mapHeaders)
                // Supporting common variations found in business requirements docs
                const titleKey = Object.keys(data).find(key =>
                    ['title', 'requirement', 'requirements', 'name', 'feature', 'summary', 'task', 'titles', 'subject'].includes(key) ||
                    key.includes('title') || key.includes('requirement')
                );

                const descKey = Object.keys(data).find(key =>
                    ['description', 'overview', 'details', 'desc', 'explanation', 'summary'].includes(key) ||
                    key.includes('description') || key.includes('overview')
                );

                const priorityKey = Object.keys(data).find(key =>
                    ['priority', 'importance', 'urgency', 'level'].includes(key)
                );

                const moduleKey = Object.keys(data).find(key =>
                    ['module', 'section', 'category', 'group', 'component', 'area'].includes(key)
                );

                let title = titleKey ? data[titleKey] : null;
                let description = descKey ? data[descKey] : "";

                // Fallback: If no header matched, use first column as title and second as description
                if (!title) {
                    const values = Object.values(data);
                    if (values[0] && values[0].toString().trim()) {
                        title = values[0];
                        description = values[1] || "";
                    }
                }

                // Skip rows that don't have a title (likely empty or corrupted rows)
                if (title && title.toString().trim()) {
                    results.push({
                        title: title.toString().trim(),
                        description: description ? description.toString().trim() : "",
                        priority: (priorityKey && data[priorityKey] ? data[priorityKey].toString().toLowerCase() : 'medium'),
                        module: (moduleKey && data[moduleKey] ? data[moduleKey].toString() : 'General'),
                        status: 'draft',
                        type: 'functional'
                    });
                }
            })
            .on('end', () => {
                if (results.length === 0) {
                    reject(new Error("No valid requirements found. Please ensure your CSV has a 'Title' header or at least one column with text."));
                } else {
                    resolve(results);
                }
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};
