
import React, { useState } from 'react';
import type { Resource } from '../types';
import { Card } from './shared/Card';
import { getAIInsight } from '../services/geminiService';

interface ResourceManagementProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({ resources, setResources }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState('');

    const getStatusColor = (status: Resource['status']) => {
        switch(status) {
            case 'Online': return 'bg-green-500/20 text-green-400';
            case 'Offline': return 'bg-gray-500/20 text-gray-400';
            case 'Warning': return 'bg-yellow-500/20 text-yellow-400';
        }
    }

    const getUsageColor = (usage: number) => {
        if (usage > 90) return 'bg-red-500';
        if (usage > 75) return 'bg-yellow-500';
        return 'bg-accent-blue';
    }

    const handleGetOptimizationPlan = async () => {
        setIsLoading(true);
        setAiInsight('');
        const resourceData = JSON.stringify(resources.map(r => ({name: r.name, type: r.type, status: r.status, usage: r.usage})), null, 2);
        const prompt = `Analyze the following system resource data and provide a predictive resource allocation and optimization plan.
        Focus on high-usage resources and potential bottlenecks. Keep the response concise and actionable.
        
        Resource Data:
        ${resourceData}`;
        const insight = await getAIInsight(prompt);
        setAiInsight(insight);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Resource Management</h2>

            <div className="flex justify-end">
                <button 
                    onClick={handleGetOptimizationPlan}
                    disabled={isLoading}
                    className="bg-accent-purple hover:bg-accent-purple/80 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Analyzing...' : 'Generate AI Optimization Plan'}
                </button>
            </div>
             
            {aiInsight && (
                <Card title="AI Optimization Plan">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{aiInsight}</pre>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(resource => (
                    <Card key={resource.id} className="flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg text-white">{resource.name}</p>
                                <p className="text-sm text-gray-400">{resource.type}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(resource.status)}`}>
                                {resource.status}
                            </span>
                        </div>
                        <div className="mt-4 flex-grow">
                            <p className="text-sm text-gray-400">Usage</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div className={`${getUsageColor(resource.usage)} h-2.5 rounded-full`} style={{width: `${resource.usage}%`}}></div>
                                </div>
                                <span className="text-sm font-semibold text-accent-cyan">{resource.usage}%</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-700 pt-3 flex gap-2">
                             <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">Details</button>
                             <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">Manage</button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
