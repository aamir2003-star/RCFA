import React from "react";
import {
    Users,
    UserPlus,
    FileDown,
    Search,
    Filter,
    SortAsc,
    MoreVertical,
    ArrowRight,
    Shield,
    Mail,
    Activity,
    AlertTriangle,
    Monitor,
    Terminal,
    Gavel,
    CheckCircle2,
    Lock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { teamStats, teamRoster } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function TeamManagement() {
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
                        Monitor resource allocation, manage conflict resolution permissions, and coordinate across cross-functional engineering units.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                        <FileDown className="w-4.5 h-4.5" />
                        Export Roster
                    </button>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest">
                        <UserPlus className="w-4.5 h-4.5" />
                        Invite New Member
                    </Button>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamStats.map((stat, i) => (
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
                            <p className="text-xs font-bold text-slate-400 tracking-tight">Managing 42 active engineering resources</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64"
                                />
                            </div>
                            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 transition-all">
                                <Filter className="w-4.5 h-4.5" />
                            </button>
                            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 transition-all">
                                <SortAsc className="w-4.5 h-4.5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workload</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {teamRoster.map((member) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={member.avatar} alt={member.name} className="size-11 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                                                    <div className={cn("absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white dark:border-[#0f1115]", member.statusColor)}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{member.name}</p>
                                                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="w-48 space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                                                    <span className="text-slate-900 dark:text-white">{member.workload}%</span>
                                                    <span className={cn(member.workload > 80 ? 'text-red-500' : 'text-slate-400')}>{member.workload > 80 ? 'CRITICAL' : 'OPTIMAL'}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-1000", member.workload > 80 ? 'bg-red-500' : 'bg-indigo-500')}
                                                        style={{ width: `${member.workload}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={cn("px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2", member.statusBg, member.statusText)}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", member.statusColor)}></div>
                                                    {member.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Showing 1-4 of 42 members</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">Prev</button>
                            <button className="size-9 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20">1</button>
                            <button className="size-9 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900">2</button>
                            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">Next</button>
                        </div>
                    </div>
                </section>

                {/* Right Sidebar: RBAC & Invitation */}
                <aside className="xl:col-span-4 flex flex-col gap-8 w-full">
                    {/* RBAC Matrix */}
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Access Control Matrix</h3>

                        <div className="space-y-6">
                            <RBACGroup
                                title="System Architects"
                                icon={Terminal}
                                permissions={[
                                    { label: "Conflict Resolution", value: "Full Access", active: true },
                                    { label: "Resource Management", value: "Full Access", active: true },
                                    { label: "Financial Reports", value: "Read Only", active: false }
                                ]}
                            />
                            <RBACGroup
                                title="Resolution Officers"
                                icon={Shield}
                                permissions={[
                                    { label: "Conflict Resolution", value: "Full Access", active: true },
                                    { label: "Team Audit Logs", value: "Read Only", active: false }
                                ]}
                            />
                            <RBACGroup
                                title="External Legal Counsel"
                                icon={Gavel}
                                permissions={[
                                    { label: "Legal Discovery", value: "Full Access", active: true },
                                    { label: "Project Details", value: "Restricted", active: false, alert: true }
                                ]}
                            />
                        </div>

                        <button className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] hover:text-indigo-500 transition-all">
                            Edit Global RBAC Policies
                        </button>
                    </div>

                    {/* Invitation Banner */}
                    <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-3xl p-8 relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-500/10 border border-indigo-500/10">
                        <div className="relative z-10 space-y-5">
                            <div className="size-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
                                <Mail className="w-6 h-6 animate-bounce" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-white tracking-tight">Grow your department?</h4>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">Add experts to your conflict resolution workflow instantly.</p>
                            </div>
                            <button className="flex items-center gap-3 text-[11px] font-black text-white uppercase tracking-widest group-hover:translate-x-3 transition-transform duration-500">
                                Invite via Email
                                <ArrowRight className="w-4 h-4 text-indigo-400" />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function RBACGroup({ title, icon: Icon, permissions }) {
    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all group/rbac">
            <div className="flex items-center gap-3 mb-5">
                <div className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/rbac:text-indigo-500 transition-colors">
                    <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{title}</span>
            </div>
            <div className="space-y-3">
                {permissions.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">{p.label}</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-lg",
                            p.active ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" : p.alert ? "text-red-500 bg-red-50 dark:bg-red-500/10" : "text-slate-400 bg-slate-50 dark:bg-slate-800"
                        )}>{p.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
