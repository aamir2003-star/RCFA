import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { cn } from "../lib/utils";
import useAuthStore from "../stores/useAuthStore";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, register: signupUser } = useAuthStore();
  const navigate = useNavigate();

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onLoginSubmit = async (data) => {
    setAuthError("");
    const result = await login(data.email, data.password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      const role = user.role?.toLowerCase() || "dev";
      navigate(`/${role}/dashboard`);
    } else {
      setAuthError(result.message);
    }
  };

  const onSignupSubmit = async (data) => {
    setAuthError("");
    const result = await signupUser(data);
    if (result.success) {
      const user = useAuthStore.getState().user;
      const role = user.role?.toLowerCase() || "dev";
      navigate(`/${role}/dashboard`);
    } else {
      setAuthError(result.message);
    }
  };

  const onForgotSubmit = async (data) => {
    try {
      console.log("Forgot Password Request", data);
      // Simulate API Call
      await new Promise((res) => setTimeout(res, 1000));
      setForgotSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-slate-50 dark:bg-slate-950 font-display">
      <div className="flex w-full md:max-w-5xl bg-white dark:bg-slate-900 md:rounded-xl overflow-hidden shadow-2xl min-h-screen md:min-h-[700px]">

        {/* Left Side: Branding */}
        <div
          className={cn(
            "hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden transition-all duration-500",
            activeTab === "login"
              ? "bg-linear-to-br from-[#1d283a] via-[#2d3e5a] to-[#4a5d7a]"
              : "bg-[#1d283a]"
          )}
        >
          {/* Abstract overlays depending on tab */}
          {activeTab === "login" ? (
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-white/30"></div>
              <div className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full border border-white/20"></div>
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full bg-linear-to-br from-indigo-500/40 to-transparent blur-3xl"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent rotate-45"></div>
            </div>
          ) : (
            <>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </>
          )}

          <div className="z-10 mt-4 max-w-md">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Spectra AI</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 transition-all">
              {activeTab === "login"
                ? "Mastering Harmony through Intelligent Resolution."
                : "Detect conflicts before they become bugs."
              }
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-sm">
              {activeTab === "login"
                ? "Our AI-driven platform helps teams navigate complex disagreements with data-backed empathy and precision."
                : "The world's first AI-driven code analysis tool that identifies architectural clashes and logic overlaps in real-time."
              }
            </p>

            {activeTab === "login" && (
              <div className="mt-auto absolute bottom-12">
                <div className="flex -space-x-3 mb-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc2NOVjwO2-DyyUZKL6nQWJCIPoCTf6X_yQOxetpWDDffaz0RkO80r9sc4qvjwWoQT4MSp5pwzPBSG8wdeyneBA69Jbd51SCqXI6d1fZBi_pE1hj8iB5W3Je94ozDQeSJyRJui-Y2LqUEKWaj3Vg_IxMW6fJ6qLLD5uTuErFO-wEJlXThyidueRTP9YjBMXJA2fOYSrZRFOO6iSHYfk0hBlWQD2U7kpfta7ap4kN55E2FEHbYujPTneWUggwkz22px5uHexBGTwbw" className="w-11 h-11 rounded-full border-2 border-primary object-cover" alt="User" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcpftLMzi7MjJkfC6k74qh2kGHjXI5P6cxq2w4JPWIxQ5Jxx_ybEU9DCOXSdiDtINsTTz0db15F3bi0ZZA9J-egyCvflB7wP9H_L9yidSdSPivdHwxEx-cyd7dVzf2R4TEALBx7vynNr0Wl2SUbiYCG8e0k3ct_7_kRit1LgCwxkqbyHBZCaihbBTtzoI73InkN6Vw5jXVEAzae3_H9luSuL7syLLtjCaGlbRCu0RAeGwni4xBmFNveTsFNDuCIhiBFXxaKHVipk" className="w-11 h-11 rounded-full border-2 border-primary object-cover" alt="User" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD23eRDEqIZvpkJtRyjAwjX5duyqqlPD17S3TDvVk0gQ4W2ZyLtoNIp3nNzH2fOhTxo8RR7rhD4MLW-_vO40PAsJ8vynSstV2jmXJ_aKlq2xQoA2gMZv-IZQ3YMuGz0m523w7YB-ElDARfOQl-3mvIE_rJZwa7mRn9W4CNMUnVXD8jQWFlgayEumwUnrua5cuUnEeYMhVtZ83yziU1TJDWkBEWSp2StnUz4FUDisdsIVxRwAGobQBF3dpWDveHhBxbe2u6wGvE04yU" className="w-11 h-11 rounded-full border-2 border-primary object-cover" alt="User" />
                </div>
                <p className="text-sm font-medium text-white/80">Joined by over 10,000+ legal and HR professionals worldwide.</p>
              </div>
            )}

            {activeTab === "signup" && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 mt-8">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWGrSkglnUuO7mfsuE9YxIHoRPRwkPOc18z-CDFrsbRyABDgDyo_p2iTSMvpIttuSHtAiE68SE4JfT1ZdaITA6mnv6wCBB5iIDjPKd46nEiU1CkHW4JIMcpsAS_81mAqg7Nbyu4EqIPy_CoosmUoo9MUijDXDFXXIZ7ZJIokYtbehOd5rZ2oTSiSOyMQBIL1Jba6cWgJb2oqG8lpmbwwxnmWcOFsqcVRDqDpfB_Xi2Y92wuRq41NBVH8PqYmCwx-kgrwBOvCeJ2Ac" alt="Preview" className="object-cover w-full h-full opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 flex flex-col pt-6 pb-12 px-6 sm:px-12 md:px-16 justify-center overflow-y-auto">

          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center mb-10 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Spectra AI</span>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">Need Help?</Button>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {activeTab === "login" ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {activeTab === "login"
                  ? "Enter your credentials to access your workspace."
                  : "Get started with 14 days of free premium access."}
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {authError}
              </div>
            )}

            {/* Forms */}
            {activeTab === "login" ? (
              <LoginForm
                onSubmit={onLoginSubmit}
                onForgotPassword={() => setIsForgotModalOpen(true)}
                onToggleSignup={() => setActiveTab("signup")}
              />
            ) : (
              <SignupForm
                onSubmit={onSignupSubmit}
                onToggleLogin={() => setActiveTab("login")}
              />
            )}

            <div className="mt-12 flex justify-center gap-6">
              <span className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
              <span className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Contact Support</span>
            </div>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotSuccess(false);
          forgotForm.reset();
        }}
        title={!forgotSuccess ? "Reset Password" : ""}
      >
        {!forgotSuccess ? (
          <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="mt-2 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div>
              <Input
                type="email"
                placeholder="name@company.com"
                {...forgotForm.register("email")}
              />
              {forgotForm.formState.errors.email && <p className="mt-1.5 text-xs text-red-500">{forgotForm.formState.errors.email.message}</p>}
            </div>
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsForgotModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={forgotForm.formState.isSubmitting}>
                {forgotForm.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Check your email</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              We've sent password reset instructions to your email address.
            </p>
            <Button className="w-full" onClick={() => {
              setIsForgotModalOpen(false);
              setForgotSuccess(false);
            }}>
              Back to login
            </Button>
          </div>
        )}
      </Modal>

    </div>
  );
}
