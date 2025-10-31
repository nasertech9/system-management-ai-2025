
import type { User, LogEntry, Resource, Task, Notification } from './types';
import { UserRole, LogLevel } from './types';

export const generateInitialUsers = (): User[] => [
    { id: 1, name: 'Admin User', role: UserRole.Admin, status: 'Active', lastLogin: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, name: 'Operator Jane', role: UserRole.Operator, status: 'Active', lastLogin: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, name: 'Viewer Bob', role: UserRole.Viewer, status: 'Inactive', lastLogin: new Date(Date.now() - 604800000).toISOString() },
    { id: 4, name: 'System Analyst', role: UserRole.Operator, status: 'Active', lastLogin: new Date(Date.now() - 172800000).toISOString() },
];

export const generateInitialLogs = (): LogEntry[] => [
    { id: 1, timestamp: new Date(Date.now() - 10000).toISOString(), level: LogLevel.INFO, message: 'System startup successful.' },
    { id: 2, timestamp: new Date(Date.now() - 8000).toISOString(), level: LogLevel.INFO, message: 'User Admin User logged in.' },
    { id: 3, timestamp: new Date(Date.now() - 5000).toISOString(), level: LogLevel.WARN, message: 'High CPU usage detected on server-01.' },
    { id: 4, timestamp: new Date(Date.now() - 2000).toISOString(), level: LogLevel.CRITICAL, message: 'Failed to connect to database cluster.' },
];

export const generateInitialResources = (): Resource[] => [
    { id: 'storage-main', name: 'Main Storage Array', type: 'Storage', status: 'Online', usage: 78 },
    { id: 'api-gateway', name: 'Public API Gateway', type: 'API', status: 'Online', usage: 45 },
    { id: 'render-gpu-1', name: 'GPU Render Node 1', type: 'Device', status: 'Warning', usage: 92 },
    { id: 'auth-service', name: 'Authentication Service', type: 'Service', status: 'Online', usage: 23 },
    { id: 'backup-storage', name: 'Backup Storage', type: 'Storage', status: 'Offline', usage: 0 },
];

export const generateInitialTasks = (): Task[] => [
    { id: 1, name: 'Database Backup', progress: 85, status: 'In Progress' },
    { id: 2, name: 'Deploy Update v2.5', progress: 30, status: 'In Progress' },
    { id: 3, name: 'System Health Check', progress: 100, status: 'Completed' },
    { id: 4, name: 'Migrate User Data', progress: 55, status: 'In Progress' },
];

export const generateInitialNotifications = (): Notification[] => [
    { id: 1, message: 'Critical alert: Database connection failed.', level: 'critical', timestamp: new Date().toISOString() },
    { id: 2, message: 'Storage is reaching capacity (91%).', level: 'warning', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, message: 'New user "Operator Jane" was added.', level: 'success', timestamp: new Date(Date.now() - 86400000).toISOString() },
];
