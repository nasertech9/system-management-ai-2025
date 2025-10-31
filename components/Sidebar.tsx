
import React from 'react';
import { Icon } from './shared/Icon';

type View = 'dashboard' | 'users' | 'resources' | 'logs';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  iconName: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ iconName, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
      isActive
        ? 'bg-accent-blue/20 text-accent-cyan shadow-neon-cyan'
        : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
    }`}
  >
    <Icon name={iconName} className="w-5 h-5 mr-3" />
    <span className="truncate">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-16 md:w-64 bg-container-bg flex-shrink-0 flex flex-col p-2 md:p-4 border-r border-slate-800">
      <div className="flex items-center justify-center md:justify-start mb-8 md:px-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-accent-cyan to-accent-purple rounded-full animate-pulse"></div>
        <h1 className="hidden md:block ml-3 text-xl font-bold tracking-wider text-white">SYS-AI</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem
          iconName="dashboard"
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          iconName="users"
          label="User Management"
          isActive={activeView === 'users'}
          onClick={() => setActiveView('users')}
        />
        <NavItem
          iconName="resources"
          label="Resources"
          isActive={activeView === 'resources'}
          onClick={() => setActiveView('resources')}
        />
        <NavItem
          iconName="logs"
          label="Activity Logs"
          isActive={activeView === 'logs'}
          onClick={() => setActiveView('logs')}
        />
      </nav>
      <div className="mt-auto hidden md:block">
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
            <p className="text-xs text-gray-400">System Status</p>
            <div className="flex items-center justify-center mt-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="ml-2 text-sm font-semibold text-green-400">All Systems Online</p>
            </div>
        </div>
      </div>
    </aside>
  );
};
