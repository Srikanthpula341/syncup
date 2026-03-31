'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setActiveWorkspace } from '@/app/store/slices/uiSlice';
import { ArrowRight, Globe, LayoutGrid, Lock, Plus, Settings, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/lib/route-constants';

export default function WorkspaceList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { workspaces } = useAppSelector((state) => state.chat);
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);

  const handleSwitchWorkspace = (workspaceId: string) => {
    dispatch(setActiveWorkspace(workspaceId));
    router.push(ROUTES.CHAT);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 mb-2">
             <LayoutGrid size={14} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Multi-Tenant Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">Your Workspaces</h1>
          <p className="text-zinc-500 font-medium max-w-md leading-relaxed">
            Switch between your teams or create a new space for your next big project.
          </p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-[22px] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 group">
           <Plus size={20} className="transition-transform group-hover:rotate-90" />
           <span>Create Workspace</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === activeWorkspaceId;
          
          return (
            <div 
              key={workspace.id}
              className={`group bg-white rounded-[32px] border ${isActive ? 'border-orange-500 ring-4 ring-orange-500/5' : 'border-zinc-100'} p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-orange-500 text-white p-1 rounded-full">
                     <Lock size={12} fill="currentColor" />
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {/* Logo */}
                <div className="w-20 h-20 rounded-[28px] bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner relative overflow-hidden">
                   {workspace.avatar ? (
                     <Image src={workspace.avatar} alt={workspace.name} fill className="object-cover" />
                   ) : (
                     <span className="text-3xl font-black text-orange-500">{workspace.name.substring(0, 2).toUpperCase()}</span>
                   )}
                </div>
                
                {/* Info */}
                <div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2 truncate group-hover:text-orange-600 transition-colors">{workspace.name}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Users size={14} /> 12 Members</span>
                     <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                     <span className="flex items-center gap-1.5"><Globe size={14} /> Global</span>
                  </div>
                </div>
                
                {/* Action */}
                <button 
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-zinc-50 text-zinc-400 cursor-default' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 px-8'
                  }`}
                  disabled={isActive}
                >
                  <span>{isActive ? 'Current Space' : 'Launch Workspace'}</span>
                  {!isActive && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Placeholder for Mock Data if none */}
        {workspaces.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-300 border-2 border-dashed border-zinc-100 rounded-[40px]">
              <LayoutGrid size={64} className="mb-4 opacity-10" />
              <p className="text-xl font-black tracking-tight">No workspaces found</p>
              <p className="text-sm font-medium mt-1">Ready to start something new?</p>
              <button className="mt-8 px-8 py-3 bg-zinc-100 text-zinc-500 hover:bg-orange-500 hover:text-white rounded-2xl font-bold transition-all">Create First Workspace</button>
           </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-zinc-50 rounded-[40px] p-8 md:p-12 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
               <Settings size={28} className="text-zinc-400" />
            </div>
            <div>
               <h4 className="font-black text-zinc-900">Workspace Management</h4>
               <p className="text-sm font-medium text-zinc-500">Need to invite team members or update settings?</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
            Access Admin Console
         </button>
      </div>
    </div>
  );
}
