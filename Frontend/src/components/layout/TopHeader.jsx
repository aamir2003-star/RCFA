import React, { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';

export function TopHeader({ toggleSidebar, toggleTheme, isDark }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search conflicts, models..."
            type="search"
            name="search"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {/* Notifications */}
          <Dropdown
            trigger={
              <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 relative">
                <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                <Bell className="h-5 w-5" />
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Notifications</p>
            </div>
            <div className="py-2 px-1 max-h-64 overflow-y-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Merge Conflict Detected</p>
                  <p className="text-xs text-slate-500">File: AuthPage.jsx at line 42</p>
                </div>
              ))}
            </div>
          </Dropdown>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-x-4 relative">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full bg-slate-50 border-2 border-primary"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc2NOVjwO2-DyyUZKL6nQWJCIPoCTf6X_yQOxetpWDDffaz0RkO80r9sc4qvjwWoQT4MSp5pwzPBSG8wdeyneBA69Jbd51SCqXI6d1fZBi_pE1hj8iB5W3Je94ozDQeSJyRJui-Y2LqUEKWaj3Vg_IxMW6fJ6qLLD5uTuErFO-wEJlXThyidueRTP9YjBMXJA2fOYSrZRFOO6iSHYfk0hBlWQD2U7kpfta7ap4kN55E2FEHbYujPTneWUggwkz22px5uHexBGTwbw"
                  alt=""
                />
              </div>
            }
          >
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">John Doe</p>
              <p className="text-xs text-slate-500">Workspace Owner</p>
            </div>
            <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Your profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Sign out</a>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
