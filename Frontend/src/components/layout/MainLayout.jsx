import React from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export function MainLayout({ children, role }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#080b11] overflow-hidden text-foreground selection:bg-indigo-500/30">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 via-transparent to-purple-50/50 dark:from-indigo-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none z-0"></div>
        <TopHeader role={role} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 relative z-10 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full w-full animate-in fade-in duration-500">{children}</div>
        </main>
      </div>
    </div>
  );
}
