'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus, MoreVertical, LayoutGrid } from 'lucide-react';
import { Task } from '@/app/hooks/useTasks';
import { cn } from '@/app/lib/utils';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
}

export default function Column({ id, title, tasks, count }: ColumnProps) {
  return (
    <div className="flex flex-col w-80 min-w-[320px] bg-zinc-100/50 rounded-2xl border border-zinc-200/60 overflow-hidden shadow-sm h-full">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-200/40 bg-zinc-50/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
             <LayoutGrid size={16} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h3>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{count} Tasks</span>
          </div>
        </div>
        <button className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors text-zinc-400 hover:text-zinc-600">
           <MoreVertical size={18} />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 overflow-y-auto min-h-[400px] transition-colors duration-200",
              snapshot.isDraggingOver && "bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-xl m-2"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {/* Add Task Button (Quick Action) */}
            <button className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 mt-2 group">
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              <span className="text-sm font-semibold">New Task</span>
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
}
