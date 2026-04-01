import React, { useEffect, useState } from "react";
import {
    Users,
    TrendingUp,
    DollarSign,
    Award,
    ChevronRight,
    MoreVertical,
    Plus,
    Mail,
    Shield,
    Briefcase,
    AlertCircle
} from "lucide-react";
import api from "../lib/api";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";

export default function BdeTeams() {
    const [pms, setPms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { bdeStats, fetchBdeStats } = useProjectStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/users?role=pm');
                setPms(response.data);
                await fetchBdeStats();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchBdeStats]);

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Project Managers</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Directory of active project managers and team leads.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all w-fit">
                    <Plus className="w-5 h-5" />
                    Invite PM
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total PMs"
                    value={pms.length}
                    color="text-blue-500"
                    sub="Active Directors"
                />
                <StatCard
                    icon={Briefcase}
                    label="Assigned Projects"
                    value={bdeStats?.totalProjects || 0}
                    color="text-emerald-500"
                    sub="Across Portfolio"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Ongoing Conflicts"
                    value={bdeStats?.totalConflicts || 0}
                    color="text-rose-500"
                    sub="Requiring Triage"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg. Project Load"
                    value={`${(bdeStats?.totalProjects / (pms.length || 1)).toFixed(1)}`}
                    color="text-amber-500"
                    sub="Projects / PM"
                />
            </div>

            {/* Project Managers List */}
            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Active Project Managers</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5">Email</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium">Syncing directory...</td>
                                </tr>
                            ) : pms.length > 0 ? (
                                pms.map((pm) => (
                                    <tr key={pm._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                    {pm.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{pm.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-semibold text-slate-600 dark:text-slate-300">{pm.email}</td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400">{pm.role}</td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/50">
                                                Online
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium">No Project Managers found.</td>
                                </tr>
                            )}
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
