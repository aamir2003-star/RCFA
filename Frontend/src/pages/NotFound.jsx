import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f6f7f7] flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                    <div className="relative bg-white dark:bg-slate-900 size-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-100 dark:border-slate-800 mx-auto">
                        <FileQuestion className="size-16 text-indigo-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">404: Trace Lost</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        The requirement or module you're looking for doesn't exist in our current pipeline. It might have been merged or deleted.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/">
                        <Button className="w-full bg-[#1e2532] hover:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                            <Home className="w-4.5 h-4.5" />
                            Return to Command Center
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Go Back
                    </button>
                </div>

                <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        SpectraAI Error Code: ERR_MODULE_NOT_MAPPED
                    </p>
                </div>
            </div>
        </div>
    );
}
