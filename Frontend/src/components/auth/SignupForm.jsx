import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Briefcase, User, Code, ChevronRight } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const signupSchema = z.object({
  role: z.enum(["bde", "pm", "dev"], {
    required_error: "Please select a role",
  }),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignupForm = ({ onSubmit, onToggleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "dev", fullName: "", email: "", password: "" },
  });

  return (
    <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select your role</label>
        <div className="grid grid-cols-3 gap-3">
          {["bde", "pm", "dev"].map((role, idx) => {
            const icons = { bde: Briefcase, pm: User, dev: Code };
            const Icon = icons[role];
            const labels = { bde: "BDE", pm: "PM", dev: "DEV" };
            return (
              <label key={role} className="cursor-pointer">
                <input type="radio" value={role} className="peer sr-only" {...signupForm.register("role")} />
                <div className="flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white dark:peer-checked:bg-primary text-slate-600 dark:text-slate-400">
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{labels[role]}</span>
                </div>
              </label>
            );
          })}
        </div>
        {signupForm.formState.errors.role && <p className="mt-1.5 text-xs text-red-500">{signupForm.formState.errors.role.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
        <Input 
          type="text" 
          placeholder="John Doe" 
          {...signupForm.register("fullName")}
        />
        {signupForm.formState.errors.fullName && <p className="mt-1.5 text-xs text-red-500">{signupForm.formState.errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
        <Input 
          type="email" 
          placeholder="john@company.com" 
          {...signupForm.register("email")}
        />
        {signupForm.formState.errors.email && <p className="mt-1.5 text-xs text-red-500">{signupForm.formState.errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            {...signupForm.register("password")}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {signupForm.formState.errors.password && <p className="mt-1.5 text-xs text-red-500">{signupForm.formState.errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full py-6 text-base group" disabled={signupForm.formState.isSubmitting}>
        {signupForm.formState.isSubmitting ? "Creating..." : "Create Account"}
        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account? <button type="button" onClick={onToggleLogin} className="font-bold text-primary hover:underline ml-1">Log in</button>
      </div>
    </form>
  );
};
