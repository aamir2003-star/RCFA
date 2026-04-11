import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Box, Activity, Terminal, Zap, Layers, Search, Bell, User, Settings, LogOut, Menu, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import useModuleStore from "../../stores/useModuleStore";
import useAuthStore from "../../stores/useAuthStore";
import useConflictStore from "../../stores/useConflictStore";
import useProjectStore from "../../stores/useProjectStore";

export default function DevDashboard() {
  const { user } = useAuthStore();
  const { modules, loading: modulesLoading, fetchUserModules } = useModuleStore();
  const { conflicts, fetchAllDevConflicts, loading: conflictsLoading } = useConflictStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserModules(user?._id || user?.id);
    fetchAllDevConflicts();
  }, [user?._id, user?.id, fetchUserModules, fetchAllDevConflicts]);

  const moduleReqIds = (modules || []).flatMap(m => (m.requirements || []).map(r => r._id || r));
  const openConflicts = (conflicts || []).filter(c =>
    (moduleReqIds.includes(c.requirementA?._id || c.requirementA) ||
      moduleReqIds.includes(c.requirementB?._id || c.requirementB)) &&
    c.status === 'open'
  );

  const stats = [
    { label: "Active Conflicts", value: openConflicts.length, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Assigned Modules", value: modules.length, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "System Status", value: "Optimal", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  if (modulesLoading || conflictsLoading) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <Activity className="w-10 h-10 animate-spin text-muted/40" />
        <span className="font-display font-[300] text-2xl text-muted italic">Calibrating Workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 md:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 py-8 border-b border-border/10 pb-12">
        <h1 className="text-6xl text-foreground font-display font-[300] tracking-tight leading-tight">
          Welcome back, <span className="italic">{user?.name?.split(' ')[0]}</span>.
        </h1>
        <p className="text-muted text-xl leading-relaxed max-w-3xl font-sans tracking-[0.18px] opacity-80">
          Your technical manifold is synchronized. Synthesizing <span className="text-foreground font-medium underline underline-offset-8 decoration-border/20">{openConflicts.length} architectural contradictions</span> across your assigned modules.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="premium-card p-10 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</span>
              <div className={cn("p-3 rounded-2xl shadow-inset-subtle", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
            <div className="text-5xl font-display font-[300] text-foreground tracking-tighter italic">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Active Conflicts Panel */}
      <div className="premium-card overflow-hidden transition-all duration-700 hover:border-border/30">
        <div className="p-12 border-b border-border/10 flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/10 gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-[300] text-foreground italic tracking-tight">Assigned Contradictions</h2>
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">Critical Specification Alignment Required</p>
          </div>
          <button className="pill-button bg-black text-white text-[10px] uppercase tracking-[0.3em] py-5 px-12 hover:shadow-premium transition-all">
            Export Manifest
          </button>
        </div>

        <div className="divide-y divide-border/5">
          {openConflicts.length > 0 ? (
            openConflicts.map((conflict) => (
              <div key={conflict._id} className="p-12 hover:bg-secondary/10 transition-all duration-500 group flex flex-col lg:flex-row lg:items-center justify-between gap-12 active:scale-[0.998]">
                <div className="space-y-8 max-w-5xl">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border",
                      conflict.severityScore >= 8 ? "bg-red-500/5 text-red-500 border-red-500/10" : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                    )}>
                      {conflict.severityScore >= 8 ? "High Intensity" : "Technical Debt"}
                    </div>
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-40">Artifact #{conflict._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <h3 className="text-3xl font-display font-[300] text-foreground leading-[1.3] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                    {conflict.conflictType} — {conflict.explanation?.split('.')[0]}.
                  </h3>
                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-4 group/meta">
                      <div className="w-11 h-11 rounded-[16px] bg-secondary/50 flex items-center justify-center text-muted group-hover/meta:text-foreground group-hover/meta:bg-white dark:group-hover/meta:bg-black group-hover/meta:shadow-premium transition-all duration-500">
                        <Terminal className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11px] font-black text-muted group-hover/meta:text-foreground transition-colors uppercase tracking-[0.2em]">{conflict.conflictType}</span>
                    </div>
                    <div className="flex items-center gap-4 group/meta">
                      <div className="w-11 h-11 rounded-[16px] bg-secondary/50 flex items-center justify-center text-muted group-hover/meta:text-foreground group-hover/meta:bg-white dark:group-hover/meta:bg-black group-hover/meta:shadow-premium transition-all duration-500">
                        <Zap className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11px] font-black text-muted group-hover/meta:text-foreground transition-colors uppercase tracking-[0.2em]">Intensity {conflict.severityScore}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <Link
                    to={`/dev/conflicts/${conflict._id}/discussion`}
                    className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.3em] py-6 px-12 group-hover:scale-[1.05] shadow-pill inline-flex items-center gap-3 transition-all duration-500"
                  >
                    Join Discussion
                    <Activity className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 px-10 text-center space-y-8">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted mb-8 shadow-inset-subtle">
                <ShieldAlert className="w-10 h-10 opacity-30" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-[300] text-foreground italic">Technical Pipeline Clear</h3>
                <p className="text-muted-foreground text-[15px] font-normal max-w-lg mx-auto leading-relaxed tracking-wide">
                  No technical contradictions detected in your assigned modules. Contributors are encouraged to assist in the team repository.
                </p>
              </div>
              <Link to="/dev/conflicts" className="inline-block warm-pill text-[12px] uppercase tracking-[0.25em] text-foreground mt-10 hover:translate-y-[-2px]">
                Explore Team Repository
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Empty states or footer highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="premium-card p-10 bg-secondary/5 border-dashed">
          <div className="flex items-center gap-4 mb-6">
            <Box className="w-6 h-6 text-muted/40" />
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.2em]">Module Health</h4>
          </div>
          <p className="text-[14px] text-muted-foreground italic">Synchronizing implementation metrics across your {modules.length} assigned blocks...</p>
        </div>
        <div className="premium-card p-10 bg-secondary/5 border-dashed flex items-center justify-between">
          <div className="space-y-2">
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.2em]">Collaborative Node</h4>
            <p className="text-[14px] text-muted-foreground">Team activity is being aggregated in real-time.</p>
          </div>
          <Activity className="w-8 h-8 text-muted/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
