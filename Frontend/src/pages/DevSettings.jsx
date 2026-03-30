import React from "react";
import {
    User,
    Settings,
    Shield,
    Globe,
    Terminal,
    Key,
    Cpu,
    Save,
    ChevronRight,
    Github
} from "lucide-react";
import { cn } from "../lib/utils";

export default function DevSettings() {
    const profile = {
        name: "Alex Rivera",
        role: "Senior Full Stack Developer",
        email: "alex.dev@spectra.ai",
        avatar: "https://i.pravatar.cc/100?u=liam"
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    System Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure your development environment and personal profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Nav */}
                <div className="space-y-2">
                    <SettingsTab icon={User} label="General Profile" active />
                    <SettingsTab icon={Terminal} label="IDE Sync" />
                    <SettingsTab icon={Key} label="API Access" />
                    <SettingsTab icon={Shield} label="Security" />
                    <SettingsTab icon={Globe} label="Localization" />
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/5 dark:shadow-none space-y-8">
                        <div className="flex items-center gap-8">
                            <div className="relative group cursor-pointer">
                                <img src={profile.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl group-hover:scale-105 transition-transform" alt="avatar" />
                                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Save className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{profile.role}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Maintainer</span>
                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="User Identifier" value="arivera_dev" />
                            <InputGroup label="Primary Email" value={profile.email} />
                            <InputGroup label="Technical Stack" value="Node.js, React, Postgres" />
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GitHub Account</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    <Github className="w-5 h-5 text-slate-900 dark:text-white" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">@arivera-codes</span>
                                    <span className="ml-auto text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-indigo-500" />
                                Environment Preferences
                            </h4>
                            <div className="space-y-4">
                                <ToggleItem label="Enable AI-Vault Sync" desc="Automatically back up conflict resolution patterns to the private cloud." enabled />
                                <ToggleItem label="Real-time Pipeline Webhooks" desc="Receive atomic updates on module contradiction spikes." enabled />
                                <ToggleItem label="Developer Analytics" desc="Share anonymous performance metrics to improve the Conflict AI model." />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-10 py-3.5 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                                <Save className="w-4 h-4" />
                                Update Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon: Icon, label, active }) {
    return (
        <button className={cn(
            "flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 group shadow-sm hover:shadow-md",
            active
                ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20"
                : "bg-white/50 dark:bg-[#0f1115]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600"
        )}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform", active && "opacity-100")} />
        </button>
    );
}

function InputGroup({ label, value }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
            <input type="text" defaultValue={value} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-sm" />
        </div>
    );
}

function ToggleItem({ label, desc, enabled }) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/30 dark:bg-white/[0.01] border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all cursor-pointer group">
            <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{label}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">{desc}</p>
            </div>
            <div className={cn("w-12 h-6 rounded-full p-1 transition-colors relative shadow-inner", enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")}>
                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform shadow-md", enabled ? "translate-x-6" : "translate-x-0")}></div>
            </div>
        </div>
    );
}
