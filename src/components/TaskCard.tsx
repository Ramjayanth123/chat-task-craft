
import React from 'react';
import { Edit, Trash2, Check, Clock, User } from 'lucide-react';
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
    <div className={`bg-card border border-border rounded-xl p-6 task-card-hover ${
      task.completed ? 'opacity-70' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Task Header */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onToggleComplete}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-border hover:border-green-500'
              }`}
            >
              {task.completed && <Check className="h-4 w-4" />}
            </button>
            
            <h3 className={`text-lg font-semibold text-foreground ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.name}
            </h3>
            
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Task Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{task.assignee}</span>
            </div>
            
            {dueInfo && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={`${
                  dueInfo.isOverdue 
                    ? 'text-red-500 font-medium' 
                    : dueInfo.isToday 
                    ? 'text-orange-500 font-medium' 
                    : ''
                }`}>
                  {dueInfo.formatted} ({dueInfo.relative})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
