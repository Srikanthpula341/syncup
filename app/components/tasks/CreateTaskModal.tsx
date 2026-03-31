'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Type, AlignLeft } from 'lucide-react';
import { Task } from '@/app/hooks/useTasks';
import { cn } from '@/app/lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => Promise<unknown>;
}

const INITIAL_STATE = {
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  dueDate: '',
};

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate ? { toMillis: () => new Date(formData.dueDate).getTime() } : null,
        columnId: 'todo',
      });
      setFormData(INITIAL_STATE);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900">Create New Task</h2>
                  <p className="text-[10px] font-bold text-zinc-400 lg:mb-1 uppercase tracking-widest leading-none">Drafting your Next Win</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                  <Type size={12} />
                  Task Title
                </label>
                <input 
                  autoFocus
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  className="w-full text-lg font-bold bg-transparent border-none outline-none placeholder:text-zinc-200 focus:ring-0 p-0"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                  <AlignLeft size={12} />
                  Description
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add more details or acceptance criteria..."
                  className="w-full min-h-[100px] text-zinc-600 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 text-sm resize-none outline-none focus:border-orange-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Priority */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <AlertCircle size={12} />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as Task['priority'][]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          formData.priority === p 
                            ? p === 'high' ? "bg-red-50 border-red-200 text-red-600"
                              : p === 'medium' ? "bg-orange-50 border-orange-200 text-orange-600"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <Calendar size={12} />
                    Due Date
                  </label>
                  <input 
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 py-2 text-sm font-bold text-zinc-700 outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 bg-white flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 rounded-2xl transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim()}
                className="px-8 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-2xl hover:bg-zinc-800 disabled:bg-zinc-200 transition-all shadow-xl shadow-zinc-900/10"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
