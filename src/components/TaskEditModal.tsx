
import React, { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-bold gradient-text">Edit Task</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Task Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Assignee
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300"
            >
              <option value="P1">🔴 P1 - Critical</option>
              <option value="P2">🟠 P2 - High</option>
              <option value="P3">🔵 P3 - Medium</option>
              <option value="P4">⚪ P4 - Low</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
