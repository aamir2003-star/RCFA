import React from 'react';
import { NavLink } from 'react-router-dom';
import { BrainCircuit, Home, FolderKanban, Settings, Bell, Search, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export function Sidebar({ isOpen, onClose }) {
  const navLinks = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Projects', icon: FolderKanban, path: '/projects', count: 3 },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-3 font-bold text-lg text-slate-900 dark:text-white">Conflict Resolver AI</span>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.count && (
                <span className="ml-auto inline-block py-0.5 px-2 text-[10px] font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upgrade To Pro</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Get advanced insights.</p>
            <Button size="sm" className="w-full">Upgrade Now</Button>
          </div>
          <div className="flex items-center gap-3 px-2">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc2NOVjwO2-DyyUZKL6nQWJCIPoCTf6X_yQOxetpWDDffaz0RkO80r9sc4qvjwWoQT4MSp5pwzPBSG8wdeyneBA69Jbd51SCqXI6d1fZBi_pE1hj8iB5W3Je94ozDQeSJyRJui-Y2LqUEKWaj3Vg_IxMW6fJ6qLLD5uTuErFO-wEJlXThyidueRTP9YjBMXJA2fOYSrZRFOO6iSHYfk0hBlWQD2U7kpfta7ap4kN55E2FEHbYujPTneWUggwkz22px5uHexBGTwbw" 
              alt="Avatar" 
              className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-800 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">john@company.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
