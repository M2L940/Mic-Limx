import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Edit3, 
  Eye, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import html2canvas from 'html2canvas';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import { ContentPlan, Platform } from '../types';

export default function Calendar() {
  const { contentPlans, clients, addContentPlan, updateContentPlan } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPlanningMode, setIsPlanningMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ContentPlan | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const exportAsPng = async () => {
    if (calendarRef.current) {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `content-calendar-${format(currentDate, 'yyyy-MM')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="h-3 w-3" />;
      case 'Facebook': return <Facebook className="h-3 w-3" />;
      case 'LinkedIn': return <Linkedin className="h-3 w-3" />;
      case 'Twitter': return <Twitter className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="mr-2 h-8 w-8 text-indigo-600" />
            Content Planner
          </h2>
          <p className="text-gray-500 mt-1">Plan and visualize your content strategy</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsPlanningMode(false)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
                !isPlanningMode ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Eye className="mr-2 h-4 w-4" />
              Live View
            </button>
            <button
              onClick={() => setIsPlanningMode(true)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all",
                isPlanningMode ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Planning Mode
            </button>
          </div>
          <button
            onClick={exportAsPng}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-bold text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PNG
          </button>
        </div>
      </header>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-xl font-bold text-gray-900 min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Today</button>
          {isPlanningMode && (
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
              <Plus className="mr-2 h-4 w-4" />
              New Content
            </button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div ref={calendarRef} className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {calendarDays.map((day, idx) => {
            const dayPlans = contentPlans.filter(p => isSameDay(new Date(p.scheduledDate), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={cn(
                  "border-r border-b border-gray-50 p-2 min-h-[120px] transition-colors",
                  !isCurrentMonth ? "bg-gray-50/50" : "bg-white",
                  isPlanningMode && "hover:bg-indigo-50/30 cursor-pointer"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-indigo-600 text-white" : isCurrentMonth ? "text-gray-700" : "text-gray-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {isPlanningMode && dayPlans.length > 0 && (
                    <span className="text-[10px] font-bold text-gray-400">{dayPlans.length} items</span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayPlans.map(plan => (
                    <motion.div
                      key={plan.id}
                      layoutId={plan.id}
                      onClick={(e) => {
                        if (isPlanningMode) {
                          e.stopPropagation();
                          setSelectedPlan(plan);
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1.5 transition-all",
                        plan.status === 'completed' ? "bg-green-50 text-green-700 border border-green-100" : "bg-indigo-50 text-indigo-700 border border-indigo-100",
                        isPlanningMode && "hover:shadow-md hover:scale-[1.02] cursor-pointer"
                      )}
                    >
                      <div className="flex-shrink-0">{getPlatformIcon(plan.platform)}</div>
                      <span className="truncate flex-1">{plan.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Content</h3>
                  <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Title</label>
                    <input
                      type="text"
                      value={selectedPlan.title}
                      onChange={(e) => setSelectedPlan({ ...selectedPlan, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Platform</label>
                      <select
                        value={selectedPlan.platform}
                        onChange={(e) => setSelectedPlan({ ...selectedPlan, platform: e.target.value as Platform })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Status</label>
                      <select
                        value={selectedPlan.status}
                        onChange={(e) => setSelectedPlan({ ...selectedPlan, status: e.target.value as any })}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Copywriting</label>
                    <textarea
                      value={selectedPlan.copywriting}
                      onChange={(e) => setSelectedPlan({ ...selectedPlan, copywriting: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => {
                      updateContentPlan(selectedPlan.id, selectedPlan);
                      setSelectedPlan(null);
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
