import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Rocket, AlertTriangle, CheckCircle2, AlertCircle, Clock, BarChart } from 'lucide-react';
import useProjectStore from '../../stores/useProjectStore';

const IconMap = {
  FileText, Rocket, AlertTriangle, CheckCircle2, AlertCircle, Clock
};

const StatCard = ({ title, value, change, isPositive, iconName, colorClass, progressClass, progressValue }) => {
  const Icon = IconMap[iconName] || FileText;
  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
      </div>
      <div className="flex items-center text-sm font-medium mb-5">
        <svg className={`w-4 h-4 mr-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'} ${!isPositive && 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
          {change}
        </span>
        <span className="text-gray-400 dark:text-gray-500 ml-1">vs last week</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-auto">
        <div className={`h-1.5 rounded-full ${progressClass}`} style={{ width: progressValue }}></div>
      </div>
    </div>
  );
};

const ConflictTrendsChart = ({ data }) => (
  <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-2 relative min-h-[300px] flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Conflict Trends</h3>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Detected</span>
        </div>
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Resolved</span>
        </div>
      </div>
    </div>
    <div className="flex-1 relative w-full border-l border-b border-gray-100 dark:border-gray-800 pb-2 pl-2 flex items-end">
      {/* Mock Chart Area - When integrating charting library (e.g., Recharts), place it here */}
      <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between text-xs text-gray-400 dark:text-gray-600 pb-8 pr-6 -ml-6">
        <span className="text-right w-5">100</span>
        <span className="text-right w-5">75</span>
        <span className="text-right w-5">50</span>
        <span className="text-right w-5">25</span>
        <span className="text-right w-5">0</span>
      </div>
      <div className="absolute left-0 bottom-0 w-full flex justify-between text-xs text-gray-400 dark:text-gray-600 pl-8 pr-4 -mb-6">
        {data?.labels?.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  </div>
);

const ConflictsByType = ({ data, alert }) => (
  <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Conflicts by Type</h3>

    <div className="space-y-5 flex-1">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.type}</span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{item.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div className={`${item.colorClass} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
          </div>
        </div>
      ))}
    </div>

    {alert && (
      <div className="mt-6 bg-red-50 dark:bg-red-900/10 rounded-lg p-4 flex items-start">
        <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full mr-3 mt-0.5">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{alert.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.description}</p>
        </div>
      </div>
    )}
  </div>
);

