'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAppSelector } from '@/app/store/hooks';
import toast from 'react-hot-toast';

export interface Task {
  id: string;
  workspaceId: string;
  columnId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: 'low' | 'medium' | 'high';
  dueDate: { toMillis: () => number } | null;
  creatorId: string;
  createdAt: { toMillis: () => number } | null;
  updatedAt: { toMillis: () => number } | null;
}

export const useTasks = (workspaceId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!workspaceId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error("Tasks sync error:", error);
        toast.error("Failed to load tasks.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId]);

  const createTask = async (taskData: Partial<Task>) => {
    if (!user || !workspaceId) return;

    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          workspaceId,
          creatorId: user.uid,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  const moveTask = async (taskId: string, newColumnId: string, oldColumnName: string, newColumnName: string) => {
    if (!user || !workspaceId) return;

    try {
      const response = await fetch('/api/tasks/move', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId: user.uid,
          workspaceId,
          newColumnId,
          oldColumnName,
          newColumnName,
        }),
      });

      if (!response.ok) throw new Error('Failed to move task');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  return { tasks, loading, createTask, moveTask };
};
