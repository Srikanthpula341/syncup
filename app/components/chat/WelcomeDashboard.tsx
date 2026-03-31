'use client';

import React from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { motion } from 'framer-motion';
import { Rocket, Coffee, Zap, Users, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const QUICK_ACTIONS = [
  {
    title: 'Create Channel',
    description: 'Start a new conversation for your team.',
    icon: PlusCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    title: 'Invite Teammate',
    description: 'Bring more collaborators to your workspace.',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  }
];

export default function WelcomeDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { workspaces } = useAppSelector((state) => state.chat);
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  return (
    <div className="h-full w-full bg-[#FDF8F5] flex flex-col items-center justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="max-w-4xl w-full flex flex-col gap-12">
        
        {/* Header Greeting */}
        <section className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20 mb-8"
          >
            <Rocket size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-zinc-900 tracking-tight"
          >
            Welcome back, <br/>
            <span className="text-orange-500">{user?.displayName?.split(' ')[0] || 'Explorer'}!</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs"
          >
            You&apos;re currently in <span className="text-zinc-900">{activeWorkspace?.name || 'an unknown workspace'}</span>
          </motion.p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Quick Actions */}
           <div className="grid grid-cols-1 gap-6 flex-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Quick Actions</h3>
              {QUICK_ACTIONS.map((action, idx) => {
                 const Icon = action.icon;
                 return (
                    <motion.div 
                       key={action.title}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.3 + (idx * 0.1) }}
                       className="group p-6 rounded-[32px] bg-white border border-zinc-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex items-center gap-6 cursor-pointer"
                    >
                       <div className={`w-12 h-12 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all`}>
                          <Icon size={24} />
                       </div>
                       <div>
                          <div className="text-base font-black text-zinc-900">{action.title}</div>
                          <div className="text-xs text-gray-400 font-bold mt-1">{action.description}</div>
                       </div>
                    </motion.div>
                 );
              })}
           </div>

           {/* Workspace Insight Card */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="flex-1 bg-zinc-900 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden"
           >
              {/* Background Feature Image */}
              <div className="absolute right-[-20%] bottom-[-10%] w-[80%] h-[80%] opacity-20 pointer-events-none grayscale">
                 <Image 
                   src="/landing/feature_workspace.png" 
                   alt="SyncUp Workspace" 
                   fill 
                   className="object-contain" 
                 />
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                       Pro Tip
                    </div>
                 </div>
                 <h2 className="text-2xl font-black leading-tight">
                    Select a channel to <br/>
                    start collaborating.
                 </h2>
                 <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Once you select a channel from the sidebar, you&apos;ll see all your team&apos;s messages, 
                    reactions, and real-time activity appear here instantly.
                 </p>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-zinc-800 relative z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                       <Zap size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Auto-Save Enabled</span>
                 </div>
                 <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Coffee size={18} />
                 </div>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
