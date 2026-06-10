import * as reportService from "../services/report.service.js";

export const generateReport = async (req, res, next) => {
    try {
        const { projectId, type } = req.body;
        const report = await reportService.generateReport(projectId, req.user._id, type);
        res.status(202).json(report); // 202 Accepted because generation might be async
    } catch (error) {
        next(error);
    }
};

export const getProjectReports = async (req, res, next) => {
    try {
        const reports = await reportService.getProjectReports(req.params.projectId);
        res.json(reports);
    } catch (error) {
        next(error);
    }
};
