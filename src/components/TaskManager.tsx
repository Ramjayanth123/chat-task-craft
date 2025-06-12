
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Task Manager</h1>
          <p className="text-xl text-muted-foreground">
            Manage your tasks with natural language
          </p>
        </header>

        {/* Task Input */}
        <div className="mb-8">
          <TaskInputForm onAddTask={addTask} />
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            assignees={uniqueAssignees}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          onEditTask={setEditingTask}
          onDeleteTask={deleteTask}
          onToggleComplete={toggleTaskComplete}
        />

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
