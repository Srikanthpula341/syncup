'use client';

import React, { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAppSelector } from '@/app/store/hooks';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SeedManager = () => {
  const { workspaces, loading } = useAppSelector((state) => state.chat);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we are loading or already have workspaces, don't show the banner
  if (loading.workspaces || workspaces.length > 0) return null;

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      const workspaceId = 'syncup-workspace';
      const channelId = 'general';

      // 1. Create Workspace
      await setDoc(doc(db, 'workspaces', workspaceId), {
        name: 'SyncUp Workspace',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SyncUp',
        createdAt: serverTimestamp(),
      });

      // 2. Create General Channel
      await setDoc(doc(db, 'workspaces', workspaceId, 'channels', channelId), {
        name: 'general',
        type: 'public',
        membersCount: 1,
        createdAt: serverTimestamp(),
      });

      // 3. Add Welcome Message
      const messageCol = collection(db, 'workspaces', workspaceId, 'channels', channelId, 'messages');
      await setDoc(doc(messageCol, 'welcome-msg'), {
        userId: 'system',
        userName: 'SyncUp Bot',
        userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SyncUp',
        content: 'Welcome to your new workspace! 🚀 Start chatting by typing below.',
        timestamp: serverTimestamp(),
      });

    } catch (err: unknown) {
      console.error('Seeding failed:', err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === 'permission-denied') {
        setError('Firestore says: "Missing or Insufficient Permissions". Remember to click PUBLISH in the Rules tab!');
      } else {
        setError(firebaseError.message || 'Something went wrong during set up.');
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4EDE4]/80 backdrop-blur-md p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 text-center border border-white"
      >
        <div className="w-20 h-20 bg-[#4A154B] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#4A154B]/20">
          <ShieldCheck size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-4">Set up Workspace</h2>
        <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
          It looks like your database is empty. Let&apos;s create your first workspace and get things moving!
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl"
          >
            <p className="text-red-600 text-sm font-semibold">
              {error}
            </p>
          </motion.div>
        )}

        <button
          onClick={handleSeed}
          disabled={isSeeding}
          className="w-full bg-[#4A154B] hover:bg-[#5D1B5E] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#4A154B]/30 disabled:opacity-50"
        >
          {isSeeding ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
             <>
                <Sparkles size={18} />
                Create First Workspace
             </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default SeedManager;
