import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Phone, MessageSquare, Plus, ChevronRight, ExternalLink, Search, Filter, MoreVertical } from 'lucide-react';
import { useData } from '../hooks/useData';
import { cn, formatDate } from '../lib/utils';
import { Client, InteractionLog } from '../types';

export default function Clients() {
  const { clients, logs, addClient, updateClient, addLog } = useData();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending'>('All');

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientLogs = logs.filter(l => l.clientId === selectedClientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contact.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Client List */}
      <div className={cn(
        "flex flex-col border-r border-gray-200 transition-all duration-300",
        selectedClientId ? "w-1/3" : "w-full"
      )}>
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-6 w-6 text-indigo-600" />
              Clients
            </h2>
            <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredClients.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all hover:shadow-sm",
                selectedClientId === client.id
                  ? "bg-indigo-50 border-indigo-200 shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900">{client.name}</h4>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full",
                  client.status === 'Active' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {client.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {client.contact}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Client Detail */}
      <AnimatePresence mode="wait">
        {selectedClientId && selectedClient ? (
          <motion.div
            key={selectedClientId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col bg-gray-50"
          >
            <div className="p-8 bg-white border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{selectedClient.name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={cn(
                    "px-3 py-1 text-xs font-bold uppercase rounded-full",
                    selectedClient.status === 'Active' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {selectedClient.status}
                  </span>
                  <a
                    href={`https://wa.me/${selectedClient.contact.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-indigo-600 hover:underline font-medium"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button onClick={() => setSelectedClientId(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Notes Section */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Client Notes</h4>
                <textarea
                  value={selectedClient.notes}
                  onChange={(e) => updateClient(selectedClient.id, { notes: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Add client strategy, goals, or important details..."
                />
              </section>

              {/* Interaction Logs */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Interaction Logs</h4>
                  <button className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
                    <Plus className="h-3 w-3 mr-1" />
                    New Log
                  </button>
                </div>
                <div className="space-y-4">
                  {clientLogs.map(log => (
                    <div key={log.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">{formatDate(log.date)}</span>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full",
                          log.status === 'completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-gray-700">{log.notes}</p>
                      {log.followUpDate && (
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-indigo-600 font-bold">
                          <Clock className="h-3 w-3 mr-1" />
                          Follow-up: {formatDate(log.followUpDate)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 italic">
            Select a client to view details
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return <ClockIcon className={className} />;
}

import { Clock as ClockIcon } from 'lucide-react';
