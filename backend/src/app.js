import express from 'express';
import { UserModel } from './models/user/user.model.js';
import { ProjectModel } from './models/project/project.model.js';
import { RequirementModel } from './models/requirements/requirement.model.js';
import { ModuleModel } from './models/module/module.model.js';
import { ConflictModel } from './models/conflict/conflict.model.js';
import { DiscussionModel } from './models/discussion/discussion.model.js';
import { ActivityModel } from './models/activity/activity.model.js';

// ================= API ROUTES =================
import conflictRoutes from './routes/conflict.routes.js';

const app = express();

// ─── Global Middleware ─────────────────────────────────────────────────────
app.use(express.json());

// ─── Mount API Routes ──────────────────────────────────────────────────────
app.use('/api/v1/conflicts', conflictRoutes);

// ================= SEED ROUTE =================
app.get("/seed", async (req, res) => {
  try {
    // 1️⃣ Users
    const bde = await UserModel.create({
      name: "BDE User",
      email: "bde@test.com",
      password: "123456",
      role: "BDE"
    });

    const pm = await UserModel.create({
      name: "Project Manager",
      email: "pm@test.com",
      password: "123456",
      role: "PM"
    });

    const dev = await UserModel.create({
      name: "Developer",
      email: "dev@test.com",
      password: "123456",
      role: "DEV"
    });

    // 2️⃣ Project
    const project = await ProjectModel.create({
      name: "Food Delivery App",
      description: "Test Project",
      createdBy: bde._id,
      projectManager: pm._id,
      team: [pm._id, dev._id],
      budget: 10000,
      timeline: "3 months"
    });

    // 3️⃣ Requirements — include conflict-prone pairs for engine testing
    const req1 = await RequirementModel.create({
      projectId: project._id,
      title: "AES-256 encryption for all user data",
      description: "All user data must be encrypted using AES-256 encryption for privacy and GDPR compliance.",
      priority: "high",
      category: "Security",
      stakeholder: "Legal",
      createdBy: pm._id
    });

    const req2 = await RequirementModel.create({
      projectId: project._id,
      title: "Dashboard response time under 1 second",
      description: "The dashboard must load in less than 1 second with sub-100ms response time for all API calls.",
      priority: "high",
      category: "Performance",
      stakeholder: "PM",
      createdBy: pm._id
    });

    const req3 = await RequirementModel.create({
      projectId: project._id,
      title: "Support 10,000 concurrent users",
      description: "System must support 10,000 concurrent users with horizontal scaling and cluster replication.",
      priority: "medium",
      category: "Scalability",
      stakeholder: "Architect",
      createdBy: dev._id
    });

    const req4 = await RequirementModel.create({
      projectId: project._id,
      title: "Keep infrastructure cost under $5,000/month",
      description: "Total monthly infrastructure billing must remain under $5,000 budget.",
      priority: "medium",
      category: "Cost",
      stakeholder: "PM",
      createdBy: pm._id
    });

    // 4️⃣ Module
    await ModuleModel.create({
      projectId: project._id,
      name: "Order Module",
      assignedTo: dev._id,
      requirements: [req1._id, req2._id, req3._id, req4._id]
    });

    // 5️⃣ Activity
    await ActivityModel.create({
      projectId: project._id,
      action: "Project seeded for conflict detection testing",
      performedBy: pm._id
    });

    res.json({
      message: "✅ Seed data created — use projectId to trigger conflict analysis",
      projectId: project._id,
      analyzeUrl: `/api/v1/conflicts/analyze/${project._id}`,
      requirements: [
        { id: req1._id, title: req1.title },
        { id: req2._id, title: req2.title },
        { id: req3._id, title: req3.title },
        { id: req4._id, title: req4.title },
      ]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    message: "RCFA API is running",
    version: "1.0.0",
    endpoints: {
      seed: "GET /seed",
      analyzeConflicts: "POST /api/v1/conflicts/analyze/:projectId",
      getStatus: "GET /api/v1/conflicts/analyze/:projectId/status?jobId=xxx",
      getConflicts: "GET /api/v1/conflicts/:projectId"
    }
  });
});

export default app;