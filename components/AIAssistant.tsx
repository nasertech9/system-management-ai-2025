
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse } from '../services/geminiService';
import { Icon } from './shared/Icon';
import type { UserRole } from '../types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  onCommandExecute: (name: string, role: UserRole) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onCommandExecute }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! How can I help you manage the system today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    const response = await getAIAssistantResponse(input, chatHistory);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);

    if (response.action) {
      // Simulate action execution
      const { action, params } = response.action;
      if (action === 'ADD_USER' && params.name && params.role) {
        onCommandExecute(params.name, params.role);
        setMessages(prev => [...prev, { sender: 'ai', text: `Action complete: User "${params.name}" has been added as an "${params.role}".` }]);
      } else if (action === 'OPTIMIZE_MEMORY') {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Simulating memory optimization... Done. Freed 2.5GB of RAM.' }]);
      } else if (action === 'SHOW_PERFORMANCE') {
         setMessages(prev => [...prev, { sender: 'ai', text: 'Current system performance: CPU at 45%, RAM at 62%, Network stable.' }]);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-accent-purple p-4 rounded-full shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
      >
        <Icon name="sparkles" className="w-8 h-8 text-white" />
      </button>
    );
  }

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-container-bg flex-shrink-0 flex flex-col border-l border-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center">
            <Icon name="sparkles" className="w-5 h-5 mr-2 text-accent-purple"/>
            AI Assistant
        </h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-accent-blue text-white' : 'bg-slate-700'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-700 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-accent-cyan rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center bg-base-bg border border-slate-700 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI... e.g., 'Add user John'"
            className="flex-1 bg-transparent p-3 text-sm focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="p-3 text-accent-cyan hover:text-white disabled:text-gray-500">
            <Icon name="send" className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </aside>
  );
};
