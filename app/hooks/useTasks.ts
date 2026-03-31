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

import { api } from '@/app/lib/api-client';

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
  const [loading, setLoading] = useState(!!workspaceId);
  const [prevWorkspaceId, setPrevWorkspaceId] = useState(workspaceId);
  const { user } = useAppSelector((state) => state.auth);

  if (workspaceId !== prevWorkspaceId) {
    setPrevWorkspaceId(workspaceId);
    setTasks([]);
    setLoading(!!workspaceId);
  }

  useEffect(() => {
    if (!workspaceId) return;

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
      return await api.tasks.create({
        ...taskData,
        workspaceId,
        creatorId: user.uid,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  const moveTask = async (taskId: string, taskTitle: string, newColumnId: string, oldColumnName: string, newColumnName: string) => {
    if (!user || !workspaceId) return;

    try {
      await api.tasks.move({
        taskId,
        taskTitle,
        userId: user.uid,
        workspaceId,
        newColumnId,
        oldColumnName,
        newColumnName,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  return { tasks, loading, createTask, moveTask };
};
