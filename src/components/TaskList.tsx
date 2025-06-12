
import React from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '../types/Task';

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
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">
          Start by adding your first task using natural language above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onToggleComplete={() => onToggleComplete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};
