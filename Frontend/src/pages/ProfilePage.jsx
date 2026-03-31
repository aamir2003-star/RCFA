import React from "react";
import { User, Mail, Shield, Briefcase, Calendar, MapPin, Edit3, Camera, Activity, CheckCircle2 } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import { cn } from "../lib/utils";

export default function ProfilePage() {
    const { user } = useAuthStore();

    const profileName = user?.name || "Alexander Wright";
    const profileRole = user?.role?.toUpperCase() || "SENIOR PRODUCT MANAGER";
    const profileEmail = user?.email || "alex.wright@spectra.ai";
    const profileInitials = profileName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "AW";

    const InfoCard = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-violet-700 shadow-2xl shadow-indigo-500/20">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-6 right-8">
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/20 transition-all active:scale-95">
                        <Edit3 className="w-4 h-4" />
                        Edit Cover
                    </button>
                </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="px-8 -mt-24 relative z-10 pb-12">
                <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="group relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white dark:bg-[#0f1115] p-2 shadow-2xl shadow-black/10">
                            <div className="w-full h-full rounded-[2.2rem] bg-linear-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-4xl md:text-5xl font-black tracking-tighter border-4 border-white dark:border-[#0f1115]">
                                {profileInitials}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg border-4 border-white dark:border-[#0f1115] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all active:scale-90">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {profileName}
                            </h1>
                            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/20">
                                PRO PLUS
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            {profileRole}
                        </p>
                    </div>

                    <div className="flex gap-3 pb-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-3 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10">
                            Share Profile
                        </button>
                        <button className="px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 transition-all active:scale-95">
                            <Edit3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard icon={Mail} label="Work Email" value={profileEmail} />
                            <InfoCard icon={Briefcase} label="Department" value="Product Architecture" />
                            <InfoCard icon={MapPin} label="Location" value="San Francisco, CA" />
                            <InfoCard icon={Calendar} label="Join Date" value="March 12, 2024" />
                        </div>

                        <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                Recent Professional Activity
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { action: "Resolved conflict in", target: "Project Aurora", time: "2 hours ago", type: "success" },
                                    { action: "Updated requirement spec for", target: "Module X-Gamma", time: "5 hours ago", type: "info" },
                                    { action: "Approved BDE proposal for", target: "Client Spectra", time: "1 day ago", type: "success" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-2 shrink-0",
                                            item.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                        )}></div>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="text-slate-500 dark:text-slate-400">{item.action}</span>{" "}
                                                <span className="font-bold text-slate-900 dark:text-white">{item.target}</span>
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-500 transition-all">
                                View Full Activity Log
                            </button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="space-y-6">
                        <div className="bg-linear-to-br from-[#1e2532] to-[#080b11] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Conflict Stats</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-3xl font-black tracking-tighter">1,204</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conflicts Analyzed</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black tracking-tighter text-indigo-400">98.2%</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Rate</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Elite Resolver Badge</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Active Stakeholder</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Account Security</h4>
                            <p className="text-xs text-slate-500 mb-4">Last login from <span className="text-indigo-500 font-bold">192.168.1.1</span></p>
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2 hover:gap-3 transition-all">
                                Security Settings
                                <Edit3 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
