
import React from 'react';
import { Edit, Trash2, Check, Clock, User, Calendar } from 'lucide-react';
import { Task } from '../types/Task';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isOverdue = diffTime < 0;
    const isToday = diffDays === 0;
    const isTomorrow = diffDays === 1;
    
    let relativeText = '';
    if (isOverdue) {
      relativeText = `${Math.abs(diffDays)} days overdue`;
    } else if (isToday) {
      relativeText = 'Today';
    } else if (isTomorrow) {
      relativeText = 'Tomorrow';
    } else {
      relativeText = `${diffDays} days`;
    }

    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }),
      relative: relativeText,
      isOverdue,
      isToday
    };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div className={`group relative task-card-enter ${
      task.completed ? 'opacity-60' : ''
    }`}>
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="h-full w-full bg-white rounded-2xl"></div>
      </div>
      
      {/* Main Card */}
      <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover-lift transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Task Header */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onToggleComplete}
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  task.completed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'border-slate-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20'
                }`}
              >
                {task.completed && <Check className="h-4 w-4" />}
              </button>
              
              <h3 className={`text-xl font-bold text-slate-800 ${
                task.completed ? 'line-through text-slate-500' : ''
              }`}>
                {task.name}
              </h3>
              
              <PriorityBadge priority={task.priority} />
            </div>

            {/* Task Description */}
            {task.description && (
              <div className="mb-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200/50">
                <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
              </div>
            )}

            {/* Task Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100/80 rounded-full">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">{task.assignee}</span>
                </div>
                
                {dueInfo && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    dueInfo.isOverdue 
                      ? 'bg-red-100 text-red-700' 
                      : dueInfo.isToday 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {dueInfo.formatted}
                    </span>
                  </div>
                )}
              </div>
              
              {dueInfo && (
                <div className={`text-sm font-medium ${
                  dueInfo.isOverdue 
                    ? 'text-red-600' 
                    : dueInfo.isToday 
                    ? 'text-orange-600' 
                    : 'text-slate-600'
                }`}>
                  {dueInfo.relative}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onEdit}
              className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
