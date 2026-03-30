import { useState, useEffect } from 'react';
import { Client, Task, Invoice, InteractionLog, ContentPlan, AppSettings } from '../types';

const STORAGE_KEY = 'freelancer_command_center_data';

interface AppData {
  clients: Client[];
  tasks: Task[];
  invoices: Invoice[];
  logs: InteractionLog[];
  contentPlans: ContentPlan[];
  settings: AppSettings;
}

const INITIAL_DATA: AppData = {
  clients: [
    { id: '1', name: 'Acme Corp', contact: '+1234567890', status: 'Active', notes: 'Marketing strategy for Q2', createdAt: new Date().toISOString() },
    { id: '2', name: 'Globex', contact: '+0987654321', status: 'Pending', notes: 'Waiting for contract signature', createdAt: new Date().toISOString() },
  ],
  tasks: [
    { id: '1', clientId: '1', title: 'Post Instagram Reel', description: 'Product showcase', dueDate: new Date().toISOString(), status: 'todo', type: 'content' },
    { id: '2', clientId: '2', title: 'Follow up on Globex contract', description: 'Send reminder email', dueDate: new Date().toISOString(), status: 'todo', type: 'follow-up' },
  ],
  invoices: [
    { id: '1', clientId: '1', amount: 1500, status: 'paid', date: '2026-03-01', link: 'https://drive.google.com/invoice1' },
    { id: '2', clientId: '2', amount: 800, status: 'pending', date: '2026-03-15', link: 'https://drive.google.com/invoice2' },
  ],
  logs: [
    { id: '1', clientId: '1', date: new Date().toISOString(), notes: 'Discussed Q2 goals', status: 'completed' },
  ],
  contentPlans: [
    { id: '1', clientId: '1', title: 'Spring Launch Post', platform: 'Instagram', copywriting: 'Spring is here!', status: 'todo', scheduledDate: new Date().toISOString() },
  ],
  settings: {
    language: 'en',
    theme: 'light',
    density: 'comfortable',
  },
};

export function useData() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = { ...client, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setData(prev => ({ ...prev, clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c) }));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...invoice, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, invoices: [...prev.invoices, newInvoice] }));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === id ? { ...i, ...updates } : i) }));
  };

  const addLog = (log: Omit<InteractionLog, 'id'>) => {
    const newLog: InteractionLog = { ...log, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, logs: [...prev.logs, newLog] }));
  };

  const addContentPlan = (plan: Omit<ContentPlan, 'id'>) => {
    const newPlan: ContentPlan = { ...plan, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, contentPlans: [...prev.contentPlans, newPlan] }));
  };

  const updateContentPlan = (id: string, updates: Partial<ContentPlan>) => {
    setData(prev => ({ ...prev, contentPlans: prev.contentPlans.map(p => p.id === id ? { ...p, ...updates } : p) }));
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  };

  return {
    ...data,
    addClient,
    updateClient,
    addTask,
    updateTask,
    addInvoice,
    updateInvoice,
    addLog,
    addContentPlan,
    updateContentPlan,
    updateSettings,
  };
}
