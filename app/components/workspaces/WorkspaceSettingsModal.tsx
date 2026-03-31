'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setSettingsModalOpen } from '@/app/store/slices/uiSlice';
import { X, Users, Settings, ShieldAlert, Save, Trash2, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';
import { api } from '@/app/lib/api-client';

const TABS = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'members', name: 'Members', icon: Users },
  { id: 'danger', name: 'Danger Zone', icon: ShieldAlert },
] as const;

type TabId = typeof TABS[number]['id'];

export default function WorkspaceSettingsModal() {
  const dispatch = useAppDispatch();
  const { isSettingsModalOpen, activeWorkspaceId } = useAppSelector((state) => state.ui);
  const { workspaces, users } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [isSaving, setIsSaving] = useState(false);
  
  const workspace = workspaces.find(w => w.id === activeWorkspaceId);
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || '');

  if (!isSettingsModalOpen) return null;

  const handleSaveGeneral = async () => {
    if (!workspaceName.trim() || !activeWorkspaceId || !currentUser) return;
    
    setIsSaving(true);
    try {
      await api.workspaces.update({
        workspaceId: activeWorkspaceId,
        userId: currentUser.uid,
        name: workspaceName.trim()
      });
      toast.success('Workspace updated successfully');
    } catch {
      toast.error('Failed to update workspace');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = (uid: string) => {
     // API Placeholder
     toast.success('Member removed');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setSettingsModalOpen(false))}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex"
        >
          {/* Sidebar Navigation */}
          <div className="w-56 bg-zinc-50/50 border-r border-zinc-100 flex flex-col p-6">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 px-2">
              Settings
            </div>
            
            <nav className="flex-1 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                      isActive 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            <button 
              onClick={() => dispatch(setSettingsModalOpen(false))}
              className="mt-auto flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
            >
              <X size={18} />
              Close
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-white">
            <header className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                  {TABS.find(t => t.id === activeTab)?.name}
                </h2>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  Manage your workspace environment
                </p>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {activeTab === 'general' && (
                <div className="max-w-md space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        Workspace Name
                      </label>
                      <input 
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                      />
                   </div>

                   <button 
                     onClick={handleSaveGeneral}
                     disabled={isSaving}
                     className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
                   >
                     {isSaving ? 'Saving...' : (
                       <>
                         <Save size={18} />
                         Save Changes
                       </>
                     )}
                   </button>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        Team Members ({users.length})
                      </span>
                   </div>
                   
                   <div className="space-y-2">
                      {users.map(member => (
                        <div 
                          key={member.uid}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-all group"
                        >
                           <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden">
                              {member.photoURL ? (
                                <img src={member.photoURL} alt={member.displayName || ''} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-zinc-500 font-black">{member.displayName?.[0] || 'U'}</span>
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-zinc-900 truncate">
                                {member.displayName || member.email}
                              </div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                                {member.uid === workspace?.ownerId ? 'Workspace Owner' : 'Member'}
                              </div>
                           </div>
                           {member.uid !== currentUser?.uid && (
                             <button 
                               onClick={() => handleRemoveMember(member.uid)}
                               className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                               title="Remove from workspace"
                             >
                               <UserMinus size={18} />
                             </button>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="max-w-md space-y-6">
                   <div className="p-6 rounded-2xl bg-red-50 border border-red-100 space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                         <ShieldAlert size={24} />
                         <span className="text-sm font-black uppercase tracking-widest">High-Risk Action</span>
                      </div>
                      <p className="text-xs text-red-600 font-bold leading-relaxed">
                        Deleting this workspace is permanent. All channels, messages, and files will be permanently wiped. This action cannot be undone.
                      </p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/20">
                         <Trash2 size={18} />
                         Delete Workspace
                      </button>
                   </div>
                </div>
              )}
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
