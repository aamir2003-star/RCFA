import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createModuleSchema = z.object({
  projectId: objectId,
  name: z.string().trim().min(2, "Module name must be at least 2 characters"),
  description: z.string().trim().max(500).optional().default(""),
  assignedTo: objectId.optional(),
  requirements: z.array(objectId).optional().default([]),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});

export const updateModuleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Module name must be at least 2 characters")
      .optional(),
    description: z.string().trim().max(500).optional(),
    assignedTo: objectId.nullable().optional(),
    requirements: z.array(objectId).optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required to update a module",
  });

export const assignDeveloperSchema = z.object({
  developerId: objectId,
});
