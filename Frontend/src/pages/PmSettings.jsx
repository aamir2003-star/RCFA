import React from "react";
import {
    User,
    Settings,
    Bell,
    Shield,
    Database,
    Cloud,
    ChevronRight,
    Users,
    Save
} from "lucide-react";

export default function PmSettings() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    Management Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure project oversight and team resolution protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Nav */}
                <div className="space-y-1">
                    {[
                        { icon: User, label: "Profile Info", active: true },
                        { icon: Users, label: "Team Permissions", active: false },
                        { icon: Bell, label: "Conflict Alerts", active: false },
                        { icon: Shield, label: "Legal Compliance", active: false },
                        { icon: Database, label: "Vault Sync", active: false },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="Alexander Wright" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role ID</label>
                                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-400" disabled defaultValue="SENIOR_PM_44" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Work Email</label>
                                <input type="email" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="alex@spectra.ai" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Conflict Resolution Protocol</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Auto-Escalation</p>
                                    <p className="text-[10px] font-medium text-slate-500">Escalate conflicts unresolved for {'>'}48h to Legal.</p>
                                </div>
                                <div className="w-10 h-5 bg-indigo-500 rounded-full relative">
                                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">AI Voting Weight</p>
                                    <p className="text-[10px] font-medium text-slate-500">Grant AI-Resolver 25% weight in consensus.</p>
                                </div>
                                <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative">
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                        <button className="px-8 py-3 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
