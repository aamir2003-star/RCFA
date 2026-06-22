import Papa from "papaparse";

/**
 * Utility to download data as CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Formats a project for a brief summary report
 */
export const formatProjectBrief = (project) => ({
    "Project Name": project.name,
    "Client": project.clientName || "Internal",
    "Status": project.status,
    "Progress": `${calculateProgress(project)}%`,
    "Requirements": project.requirementCount || 0,
    "Conflicts (Total)": project.conflictCount || 0,
    "Conflicts (Resolved)": project.resolvedConflictCount || 0,
    "Modules (Total)": project.totalModuleCount || 0,
    "Modules (Completed)": project.completedModuleCount || 0,
    "Timeline": project.timeline || "N/A",
    "Created At": new Date(project.createdAt).toLocaleDateString()
});

/**
 * Helper to calculate project progress percentage
 */
export const calculateProgress = (project) => {
    const modProgress = project.totalModuleCount > 0
        ? (project.completedModuleCount / project.totalModuleCount) * 100
        : 0;

    const conProgress = project.conflictCount > 0
        ? (project.resolvedConflictCount / project.conflictCount) * 100
        : 100; // If no conflicts, that part is "done"

    // If no modules, rely on conflicts. If no conflicts, rely on modules. 
    // If neither, 0%.
    if (project.totalModuleCount === 0 && project.conflictCount === 0) return 0;
    if (project.totalModuleCount === 0) return Math.round(conProgress);
    if (project.conflictCount === 0) return Math.round(modProgress);

    // Weighted: 60% Modules, 40% Conflicts
    return Math.round((modProgress * 0.6) + (conProgress * 0.4));
};
