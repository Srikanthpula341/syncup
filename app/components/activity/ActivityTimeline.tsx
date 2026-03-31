/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import { useActivities } from '@/app/hooks/useActivities';
import { useAppSelector } from '@/app/store/hooks';
import { 
  MessageSquare, 
  LayoutGrid, 
  PlusCircle, 
  Move, 
  MessageCircle, 
  Zap,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import { useAppDispatch } from '@/app/store/hooks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import { ROUTES } from '@/app/lib/route-constants';

const activityIcons = {
  MESSAGE_SENT: { icon: MessageSquare, color: 'bg-blue-500', label: 'Message Sent' },
  TASK_CREATED: { icon: PlusCircle, color: 'bg-green-500', label: 'Task Created' },
  TASK_MOVED: { icon: Move, color: 'bg-orange-500', label: 'Task Moved' },
  TASK_COMMENTED: { icon: MessageCircle, color: 'bg-purple-500', label: 'Task Comment' },
  THREAD_REPLY_SENT: { icon: Zap, color: 'bg-yellow-500', label: 'Thread Reply' },
  WORKSPACE_CREATED: { icon: LayoutGrid, color: 'bg-indigo-500', label: 'System' },
};

export default function ActivityTimeline() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);
  const { users } = useAppSelector((state) => state.chat);
  const { activities, loading } = useActivities(activeWorkspaceId);

  const handleBack = () => {
    dispatch(setActiveChannel(null));
    router.push(ROUTES.CHAT);
  };

  const getActivityUser = (uid: string) => {
    return users.find(u => u.uid === uid) || { displayName: 'Someone', photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}` };
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-zinc-100" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-zinc-100 rounded w-1/4" />
              <div className="h-2 bg-zinc-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-8 border-b border-zinc-100 bg-white sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-2">
           <button 
             onClick={handleBack}
             className="p-2 lg:hidden hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400"
           >
             <ChevronLeft size={20} />
           </button>
           <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Activity Timeline</h1>
        </div>
        <p className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
           <Zap size={14} className="text-orange-500 animate-pulse" />
           The dynamic pulse of your workspace
        </p>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-zinc-50/30">
        <div className="max-w-2xl mx-auto space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-100" />

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
               <Calendar size={48} className="mb-4 opacity-10" />
               <p className="text-lg font-bold tracking-tight">No recent activity</p>
               <p className="text-sm">Start collaborating to see the pulse</p>
            </div>
          ) : (
            activities.map((activity) => {
              const user = getActivityUser(activity.userId);
              const config = activityIcons[activity.type] || activityIcons.WORKSPACE_CREATED;
              const Icon = config.icon;

              const isTaskRelated = ['TASK_CREATED', 'TASK_MOVED', 'TASK_COMMENTED'].includes(activity.type);

              return (
                <div 
                  key={activity.id} 
                  className={cn(
                    "relative flex gap-6 group transition-all",
                    isTaskRelated && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (isTaskRelated) {
                      router.push(`${ROUTES.TASKS}?taskId=${activity.entityId}`);
                    }
                  }}
                >
                  {/* Icon Node */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 z-10",
                    config.color
                  )}>
                    <Icon size={20} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group-hover:border-zinc-300">
                     <div className="flex items-center justify-between mb-3 text-left">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-lg overflow-hidden relative border border-zinc-100">
                              <Image src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.userId}`} alt="user" fill className="object-cover" />
                           </div>
                           <span className="text-sm font-black text-zinc-900">{user.displayName}</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">
                          {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                        </span>
                     </div>

                     <p className="text-sm text-zinc-600 leading-relaxed font-medium text-left">
                        {activity.type === 'TASK_MOVED' && (
                          <span>Moved task <span className="font-black text-zinc-900">"{activity.metadata?.taskTitle || activity.entityId.substring(0, 5)}"</span> to <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black uppercase border border-orange-200/50">{activity.metadata?.to}</span></span>
                        )}
                        {activity.type === 'TASK_CREATED' && (
                          <span>Created a new task: <span className="font-black text-zinc-900 underline decoration-orange-200 decoration-2 underline-offset-4">{activity.metadata?.taskTitle}</span></span>
                        )}
                        {activity.type === 'MESSAGE_SENT' && (
                          <span>Sent a message in <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px] uppercase border border-blue-100">#{activity.metadata?.channelName || 'general'}</span></span>
                        )}
                        {activity.type === 'THREAD_REPLY_SENT' && (
                          <span>Replied to a thread: <span className="italic text-zinc-400 font-bold">"{activity.metadata?.replyPreview || '...'}"</span></span>
                        )}
                        {activity.type === 'TASK_COMMENTED' && (
                           <span>Commented on task: <span className="italic text-zinc-400 font-bold">"{activity.metadata?.preview || '...'}"</span></span>
                        )}
                        {activity.type === 'WORKSPACE_CREATED' && (
                          <span>Created the workspace <span className="font-black text-zinc-900">"{activity.metadata?.workspaceName || 'SyncUp'}"</span></span>
                        )}
                     </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
