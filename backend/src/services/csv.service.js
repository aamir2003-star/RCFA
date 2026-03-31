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
                // Map common CSV headers to internal requirement fields
                // Supporting: title, requirement, name, feature, description, overview, priority, module, section
                const title = data.title || data.requirement || data.name || data.feature || data.summary;
                const description = data.description || data.overview || data.details || "";

                // Skip rows that don't have a title (likely empty or corrupted rows)
                if (title && title.trim()) {
                    results.push({
                        title: title.trim(),
                        description: description.trim(),
                        priority: (data.priority || 'medium').toLowerCase(),
                        module: data.module || data.section || 'General',
                        status: 'draft',
                        type: 'functional'
                    });
                }
            })
            .on('end', () => {
                if (results.length === 0) {
                    reject(new Error("No valid requirements found in CSV. Please ensure your CSV has a 'Title' or 'Requirement' header."));
                } else {
                    resolve(results);
                }
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};
