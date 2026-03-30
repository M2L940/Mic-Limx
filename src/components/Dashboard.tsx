import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, Users, MessageSquare, Calendar as CalendarIcon, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useData } from '../hooks/useData';
import { cn, formatDate } from '../lib/utils';
import { Task, Client } from '../types';

export default function Dashboard() {
  const { tasks, clients, updateTask } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate.startsWith(today) || t.dueDate < today);
  const pendingFollowups = tasks.filter(t => t.type === 'follow-up' && t.status !== 'completed');
  const overdueTasks = tasks.filter(t => t.dueDate < today && t.status !== 'completed');

  const stats = [
    { label: 'Pending Tasks', value: todayTasks.filter(t => t.status !== 'completed').length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Follow-ups', value: pendingFollowups.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Overdue', value: overdueTasks.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Active Clients', value: clients.filter(c => c.status === 'Active').length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const kanbanColumns = [
    { id: 'todo', label: 'To Do', color: 'bg-gray-400' },
    { id: 'pending', label: 'In Progress', color: 'bg-blue-400' },
    { id: 'completed', label: 'Completed', color: 'bg-green-400' },
  ];

  return (
    <div className="space-y-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Today's Overview</h2>
          <p className="text-gray-500 mt-1">{formatDate(new Date())}</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
              viewMode === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
              viewMode === 'kanban' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
          >
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Today's Tasks */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-indigo-600" />
                  Today's Tasks
                </h3>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                  {todayTasks.filter(t => t.status !== 'completed').length}
                </span>
              </div>
              
              <div className="space-y-4">
                {todayTasks.filter(t => t.status !== 'completed').length > 0 ? (
                  todayTasks.filter(t => t.status !== 'completed').map(task => (
                    <TaskItem key={task.id} task={task} client={clients.find(c => c.id === task.clientId)} isOverdue={task.dueDate < today} />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-400 italic">No tasks for today. Take a break!</p>
                )}
              </div>
            </section>

            {/* Completed Today */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                  Completed Today
                </h3>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                  {todayTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>

              <div className="space-y-4">
                {todayTasks.filter(t => t.status === 'completed').length > 0 ? (
                  todayTasks.filter(t => t.status === 'completed').map(task => (
                    <TaskItem key={task.id} task={task} client={clients.find(c => c.id === task.clientId)} />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-400 italic">Nothing completed yet.</p>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {kanbanColumns.map(col => (
              <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="font-bold text-gray-500 uppercase text-xs tracking-widest flex items-center">
                    <div className={cn("w-2 h-2 rounded-full mr-2", col.color)} />
                    {col.label}
                  </h4>
                  <span className="text-xs font-bold text-gray-400">
                    {todayTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                <div className="bg-gray-100/50 p-4 rounded-3xl border border-gray-100 min-h-[400px] space-y-4">
                  {todayTasks.filter(t => t.status === col.id).map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => {
                        const nextStatus = col.id === 'todo' ? 'pending' : col.id === 'pending' ? 'completed' : 'todo';
                        updateTask(task.id, { status: nextStatus });
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full",
                          task.type === 'content' ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"
                        )}>
                          {task.type}
                        </span>
                        {task.dueDate < today && task.status !== 'completed' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <h5 className="font-bold text-gray-900 text-sm">{task.title}</h5>
                      <p className="text-xs text-gray-500 mt-1">{clients.find(c => c.id === task.clientId)?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Summary Section */}
      <section className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Weekly Goal Progress</h3>
          <p className="text-indigo-100 mb-6">You've completed {tasks.filter(t => t.status === 'completed').length} tasks this week. Keep going!</p>
          <div className="w-full bg-indigo-500 rounded-full h-3">
            <div className="bg-white h-3 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <CalendarIcon className="h-64 w-64" />
        </div>
      </section>
    </div>
  );
}

function TaskItem({ task, client, isOverdue }: { task: Task, client?: Client, isOverdue?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all hover:shadow-md flex items-center justify-between",
      isOverdue ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
    )}>
      <div className="flex items-center space-x-4">
        <div className={cn(
          "w-2 h-10 rounded-full",
          task.type === 'content' ? "bg-blue-400" : task.type === 'follow-up' ? "bg-indigo-400" : "bg-gray-400"
        )} />
        <div>
          <h4 className="font-bold text-gray-900">{task.title}</h4>
          <p className="text-sm text-gray-500">{client?.name || 'Unknown Client'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-xs font-bold uppercase tracking-wider", isOverdue ? "text-red-600" : "text-gray-400")}>
          {isOverdue ? 'Overdue' : task.status === 'completed' ? 'Done' : 'Due Today'}
        </p>
        <p className="text-xs text-gray-400">{task.type}</p>
      </div>
    </div>
  );
}

