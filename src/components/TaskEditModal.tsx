
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Task, Priority } from '../types/Task';

interface TaskEditModalProps {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task.name,
    assignee: task.assignee,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    priority: task.priority
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      name: formData.name,
      assignee: formData.assignee,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      priority: formData.priority
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Edit Task</h2>
          <button
            onClick={onCancel}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg input-focus"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Assignee
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg input-focus"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg input-focus"
            >
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
