import React, { useEffect, useState } from "react";
import {
    Users,
    Search,
    Filter,
    SortAsc,
    MoreVertical,
    ArrowRight,
    Shield,
    Mail,
    Activity,
    AlertTriangle,
    Terminal,
    Gavel,
    Loader2,
    Briefcase
} from "lucide-react";
import { Button } from "../components/ui/Button";
import useTeamStore from "../stores/useTeamStore";
import { cn } from "../lib/utils";

export default function TeamManagement() {
    const { members, totalMembers, totalProjects, loading, fetchTeam } = useTeamStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    // Compute stats dynamically from real data
    const stats = [
        {
            title: "Total Members",
            value: totalMembers.toString(),
            subtext: `${totalProjects} project${totalProjects !== 1 ? 's' : ''}`,
            icon: Users,
            color: "text-indigo-600 dark:text-indigo-400"
        },
        {
            title: "Developers",
            value: members.filter(m => m.role?.toLowerCase() === 'dev').length.toString(),
            subtext: "Active",
            icon: Activity,
            color: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: "Project Managers",
            value: members.filter(m => m.role?.toLowerCase() === 'pm').length.toString(),
            subtext: "Assigned",
            icon: Briefcase,
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Highest Workload",
            value: members.length > 0 ? Math.max(...members.map(m => m.projectCount || 0)).toString() : "0",
            subtext: "Projects/person",
            icon: AlertTriangle,
            color: "text-amber-600 dark:text-amber-400"
        }
    ];

    // Filter members by search query
    const filteredMembers = members.filter(member =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium">Loading team data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Admin</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Organization Units</span>
                    </nav>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Team Management</h1>
                    <p className="text-sm font-bold text-slate-500 max-w-2xl leading-relaxed italic">
                        View team members across your projects. {totalMembers} members across {totalProjects} project{totalProjects !== 1 ? 's' : ''}.
                    </p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none group hover:-translate-y-1 transition-all duration-500">
                        <div className={cn("inline-flex p-3 rounded-2xl mb-5 shadow-lg shadow-current/10", stat.color.replace('text-', 'bg-').replace('600', '500/10'))}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.title}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                                <span className={cn("text-[10px] font-black uppercase tracking-tight", stat.color)}>{stat.subtext}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Member Roster Table */}
                <section className="xl:col-span-8 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Member Roster</h3>
                            <p className="text-xs font-bold text-slate-400 tracking-tight">{filteredMembers.length} team member{filteredMembers.length !== 1 ? 's' : ''} found</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workload</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Projects</th>
                                    <th className="px-8 py-5 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                                            {searchQuery ? "No members match your search." : "No team members found. Assign developers to your projects to see them here."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => {
                                        const workloadPercent = Math.min((member.projectCount || 0) * 25, 100);
                                        return (
                                            <tr key={member._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="size-11 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm border-2 border-white dark:border-slate-800 shadow-sm">
                                                                {member.name?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{member.name}</p>
                                                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.role || 'Team Member'} • {member.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-48 space-y-2">
                                                        <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                                                            <span className="text-slate-900 dark:text-white">{member.projectCount || 0} project{(member.projectCount || 0) !== 1 ? 's' : ''}</span>
                                                            <span className={cn(workloadPercent > 75 ? 'text-red-500' : workloadPercent > 50 ? 'text-amber-500' : 'text-emerald-500')}>
                                                                {workloadPercent > 75 ? 'HIGH' : workloadPercent > 50 ? 'MODERATE' : 'OPTIMAL'}
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn("h-full rounded-full transition-all duration-1000", workloadPercent > 75 ? 'bg-red-500' : workloadPercent > 50 ? 'bg-amber-500' : 'bg-indigo-500')}
                                                                style={{ width: `${workloadPercent}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                        {(member.projects || []).slice(0, 3).map((proj, i) => (
                                                            <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                                {proj}
                                                            </span>
                                                        ))}
                                                        {(member.projects || []).length > 3 && (
                                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                                                                +{member.projects.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {filteredMembers.length} of {totalMembers} members
                        </p>
                    </div>
                </section>

                {/* Right Sidebar: Team Summary */}
                <aside className="xl:col-span-4 flex flex-col gap-8 w-full">
                    {/* Role Distribution */}
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Role Distribution</h3>
                        <div className="space-y-6">
                            {['Dev', 'PM', 'BDE'].map(role => {
                                const count = members.filter(m => m.role?.toLowerCase() === role.toLowerCase()).length;
                                const percent = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                                return (
                                    <div key={role} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-black">
                                            <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">{role === 'Dev' ? 'Developers' : role === 'PM' ? 'Project Managers' : 'Business Development'}</span>
                                            <span className="text-slate-400">{count} ({percent}%)</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Info Banner */}
                    <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-3xl p-8 relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-500/10 border border-indigo-500/10">
                        <div className="relative z-10 space-y-5">
                            <div className="size-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-white tracking-tight">Team Overview</h4>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                                    {totalMembers} team member{totalMembers !== 1 ? 's' : ''} working across {totalProjects} active project{totalProjects !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
