
import React, { useState } from 'react';
import type { Notification } from '../types';
import { Icon } from './shared/Icon';

interface HeaderProps {
    notifications: Notification[];
}

export const Header: React.FC<HeaderProps> = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getLevelColor = (level: 'success' | 'warning' | 'critical') => {
    switch(level) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
    }
  }

  return (
    <header className="flex-shrink-0 bg-container-bg/50 backdrop-blur-sm border-b border-slate-800 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
        <p className="text-sm text-gray-400">Welcome back, Admin</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-base-bg border border-slate-700 rounded-full py-2 px-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent"
          />
        </div>

        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
            >
                <Icon name="bell" className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-container-bg border border-slate-700 rounded-lg shadow-2xl z-10">
                    <div className="p-3 border-b border-slate-700">
                        <h4 className="font-semibold">Notifications</h4>
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                        {notifications.map(n => (
                            <li key={n.id} className="p-3 border-b border-slate-800 hover:bg-slate-800/50">
                                <p className={`text-sm ${getLevelColor(n.level)}`}>{n.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue cursor-pointer border-2 border-slate-600">
          <img src="https://picsum.photos/id/237/100/100" alt="Admin" className="rounded-full object-cover"/>
        </div>
      </div>
    </header>
  );
};
