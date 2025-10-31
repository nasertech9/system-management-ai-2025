
import React, { useState } from 'react';
import type { LogEntry } from '../types';
import { LogLevel } from '../types';
import { Card } from './shared/Card';
import { getAIInsight } from '../services/geminiService';


interface ActivityLogProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, setLogs }) => {
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState('');

    const getLevelColor = (level: LogLevel) => {
        switch (level) {
            case LogLevel.INFO: return 'text-blue-400';
            case LogLevel.WARN: return 'text-yellow-400';
            case LogLevel.ERROR: return 'text-orange-400';
            case LogLevel.CRITICAL: return 'text-red-500';
            default: return 'text-gray-400';
        }
    }
    
    const filteredLogs = logs.filter(log => filterLevel === 'ALL' || log.level === filterLevel)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleAnalyzeLogs = async () => {
        setIsLoading(true);
        setAiInsight('');
        const logSample = JSON.stringify(logs.slice(0, 20), null, 2); // Analyze latest 20 logs
        const prompt = `Analyze these system activity logs for unusual patterns, potential security concerns, or performance issues. Provide a brief summary of your findings.
        
        Logs:
        ${logSample}`;
        const insight = await getAIInsight(prompt);
        setAiInsight(insight);
        setIsLoading(false);
    }
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-sm mr-2">Filter by level:</span>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
                            className="bg-base-bg border border-slate-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                        >
                            <option value="ALL">All</option>
                            {Object.values(LogLevel).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handleAnalyzeLogs}
                        disabled={isLoading}
                        className="bg-accent-purple hover:bg-accent-purple/80 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                       {isLoading ? 'Analyzing...' : 'Generate AI Insights'}
                    </button>
                </div>
                 {aiInsight && (
                    <div className="my-4 p-4 bg-slate-800/50 border border-accent-purple/50 rounded-lg text-sm">
                        <h4 className="font-semibold text-accent-purple mb-2">AI Insights:</h4>
                        <p className="text-gray-300 whitespace-pre-wrap">{aiInsight}</p>
                    </div>
                )}
                <div className="font-mono text-xs bg-base-bg p-4 rounded-lg h-[60vh] overflow-y-auto border border-slate-800">
                    {filteredLogs.map(log => (
                        <div key={log.id} className="flex items-start mb-2">
                            <span className="text-gray-500 mr-4">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className={`font-bold w-20 flex-shrink-0 ${getLevelColor(log.level)}`}>[{log.level}]</span>
                            <p className="text-gray-300">{log.message}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
