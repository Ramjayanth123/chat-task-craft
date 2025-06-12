
import React from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '../types/Task';
import { Sparkles } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleComplete
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl mb-6 shadow-lg">
          <Sparkles className="h-16 w-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
        </div>
        <h3 className="text-3xl font-bold gradient-text mb-4">Ready to get organized?</h3>
        <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
          Start by describing your first task using natural language above. 
          Our AI will understand and organize it perfectly!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        <h2 className="text-2xl font-bold gradient-text">Your Tasks</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>
      
      <div className="grid gap-6">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TaskCard
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onToggleComplete={() => onToggleComplete(task.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
