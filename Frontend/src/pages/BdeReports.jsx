import React from "react";
import {
    FileText,
    Download,
    ExternalLink,
    Search,
    Filter,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

const reports = [
    { id: "RPT-001", name: "Phoenix 2.0 Feasibility Brief", project: "Phoenix 2.0", date: "Mar 28, 2026", status: "Ready", type: "Feasibility" },
    { id: "RPT-002", name: "Compliance Audit Trail", project: "Legal Sync", date: "Mar 25, 2026", status: "Ready", type: "Compliance" },
    { id: "RPT-003", name: "Architecture Risk Analysis", project: "Phoenix 2.0", date: "Mar 20, 2026", status: "Archived", type: "Risk" },
    { id: "RPT-004", name: "Stakeholder Consensus Report", project: "Global Core", date: "Mar 15, 2026", status: "Generating", type: "Consensus" },
];

export default function BdeReports() {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        Client Reporting
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Generate and export board-ready feasibility and compliance reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                        <Download className="w-4 h-4" />
                        New Report
                    </button>
                </div>
            </div>

            {/* Report Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((rpt, i) => (
                    <div key={i} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/5 hover:-translate-y-1 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${rpt.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                {rpt.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{rpt.name}</h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                            <span>{rpt.project}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{rpt.type}</span>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Generated: {rpt.date}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
