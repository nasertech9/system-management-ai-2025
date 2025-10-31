
export enum UserRole {
  Admin = 'Admin',
  Operator = 'Operator',
  Viewer = 'Viewer',
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface Resource {
    id: string;
    name: string;
    type: 'Storage' | 'API' | 'Device' | 'Service';
    status: 'Online' | 'Offline' | 'Warning';
    usage: number; // as a percentage
}

export interface MetricData {
    name: string;
    value: number;
}

export interface Task {
    id: number;
    name: string;
    progress: number;
    status: 'In Progress' | 'Completed' | 'Failed';
}

export interface Notification {
    id: number;
    message: string;
    level: 'success' | 'warning' | 'critical';
    timestamp: string;
}
