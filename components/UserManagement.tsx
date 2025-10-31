
import React, { useState } from 'react';
import type { User } from '../types';
import { UserRole } from '../types';
import { Card } from './shared/Card';
import { getAIInsight } from '../services/geminiService';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleGetRecommendation = async () => {
      setIsLoading(true);
      setAiRecommendation('');
      const prompt = `Based on the following user roles in a system: Admin, Operator, Viewer.
      A new user is being added to manage system monitoring and basic troubleshooting tasks. They should not have permission to change system configurations or manage other users.
      Which role (Admin, Operator, or Viewer) would you recommend for this new user? Provide a brief justification.
      Respond in a single paragraph.`;
      const recommendation = await getAIInsight(prompt);
      setAiRecommendation(recommendation);
      setIsLoading(false);
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <Card>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-base-bg border border-slate-700 rounded-md py-2 px-4 w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
                <div className="flex gap-2">
                    <button 
                        onClick={handleGetRecommendation}
                        disabled={isLoading}
                        className="bg-accent-purple/80 hover:bg-accent-purple text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                       {isLoading ? 'Getting Rec...' : 'Get AI Role Recommendation'}
                    </button>
                    <button className="bg-accent-blue hover:bg-accent-blue/80 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Add New User
                    </button>
                </div>
            </div>

            {aiRecommendation && (
                <div className="my-4 p-4 bg-slate-800/50 border border-accent-purple/50 rounded-lg text-sm">
                    <h4 className="font-semibold text-accent-purple mb-2">AI Recommendation:</h4>
                    <p className="text-gray-300">{aiRecommendation}</p>
                </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Last Login</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(user.lastLogin).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="font-medium text-accent-cyan hover:underline mr-4">Edit</button>
                                    <button className="font-medium text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );
};
