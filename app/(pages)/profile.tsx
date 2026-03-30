'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Hash, 
  ChevronDown, 
  Plus, 
  Bell, 
  MessageSquareText,
  LogOut
} from 'lucide-react';
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';
import { signOut as clearAuth } from '@/app/store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Profile() {

      const dispatch = useAppDispatch();
  const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);


      const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearAuth());
      toast.success("Signed out successfully");
      router.push('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Logout failed: " + errorMessage);
    }
  };
    return (
        <>
              <div className="p-4 bg-white/[0.02] backdrop-blur-md border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-accent/20 overflow-hidden relative border border-white/10 shrink-0 transition-transform group-hover:scale-105 active:scale-95">
            {user?.photoURL ? (
              <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-accent text-white flex items-center justify-center font-black text-sm uppercase">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
             <div className="absolute right-0 bottom-0 w-3 h-3 bg-emerald-500 border-2 border-[#121016] rounded-full shadow-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black truncate text-white tracking-tight">
              {user?.displayName || user?.email?.split('@')[0] || 'Member'}
            </span>
            <div className="flex items-center space-x-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-white/30 hover:text-red-400 group"
            title="Sign Out"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <div className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-white/30 hover:text-white">
            <Bell size={18} />
          </div>
        </div>
      </div>
        </>
    );
}