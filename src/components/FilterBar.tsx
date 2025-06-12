
import React from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { Priority } from '../types/Task';

interface FilterBarProps {
  filter: {
    priority?: Priority;
    assignee?: string;
    sortBy: 'dueDate' | 'priority' | 'assignee';
  };
  onFilterChange: (filter: FilterBarProps['filter']) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  assignees: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  assignees
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-700">Filter & Search</h3>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks or assignees..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <SortDesc className="h-5 w-5 text-slate-500" />
          <select
            value={filter.priority || ''}
            onChange={(e) => onFilterChange({
              ...filter,
              priority: e.target.value as Priority || undefined
            })}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300 min-w-48"
          >
            <option value="">All Priorities</option>
            <option value="P1">🔴 P1 - Critical</option>
            <option value="P2">🟠 P2 - High</option>
            <option value="P3">🔵 P3 - Medium</option>
            <option value="P4">⚪ P4 - Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <select
          value={filter.assignee || ''}
          onChange={(e) => onFilterChange({
            ...filter,
            assignee: e.target.value || undefined
          })}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300 min-w-48"
        >
          <option value="">All Assignees</option>
          {assignees.map(assignee => (
            <option key={assignee} value={assignee}>👤 {assignee}</option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={filter.sortBy}
          onChange={(e) => onFilterChange({
            ...filter,
            sortBy: e.target.value as 'dueDate' | 'priority' | 'assignee'
          })}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl input-glow shadow-md transition-all duration-300 min-w-48"
        >
          <option value="dueDate">📅 Sort by Due Date</option>
          <option value="priority">⚡ Sort by Priority</option>
          <option value="assignee">👥 Sort by Assignee</option>
        </select>
      </div>
    </div>
  );
};
