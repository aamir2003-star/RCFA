import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Zap, Lightbulb, ChevronDown, Loader2, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../stores/useProjectStore';
import useConflictStore from '../stores/useConflictStore';
import useAuthStore from '../stores/useAuthStore';
import api from '../lib/api';
import { PROJECT_FORM_INITIAL_STATE, PROJECT_FORM_FIELDS } from '../constants/projects';
import { cn } from '../lib/utils';

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProject, uploadRequirementsCSV, loading } = useProjectStore();
  const { analysisProgress, resetAnalysisProgress, subscribeToConflicts, unsubscribeFromConflicts } = useConflictStore();

  const [projectManagers, setProjectManagers] = useState([]);
  const [formData, setFormData] = useState(() => {
    // Restore form data from sessionStorage if available (prevents loss on navigation)
    try {
      const saved = sessionStorage.getItem("spectra-create-project-form");
      return saved ? JSON.parse(saved) : PROJECT_FORM_INITIAL_STATE;
    } catch {
      return PROJECT_FORM_INITIAL_STATE;
    }
  });
  const [requirementFile, setRequirementFile] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // Persist formData to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem("spectra-create-project-form", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Fetch PMs only
    const fetchData = async () => {
      try {
        const pmsRes = await api.get('/users?role=pm');
        setProjectManagers(pmsRes.data);
      } catch (error) {
        console.error("Failed to fetch PMs:", error);
        toast.error("Failed to fetch project managers");
      }
    };
    fetchData();

    // Reset progress on mount to prevent premature redirection
    resetAnalysisProgress();

    return () => {
      resetAnalysisProgress();
    };
  }, [resetAnalysisProgress]);

  // Effect to navigate when analysis is complete
  useEffect(() => {
    if (showProgress && analysisProgress.percent === 100) {
      setTimeout(() => {
        if (user?.role?.toLowerCase() === 'bde') {
          navigate('/bde/dashboard');
        } else {
          navigate('/pm/conflicts');
        }
      }, 1500);
    }
  }, [analysisProgress.percent, showProgress, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setRequirementFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive Validation using constants
    const missingFields = PROJECT_FORM_FIELDS
      .filter(f => f.required && !formData[f.name] && (f.name !== 'requirementFile'))
      .map(f => f.label);

    if (!requirementFile) missingFields.push("Requirement CSV File");

    if (missingFields.length > 0) {
      toast.error(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    const submissionData = {
      ...formData,
      createdBy: user?._id
    };

    const result = await createProject(submissionData);
    if (result.success) {
      setShowProgress(true);
      subscribeToConflicts(result.project._id);

      // Clear saved form on successful submission
      sessionStorage.removeItem("spectra-create-project-form");

      try {
        const uploadResult = await uploadRequirementsCSV(result.project._id, requirementFile);
        if (!uploadResult.success) {
          toast.error("CSV Error: " + uploadResult.message, { duration: 6000 });
          setShowProgress(false);
          unsubscribeFromConflicts(result.project._id);
        }
      } catch (err) {
        toast.error("Upload failed: " + err.message);
        setShowProgress(false);
        unsubscribeFromConflicts(result.project._id);
      }
    } else {
      toast.error("Error creating project: " + result.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#1e2532] dark:text-white">Create New Project</h1>

      {/* Full-width layout */}
      <div className="flex flex-col gap-6 items-start">

        {/* ── Project Details Form ── */}
        <div className="w-full bg-white dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            <h2 className="text-lg font-semibold text-[#1e2532] dark:text-white">Project Details</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Row 1: Project Name + Client Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Infrastructure Modernization"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Search or select client"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                />
              </div>
            </div>

            {/* Project Overview */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                Project Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project scope, objectives, and any potential conflict zones..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Row 2: Timeline + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Expected Timeline (Duration) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Budget ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="50,000"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-[#1e2532] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Assign Project Manager & Developer Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* PM Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Assign Project Manager <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="projectManager"
                    value={formData.projectManager}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer font-medium"
                  >
                    <option value="">Select a Project Manager</option>
                    {projectManagers.map(pm => (
                      <option key={pm._id} value={pm._id}>
                        {pm.name} ({pm.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Requirement Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Requirement CSV <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Project"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem("spectra-create-project-form");
                  navigate(-1);
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Progress Overlay ── */}
      {showProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a2035] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-indigo-600 rounded-full p-4 text-white">
                <BrainCircuit className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#1e2532] dark:text-white mb-2">
              Conflict Resolver AI is Scanning...
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Analyzing requirements across modules to detect logical contradictions and potential synchronization risks.
            </p>

            {/* Progress Bar Container */}
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>{analysisProgress.message || "Initializing 7-step pipeline..."}</span>
                <span className="text-indigo-600 dark:text-indigo-400">{analysisProgress.percent}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${analysisProgress.percent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Step {Math.min(7, Math.ceil((analysisProgress.percent / 100) * 7))} of 7: {analysisProgress.percent < 100 ? "Processing" : "Complete"}
                </span>
              </div>
            </div>

            {analysisProgress.percent === 100 && (
              <div className="mt-8 flex items-center gap-2 text-emerald-500 text-sm font-bold animate-bounce">
                <Zap className="w-4 h-4 fill-current" />
                <span>Detection Complete. Redirecting to Triage...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
