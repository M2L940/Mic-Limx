import React from 'react';
import { Settings as SettingsIcon, Globe, Moon, Sun, Layout, Trash2, Download, Upload } from 'lucide-react';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';

export default function Settings() {
  const { settings, updateSettings } = useData();

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="mr-2 h-8 w-8 text-gray-600" />
          App Settings
        </h2>
        <p className="text-gray-500 mt-1">Customize your command center experience</p>
      </header>

      <div className="space-y-6">
        {/* Language */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Language</h4>
                <p className="text-xs text-gray-500">Choose your preferred language</p>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => updateSettings({ language: 'en' })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.language === 'en' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                English
              </button>
              <button
                onClick={() => updateSettings({ language: 'zh' })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.language === 'zh' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                中文
              </button>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Sun className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Appearance</h4>
                <p className="text-xs text-gray-500">Switch between light and dark mode</p>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.theme === 'light' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.theme === 'dark' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </button>
            </div>
          </div>
        </section>

        {/* Layout Density */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Layout className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Layout Density</h4>
                <p className="text-xs text-gray-500">Adjust the spacing of the interface</p>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => updateSettings({ density: 'compact' })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.density === 'compact' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Compact
              </button>
              <button
                onClick={() => updateSettings({ density: 'comfortable' })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  settings.density === 'comfortable' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Comfortable
              </button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">Data Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-bold text-sm">
              <Download className="mr-2 h-4 w-4" />
              Export Backup (JSON)
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-bold text-sm">
              <Upload className="mr-2 h-4 w-4" />
              Restore Backup
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm md:col-span-2">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </button>
          </div>
        </section>
      </div>

      <footer className="text-center py-8">
        <p className="text-xs text-gray-400">Freelancer Command Center v1.0.0</p>
        <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-bold">Built with AI Studio</p>
      </footer>
    </div>
  );
}
