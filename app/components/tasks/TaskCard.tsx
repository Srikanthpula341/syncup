'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { Task } from '@/app/hooks/useTasks';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import PresenceBadge from '../ui/PresenceBadge';

interface TaskCardProps {
  task: Task;
  index: number;
  isHighlighted?: boolean;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

export default function TaskCard({ task, index, isHighlighted }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-4 mb-3 bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group",
            snapshot.isDragging && "shadow-xl border-orange-200 ring-2 ring-orange-500/10 rotate-1 scale-105",
            isHighlighted && "ring-2 ring-orange-500 ring-offset-2 border-orange-500 animate-pulse"
          )}
        >
          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
              priorityColors[task.priority]
            )}>
              {task.priority}
            </span>
            {task.priority === 'high' && <AlertCircle size={14} className="text-red-500" />}
          </div>

          <h4 className="text-sm font-semibold text-zinc-800 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
            {task.title}
          </h4>
          
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
            {task.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <Calendar size={13} />
                <span>Tomorrow</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <MessageSquare size={13} />
                <span>3</span>
              </div>
            </div>

            {/* Assignee Avatar */}
            <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm bg-zinc-100 relative">
              <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId || task.creatorId}`} 
                alt="avatar"
                fill
                sizes="24px"
                className="object-cover rounded-full" 
              />
              <PresenceBadge 
                uid={task.assigneeId || task.creatorId} 
                className="absolute -bottom-0.5 -right-0.5 scale-75"
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
