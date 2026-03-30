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
            .pipe(csv())
            .on('data', (data) => {
                // Map CSV headers to internal requirement fields
                results.push({
                    title: data.Title || data.title,
                    description: data.Description || data.description,
                    priority: (data.Priority || data.priority || 'medium').toLowerCase(),
                    module: data.Module || data.module,
                    status: 'draft',
                    type: 'functional'
                });
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};
