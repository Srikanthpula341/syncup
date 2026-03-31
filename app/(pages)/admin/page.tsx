'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  Activity,
  ShieldCheck,
  MoreVertical,
  Calendar
} from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES, USER_ROLES } from '@/app/lib/route-constants';

export default function AdminPage() {
  const router = useRouter();
  const { user: currentUser, status } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.chat);
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(() => Date.now());

  // Update 'now' every minute for fresh relative times
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Security Check Redirect
  useEffect(() => {
    if (status === 'authenticated' && currentUser?.role !== USER_ROLES.SUPER_ADMIN) {
      router.push(ROUTES.CHAT);
    }
  }, [currentUser, status, router]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0));
  }, [users, searchTerm]);

  // Loading state if not checked yet
  if (status === 'loading' || !currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-50/50">
        <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Double check role during render (don't render content if unauthorized)
  if (currentUser.role !== USER_ROLES.SUPER_ADMIN) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-zinc-50/50">
      {/* Header */}
      <div className="p-8 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <ShieldCheck size={24} />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">System Admin</h1>
             </div>
             <p className="text-sm font-medium text-zinc-500">Manage your entire workspace ecosystem and user directory.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder="Search all users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-zinc-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-600/20 transition-all outline-none w-64 lg:w-80"
                />
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <StatCard 
               icon={<Users className="text-blue-600" />} 
               label="Total Users" 
               value={users.length.toString()} 
               trend="+12 this week"
             />
             <StatCard 
               icon={<Activity className="text-emerald-600" />} 
               label="Active Now" 
               value={users.filter(u => (now / 1000 - (u.lastSeen?.seconds || 0)) < 300).length.toString()} 
               trend="84% Engagement"
             />
             <StatCard 
               icon={<ShieldAlert className="text-amber-600" />} 
               label="Super Admins" 
               value={users.filter(u => u.role === USER_ROLES.SUPER_ADMIN).length.toString()} 
               trend="Restricted Access"
             />
          </div>

          {/* User List Table */}
          <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-zinc-50/50 border-b border-zinc-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">User Identity</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Access Role</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Last Active</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {filteredUsers.map(user => (
                      <tr key={user.uid} className="hover:bg-zinc-50/50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="relative">
                                  <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden relative border border-zinc-200">
                                     {user.photoURL ? (
                                        <Image src={user.photoURL} alt={user.displayName || ''} fill className="object-cover" />
                                     ) : (
                                        <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                                           {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </div>
                                     )}
                                  </div>
                                  {(now / 1000 - (user.lastSeen?.seconds || 0)) < 300 && (
                                     <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                  )}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-zinc-900 leading-none mb-1">{user.displayName || 'Anonymous User'}</p>
                                  <p className="text-[11px] font-medium text-zinc-400">{user.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className={cn(
                               "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                               user.role === USER_ROLES.SUPER_ADMIN 
                                 ? "bg-indigo-100 text-indigo-700 border border-indigo-200" 
                                 : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                            )}>
                               {user.role === USER_ROLES.SUPER_ADMIN ? <ShieldCheck size={12} /> : null}
                               {user.role || 'Member'}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                               <Calendar size={14} className="text-zinc-400" />
                               {user.lastSeen 
                                 ? formatDistanceToNow(user.lastSeen.seconds * 1000, { addSuffix: true }) 
                                 : 'Never'}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100">
                               <MoreVertical size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             
             {filteredUsers.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-zinc-50 rounded-[20px] flex items-center justify-center text-zinc-300 mb-4 border border-zinc-100">
                      <Search size={32} />
                   </div>
                   <p className="text-sm font-black text-zinc-400 uppercase tracking-widest leading-none">No users found</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
       <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
             {icon}
          </div>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{trend}</span>
       </div>
       <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</h4>
       <p className="text-3xl font-black text-zinc-900 tracking-tight">{value}</p>
    </div>
  );
}
