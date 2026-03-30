import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Users, CheckSquare, MessageSquare, DollarSign, Calendar } from 'lucide-react';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import { ClientStatus, TaskStatus, Platform } from '../types';

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'task' | 'client' | 'log' | 'invoice' | 'content';

export default function QuickAdd({ isOpen, onClose }: QuickAddProps) {
  const { clients, addTask, addClient, addLog, addInvoice, addContentPlan } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('task');

  // Form states
  const [taskData, setTaskData] = useState({ title: '', clientId: '', dueDate: new Date().toISOString().split('T')[0], type: 'content' as any });
  const [clientData, setClientData] = useState({ name: '', contact: '', status: 'Active' as ClientStatus, notes: '' });
  const [logData, setLogData] = useState({ clientId: '', notes: '', followUpDate: '', status: 'completed' as TaskStatus });
  const [invoiceData, setInvoiceData] = useState({ clientId: '', amount: 0, date: new Date().toISOString().split('T')[0], status: 'pending' as any, link: '' });
  const [contentData, setContentData] = useState({ clientId: '', title: '', platform: 'Instagram' as Platform, copywriting: '', scheduledDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'task') {
      addTask({ ...taskData, status: 'todo', description: '' });
    } else if (activeTab === 'client') {
      addClient(clientData);
    } else if (activeTab === 'log') {
      addLog({ ...logData, date: new Date().toISOString() });
    } else if (activeTab === 'invoice') {
      addInvoice(invoiceData);
    } else if (activeTab === 'content') {
      addContentPlan({ ...contentData, status: 'todo' });
    }
    onClose();
  };

  const tabs = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'client', label: 'Client', icon: Users },
    { id: 'log', label: 'Log', icon: MessageSquare },
    { id: 'invoice', label: 'Invoice', icon: DollarSign },
    { id: 'content', label: 'Content', icon: Calendar },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Quick Add</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-2xl">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={cn(
                      "flex-1 flex items-center justify-center py-2 rounded-xl text-xs font-bold transition-all",
                      activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <tab.icon className="mr-1.5 h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'task' && (
                  <>
                    <input
                      type="text"
                      placeholder="Task Title"
                      required
                      value={taskData.title}
                      onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      required
                      value={taskData.clientId}
                      onChange={e => setTaskData({ ...taskData, clientId: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        required
                        value={taskData.dueDate}
                        onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={taskData.type}
                        onChange={e => setTaskData({ ...taskData, type: e.target.value as any })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="content">Content</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'client' && (
                  <>
                    <input
                      type="text"
                      placeholder="Client Name"
                      required
                      value={clientData.name}
                      onChange={e => setClientData({ ...clientData, name: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp Contact"
                      required
                      value={clientData.contact}
                      onChange={e => setClientData({ ...clientData, contact: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={clientData.status}
                      onChange={e => setClientData({ ...clientData, status: e.target.value as any })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </>
                )}

                {activeTab === 'log' && (
                  <>
                    <select
                      required
                      value={logData.clientId}
                      onChange={e => setLogData({ ...logData, clientId: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <textarea
                      placeholder="Conversation Notes"
                      required
                      value={logData.notes}
                      onChange={e => setLogData({ ...logData, notes: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    />
                    <input
                      type="date"
                      placeholder="Follow-up Date"
                      value={logData.followUpDate}
                      onChange={e => setLogData({ ...logData, followUpDate: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </>
                )}

                {activeTab === 'invoice' && (
                  <>
                    <select
                      required
                      value={invoiceData.clientId}
                      onChange={e => setInvoiceData({ ...invoiceData, clientId: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Amount"
                        required
                        value={invoiceData.amount || ''}
                        onChange={e => setInvoiceData({ ...invoiceData, amount: parseFloat(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="date"
                        required
                        value={invoiceData.date}
                        onChange={e => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Google Drive Link"
                      value={invoiceData.link}
                      onChange={e => setInvoiceData({ ...invoiceData, link: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </>
                )}

                {activeTab === 'content' && (
                  <>
                    <select
                      required
                      value={contentData.clientId}
                      onChange={e => setContentData({ ...contentData, clientId: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Content Title"
                      required
                      value={contentData.title}
                      onChange={e => setContentData({ ...contentData, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={contentData.platform}
                        onChange={e => setContentData({ ...contentData, platform: e.target.value as Platform })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="date"
                        required
                        value={contentData.scheduledDate}
                        onChange={e => setContentData({ ...contentData, scheduledDate: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <textarea
                      placeholder="Copywriting Draft"
                      value={contentData.copywriting}
                      onChange={e => setContentData({ ...contentData, copywriting: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4"
                >
                  Add {tabs.find(t => t.id === activeTab)?.label}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
