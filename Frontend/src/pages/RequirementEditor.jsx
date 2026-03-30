import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import {
    Save,
    ChevronRight,
    MoreHorizontal,
    Type,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Bold,
    Italic,
    AlertTriangle,
    HelpCircle,
    Shield,
    AlertOctagon,
    Sparkles,
    Zap,
    FileText,
    Plus,
    Trash2
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { requirementPriorities, requirementModules, aiAssistantCards } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function RequirementEditor() {
    return (
        <MainLayout role="pm">
            <div className="flex flex-col h-full gap-6">
                {/* Editor Top Bar */}
                <div className="flex items-center justify-between bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/10 dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Projects</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Alpha System</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-slate-900 dark:text-white">REQ-102</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            In Review
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            AI Sync Active
                        </div>
                        <Button className="bg-[#1e2532] hover:bg-slate-800 text-white font-black px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 flex-1 overflow-hidden">
                    {/* Main Editor Component */}
                    <div className="flex-1 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-y-auto custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-10">
                            {/* Title Section */}
                            <input
                                type="text"
                                defaultValue="Secure User Authentication Flow"
                                className="w-full text-4xl font-extrabold tracking-tight border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 bg-transparent text-slate-900 dark:text-white"
                                placeholder="Requirement Title"
                            />

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500/50 transition-all shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-xs font-bold">High</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500/50 transition-all shadow-sm">
                                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold truncate">Authentication</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dependencies</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500/50 transition-all shadow-sm">
                                        <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold truncate text-indigo-600 dark:text-indigo-400">REQ-089...</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags</label>
                                    <div className="flex flex-wrap gap-1 items-center px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[38px]">
                                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-black uppercase tracking-tight">Security</span>
                                        <button className="p-1 text-slate-300 hover:text-indigo-500 ml-auto">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Rich Text Editor Body */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                                    <EditorButton icon={Bold} />
                                    <EditorButton icon={Italic} />
                                    <EditorButton icon={List} />
                                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                    <EditorButton icon={LinkIcon} />
                                    <EditorButton icon={ImageIcon} />
                                    <EditorButton icon={Code} />
                                </div>

                                <div
                                    className="min-h-[500px] text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed outline-none prose dark:prose-invert max-w-none scroll-smooth"
                                    contentEditable="true"
                                >
                                    <p className="mb-6">The system shall implement a multi-factor authentication (MFA) process for all administrative users. This ensures that even if credentials are compromised, unauthorized access is prevented by requiring a secondary verification method.</p>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-10 mb-5 flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                        Functional Requirements
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-3 font-medium">
                                        <li>Users must be able to choose between SMS-based OTP and TOTP (e.g., Google Authenticator).</li>
                                        <li>The system should allow users to "Remember this device" for 30 days.</li>
                                        <li>If a login attempt fails 5 times, the account should be locked automatically to prevent brute-force attacks.</li>
                                    </ul>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-10 mb-5 flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                        Technical Constraints
                                    </h3>
                                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mt-4 leading-normal italic font-semibold">
                                        Passwords must be hashed using Argon2id with a minimum memory cost of 64MiB and 3 iterations. MFA tokens must expire after 5 minutes of issuance to ensure temporal security.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Assistant Sidebar */}
                    <aside className="w-85 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar">
                        <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                        <Sparkles className="w-4.5 h-4.5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">AI Assistant</h3>
                                </div>
                                <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">3</span>
                            </div>

                            <div className="space-y-4">
                                {aiAssistantCards.map((card) => (
                                    <AICard key={card.id} card={card} />
                                ))}
                            </div>

                            {/* AI Quick Actions */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Tools</p>
                                <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group">
                                    <Zap className="w-4.5 h-4.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Generate Test Cases</p>
                                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Define QA parameters</p>
                                    </div>
                                </button>
                                <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group">
                                    <List className="w-4.5 h-4.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Stakeholder Summary</p>
                                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Condense for reporting</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
}


function EditorButton({ icon: Icon }) {
    return (
        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-indigo-500/10 rounded-lg transition-all">
            <Icon className="w-4 h-4" />
        </button>
    );
}

function AICard({ card }) {
    const Icon = card.icon;

    return (
        <div className={cn("p-4 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-lg", card.color)}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{card.title}</span>
            </div>
            <p className="text-[13px] font-medium leading-relaxed opacity-90 mb-3">
                {card.desc}
            </p>
            {card.action && (
                <button className="text-[11px] font-black flex items-center gap-1 hover:gap-2 transition-all">
                    {card.action}
                    <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
