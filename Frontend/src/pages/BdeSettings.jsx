import React from "react";
import {
    User,
    Bell,
    Shield,
    Globe,
    ChevronRight,
    Save
} from "lucide-react";
import { bdeSettings } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function BdeSettings() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your profile, notifications, and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    <SettingsNav icon={User} label="Profile" active />
                    <SettingsNav icon={Bell} label="Notifications" />
                    <SettingsNav icon={Shield} label="Security" />
                    <SettingsNav icon={Globe} label="Language & Region" />
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/5 dark:shadow-none space-y-8">
                        <div className="flex items-center gap-6">
                            <img src={bdeSettings.profile.avatar} alt="Profile" className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{bdeSettings.profile.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{bdeSettings.profile.role}</p>
                                <button className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mt-2 hover:underline">Change Avatar</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input type="text" defaultValue={bdeSettings.profile.name} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input type="email" defaultValue={bdeSettings.profile.email} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all" />
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notification Preferences</h4>
                            <div className="space-y-4">
                                {bdeSettings.notifications.map((notif) => (
                                    <div key={notif.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{notif.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.type}</p>
                                        </div>
                                        <div className={cn("w-12 h-6 rounded-full p-1 transition-colors cursor-pointer", notif.enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")}>
                                            <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", notif.enabled ? "translate-x-6" : "translate-x-0")}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsNav({ icon: Icon, label, active }) {
    return (
        <button className={cn(
            "flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 group",
            active
                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                : "bg-white/50 dark:bg-[#0f1115]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600"
        )}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform", active && "opacity-100")} />
        </button>
    );
}
