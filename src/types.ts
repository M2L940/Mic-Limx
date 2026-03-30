export type ClientStatus = 'Active' | 'Pending';
export type TaskStatus = 'todo' | 'pending' | 'completed';
export type InvoiceStatus = 'paid' | 'pending';
export type Platform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Twitter' | 'Other';

export interface Client {
  id: string;
  name: string;
  contact: string; // WhatsApp number
  status: ClientStatus;
  notes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  type: 'content' | 'follow-up' | 'other';
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  link: string; // Google Drive link
}

export interface InteractionLog {
  id: string;
  clientId: string;
  date: string;
  notes: string;
  followUpDate?: string;
  status: TaskStatus;
}

export interface ContentPlan {
  id: string;
  clientId: string;
  title: string;
  platform: Platform;
  copywriting: string;
  status: TaskStatus;
  scheduledDate: string;
}

export interface AppSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark';
  density: 'compact' | 'comfortable';
}
