import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const LoginForm = ({ onSubmit, onForgotPassword, onToggleSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  return (
    <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
        <Input 
          type="email" 
          placeholder="name@company.com" 
          {...loginForm.register("email")}
          className={loginForm.formState.errors.email ? "border-red-500 focus:ring-red-500/20" : ""}
        />
        {loginForm.formState.errors.email && <p className="mt-1.5 text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <button type="button" onClick={onForgotPassword} className="text-sm font-semibold text-primary hover:underline">Forgot password?</button>
        </div>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            {...loginForm.register("password")}
            className={loginForm.formState.errors.password ? "border-red-500 focus:ring-red-500/20" : ""}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {loginForm.formState.errors.password && <p className="mt-1.5 text-xs text-red-500">{loginForm.formState.errors.password.message}</p>}
      </div>
      <div className="flex items-center">
        <input 
          id="remember-me" 
          type="checkbox" 
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
          {...loginForm.register("rememberMe")} 
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">Remember me for 30 days</label>
      </div>
      <Button 
        type="submit" 
        className="w-full py-6 text-base text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 transition-colors shadow-none" 
        disabled={loginForm.formState.isSubmitting}
      >
        {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in to Account"}
      </Button>
      <div className="mt-8 text-center text-sm text-slate-500">
        Don't have an account? <button type="button" onClick={onToggleSignup} className="font-bold text-primary hover:underline ml-1">Create an account</button>
      </div>
    </form>
  );
};
