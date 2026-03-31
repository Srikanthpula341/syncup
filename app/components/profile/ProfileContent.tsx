'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { Mail, Shield, User, Briefcase, Activity, Calendar, LogOut, CheckCircle2, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/app/hooks/useTasks';
import { useActivities } from '@/app/hooks/useActivities';

export default function ProfileContent() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { workspaces } = useAppSelector((state) => state.chat);
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);
  
  // Get counts
  const { tasks } = useTasks(activeWorkspaceId);
  const { activities } = useActivities(activeWorkspaceId);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (!user) return null;

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total Activities', value: activities.length, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Messages Sent', value: activities.filter(a => a.type === 'MESSAGE_SENT').length, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Workspaces', value: workspaces.length, icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-zinc-900 rounded-[32px] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl border-4 border-white/10 p-1 bg-zinc-800 shadow-2xl overflow-hidden relative group">
            <Image 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              alt="Profile" 
              fill 
              className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.displayName || 'Member'}</h1>
               <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-500/30">Active</span>
            </div>
            <p className="text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} />
              {user.email}
            </p>
          </div>
          
          <div className="md:ml-auto flex gap-3 w-full md:w-auto">
             <button 
               onClick={handleLogout}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-2xl transition-all border border-white/5"
             >
               <LogOut size={18} />
               <span>Log Out</span>
             </button>
             <button className="flex-1 md:flex-none px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20">
               Edit Profile
             </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", stat.bg)}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-zinc-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden">
              <div className="p-6 border-b border-zinc-50 bg-zinc-50/50 flex items-center justify-between">
                 <h3 className="font-black text-zinc-900 flex items-center gap-2">
                   <User size={18} className="text-orange-500" />
                   Account Information
                 </h3>
              </div>
              <div className="p-8 grid sm:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Display Name</p>
                    <p className="text-sm font-bold text-zinc-800">{user.displayName || 'Not Provided'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-zinc-800">{user.email}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Account ID</p>
                    <p className="text-sm font-mono text-zinc-500 truncate">{user.uid}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Joined On</p>
                    <p className="text-sm font-bold text-zinc-800">March 2026</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden h-full">
              <div className="p-6 border-b border-zinc-50 bg-zinc-50/50">
                 <h3 className="font-black text-zinc-900 flex items-center gap-2">
                   <Shield size={18} className="text-blue-500" />
                   Security
                 </h3>
              </div>
              <div className="p-6 space-y-4">
                 <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3">
                       <Shield size={16} className="text-emerald-500" />
                       <span className="text-xs font-bold text-zinc-700">Verified Email</span>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                 </div>
                 <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/30">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Two-Factor Auth</p>
                    <p className="text-[11px] text-zinc-500 mb-4 font-medium leading-relaxed">Add an extra layer of security to your account.</p>
                    <button className="w-full py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">Enable 2FA</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
