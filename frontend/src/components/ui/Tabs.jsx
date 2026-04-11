import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext();

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={cn("inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "hover:text-slate-900 dark:hover:text-slate-100",
        className
      )}
      onClick={() => setActiveTab(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={cn("mt-6", className)}>{children}</div>;
}