const DevelopmentProgress = ({ data }) => (
  <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-1">
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Development Progress</h3>

    <div className="space-y-6">
      {data.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{item.module}</div>
          <div className="col-span-8 flex bg-gray-100 dark:bg-gray-800 rounded-sm h-6 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${item.completed}%` }}></div>
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${item.inProgress}%` }}></div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 flex justify-between items-center text-xs">
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2"></span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Completed</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-sm mr-2"></span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">In Progress</span>
        </div>
      </div>
      <button className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        View Roadmap
      </button>
    </div>
  </div>
);

const RecentConflictResolutions = ({ data }) => (
  <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-1">
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Conflict Resolutions</h3>

    <div className="space-y-6">
      {data.map((item, index) => {
        const Icon = IconMap[item.iconName] || CheckCircle2;
        return (
          <div key={index} className="flex items-start">
            <div className={`${item.iconBgClass} p-2 rounded-full mr-4 shrink-0`}>
              <Icon className={`w-5 h-5 ${item.iconColorClass}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-4">{item.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Mock Initial Data for UI ---
const initialDashboardData = {
  projectName: "Phoenix 2.0",
  stats: [
    { title: "Requirement Clarity", value: "94.2%", change: "+5.2%", isPositive: true, iconName: "FileText", colorClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", progressClass: "bg-emerald-500", progressValue: "94.2%" },
    { title: "Project Readiness", value: "82.0%", change: "+2.1%", isPositive: true, iconName: "Rocket", colorClass: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400", progressClass: "bg-indigo-500", progressValue: "82%" },
    { title: "Open Conflicts", value: "12", change: "-14%", isPositive: false, iconName: "AlertTriangle", colorClass: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", progressClass: "bg-red-500", progressValue: "15%" }
  ],
  trends: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    // Data arrays can be added here when integrating charts
  },
  conflictsByType: [
    { type: "Technical Architecture", percentage: 45, colorClass: "bg-indigo-500" },
    { type: "Business Logic", percentage: 32, colorClass: "bg-indigo-400" },
    { type: "Compliance & Security", percentage: 23, colorClass: "bg-amber-500" }
  ],
  criticalAlert: {
    title: "Critical Alert",
    description: "2 Logic conflicts detected in Auth Module."
  },
  developmentProgress: [
    { module: "Core Engine", completed: 60, inProgress: 20 },
    { module: "UI Components", completed: 45, inProgress: 40 },
    { module: "API Integration", completed: 30, inProgress: 60 }
  ],
  recentResolutions: [
    { title: "Database Schema Conflict", description: "Resolved by AI Suggestions", time: "2h ago", iconName: "CheckCircle2", iconBgClass: "bg-emerald-50 dark:bg-emerald-900/20", iconColorClass: "text-emerald-500" },
    { title: "Authentication Flow Mismatch", description: "Manually merged by Alex", time: "5h ago", iconName: "CheckCircle2", iconBgClass: "bg-emerald-50 dark:bg-emerald-900/20", iconColorClass: "text-emerald-500" },
    { title: "UI Theme Variable Overlap", description: "Pending team review", time: "Yesterday", iconName: "Clock", iconBgClass: "bg-amber-50 dark:bg-amber-900/20", iconColorClass: "text-amber-500" }
  ]
};

const AnalyticsDashboard = () => {
  const { currentProject, projectStats, fetchProjectStats } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentProject?._id) {
      setIsLoading(true);
      fetchProjectStats(currentProject._id).finally(() => setIsLoading(false));
    }
  }, [currentProject?._id, fetchProjectStats]);

  // Map dynamic stats to UI format
  const reqTotal = projectStats?.requirements?.total || 0;
  const reqApproved = projectStats?.requirements?.approved || 0;
  const reqClarity = reqTotal > 0 ? Math.round((reqApproved / reqTotal) * 100) : 0;

  const conflictTotal = projectStats?.conflicts?.total || 0;
  const highConflicts = projectStats?.conflicts?.high || 0;

  const dynamicStats = [
    {
      title: "Requirement Clarity",
      value: `${reqClarity}%`,
      change: "+2.4%",
      isPositive: true,
      iconName: "FileText",
      colorClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      progressClass: "bg-emerald-500",
      progressValue: `${reqClarity}%`
    },
    {
      title: "Project Readiness",
      value: "75.0%",
      change: "+1.2%",
      isPositive: true,
      iconName: "Rocket",
      colorClass: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      progressClass: "bg-indigo-500",
      progressValue: "75%"
    },
    {
      title: "Open Conflicts",
      value: conflictTotal.toString(),
      change: highConflicts > 0 ? `+${highConflicts} Critical` : "Stable",
      isPositive: highConflicts === 0,
      iconName: "AlertTriangle",
      colorClass: highConflicts > 0 ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      progressClass: highConflicts > 0 ? "bg-red-500" : "bg-blue-500",
      progressValue: "15%"
    }
  ];

  const conflictsByType = [
    { type: "High Severity", percentage: conflictTotal > 0 ? Math.round((projectStats?.conflicts?.high / conflictTotal) * 100) : 0, colorClass: "bg-red-500" },
    { type: "Medium Severity", percentage: conflictTotal > 0 ? Math.round((projectStats?.conflicts?.medium / conflictTotal) * 100) : 0, colorClass: "bg-amber-500" },
    { type: "Low Severity", percentage: conflictTotal > 0 ? Math.round((projectStats?.conflicts?.low / conflictTotal) * 100) : 0, colorClass: "bg-indigo-400" }
  ];

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-[#111827] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
          <BarChart className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Project Selected</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
          Please select a project from the dashboard to view its real-time health analytics and conflict metrics.
        </p>
        <button
          onClick={() => window.location.href = '/bde/dashboard'}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto pb-8 ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Project Health Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time performance metrics and conflict analysis for <span className="font-bold text-gray-700 dark:text-gray-300">{currentProject?.name || initialDashboardData.projectName}</span></p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Last 30 Days
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {dynamicStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ConflictTrendsChart data={initialDashboardData.trends} />
        <ConflictsByType data={conflictsByType} alert={initialDashboardData.criticalAlert} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DevelopmentProgress data={initialDashboardData.developmentProgress} />
        <RecentConflictResolutions data={initialDashboardData.recentResolutions} />
      </div>
    </div>
  )
}

export default AnalyticsDashboard;