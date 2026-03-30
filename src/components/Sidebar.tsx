import React from 'react';
import { LayoutDashboard, Users, CheckSquare, Calendar, Settings, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type View = 'dashboard' | 'clients' | 'tasks' | 'calendar' | 'settings' | 'invoices';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onQuickAdd: () => void;
}

export default function Sidebar({ currentView, onViewChange, onQuickAdd }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Freelancer CC</h1>
        <p className="text-xs text-gray-500 mt-1 italic">Command Center</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={cn(
              "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              currentView === item.id
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onQuickAdd}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Quick Add
        </button>
      </div>
    </div>
  );
}
