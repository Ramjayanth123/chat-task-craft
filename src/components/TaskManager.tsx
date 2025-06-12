
import React, { useState } from 'react';
import { TaskInputForm } from './TaskInputForm';
import { TaskList } from './TaskList';
import { FilterBar } from './FilterBar';
import { TaskEditModal } from './TaskEditModal';
import { Task, Priority } from '../types/Task';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<{
    priority?: Priority;
    assignee?: string;
    sortBy: 'dueDate' | 'priority' | 'assignee';
  }>({
    sortBy: 'dueDate'
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    console.log('Added new task:', newTask);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    console.log('Updated task:', updatedTask);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    console.log('Deleted task with id:', id);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.assignee && task.assignee !== filter.assignee) return false;
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !task.assignee.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filter.sortBy) {
        case 'priority':
          const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'assignee':
          return a.assignee.localeCompare(b.assignee);
        case 'dueDate':
        default:
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block mb-6">
            <h1 className="text-7xl font-black gradient-text mb-4">
              TaskFlow
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <p className="text-2xl text-slate-600 font-light">
            Transform thoughts into organized action
          </p>
        </header>

        {/* Task Input - Hero Section */}
        <div className="mb-16">
          <div className="glass-effect rounded-3xl p-8 hover-lift">
            <TaskInputForm onAddTask={addTask} />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="glass-card rounded-2xl p-6">
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              assignees={uniqueAssignees}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="glass-card rounded-2xl p-8">
          <TaskList
            tasks={filteredAndSortedTasks}
            onEditTask={setEditingTask}
            onDeleteTask={deleteTask}
            onToggleComplete={toggleTaskComplete}
          />
        </div>

        {/* Edit Modal */}
        {editingTask && (
          <TaskEditModal
            task={editingTask}
            onSave={updateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </div>
    </div>
  );
};
