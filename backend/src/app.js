import express from 'express'
import { UserModel } from './models/user/user.model.js';
import { ProjectModel } from './models/project/project.model.js';
import { RequirementModel } from './models/requirements/requirement.model.js';
import { ModuleModel } from './models/module/module.model.js';
import { ConflictModel } from './models/conflict/conflict.model.js';
import { DiscussionModel } from './models/discussion/discussion.model.js';
import { ActivityModel } from './models/activity/activity.model.js';

const app = express();

// middleware (ALWAYS before routes)
app.use(express.json());

// ================= IMPORT MODELS (ONLY ONCE) =================


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

    // 3️⃣ Requirements
    const req1 = await RequirementModel.create({
      projectId: project._id,
      title: "Users can cancel orders anytime",
      priority: "high",
      createdBy: pm._id
    });

    const req2 = await RequirementModel.create({
      projectId: project._id,
      title: "Orders cannot be cancelled after preparation",
      priority: "high",
      createdBy: pm._id
    });

    // 4️⃣ Module
    const moduleData = await ModuleModel.create({
      projectId: project._id,
      name: "Order Module",
      assignedTo: dev._id,
      requirements: [req1._id, req2._id]
    });

    // 5️⃣ Conflict
    const conflict = await ConflictModel.create({
      projectId: project._id,
      requirementA: req1._id,
      requirementB: req2._id,
      type: "contradiction",
      severity: "high",
      aiSuggestion: "Allow cancellation only before preparation"
    });

    // 6️⃣ Discussion
    await DiscussionModel.create({
      conflictId: conflict._id,
      comments: [
        {
          userId: dev._id,
          message: "We should restrict cancellation after preparation"
        }
      ]
    });

    // 7️⃣ Activity
    await ActivityModel.create({
      projectId: project._id,
      action: "Project created and conflict detected",
      performedBy: pm._id
    });

    res.json({
      message: "✅ Dummy data created successfully",
      projectId: project._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ================= TEST ROUTE =================
app.get("/test-user", async (req, res) => {
  const user = await UserModel.create({
    name: "Feneel",
    email: "feneel@test.com",
    password: "123456",
    role: "BDE"
  });

  res.json(user);
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app