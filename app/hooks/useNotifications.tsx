'use client';

import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { useRouter } from 'next/navigation';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import { 
  collection, 
  query, 
  onSnapshot, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Desktop notifications enabled!', {
          icon: '🔔',
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Request permission once on login if not decided
    requestPermission();

    // Listen for NEW notifications only (created in last 10 seconds)
    const startTime = Timestamp.fromDate(new Date(Date.now() - 10000));
    
    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      where('createdAt', '>', startTime),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          
          // Browser Notification
          if (Notification.permission === 'granted' && document.hidden) {
            const n = new Notification(data.title || 'SyncUp Alert', {
              body: `${data.senderName}: ${data.body}`,
              icon: data.senderAvatar || '/icon.png',
            });
            
            n.onclick = () => {
              window.focus();
              if (data.channelId) {
                dispatch(setActiveChannel(data.channelId));
                router.push('/chat');
              }
            };
          }

          // In-app Toast (if not already looking at the channel)
          toast(
            () => (
              <div 
                 className="flex items-center gap-3 cursor-pointer"
                 onClick={() => {
                   if (data.channelId) {
                     dispatch(setActiveChannel(data.channelId));
                     router.push('/chat');
                   }
                 }}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs">
                  {data.senderName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-900">{data.title}</p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{data.body}</p>
                </div>
              </div>
            ),
            {
              duration: 4000,
              position: 'top-right',
              style: {
                borderRadius: '16px',
                background: '#fff',
                color: '#333',
                border: '1px solid #f4f4f5'
              },
            }
          );
        }
      });
    }, (error) => {
      console.error("Notification listener error", error);
    });

    return () => unsubscribe();
  }, [user, requestPermission, dispatch, router]);

  return { requestPermission };
};
