import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layout,
  FileText,
  AlertCircle,
  Users,
  CreditCard,
  ShoppingCart,
  Shield,
  BarChart,
  ArrowUpRight,
  AlertTriangle,
  Activity,
  Plus
} from "lucide-react";
import {
  PM_STATS_TEMPLATE,
  PM_QUICK_ACTIONS_TEMPLATE,
  PROJECT_STATUS_COLORS
} from "../../constants/dashboard";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../../stores/useProjectStore";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";

export default function PmDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    projects,
    fetchProjects,
    pmStats,
    fetchPmStats,
    loading
  } = useProjectStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProjects(), fetchPmStats()]);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchProjects, fetchPmStats]);

  const stats = PM_STATS_TEMPLATE.map(template => ({
    ...template,
    value: pmStats?.[template.key] || "0"
  }));

  if (isInitialLoading) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <Activity className="w-10 h-10 animate-spin text-muted/40" />
        <span className="font-display font-[300] text-2xl text-muted italic">Calibrating Manager Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-24 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl text-foreground font-display font-[300] tracking-tight">
            Portfolio <span className="italic">Overview</span>
          </h1>
          <p className="text-[12px] font-bold text-muted uppercase tracking-[0.25em]">
            Managing {pmStats?.totalProjects || 0} Architectural Units
          </p>
        </div>
        <button
          onClick={() => navigate('/pm/analytics')}
          className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.2em] py-5 px-10 shadow-pill"
        >
          <BarChart className="w-4 h-4 mr-2 inline" />
          Detailed Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="premium-card p-10 space-y-8 group hover:border-foreground/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[18px] bg-secondary flex items-center justify-center text-muted group-hover:text-foreground group-hover:bg-secondary/80 transition-all shadow-inset-subtle border border-border/10">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-border/10", stat.trendUp ? "text-emerald-600 bg-emerald-50/50" : "text-amber-600 bg-amber-50/50")}>
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-2 px-1 opacity-70">{stat.title}</p>
              <p className="text-5xl font-display font-[300] px-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Project Feed */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.25em]">Active Trajectories</h2>
            <button onClick={() => navigate('/pm/workspace')} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-500 transition-colors">Create Project +</button>
          </div>

          <div className="space-y-6">
            {projects.map((proj, i) => (
              <div
                key={proj._id}
                onClick={() => navigate(`/pm/editor?projectId=${proj._id}`)}
                className="premium-card p-8 flex flex-col md:flex-row md:items-center gap-10 hover:shadow-premium group cursor-pointer transition-all border-border/10 hover:border-foreground/10"
              >
                <div className="w-16 h-16 rounded-[22px] bg-black text-white flex items-center justify-center shrink-0 shadow-premium group-hover:scale-105 transition-transform duration-500">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-2xl font-display font-[300] group-hover:italic transition-all">{proj.name}</h3>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">
                    {proj.requirementCount || 0} Requirements / {proj.conflictCount || 0} Conflicts
                  </p>
                </div>
                <div className="flex items-center gap-12 shrink-0">
                  <div className="hidden md:flex -space-x-3 opacity-60 group-hover:opacity-100 transition-all">
                    {[1, 2, 3].map(v => (
                      <div key={v} className="w-10 h-10 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] font-bold">
                        {proj.team?.[v - 1]?.name?.[0] || 'D'}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 w-32">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted">Progress <span className="text-foreground">75%</span></div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-black/80 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Actions */}
        <div className="space-y-10">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.25em] px-2">Manager Console</h2>
          <div className="space-y-4">
            {PM_QUICK_ACTIONS_TEMPLATE.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className="w-full premium-card p-6 flex items-center gap-5 hover:bg-secondary/10 transition-all border-border/10 group text-left"
              >
                <div className="w-12 h-12 rounded-[18px] bg-secondary flex items-center justify-center text-muted group-hover:text-foreground transition-all">
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-display font-[500]">{action.title}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="premium-card p-8 bg-black text-white space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em]">Human Capital</h3>
            </div>
            <p className="text-[12px] opacity-60 leading-relaxed font-sans">Orchestrate your multidisciplinary team across {pmStats?.totalProjects} specialized nodes.</p>
            <button
              onClick={() => navigate('/pm/team')}
              className="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:shadow-premium transition-all"
            >
              Management Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
