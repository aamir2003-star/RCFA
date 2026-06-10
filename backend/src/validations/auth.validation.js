import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().transform(val => val.toUpperCase()).pipe(z.enum(["BDE", "PM", "DEV"])),
}).refine(data => data.fullName || data.name, {
  message: "Either fullName or name is required",
  path: ["name"]
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

