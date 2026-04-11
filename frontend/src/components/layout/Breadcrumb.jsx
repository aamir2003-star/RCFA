import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3 shadow-sm border border-slate-200 dark:border-slate-800">
        <li>
          <div>
            <Link to="/" className="text-slate-400 hover:text-slate-500">
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <Link
                  to={to}
                  className={`ml-2 text-sm font-medium ${isLast ? 'text-primary dark:text-primary-light pointer-events-none' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'} capitalize`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {value.replace('-', ' ')}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
