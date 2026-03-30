/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Invoices from './components/Invoices';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import QuickAdd from './components/QuickAdd';
import { useData } from './hooks/useData';
import { cn } from './lib/utils';

type View = 'dashboard' | 'clients' | 'tasks' | 'calendar' | 'settings' | 'invoices';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { settings } = useData();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'invoices': return <Invoices />;
      case 'calendar': return <Calendar />;
      case 'settings': return <Settings />;
      case 'tasks': return <Dashboard />; // Tasks view reuse dashboard for now or can be separate
      default: return <Dashboard />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900",
      settings.theme === 'dark' && "dark bg-gray-900 text-gray-100",
      settings.density === 'compact' ? "text-sm" : "text-base"
    )}>
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onQuickAdd={() => setIsQuickAddOpen(true)} 
      />

      <main className="pl-64 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <QuickAdd 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </div>
  );
}

