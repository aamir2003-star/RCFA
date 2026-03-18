import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { Breadcrumb } from './Breadcrumb';
import { PageWrapper } from './PageWrapper';

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden font-display transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col z-0 overflow-y-auto">
        <TopHeader 
          toggleSidebar={() => setSidebarOpen(true)} 
          toggleTheme={() => setIsDark(!isDark)}
          isDark={isDark}
        />
        
        <main className="flex-1">
          <PageWrapper>
            <div className="mb-6">
              <Breadcrumb />
            </div>
            {children}
          </PageWrapper>
        </main>
      </div>
    </div>
  );
}
