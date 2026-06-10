import { ReportModel } from "../models/report/report.model.js";
import { RequirementModel } from "../models/requirements/requirement.model.js";
import { getGeminiModel } from "../config/gemini.js";

export const generateReport = async (projectId, userId, type = "feasibility") => {
    // 1. Create initial report doc
    const report = await ReportModel.create({
        projectId,
        title: `${type.toUpperCase()} Report - ${new Date().toLocaleDateString()}`,
        type,
        status: "generating",
        createdBy: userId
    });

    // 2. Fetch requirements for context
    const requirements = await RequirementModel.find({ projectId });
    const context = requirements.map(r => `${r.title}: ${r.description}`).join("\n");

    // 3. Trigger Gemini (Async)
    // We'll wrap this in a try-catch and update the report status
    try {
        const aiClient = getGeminiModel();
        if (!aiClient) throw new Error("Gemini client not configured");

        const prompt = `
      Analyze the following project requirements and generate a structured ${type} summary:
      
      Requirements:
      ${context}
      
      Respond ONLY in JSON:
      {
        "summary": "2-3 sentences overview",
        "details": ["point 1", "point 2"],
        "riskLevel": "Low|Medium|High|Critical",
        "score": 0.0 to 100.0
      }
    `;

        const response = await aiClient.chat.completions.create({
            model: 'gemini-flash-latest',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const aiResult = JSON.parse(response.choices[0].message.content);

        report.content = aiResult;
        report.status = "completed";
        await report.save();

    } catch (err) {
        console.error("AI Report Error:", err.message);
        report.status = "failed";
        await report.save();
    }

    return report;
};

export const getProjectReports = async (projectId) => {
    return await ReportModel.find({ projectId }).sort({ createdAt: -1 });
};
