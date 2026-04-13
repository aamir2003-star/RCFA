import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Layers,
    CheckCircle2,
    AlertCircle,
    Clock,
    FileText,
    Users,
    Shield,
    Briefcase,
    ChevronRight,
    TrendingUp,

} from 'lucide-react';
import useProjectStore from '../stores/useProjectStore';
import useModuleStore from '../stores/useModuleStore';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { downloadCSV, formatProjectBrief, calculateProgress } from '../lib/exportUtils';

export default function BdeProjectDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get("projectId");

    const {
        projects,
        fetchProjects,
        currentProject,
        setCurrentProject,
        projectStats,
        fetchProjectStats,
        requirements,
        fetchRequirements
    } = useProjectStore();

    const {
        modules,
        fetchModules
    } = useModuleStore();

    useEffect(() => {
        if (!projectId) {
            navigate('/bde/dashboard');
            return;
        }

        // Fetch all required data
        fetchProjects();
        fetchProjectStats(projectId);
        fetchModules(projectId);
        fetchRequirements(projectId, 1, 50);

        // Find and set project
        const project = projects.find(p => p._id === projectId);
        if (project) setCurrentProject(project);

    }, [projectId, fetchProjects, fetchProjectStats, fetchModules, fetchRequirements, navigate]);

    const progressValue = useMemo(() => {
        if (!currentProject) return 0;
        return calculateProgress(currentProject);
    }, [currentProject]);

    const handleExport = () => {
        if (!currentProject) return;

        // Prepare detailed data for export
        const projectData = formatProjectBrief(currentProject);

        // Add module summaries to the export if needed, 
        // but for now brief report is enough as requested.
        downloadCSV([projectData], `${currentProject.name}_Report`);
    };

    if (!currentProject) return null;

    return (
        <div className="w-full max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-end border-b border-border/20 pb-12 mb-12 gap-8">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group w-14 h-14 rounded-full border border-border/20 flex items-center justify-center hover:bg-black dark:hover:bg-white transition-all duration-500"
                    >
                        <ArrowLeft className="w-6 h-6 text-muted group-hover:text-white dark:group-hover:text-black transition-colors" />
                    </button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] shadow-premium">
                                Project Specification
                            </div>
                            <h1 className="text-4xl font-display font-[300] text-foreground tracking-tight">{currentProject.name}</h1>
                        </div>
                        <p className="text-base text-muted font-sans tracking-wide">
                            Detailed overview of client requirements and implementation architecture.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleExport}
                        className="group flex items-center gap-3 px-8 py-4 bg-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black text-muted uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500 shadow-sm"
                    >
                        <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                        Export Full Report
                    </button>
                    <Button
                        onClick={() => navigate(`/bde/analytics?projectId=${projectId}`)}
                        className="h-14 px-10 rounded-2xl font-black bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all"
                    >
                        Real-time Analytics
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Health & Progress */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Overall Progress Card */}
                    <div className="premium-card p-10 bg-indigo-600 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-8">Overall Velocity</h3>
                            <div className="flex items-end gap-3 mb-10">
                                <span className="text-7xl font-display font-[300] tracking-tighter leading-none">{progressValue}%</span>
                                <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Complete</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000"
                                    style={{ width: `${progressValue}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Stats Breakdown */}
                    <div className="premium-card p-8 space-y-8">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted mb-4 text-center">Health Synthesis</h3>

                        <div className="space-y-6">
                            <StatRow
                                icon={AlertCircle}
                                label="Conflict Resolution"
                                value={`${currentProject.resolvedConflictCount || 0} / ${currentProject.conflictCount || 0}`}
                                percentage={currentProject.conflictCount > 0 ? (currentProject.resolvedConflictCount / currentProject.conflictCount) * 100 : 100}
                                color="amber"
                            />
                            <StatRow
                                icon={Layers}
                                label="Module Completion"
                                value={`${currentProject.completedModuleCount || 0} / ${currentProject.totalModuleCount || 0}`}
                                percentage={currentProject.totalModuleCount > 0 ? (currentProject.completedModuleCount / currentProject.totalModuleCount) * 100 : 0}
                                color="emerald"
                            />
                            <StatRow
                                icon={FileText}
                                label="Requirement Coverage"
                                value={`${currentProject.requirementCount || 0} Drafted`}
                                percentage={100}
                                color="indigo"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Module & Requirement Lists */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Architectural Modules Section */}
                    <div className="premium-card p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-display font-[300] tracking-tight">System Architecture</h3>
                                <p className="text-[13px] text-muted font-sans tracking-wide">Implementation blocks and development status</p>
                            </div>
                            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700" onClick={() => navigate(`/bde/editor?projectId=${projectId}`)}>
                                Manage <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map((mod) => (
                                <div key={mod._id} className="p-6 rounded-3xl bg-secondary/20 border border-border/5 group hover:border-black dark:hover:border-white transition-all duration-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            mod.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                mod.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                                                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                        )}>
                                            {mod.status}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-bold text-foreground mb-1">{mod.name}</h4>
                                    <p className="text-xs text-muted line-clamp-1 italic">{mod.description || "No description provided."}</p>
                                </div>
                            ))}
                            {modules.length === 0 && (
                                <div className="col-span-2 py-12 text-center border-2 border-dashed border-border/10 rounded-[2.5rem]">
                                    <p className="text-muted font-display font-[300] italic">No architectural modules defined yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Technical Directives (Requirements) */}
                    <div className="premium-card p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-display font-[300] tracking-tight">Technical Directives</h3>
                                <p className="text-[13px] text-muted font-sans tracking-wide">High-priority project specifications</p>
                            </div>
                            <span className="text-[11px] font-black text-muted uppercase tracking-widest">{requirements.length} Total</span>
                        </div>

                        <div className="space-y-4">
                            {requirements.slice(0, 5).map((req) => (
                                <div key={req._id} className="flex items-center p-6 rounded-3xl bg-secondary/10 border border-border/5 hover:border-indigo-500/20 transition-all duration-300">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-premium",
                                        req.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                                    )}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-foreground truncate">{req.title}</h4>
                                        <p className="text-[10px] text-muted uppercase tracking-widest font-black opacity-40">{req.category} • {req.status}</p>
                                    </div>
                                    <div className="text-right ml-6 pl-6 border-l border-border/10">
                                        <CheckCircle2 className={cn("w-5 h-5", req.status === 'approved' ? 'text-emerald-500' : 'text-slate-300')} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatRow({ icon: Icon, label, value, percentage, color }) {
    const colorClasses = {
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500"
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-muted">{label}</span>
                </div>
                <span className="text-foreground">{value}</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-1 relative overflow-hidden">
                <div
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", colorClasses[color])}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
