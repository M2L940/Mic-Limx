import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, DollarSign, ExternalLink, Filter, Search, MoreVertical, TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';
import { useData } from '../hooks/useData';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { Invoice } from '../types';

export default function Invoices() {
  const { invoices, clients, addInvoice, updateInvoice } = useData();
  const [filterStatus, setFilterStatus] = useState<'All' | 'paid' | 'pending'>('All');

  const filteredInvoices = invoices.filter(i => filterStatus === 'All' || i.status === filterStatus);

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = invoices
    .filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && i.status === 'paid';
    })
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="mr-2 h-8 w-8 text-green-600" />
            Invoices
          </h2>
          <p className="text-gray-500 mt-1">Manage your records and revenue</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="mr-2 h-5 w-5" />
          New Invoice
        </button>
      </header>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Monthly Revenue</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
          <p className="text-xs text-gray-400 mt-2">March 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Payments</p>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(pendingRevenue)}</p>
          <p className="text-xs text-gray-400 mt-2">{invoices.filter(i => i.status === 'pending').length} invoices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-indigo-600 rounded-2xl shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-indigo-100 uppercase tracking-wider">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-indigo-200" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-indigo-100 mt-2">All time</p>
        </motion.div>
      </div>

      {/* Invoice List */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Invoices</h3>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {clients.find(c => c.id === invoice.clientId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase rounded-full",
                      invoice.status === 'paid' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={invoice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
