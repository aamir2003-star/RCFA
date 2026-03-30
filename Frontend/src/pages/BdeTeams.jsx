import React from "react";
import {
    Users,
    TrendingUp,
    DollarSign,
    Award,
    ChevronRight,
    MoreVertical,
    Plus
} from "lucide-react";
import { bdeTeams } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function BdeTeams() {
    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Teams Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Monitor sales performance and team distribution.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all w-fit">
                    <Plus className="w-5 h-5" />
                    Create New Team
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Agents" value="35" change="+3" color="text-blue-500" />
                <StatCard icon={TrendingUp} label="Avg Growth" value="14.8%" change="+2.4%" color="text-emerald-500" />
                <StatCard icon={DollarSign} label="Total Pipeline" value="$4.5M" change="+$0.8M" color="text-indigo-500" />
                <StatCard icon={Award} label="Top Team" value="Global Ops" sub="22% Growth" color="text-amber-500" />
            </div>

            {/* Teams List */}
            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Active Sales Teams</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5">Team Name</th>
                                <th className="px-8 py-5">Team Lead</th>
                                <th className="px-8 py-5">Agents</th>
                                <th className="px-8 py-5">Revenue</th>
                                <th className="px-8 py-5">Growth</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {bdeTeams.map((team) => (
                                <tr key={team.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-10 rounded-full", team.color)}></div>
                                            <span className="font-bold text-slate-900 dark:text-white">{team.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-semibold text-slate-600 dark:text-slate-300">{team.lead}</td>
                                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{team.members}</td>
                                    <td className="px-8 py-6 font-black text-indigo-600 dark:text-indigo-400">{team.revenue}</td>
                                    <td className="px-8 py-6 font-bold text-emerald-500">{team.growth}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                                            {team.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, sub, color }) {
    return (
        <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-xl bg-slate-50 dark:bg-slate-800", color)}>
                    <Icon className="w-6 h-6" />
                </div>
                {change && (
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                        {change}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
                    {sub && <span className="text-xs font-bold text-slate-500">{sub}</span>}
                </div>
            </div>
        </div>
    );
}
