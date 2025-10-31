
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { MetricData, Task, Notification } from '../types';
import { Card } from './shared/Card';
import { Icon } from './shared/Icon';

interface DashboardProps {
    cpuData: MetricData[];
    ramData: MetricData[];
    networkData: MetricData[];
    tasks: Task[];
    notifications: Notification[];
    userCount: number;
    logCount: number;
}

const MetricChart: React.FC<{ data: MetricData[], title: string, color: string }> = ({ data, title, color }) => (
    <div className="h-64">
        <h4 className="text-gray-300 mb-2">{title}</h4>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#13182b', border: '1px solid #334155', borderRadius: '0.5rem' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="value" name={title} stroke={color} fillOpacity={1} fill={`url(#color${title})`} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'up' | 'down' }> = ({ title, value, change, changeType }) => (
    <Card className="flex flex-col justify-between">
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`text-xs flex items-center ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'up' ? '▲' : '▼'} {change} vs last 24h
        </div>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ cpuData, ramData, networkData, tasks, notifications, userCount, logCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="System Uptime" value="99.98%" change="+0.02%" changeType="up" />
                 <StatCard title="Active Users" value={userCount.toString()} change="+2" changeType="up" />
                 <StatCard title="Alerts Triggered" value={notifications.filter(n => n.level === 'critical').length.toString()} change="-1" changeType="down" />
                 <StatCard title="Logs Generated" value={`${(logCount / 1000).toFixed(1)}k`} change="+5.4%" changeType="up" />
            </div>

            <Card title="CPU Usage" className="lg:col-span-2">
                <MetricChart data={cpuData} title="CPU" color="#00f6ff" />
            </Card>
            <Card title="RAM Usage" className="lg:col-span-2">
                <MetricChart data={ramData} title="RAM" color="#a855f7" />
            </Card>

            <Card title="Active Tasks" className="lg:col-span-3">
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span>{task.name}</span>
                                <span className="font-semibold text-accent-cyan">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-accent-blue to-accent-cyan h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="AI Performance Suggestions" className="lg:col-span-1">
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Icon name="sparkles" className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-300">
                            <span className="font-semibold text-white">Optimize Storage:</span> Consider archiving logs older than 90 days to free up 15% disk space.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                         <Icon name="sparkles" className="w-5 h-5 text-accent-purple flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-300">
                           <span className="font-semibold text-white">Scale Resources:</span> Network traffic is up 30% during peak hours. Recommend scaling API gateway instances.
                        </p>
                    </div>
                 </div>
            </Card>
        </div>
    );
};
