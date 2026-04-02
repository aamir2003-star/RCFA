import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Rocket, AlertTriangle, CheckCircle2, AlertCircle, Clock, BarChart, ArrowLeft } from 'lucide-react';
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
    <div className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{tooltip}</p>
        </div>
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <div className="flex items-center text-[11px] font-bold mb-5">
        <div className={`flex items-center px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
          <svg className={`w-3 h-3 mr-1 ${!isPositive && 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{change}</span>
        </div>
        <span className="text-slate-400 ml-2 font-medium">real-time update</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-1.5 mt-auto">
        <div className={`h-1.5 rounded-full transition-all duration-1000 ${progressClass}`} style={{ width: progressValue }}></div>
      </div>
    </div>
  );
};

const ConflictTrendsChart = ({ timeline, timeframe }) => {
  const max = Math.max(...(timeline?.map(t => t.count) || [0]), 10);
  const subheader = TIMEFRAME_SUBHEADERS[timeframe] || DEFAULT_SUBHEADER;

  return (
    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none col-span-1 lg:col-span-2 relative min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Detection Timeline</h3>
          <p className="text-xs text-slate-500 font-medium">{subheader}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 shadow-sm"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conflicts</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative w-full flex items-end gap-3 pb-6 pt-4">
        {timeline && timeline.length > 0 ? (
          timeline.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex justify-center items-end h-[160px]">
                <div
                  className="w-full max-w-[40px] bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-all duration-500 relative"
                  style={{ height: `${(item.count / max) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.count} Detected
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">
                {item._id.includes(':')
                  ? (() => {
                    const hour = parseInt(item._id.split(' ')[1].split(':')[0]);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    return `${hour % 12 || 12} ${ampm}`;
                  })()
                  : new Date(item._id).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
                }
              </span>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium italic">
            No conflict data available for this period.
          </div>
        )}
      </div>
    </div>
  );
};

const ConflictsByType = ({ data, stats }) => (
  <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none flex flex-col">
    <div className="mb-8">
      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Risk Distribution</h3>
      <p className="text-xs text-slate-500 font-medium">Breakdown of conflicts by severity level.</p>
    </div>

    <div className="space-y-6 flex-1">
      {data.map((item, index) => (
        <div key={index} className="group">
          <div className="flex justify-between mb-2 items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{item.percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div className={`${item.colorClass} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.percentage}%` }}></div>
          </div>
        </div>
      ))}
    </div>

    {stats?.conflicts?.high > 0 && (
      <div className="mt-8 bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-4 flex items-start border border-rose-100 dark:border-rose-900/30 group animate-pulse">
        <div className="bg-rose-100 dark:bg-rose-900/50 p-2 rounded-xl mr-3">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h4 className="text-xs font-black text-rose-900 dark:text-rose-100 uppercase tracking-wider">Critical Escalation</h4>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium italic">
            {stats.conflicts.high} High-severity blocks identified. AI resolution recommended.
          </p>
        </div>
      </div>
    )}
  </div>
);

const ActivityLog = ({ activity }) => (
  <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none col-span-1 lg:col-span-2">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Recent Intelligence Log</h3>
        <p className="text-xs text-slate-500 font-medium">Real-time audit of AI conflict detection events.</p>
      </div>
    </div>

    <div className="space-y-4">
      {activity && activity.length > 0 ? (
        activity.map((item, index) => (
          <div key={index} className="flex items-center p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] group hover:border-indigo-500/30 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-sm ${item.severity === 'Red' ? 'bg-rose-500/10 text-rose-500' :
              item.severity === 'Orange' ? 'bg-amber-500/10 text-amber-500' :
                'bg-emerald-500/10 text-emerald-500'
              }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${item.status === 'open' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
            </div>
            <div className="text-right ml-4">
              <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Detected</div>
              <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
          Steady state. No recent conflicts detected.
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchParams({})}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh Discovery"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded bg-indigo-500 text-[9px] font-black text-white uppercase tracking-widest shadow-sm">Live System</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Intelligence</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium truncate max-w-md">Health metrics for <span className="text-indigo-600 font-bold underline decoration-indigo-500/30 underline-offset-4">{currentProject?.name}</span></p>
          </div>
        </div>
        <div className="flex items-center bg-white/50 dark:bg-white/[0.02] p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05] shadow-sm">
          {Object.values(ANALYTICS_TIMEFRAMES).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${timeframe === tf
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-white/[0.05]'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {tf.charAt(0) + tf.slice(1).toLowerCase()}
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

        {/* Quick Intelligence Summary */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-widest mb-4">Strategic Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                  <p className="text-sm font-bold">{stats.readiness > 80 ? 'Project Healthy' : 'Action Required'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-xl"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Priority</p>
                  <p className="text-sm font-bold">{stats.conflicts?.high > 0 ? 'High Alert: Blockers' : 'Medium: Refinement'}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="text-[11px] font-medium italic leading-relaxed opacity-90 text-white/80 uppercase tracking-tight">
                  "Spectra Intelligence suggests prioritizing the resolution of {stats.conflicts?.high || 0} critical blockers to restore project velocity."
                </p>
              </div>
            </div>
          </div>
          {/* Decor */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-indigo-400 rounded-full blur-2xl pointer-events-none opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;