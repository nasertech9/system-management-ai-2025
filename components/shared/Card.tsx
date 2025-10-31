
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div
      className={`bg-container-bg/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:border-slate-500/70 hover:shadow-2xl ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-cyan">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
