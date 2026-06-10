import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Rocket, AlertTriangle, CheckCircle2, AlertCircle, Clock, BarChart, ArrowLeft, Shield } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../../stores/useProjectStore';
import ProjectSelector from '../shared/ProjectSelector';
import {
  ANALYTICS_TIMEFRAMES,
  TIMEFRAME_SUBHEADERS,
  DEFAULT_SUBHEADER,
  ANALYTICS_STATS_TEMPLATE,
  SEVERITY_BREAKDOWN_TEMPLATE
} from '../../constants/analytics';
import { cn } from '../../lib/utils';

const IconMap = {
  Calendar,
  Download,
  FileText,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart
};

const StatCard = ({ title, value, change, isPositive, iconName, colorClass, progressClass, progressValue, tooltip }) => {
  const Icon = IconMap[iconName] || FileText;
  return (
    <div className="premium-card p-8 group transition-all duration-500 hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-[11px] font-[900] text-muted uppercase tracking-[0.25em]">{title}</h3>
          <p className="text-[12px] text-muted/60 font-sans tracking-wide leading-tight group-hover:text-muted transition-colors">{tooltip}</p>
        </div>
        <div className={cn("p-2.5 rounded-xl shadow-premium", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mb-4">
        <span className="text-4xl font-display font-[300] text-foreground tracking-tight">{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
          isPositive
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
        )}>
          {isPositive ? "↑" : "↓"} {change}
        </div>
        <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-40">Live Delta</span>
      </div>
      <div className="mt-8 w-full bg-secondary/30 rounded-full h-1 relative overflow-hidden">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", progressClass)}
          style={{ width: progressValue }}
        ></div>
      </div>
    </div>
  );
};

const ConflictTrendsChart = ({ timeline, timeframe }) => {
  const max = Math.max(...(timeline?.map(t => t.count) || [0]), 10);
  const subheader = TIMEFRAME_SUBHEADERS[timeframe] || DEFAULT_SUBHEADER;

  return (
    <div className="premium-card p-10 col-span-1 lg:col-span-2 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-1">
          <h3 className="text-2xl font-display font-[300] text-foreground tracking-tight">Detection Timeline</h3>
          <p className="text-[13px] text-muted font-sans tracking-wide">{subheader}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-glow"></span>
            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Signal Events</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-3 pb-8 relative pt-10">
        {timeline && timeline.length > 0 ? (
          timeline.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
              <div className="relative w-full flex justify-center items-end h-[180px]">
                <div
                  className="w-full max-w-[12px] bg-secondary/50 group-hover:bg-black dark:group-hover:bg-white rounded-full transition-all duration-700 relative shadow-premium"
                  style={{ height: `${(item.count / max) * 100}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-xl text-[10px] font-[900] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-pill">
                    {item.count} Detected
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-[800] text-muted/40 uppercase tracking-widest group-hover:text-foreground transition-colors">
                {item._id.includes(':')
                  ? (() => {
                    const hour = parseInt(item._id.split(' ')[1].split(':')[0]);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    return `${hour % 12 || 12}${ampm}`;
                  })()
                  : new Date(item._id).toLocaleDateString(undefined, { weekday: 'short' })
                }
              </span>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted font-display font-[300] text-xl opacity-30 italic">
            Zero signal anomalies detected.
          </div>
        )}
      </div>
    </div>
  );
};

const ConflictsByType = ({ data, stats }) => (
  <div className="premium-card p-10 flex flex-col">
    <div className="mb-10 space-y-1">
      <h3 className="text-2xl font-display font-[300] text-foreground tracking-tight">Risk Vector Distribution</h3>
      <p className="text-[13px] text-muted font-sans tracking-wide opacity-80">Categorical breakdown by impact severity.</p>
    </div>

    <div className="space-y-10 flex-1">
      {data.map((item, index) => (
        <div key={index} className="group flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">{item.type}</span>
            <span className="text-base font-display font-[300] text-foreground">{item.percentage}%</span>
          </div>
          <div className="w-full bg-secondary/30 rounded-full h-1 relative overflow-hidden">
            <div className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", item.colorClass)} style={{ width: `${item.percentage}%` }}></div>
          </div>
        </div>
      ))}
    </div>

    {stats?.conflicts?.high > 0 && (
      <div className="mt-12 bg-rose-500/5 rounded-3xl p-6 flex items-start border border-rose-500/10 group animate-pulse">
        <div className="bg-rose-500/10 p-3 rounded-2xl mr-4 shadow-premium">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Immediate Escalation Required</h4>
          <p className="text-[13px] text-rose-500/70 font-sans leading-relaxed tracking-tight">
            {stats.conflicts.high} Red-line conflicts identified. Core velocity is currently obstructed.
          </p>
        </div>
      </div>
    )}
  </div>
);

const ActivityLog = ({ activity }) => (
  <div className="premium-card p-10 col-span-1 lg:col-span-2">
    <div className="flex justify-between items-end mb-12">
      <div className="space-y-1">
        <h3 className="text-2xl font-display font-[300] text-foreground tracking-tight">Intelligence Ledger</h3>
        <p className="text-[13px] text-muted font-sans tracking-wide">Autonomous audit of system signal events.</p>
      </div>
      <button className="text-[11px] font-[900] text-muted hover:text-foreground uppercase tracking-[0.2em] transition-colors">
        Export Audit
      </button>
    </div>

    <div className="space-y-4">
      {activity && activity.length > 0 ? (
        activity.map((item, index) => (
          <div key={index} className="flex items-center p-6 rounded-3xl bg-secondary/20 border border-border/5 group hover:border-black dark:hover:border-white transition-all duration-500">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-premium transition-transform duration-500 group-hover:scale-105",
              item.severity === 'Red' ? 'bg-rose-500/10 text-rose-500' :
                item.severity === 'Orange' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-emerald-500/10 text-emerald-500'
            )}>
              <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-40">{item.type}</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  item.status === 'open' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                )}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-[15px] font-bold text-foreground truncate font-sans tracking-tight">{item.title}</h4>
            </div>
            <div className="text-right ml-6 pl-6 border-l border-border/10">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-40 mb-1">Observation</p>
              <p className="text-[13px] text-foreground font-display font-[300] whitespace-nowrap">
                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="py-24 text-center space-y-4 border-2 border-dashed border-border/10 rounded-[3rem]">
          <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto opacity-20">
            <Shield className="w-8 h-8" />
          </div>
          <p className="text-xl font-display font-[300] text-muted italic">Steady state. Signals clear.</p>
        </div>
      )}
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const isPm = window.location.pathname.startsWith('/pm');

  const {
    projects,
    fetchProjects,
    currentProject,
    setCurrentProject,
    projectStats,
    fetchProjectStats,
    loading: storeLoading,
    error: storeError,
    clearError
  } = useProjectStore();

  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState(ANALYTICS_TIMEFRAMES.WEEKLY);

  useEffect(() => {
    if (!projectId) {
      fetchProjects();
    } else {
      // Find project in state or set it if we have ID
      const project = projects.find(p => p._id === projectId);
      if (project) {
        setCurrentProject(project);
      } else if (projects.length > 0) {
        // If not found but projects are loaded, might be an invalid ID or not assigned
        console.warn("Project not found in user's assigned list");
      }
    }
    return () => clearError();
  }, [projectId, projects, fetchProjects, setCurrentProject, clearError]);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetchProjectStats(projectId, timeframe).finally(() => setIsLoading(false));
    }
  }, [projectId, timeframe, fetchProjectStats]);

  const stats = projectStats || {};
  const conflictTotal = stats.conflicts?.total || 0;

  const dynamicCards = ANALYTICS_STATS_TEMPLATE.map(template => {
    // Helper to get nested values
    const getValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
    const value = getValue(stats, template.keyPath) || 0;

    return {
      ...template,
      value: template.keyPath === 'conflicts.total' ? value.toString() : `${value}%`,
      change: template.keyPath === 'readiness' ? (value > 70 ? "Stable" : "Critical") :
        template.keyPath === 'conflicts.total' ? `${stats.conflicts?.high || 0} Critical` : "+2% drift",
      isPositive: template.keyPath === 'conflicts.total' ? (stats.conflicts?.high || 0) === 0 : value > 70,
      progressValue: template.keyPath === 'conflicts.total' ? (value > 0 ? "100%" : "0%") : `${value}%`
    };
  });

  const severityBreakdown = SEVERITY_BREAKDOWN_TEMPLATE.map(template => ({
    type: template.label,
    percentage: conflictTotal > 0 ? Math.round((stats.conflicts?.[template.key] / conflictTotal) * 100) : 0,
    colorClass: template.colorClass
  }));

  if (!projectId) {
    return (
      <ProjectSelector
        projects={projects}
        onSelect={(id) => setSearchParams({ projectId: id })}
        title="Intelligence Discovery"
        description="Select a specific project from your vault to initialize the deep intelligence suite and health analytics."
        loading={storeLoading}
      />
    );
  }

  // Handle API Errors (like 429)
  if (projectId && storeError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/20">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Intelligence Interrupted</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          {storeError.includes('429') || storeError.includes('Too many requests')
            ? "The system is currently handling high volume. Please wait a few moments for diagnostics to clear."
            : `An error occurred while fetching diagnostics: ${storeError}`}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => fetchProjectStats(projectId, timeframe)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
          >
            Retry Diagnostics
          </button>
          <button
            onClick={() => setSearchParams({})}
            className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Switch Project
          </button>
        </div>
      </div>
    );
  }

  // Handle case where project is selected but not yet found/loaded
  if (projectId && !currentProject && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/20">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          You are attempting to access diagnostics for a project that is not in your authorized inventory.
        </p>
        <button
          onClick={() => navigate(isPm ? '/pm/dashboard' : '/bde/dashboard')}
          className="px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto pb-8 ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-end border-b border-border/20 pb-12 mb-16 gap-8">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setSearchParams({})}
            className="group w-14 h-14 rounded-full border border-border/20 flex items-center justify-center hover:bg-black dark:hover:bg-white transition-all duration-500"
            title="Return to Discovery"
          >
            <ArrowLeft className="w-6 h-6 text-muted group-hover:text-white dark:group-hover:text-black transition-colors" />
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] shadow-premium">
                Intelligence Stream
              </div>
              <h1 className="text-5xl font-display font-[300] text-foreground tracking-tight">Project Diagnostics</h1>
            </div>
            <p className="text-base text-muted font-sans tracking-wide">
              Deep-health inspection for <span className="text-foreground font-bold underline decoration-border/40 underline-offset-8">{currentProject?.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center bg-secondary/30 p-1.5 rounded-2xl border border-border/10 shadow-inset-subtle">
          {Object.values(ANALYTICS_TIMEFRAMES).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-xl",
                timeframe === tf
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-pill scale-105"
                  : "text-muted hover:text-foreground opacity-60 hover:opacity-100"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dynamicCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ConflictTrendsChart timeline={stats.timeline} timeframe={timeframe} />
        <ConflictsByType data={severityBreakdown} stats={stats} />
      </div>

      {/* Bottom Insights Level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityLog activity={stats.activity} />

        {/* Strategic Summary Card */}
        <div className="bg-black dark:bg-white rounded-[3rem] p-12 text-white dark:text-black relative overflow-hidden group shadow- pill transition-all duration-700 hover:scale-[1.02]">
          <div className="relative z-10 space-y-12">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50">Operational Synthesis</h3>
              <p className="text-3xl font-display font-[300] tracking-tight">Strategic Directive</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group/item">
                <div className="bg-white/10 dark:bg-black/10 p-4 rounded-2xl border border-white/10 dark:border-black/10 transition-transform duration-500 group-hover/item:scale-110"><CheckCircle2 className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Environment Status</p>
                  <p className="text-lg font-bold font-sans tracking-tight">{stats.readiness > 80 ? 'Project Optimal' : 'Stabilization Required'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group/item">
                <div className="bg-white/10 dark:bg-black/10 p-4 rounded-2xl border border-white/10 dark:border-black/10 transition-transform duration-500 group-hover/item:scale-110"><Clock className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Resolution Priority</p>
                  <p className="text-lg font-bold font-sans tracking-tight">{stats.conflicts?.high > 0 ? 'Urgent: Structural' : 'Routine: Refinement'}</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 dark:border-black/10">
              <p className="text-base font-display font-[300] italic leading-relaxed opacity-80 tracking-tight">
                "System intelligence recommends a focused allocation to resolve {stats.conflicts?.high || 0} critical structural anomalies to maintain target velocity."
              </p>
            </div>
          </div>
          {/* Subtle light effects */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 dark:bg-black/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;