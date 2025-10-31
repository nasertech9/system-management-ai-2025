
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { AIAssistant } from './components/AIAssistant';
import { ActivityLog } from './components/ActivityLog';
import type { User, LogEntry, Resource, MetricData, Task, Notification } from './types';
import { UserRole } from './types';
import { generateInitialUsers, generateInitialLogs, generateInitialResources, generateInitialTasks, generateInitialNotifications } from './constants';
import { ResourceManagement } from './components/ResourceManagement';

type View = 'dashboard' | 'users' | 'resources' | 'logs';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  const [users, setUsers] = useState<User[]>(generateInitialUsers);
  const [logs, setLogs] = useState<LogEntry[]>(generateInitialLogs);
  const [resources, setResources] = useState<Resource[]>(generateInitialResources);
  const [tasks, setTasks] = useState<Task[]>(generateInitialTasks);
  const [notifications, setNotifications] = useState<Notification[]>(generateInitialNotifications);
  
  const [cpuData, setCpuData] = useState<MetricData[]>([]);
  const [ramData, setRamData] = useState<MetricData[]>([]);
  const [networkData, setNetworkData] = useState<MetricData[]>([]);

  const addNewUser = useCallback((name: string, role: UserRole) => {
    setUsers(prevUsers => [
      ...prevUsers,
      {
        id: prevUsers.length + 1,
        name,
        role,
        status: 'Active',
        lastLogin: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newCpuValue = Math.floor(Math.random() * 60) + 20;
      const newRamValue = Math.floor(Math.random() * 50) + 40;
      const newNetworkValue = Math.floor(Math.random() * 70) + 10;
      
      setCpuData(prev => [...prev.slice(-9), { name: newTime, value: newCpuValue }]);
      setRamData(prev => [...prev.slice(-9), { name: newTime, value: newRamValue }]);
      setNetworkData(prev => [...prev.slice(-9), { name: newTime, value: newNetworkValue }]);

      // Randomly update a task
      setTasks(prevTasks => {
        const newTasks = [...prevTasks];
        const taskIndex = Math.floor(Math.random() * newTasks.length);
        if (newTasks[taskIndex].progress < 100) {
            newTasks[taskIndex].progress = Math.min(100, newTasks[taskIndex].progress + Math.floor(Math.random() * 5));
        }
        return newTasks;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  cpuData={cpuData} 
                  ramData={ramData} 
                  networkData={networkData} 
                  tasks={tasks} 
                  notifications={notifications}
                  logCount={logs.length}
                  userCount={users.length}
                />;
      case 'users':
        return <UserManagement users={users} setUsers={setUsers} />;
      case 'resources':
        return <ResourceManagement resources={resources} setResources={setResources} />;
      case 'logs':
        return <ActivityLog logs={logs} setLogs={setLogs} />;
      default:
        return <Dashboard 
                  cpuData={cpuData} 
                  ramData={ramData} 
                  networkData={networkData} 
                  tasks={tasks} 
                  notifications={notifications}
                  logCount={logs.length}
                  userCount={users.length}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-base-bg text-gray-200 font-mono">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header notifications={notifications} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-bg p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <AIAssistant onCommandExecute={addNewUser} />
    </div>
  );
};

export default App;
