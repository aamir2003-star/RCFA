import React, { useState } from 'react';
import { Zap, Lightbulb, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState('');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#1e2532] dark:text-white">Create New Project</h1>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT: Project Details Form ── */}
        <div className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            <h2 className="text-lg font-semibold text-[#1e2532] dark:text-white">Project Details</h2>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1: Project Name + Client Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Infrastructure Modernizatio..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Client Name</label>
                <input
                  type="text"
                  placeholder="Search or select client"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>
            </div>

            {/* Project Overview */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Overview</label>
              <textarea
                rows={6}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Describe the project scope, objectives, and any potential conflict zones..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
              />
            </div>

            {/* Row 2: Timeline + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expected Timeline</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-400 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Budget ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input
                    type="number"
                    placeholder="50,000"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-7 pr-3 py-2.5 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Assign Project Manager */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Project Manager</label>
              <div className="relative">
                <select className="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer">
                  <option value="">Select a team lead</option>
                  <option value="pm1">Alice Johnson</option>
                  <option value="pm2">Bob Smith</option>
                  <option value="pm3">Carol Williams</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
              >
                Generate Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: AI Preview Panel ── */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* AI Preview Card */}
          <div className="bg-[#1a2035] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold text-white text-sm">AI Preview Panel</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              As you type, our AI analyzes your overview to suggest potential project requirements and risk mitigations.
            </p>

            {/* Requirement #1 */}
            <div className="bg-[#232b3e] rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requirement #1</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  High Priority
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Conflict Mitigation Strategy</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on 'infrastructure audit', we suggest defining a clear escalation path for stakeholder disputes.
              </p>
            </div>

            {/* Requirement #2 */}
            <div className="bg-[#232b3e] rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requirement #2</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                  Medium Priority
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Bi-Weekly Compliance Sync</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated checks for regulatory alignment with current municipal guidelines.
              </p>
            </div>

            {/* Requirement #3 */}
            <div className="bg-[#232b3e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requirement #3</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Low Priority
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Document Versioning</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensure all historical project iterations are stored in the AI-Vault for legal auditing.
              </p>
            </div>
          </div>

          {/* AI Tip Card */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-[#1e2532] dark:text-white">AI Tip</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Adding a detailed budget helps the Conflict Resolver AI better predict resource-related bottlenecks and financial dispute risks.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
