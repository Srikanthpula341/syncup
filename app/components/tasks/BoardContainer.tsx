'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import { useTasks, Task } from '@/app/hooks/useTasks';
import { useAppSelector } from '@/app/store/hooks';
import { Layout, Filter, Search, PlusCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To-Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export default function BoardContainer() {
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);
  const { tasks, loading, moveTask } = useTasks(activeWorkspaceId);
  const [boardTasks, setBoardTasks] = useState<Task[]>([]);

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Optimistic UI update
    const updatedTasks = Array.from(boardTasks);
    const movedTaskIndex = updatedTasks.findIndex(t => t.id === draggableId);
    if (movedTaskIndex !== -1) {
      const movedTask = { ...updatedTasks[movedTaskIndex], columnId: destination.droppableId };
      updatedTasks.splice(movedTaskIndex, 1);
      
      // Calculate insertion index in the new column
      const columnTasks = updatedTasks.filter(t => t.columnId === destination.droppableId);
      const otherTasks = updatedTasks.filter(t => t.columnId !== destination.droppableId);
      
      columnTasks.splice(destination.index, 0, movedTask as Task);
      setBoardTasks([...columnTasks, ...otherTasks]);

      // Call API to persist change
      const oldColumnName = COLUMNS.find(c => c.id === source.droppableId)?.title || source.droppableId;
      const newColumnName = COLUMNS.find(c => c.id === destination.droppableId)?.title || destination.droppableId;
      
      await moveTask(draggableId, destination.droppableId, oldColumnName, newColumnName);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50/30">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
           <Layout size={40} className="animate-pulse text-orange-200" />
           <p className="text-sm font-medium animate-pulse">Syncing your board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Board Header */}
      <div className="p-6 pb-2 border-b border-zinc-100 bg-white sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
                <Layout size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Kanban Board</h1>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest truncate">Workspace Tasks & Sprint Planning</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10">
                <PlusCircle size={18} />
                <span>Create Task</span>
             </button>
             <button className="p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200 shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2 border-t border-zinc-50 pt-4 md:border-none md:pt-0">
           <div className="relative group w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Find a task..." 
                className="pl-10 pr-4 py-2 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all w-full"
              />
           </div>
           
           <div className="hidden sm:block w-px h-6 bg-zinc-200" />
           
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest whitespace-nowrap">Active:</p>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">All Tasks</span>
              <span className="px-3 py-1 bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-lg text-xs font-bold hover:bg-zinc-100 cursor-pointer transition-colors shadow-sm whitespace-nowrap">My Tasks</span>
           </div>
        </div>
      </div>

      {/* Board Scroll Area */}
      <div className="flex-1 overflow-x-auto p-6 bg-zinc-50/30">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-h-[500px]">
            {COLUMNS.map(column => (
              <Column 
                key={column.id} 
                id={column.id} 
                title={column.title} 
                tasks={boardTasks.filter(t => t.columnId === column.id)}
                count={boardTasks.filter(t => t.columnId === column.id).length}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
